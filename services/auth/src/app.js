const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081;

app.get("/", (req, res) => {
  res.send("hello from auth service");
});

app.get("/health", (req, res) => {
  res.status(200).send("auth service is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
