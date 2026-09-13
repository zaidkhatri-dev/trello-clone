import type { NextFunction, Request, Response } from "express";
import type { ZodObject } from "zod";

export const inputValidator = (schema: ZodObject) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const input = { ...req.body, ...req.params, ...req.query };
        const result = schema.safeParse(input);

        if (!result.success) {
            return next(result.error);
        }

        req.body = result.data
        next();
    };
};

