window.addEventListener("load", function () {

    // Content Type
    const contentTypes = ["Triangle", "Square", "Rectangle"];
    const contentType = contentTypes[0];
    console.log(`Content Type: ${contentType}`);

    // Question Type (default: Decontextual)
    const questionTypes = ["Decontextual", "Contextual"];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    console.log(`Question Type: ${questionType}`);
    const questionText = document.getElementById("question-text");
    const contextuals = document.querySelectorAll(".contextual");
    switch (questionType) {
        case "Decontextual":
            questionText.innerHTML = "1 - A triangle is <b>14</b> inches long and has a <b>5</b> inch base.<br>What is the <b>area</b> of the triangle?";
            contextuals.forEach(contextual => contextual.style.display = "none");
            break;
        case "Contextual":
            questionText.innerHTML = "1 - A college banner is <b>14</b> inches long and has a <b>5</b> inch base.<br>What is the <b>area</b> of the banner?";
            contextuals.forEach(contextual => contextual.style.display = "block");
            break;
    }

    // Motivational Support Type (default: Default)
    const motivationalSupportTypes = ["Default", "Mindset", "Utility Value"];
    const motivationalSupportType = motivationalSupportTypes[Math.floor(Math.random() * motivationalSupportTypes.length)];
    console.log(`Motivational Support Type: ${motivationalSupportType}`);
    switch (motivationalSupportType) {
        case "Default":
            break;
        case "Mindset":
            setTimeout(() => alert("Did you know your brain grows as you learn?"), 500);
            break;
        case "Utility Value":
            setTimeout(() => alert("Did you know that 86% of jobs require math?"), 500);
            break;
    }

    // Answer Submission Form
    const answerForm = document.getElementById("answer-form");
    const numberInput = document.getElementById("number-input");
    answerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        fetch("/api/v1/answer", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ contentType, questionType, motivationalSupportType, answer: numberInput.value })
        }).then(response => response.json()).then((data) => {
            if (data.error) {
                alert(data.message);
                return;
            }
            alert(data.isCorrect === true ? "Correct Answer!" : "Wrong Answer!");
            window.location.reload();
        });
    });

    // View Source Button
    const sourceButton = document.getElementById("source-button");
    sourceButton.addEventListener("click", (event) => {
        window.open("https://github.com/CarnegieLearningWeb/quiz-app", "_blank");
    });
});