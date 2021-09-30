window.addEventListener("load", async () => {
    // Login Button (Currently simply redirects to the /app page)
    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", () => {
        window.location.href = "/app";
    });

    // View Source Button
    const sourceButton = document.getElementById("source-button");
    sourceButton.addEventListener("click", () => {
        window.open("https://github.com/CarnegieLearningWeb/quiz-app", "_blank");
    });
});