const express = require("express");
const bodyparser = require("body-parser");
const favicon = require("serve-favicon");
const { v4: uuidv4 } = require("uuid");
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

// Serve views
app.get("/", (req, res) => {
    res.redirect("/square_area");
});

app.get("/square_area", (req, res) => {
    res.sendFile(path.join(__dirname, "views/square_area.html"));
});

app.get("/rectangle_area", (req, res) => {
    res.sendFile(path.join(__dirname, "views/rectangle_area.html"));
});

app.get("/triangle_area", (req, res) => {
    res.sendFile(path.join(__dirname, "views/triangle_area.html"));
});

// Return a unique user ID
app.get("/api/v1/userid", (req, res) => {
    return res.status(200).json({ id: uuidv4() });
});

// Return whether the answer is correct
app.post("/api/v1/answer", (req, res) => {
    const { contentType, answer } = req.body;
    switch (contentType) {
        case "Square":
            return res.status(200).json({ isCorrect: Number(answer) === 40 });
        case "Rectangle":
            return res.status(200).json({ isCorrect: Number(answer) === 70 });
        case "Triangle":
            return res.status(200).json({ isCorrect: Number(answer) === 35 });
        default:
            return res.status(400).json({ error: true, message: `Invalid Content Type: ${contentType}` });
    }
});

// Listening port
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});