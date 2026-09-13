import type { ZodError } from "zod";

export const validationErrorHandler = (err: ZodError) => {
    for (const issue of err.issues) {
        console.error(issue.path.join("."), issue.message);
    }

    return {
        message: err.issues[0]?.message || "The provided input is invalid",
        statusCode: 422
    }
}

export { ZodError } from "zod";