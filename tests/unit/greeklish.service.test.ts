import { describe, expect, it } from 'vitest';
import { GreeklishService, greeklishService } from '@/services/greeklish.service';

describe('GreeklishService', () => {
  it('transliterates and spell-corrects representative greeklish text', () => {
    const result = greeklishService.convert('Euhxo: autw pou akougetai wrea.');
    expect(result.output).toBe('Εύηχο: αυτό που ακούγεται ωραία.');
  });

  it('keeps punctuation stable without duplication', () => {
    const result = greeklishService.convert('kalimera!!!');
    expect(result.output.endsWith('!!!')).toBe(true);
    expect(result.output.includes('!!!!!!')).toBe(false);
  });

  it('falls back to original token when no suggestions are available', () => {
    let parseCalls = 0;
    const fakeDictionary = {
      rules: {},
      dictionaryTable: {},
      compoundRules: [],
      compoundRuleCodes: {},
      replacementTable: [],
      flags: {},
    };

    const fakeSpellchecker = {
      parse: () => {
        parseCalls += 1;
        return fakeDictionary;
      },
      use: () => undefined,
      check: () => false,
      suggest: (): string[] => [],
    };

    const service = new GreeklishService({
      createSpellchecker: () => fakeSpellchecker,
      readDictionaryFiles: () => ({
        aff: Buffer.from('aff'),
        dic: Buffer.from('dic'),
      }),
    });

    const result = service.convert('test');
    expect(result.output).toBe('τεστ');
    expect(result.warnings).toHaveLength(1);
    expect(parseCalls).toBe(1);
  });

  it('keeps output in NFC normalization and supports mixed text safely', () => {
    const result = greeklishService.convert('Kalimera world 2026');
    expect(result.output).toBe(result.output.normalize('NFC'));
    expect(typeof result.output).toBe('string');
  });

  it('loads dictionary once for service lifetime', () => {
    let parseCalls = 0;
    const fakeDictionary = {
      rules: {},
      dictionaryTable: {},
      compoundRules: [],
      compoundRuleCodes: {},
      replacementTable: [],
      flags: {},
    };

    const fakeSpellchecker = {
      parse: () => {
        parseCalls += 1;
        return fakeDictionary;
      },
      use: () => undefined,
      check: () => true,
      suggest: (): string[] => [],
    };

    const service = new GreeklishService({
      createSpellchecker: () => fakeSpellchecker,
      readDictionaryFiles: () => ({
        aff: Buffer.from('aff'),
        dic: Buffer.from('dic'),
      }),
    });

    service.convert('ena');
    service.convert('dyo');
    expect(parseCalls).toBe(1);
  });
});
