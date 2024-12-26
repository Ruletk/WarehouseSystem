const express = require("express");
const app = express();
const PORT = 8082;

app.get("/", (req, res) => {
  res.send("hello from warehouse service");
});

app.get("/health", (req, res) => {
  res.status(200).send("warehouse service is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
