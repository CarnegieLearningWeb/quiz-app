const express = require("express");
const bodyparser = require("body-parser");
const favicon = require("serve-favicon");
const short = require("short-uuid");
const path = require("path");
const PORT = process.env.PORT || 8080;
const app = express();
const userData = {};

// Serve favicon
app.use(favicon(path.join(__dirname, "public/asset/favicon/favicon.ico")));

// Handle data in a nice way
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Set static server
app.use(express.static(path.join(__dirname, "public")));

// Serve views
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

// Serve area question page for the user
app.get("/area/:userId", (req, res) => {
    const userId = req.params.userId;
    if (!(userId in userData)) {
        return res.redirect("/");
    }
    const contentType = userData[userId].contentType;
    res.sendFile(path.join(__dirname, `views/${contentType.toLowerCase()}.html`));
});

// Temporary login (signup -> login)
app.get("/api/login", (req, res) => {
    const userId = short.generate().substr(0, 11);
    userData[userId] = {
        contentType: "Square"
    };
    res.status(200).json({ userId: userId });
});

// Return whether the answer is correct
app.post("/api/answer", (req, res) => {
    const { userId, contentType, answer } = req.body;
    if (!(userId in userData)) {
        return res.status(400).json({ error: true, message: `Invalid User ID: ${userId}` });
    }
    switch (contentType) {
        case "Square":
            userData[userId].contentType = "Rectangle";
            res.status(200).json({ isCorrect: Number(answer) === 100 });
            break;
        case "Rectangle":
            userData[userId].contentType = "Triangle";
            res.status(200).json({ isCorrect: Number(answer) === 1500 });
            break;
        case "Triangle":
            delete userData[userId];
            res.status(200).json({ isCorrect: Number(answer) === 35 });
            break;
        default:
            res.status(400).json({ error: true, message: `Invalid Content Type: ${contentType}` });
    }
});

// Listening port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});