import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const greekUtils = require('greek-utils');
const Spellchecker = require('hunspell-spellchecker');

const SPECIAL_CHARS = '[`~!@#$%^&*()_|+-=?;:\'",.<>{}[]\\/]';

const getText = async (req: Request, res: Response): Promise<void> => {
  try {
    const greek = greekUtils.toGreek(req.query.text) as string;

    const spellchecker = new Spellchecker();
    const DICT = spellchecker.parse({
      aff: fs.readFileSync(path.resolve(__dirname, '../assets/el_GR.aff')),
      dic: fs.readFileSync(path.resolve(__dirname, '../assets/el_GR.dic')),
    });
    spellchecker.use(DICT);

    const greekSplit = greek.split(' ');
    let greekCorrectArr: string[] = [];
    let chkLastChar = false;

    for (const word of greekSplit) {
      const lastChar = word[word.length - 1];
      chkLastChar = false;

      if (SPECIAL_CHARS.includes(lastChar)) {
        chkLastChar = true;
      }

      const cleanWord = word.replace(
        /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
        ''
      );

      const isRight = spellchecker.check(cleanWord);

      if (isRight) {
        greekCorrectArr = [
          ...greekCorrectArr,
          chkLastChar ? `${word}${lastChar}` : word,
        ];
      } else {
        const sugg = spellchecker.suggest(cleanWord) as string;

        greekCorrectArr = [
          ...greekCorrectArr,
          chkLastChar ? `${sugg[0]}${lastChar}` : sugg[0],
        ];
      }
    }

    const greekCorrect = greekCorrectArr.join(' ');

    res.status(200).json({
      greek: greekCorrect,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default { getText };
