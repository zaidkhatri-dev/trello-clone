import type { DatabaseError } from "pg"
import { UNIQUE_CONSTRAINT_MESSAGES, FOREIGN_KEY_CONSTRAINT_MESSAGES, CONSTRAINT_MESSAGES } from "./constants"

export const dbErrorHandler = (err: DatabaseError) => {
    console.error({
        message: err.message,
        code: err.code,
        detail: err.detail,
        constraint: err.constraint,
        table: err.table,
        schema: err.schema
    })

    switch (err.code) {
        case "23505": {
            const message = (err.constraint && UNIQUE_CONSTRAINT_MESSAGES[err.constraint]) || 
            "Resource already exists."
            return {
                message,
                statusCode: 409
            }
        }

        case "23503": {
            const message = (err.constraint && FOREIGN_KEY_CONSTRAINT_MESSAGES[err.constraint]) || 
            "Related resource does not exist."
            return {
                message,
                statusCode: 409
            }
        }

        case "23502": {
            const message = err.column ? `${err.column} is required.` : 
            "Required field is missing."
            return {
                message,
                statusCode: 400
            }
        }

        case "23514": {
            const message = (err.constraint && CONSTRAINT_MESSAGES[err.constraint]) || "Data violates business rules."
            return {
                message,
                statusCode: 400
            }
        }

        case "22P02": {
            return {
                message: "Invalid Input.",
                statusCode: 400
            }
        }

        default:
            return {
                message: "Something went wrong.",
                statusCode: 500,
            }
    }
}

export { DatabaseError } from "pg"
