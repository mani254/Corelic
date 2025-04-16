import { NextFunction, Request, Response } from "express";

type ParamType = "number" | "boolean" | "object";

const autoCastQueryParams = (paramsToCast: Record<string, ParamType>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const key in paramsToCast) {
      const value = req.query[key];

      if (value !== undefined && typeof value === "string") {
        switch (paramsToCast[key]) {
          case "number": {
            const num = Number(value);
            if (isNaN(num)) {
              res.status(400).json({
                message: `Invalid query param: '${key}' must be a valid number.`,
              });
              return;
            }
            (req.query as any)[key] = num;
            break;
          }

          case "boolean": {
            if (value !== "true" && value !== "false") {
              res.status(400).json({
                message: `Invalid query param: '${key}' must be 'true' or 'false'.`,
              });
              return;
            }
            (req.query as any)[key] = value === "true";
            break;
          }

          case "object": {
            const fields = value
              .split(",")
              .map((field) => field.trim())
              .filter((field) => !!field);

            if (fields.length === 0) {
              return res.status(400).json({
                message: `Invalid query param: '${key}' must contain at least one valid field.`,
              });
            }

            const projectedFields: Record<string, number> = Object.fromEntries(
              fields.map((field) => [field, 1])
            );

            (req.query as any)[key] = projectedFields;
            break;
          }
        }
      }
    }

    next();
  };
};

export default autoCastQueryParams;
