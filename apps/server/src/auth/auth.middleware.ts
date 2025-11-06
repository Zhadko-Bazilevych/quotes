import {
  type Request,
  type Response,
  type NextFunction,
  json,
  urlencoded,
} from 'express';

export function bodyParserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.path.startsWith('/api/auth/')) {
    next();
    return;
  }

  json()(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    urlencoded({ extended: true })(req, res, next);
  });
}
