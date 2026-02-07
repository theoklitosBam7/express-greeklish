import fs from 'node:fs';
import path from 'node:path';
import * as greekUtils from 'greek-utils';
import Spellchecker from 'hunspell-spellchecker';

type SpellcheckerDictionary = ReturnType<Spellchecker['parse']>;

type SpellcheckerLike = {
  parse: (files: { aff: Buffer; dic: Buffer }) => SpellcheckerDictionary;
  use: (dictionary: SpellcheckerDictionary) => void;
  check: (word: string) => boolean;
  suggest: (word: string, limit?: number) => string[];
};

type SpellcheckerFactory = () => SpellcheckerLike;
type DictionaryReader = () => { aff: Buffer; dic: Buffer };

type GreeklishServiceDeps = {
  createSpellchecker?: SpellcheckerFactory;
  readDictionaryFiles?: DictionaryReader;
};

export type TokenResult = {
  index: number;
  input: string;
  output: string;
  corrected: boolean;
};

export type ConvertResult = {
  output: string;
  corrected: boolean;
  tokens: TokenResult[];
  warnings: string[];
};

type ReadyState = {
  ready: boolean;
  dictionaryLoadCount: number;
  error: string | null;
};

const MULTI_SPACE_REGEX = /\s+/g;
const LEADING_NON_WORD_REGEX = /^[^\p{L}\p{N}]+/u;
const TRAILING_NON_WORD_REGEX = /[^\p{L}\p{N}]+$/u;

const resolveDictionaryDir = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'src/assets'),
    path.resolve(__dirname, '../assets'),
  ];

  for (const candidate of candidates) {
    const affPath = path.resolve(candidate, 'el_GR.aff');
    const dicPath = path.resolve(candidate, 'el_GR.dic');
    if (fs.existsSync(affPath) && fs.existsSync(dicPath)) {
      return candidate;
    }
  }

  return candidates[0];
};

const readDictionaryFiles = (): { aff: Buffer; dic: Buffer } => {
  const dictionaryDir = resolveDictionaryDir();

  return {
    aff: fs.readFileSync(path.resolve(dictionaryDir, 'el_GR.aff')),
    dic: fs.readFileSync(path.resolve(dictionaryDir, 'el_GR.dic')),
  };
};

const createSpellchecker = (): SpellcheckerLike => new Spellchecker();

const splitToken = (token: string): { leading: string; core: string; trailing: string } => {
  const leading = LEADING_NON_WORD_REGEX.exec(token)?.[0] ?? '';
  const trailing = TRAILING_NON_WORD_REGEX.exec(token)?.[0] ?? '';
  const coreStart = leading.length;
  const coreEnd = token.length - trailing.length;
  const core = token.slice(coreStart, coreEnd);

  return { leading, core, trailing };
};

class GreeklishService {
  private readonly spellchecker: SpellcheckerLike;
  private readonly readFiles: DictionaryReader;
  private dictionaryLoadCount = 0;
  private ready = false;
  private initError: Error | null = null;

  constructor(deps: GreeklishServiceDeps = {}) {
    this.spellchecker = (deps.createSpellchecker ?? createSpellchecker)();
    this.readFiles = deps.readDictionaryFiles ?? readDictionaryFiles;

    this.initializeDictionary();
  }

  private initializeDictionary(): void {
    try {
      const dictionary = this.spellchecker.parse(this.readFiles());
      this.dictionaryLoadCount += 1;
      this.spellchecker.use(dictionary);
      this.ready = true;
      this.initError = null;
    } catch (error) {
      this.ready = false;
      this.initError = error instanceof Error ? error : new Error('Unknown dictionary error');
    }
  }

  getReadyState(): ReadyState {
    return {
      ready: this.ready,
      dictionaryLoadCount: this.dictionaryLoadCount,
      error: this.initError?.message ?? null,
    };
  }

  convert(input: string): ConvertResult {
    if (!this.ready) {
      throw new Error(this.initError?.message ?? 'Dictionary is not ready.');
    }

    const greekText = greekUtils.toGreek(input).normalize('NFC');
    const normalizedText = greekText.replaceAll(MULTI_SPACE_REGEX, ' ').trim();
    const rawTokens = normalizedText.length > 0 ? normalizedText.split(' ') : [];

    const warnings: string[] = [];
    const tokenResults: TokenResult[] = [];

    for (const [index, token] of rawTokens.entries()) {
      const parts = splitToken(token);
      const hasWord = parts.core.length > 0;

      if (!hasWord) {
        tokenResults.push({
          index,
          input: token,
          output: token,
          corrected: false,
        });
        continue;
      }

      const isCorrect = this.spellchecker.check(parts.core);
      if (isCorrect) {
        tokenResults.push({
          index,
          input: token,
          output: token,
          corrected: false,
        });
        continue;
      }

      const suggestions = this.spellchecker.suggest(parts.core, 1);
      const replacement = suggestions[0];

      if (!replacement) {
        warnings.push(`No suggestion found for token "${parts.core}".`);
        tokenResults.push({
          index,
          input: token,
          output: token,
          corrected: false,
        });
        continue;
      }

      tokenResults.push({
        index,
        input: token,
        output: `${parts.leading}${replacement}${parts.trailing}`,
        corrected: replacement !== parts.core,
      });
    }

    const output = tokenResults.map((token) => token.output).join(' ');
    const corrected = tokenResults.some((token) => token.corrected);

    return {
      output,
      corrected,
      tokens: tokenResults,
      warnings,
    };
  }
}

const greeklishService = new GreeklishService();

export { GreeklishService, greeklishService };
