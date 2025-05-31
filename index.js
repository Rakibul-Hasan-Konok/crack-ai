const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const form = `
<form method="POST" action="/prompt">
  <textarea name="prompt" id="prompt"></textarea>
  <button type="submit">Generate JSON</button>
</form>
`;

app.use(express.urlencoded({ extended: true }));

app.get("/prompt", async (req, res) => {
  res.send(form);
});

app.post("/prompt", async (req, res) => {
  let { prompt } = req.body; 
  prompt = prompt + ". data will be in json stringify version. no extra text";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const rsp = text.split("```json")[1].split("```")[0]; // ✅ safer JSON extraction
    res.send({ data: JSON.parse(rsp), status: 200 });
    
});


app.get("/", (req, res) => {
  res.send({ data: "Server running", status: 200 });
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});
