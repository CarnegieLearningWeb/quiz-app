window.addEventListener("load", async () => {
    // Login Button
    const loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", async () => {

        // Fetch the unique user ID from the server, and redirect to area page
        const response = await fetch("/api/login", {
            method: "GET"
        });
        const data = await response.json();
        const userId = data.userId;
        console.log(`User ID: ${userId}`);
        window.location.href = `/area/${userId}`;
    });

    // View Source Button
    const sourceButton = document.getElementById("source-button");
    sourceButton.addEventListener("click", () => {
        window.open("https://github.com/CarnegieLearningWeb/quiz-app", "_blank");
    });
});