import express from "express";
import { client } from "db/client";

const app = express();

app.get("/user", async (req, res) => {
  // const user = await prisma.user.create({
  //   data: {
  //     name: "demo",
  //     email: "demo@gmail.com",
  //   },
  // });
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});