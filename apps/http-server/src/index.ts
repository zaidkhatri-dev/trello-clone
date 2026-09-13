import "dotenv/config"
import { env } from "@config/env";

import app from "./app";
import { GRACEFUL_SHUTDOWN_TIMEOUT } from "@constants/app";
import { isShuttingDown, setShuttingDown } from "./shutdown";
import { closeDBConnection } from "db/client";

// Handle synchronous errors that were not caught by try-catch blocks
process.on("uncaughtException", (error) => {
    console.error("[Uncaught Exception]", error)
    process.exit(1)
})

// Handle promise rejections that were not caught by .catch() handlers
process.on("unhandledRejection", (reason) => {
    console.error("[Unhandled Rejection]", reason)
    process.exit(1)
})

const server = app.listen(env.PORT, () => {
    console.log(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`)
})

// Graceful shutdown handler
const shutdown = async (signal: string) => {
    // Guard against multiple shutdown calls
    if(isShuttingDown()){
        return;
    }

    setShuttingDown(true);
    
    console.log(`\n${signal} received. Shutting down gracefully...`);

    // Timeout for graceful shutdown
    const timeout = setTimeout(() => {
        console.error("Graceful shutdown timeout. Forcing exit...")
        process.exitCode = 0
        process.exit()
    }, GRACEFUL_SHUTDOWN_TIMEOUT)

    server.close(async (err) => {
        clearTimeout(timeout)

        if (err){
            console.error("Error closing server:", err);
            process.exitCode = 1
            return
        }

        try {
            // Close DB connection
            await closeDBConnection()
            console.log("Database connection closed...")

            console.log("Server closed...")
            process.exitCode = 0
        }catch(error){
            console.error("Error closing database connection:", error);
            process.exitCode = 1
        }
    })
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))