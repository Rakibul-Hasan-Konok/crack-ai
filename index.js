const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Serve static files from "public" folder
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.post("/prompt", async (req, res) => {
  let { prompt } = req.body;
  prompt = prompt + ". data will be in json stringify version. no extra text";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const rsp = text.split("```json")[1].split("```")[0];
    res.send({ data: JSON.parse(rsp), status: 200 });
  } catch (error) {
    console.error("Error generating or parsing content:", error);
    res.status(500).send({ error: "Failed to generate or parse content" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
