import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isHttp = err instanceof HttpError;
  const statusCode = isHttp ? err.statusCode : 500;
  const message = isHttp ? err.message : "Internal Server Error";

  if (!isHttp) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: isHttp ? err.details : undefined,
  });
}
