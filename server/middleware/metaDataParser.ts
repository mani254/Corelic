import { NextFunction, Request, Response } from 'express';

const transformMetaData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { metaTitle, metaDescription } = req.body;

  if (metaTitle || metaDescription) {

    req.body.metaData = {
      metaTitle: metaTitle ?? '',
      metaDescription: metaDescription ?? '',
    };

    delete req.body.metaTitle;
    delete req.body.metaDescription;
  }

  next();
};

export default transformMetaData;