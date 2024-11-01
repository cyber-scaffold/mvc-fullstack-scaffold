import express from "express";

const app = express();

const server = app.listen(8190, () => {
  console.log("server", server.address());
});