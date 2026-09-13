import express from "express";
import { isShuttingDown } from "@/shutdown";
import { globalErrorHandler } from "@middlewares/error"

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    if(isShuttingDown()){
        return res.status(503).json({
            success: false,
            message: "Server is shutting down"
        });
    }

    next()
})

app.get("/health", (req, res) => {
    return res.status(200).json({success: true, message: "OK", data : { timestamp : new Date()}})
})

app.use(globalErrorHandler)

export default app