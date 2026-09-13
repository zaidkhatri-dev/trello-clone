import type { NextFunction, Request, Response } from "express";
import { AppError } from "@classes/error";
import { env } from "@config/env.js";
import type { ResponseFormat } from "../types/response"

import { dbErrorHandler, DatabaseError } from "@repo/db/error"
import { validationErrorHandler, ZodError } from "@repo/validation/error"

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent){
        return next(err)
    }

    let message: string | null = null
    let statusCode: number | null = null
    
    if (err instanceof ZodError){
        const result = validationErrorHandler(err) 
        message = result.message
        statusCode = result.statusCode   
    }

    if (err instanceof DatabaseError){
        const result = dbErrorHandler(err) 
        message = result.message
        statusCode = result.statusCode
    }

    if (err instanceof AppError){
        if (!err.isOperational){
            console.error("[NON-OPERATIONAL ERROR]", err)
            message = env.NODE_ENV === "development" ? err.message : 
            "Something went wrong" // prevent leaking internal details
        }else{
            console.log("[OPERATIONAL ERROR]", err)
            message = err.message
        }

        statusCode = err.statusCode
    }

    if (message == null || statusCode == null || statusCode == 500){
        console.error("[UNEXPECTED ERROR]", err)

        message = env.NODE_ENV === "development" ? err.message : "Something went wrong"
        statusCode = 500
    }
    
    const errorResponse : ResponseFormat<null> = {
        success: false,
        message: message,
        data: null
    }

    return res.status(statusCode).json(errorResponse)
}