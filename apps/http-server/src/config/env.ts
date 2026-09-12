import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('production'),
    PORT: z.coerce.number().default(8000),
    DATABASE_URL: z.url(),
    CORS_ORIGIN: z.url().default('http://localhost:3000')
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    parsed.error.issues.forEach(issue => {
        console.error("Field: ", issue.path.join("."))
        console.error("Message: ", issue.message)
    })
    process.exit(1)
}

export const env = parsed.data