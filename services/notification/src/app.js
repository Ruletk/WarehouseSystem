const express = require("express");
const app = express();
const PORT = process.env.PORT || 8085;

app.get("/", (req, res) => {
  res.send("hello from notification service");
});

app.get("/health", (req, res) => {
  res.status(200).send("notification service is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
