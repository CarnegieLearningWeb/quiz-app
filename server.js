const express = require("express");
const bodyparser = require("body-parser");
const favicon = require("serve-favicon");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();

// Serve favicon
app.use(favicon(path.join(__dirname, "public/asset/favicon/favicon.ico")));

// Handle data in a nice way
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Set static server
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/v1/answer", (req, res) => {
    const { contentType, questionType, motivationalSupportType, answer } = req.body;
    switch (contentType) {
        case "Triangle":
            const isCorrect = Number(answer) === 35;
            // TODO?: validate and store question type, motivational support type, and isCorrect values
            return res.status(200).json({ isCorrect });
        default:
            return res.status(400).json({ error: true, message: `Invalid Content Type: ${contentType}` });
    }
});

// Listening port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});