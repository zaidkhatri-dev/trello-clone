import express from "express";
import { prisma } from "db/client";

const app = express();

app.post("/user", async (req, res) => {
  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });
  res.send("User created");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});