const express = require("express");
const app = express();
const PORT = 8084;

app.get("/", (req, res) => {
  res.send("hello from stock service");
});

app.get("/health", (req, res) => {
  res.status(200).send("stock service is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
