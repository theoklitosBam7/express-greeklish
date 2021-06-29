import { Request, Response } from 'express';

const greekUtils = require('greek-utils');

const getText = async (req: Request, res: Response): Promise<void> => {
  try {
    const greek = greekUtils.toGreek(req.query.text) as string;

    res.status(200).json({
      greek,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default { getText };
