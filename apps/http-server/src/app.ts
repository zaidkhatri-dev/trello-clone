import express from "express";
import { isShuttingDown } from "@/shutdown";

const app = express()

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

export default app