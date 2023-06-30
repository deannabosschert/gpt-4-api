require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const { Configuration, OpenAIApi } = require("openai");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

// ROUTES
app.get("/", function (req, res) {
  res.render("index.ejs", {});

  getAPImodels();
});

app.post("/newReq", (req, res) => {
  newReq(req, res);
});

async function getAPImodels() {
  try {
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.listModels();
    const modelsOverview = response.data.data;
    console.log(modelsOverview);
    const availableModels = response.data.data.map((model) => model.id);

    console.log("Models available to you:");
    availableModels.forEach((model) => {
      console.log(`- ${model}`);
    });

    const requiredModels = [
      "gpt-4",
      "gpt-4-0314",
      "gpt-4-32k",
      "gpt-4-32k-0314",
    ];

    const missingModels = requiredModels.filter(
      (model) => !availableModels.includes(model)
    );

    if (missingModels.length > 0) {
      console.log("\nYou are missing access to the following models:");
      missingModels.forEach((model) => {
        console.log(`- ${model}`);
      });
    } else {
      console.log("\nYou have access to all required models.");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
    console.log("Unable to retrieve model information.");
  }
}

http.listen(port, () => {
  console.log("App listening on: " + port);
});
