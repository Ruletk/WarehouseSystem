const express = require("express");
const app = express();
const PORT = 8083;

app.get("/", (req, res) => {
  res.send("hello from admin service");
});

app.get("/health", (req, res) => {
  res.status(200).send("admin service is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
