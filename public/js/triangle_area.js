// Accessing UpgradeClient (Note: We should make UpgradeClient directly accessible)
const UpgradeClient = window["upgrade-client-lib"].UpgradeClient;

// UpGrade/Experiment settings
const hostUrl = "http://localhost:3030";
const context = "app";
const expPoint = "triangle_area";
const questionTypeExpId = "question_type";
const motivationalSupportTypeExpId = "motivational_support_type";

window.addEventListener("load", async () => {
    // Store the page loaded time (used to calculate the timeSpent metric)
    const pageLoadedTime = new Date();

    // Fetch the unique user ID from the server
    const response = await fetch("/api/v1/userid", {
        method: "GET"
    });
    const data = await response.json();
    const userId = data.id;
    console.log(`User ID: ${userId}`);

    // Construct and initialize the UpgradeClient library
    const upClient = new UpgradeClient(userId, hostUrl);
    await upClient.init();

    // Content Type (Square / Rectangle / Triangle)
    const contentType = "Triangle";
    console.log(`Content Type: ${contentType}`);

    // Question Type (default: Decontextual)
    // Note: getExperimentCondition returns null after the experiment if the post experiment rule is Assign: default
    const questionTypeExpCondition = await upClient.getExperimentCondition(context, expPoint, questionTypeExpId);
    const questionType = questionTypeExpCondition == null ? "Decontextual" : questionTypeExpCondition.assignedCondition.conditionCode;
    await upClient.markExperimentPoint(expPoint, questionType, questionTypeExpId);
    console.log(`Question Type: ${questionType}`);
    const questionText = document.getElementById("question-text");
    const contextuals = document.querySelectorAll(".contextual");
    switch (questionType) {
        case "Decontextual":
            questionText.innerHTML = "A triangle is <b>14</b> inches long and has a <b>5</b> inch base.<br>What is the <b>area</b> of the triangle?";
            contextuals.forEach(contextual => contextual.style.display = "none");
            break;
        case "Contextual":
            questionText.innerHTML = "A college banner is <b>14</b> inches long and has a <b>5</b> inch base.<br>What is the <b>area</b> of the banner?";
            contextuals.forEach(contextual => contextual.style.display = "block");
            break;
    }

    // Motivational Support Type (default: No Support)
    // Note: getExperimentCondition returns null after the experiment if the post experiment rule is Assign: default
    const motivationalSupportTypeExpCondition = await upClient.getExperimentCondition(context, expPoint, motivationalSupportTypeExpId);
    const motivationalSupportType = motivationalSupportTypeExpCondition == null ? "No Support" : motivationalSupportTypeExpCondition.assignedCondition.conditionCode;
    await upClient.markExperimentPoint(expPoint, motivationalSupportType, motivationalSupportTypeExpId);
    console.log(`Motivational Support Type: ${motivationalSupportType}`);
    switch (motivationalSupportType) {
        case "No Support":
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
    answerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Fetch the answer status (isCorrect) from the server
        const response = await fetch("/api/v1/answer", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ contentType, answer: numberInput.value })
        });
        const data = await response.json();
        if (data.error) {
            alert(data.message);
            return;
        }
        // Post Metrics (Note: Need a documentation and maybe a better way to add/post metrics)
        /* 
        How to add metrics in UpGrade: Profile -> Metrics -> Add Metrics (add each data one by one)
        {
            "metric": "timeSpent",
            "datatype": "continuous"
        }
        {
            "metric": "answerStatus",
            "datatype": "categorical",
            "allowedValues":  ["CORRECT", "WRONG"]
        }
        */
        const metrics = [{
            timestamp: new Date().toISOString(), // Note: Do we need to require this from the user?
            metrics: {
                attributes: {
                    timeSpent: Math.round((new Date() - pageLoadedTime) / 1000),
                    answerStatus: data.isCorrect === true ? "CORRECT" : "WRONG"
                }
            }
        }];
        await upClient.log(metrics);  // Note: Why does the log() function require an array? Any use cases?

        // Alert the answer status and reload the page
        alert(data.isCorrect === true ? "Correct Answer!" : "Wrong Answer!");
        window.location.href = "/"; // Note: Should it redirect to square_area or ending page?
    });

    // View Source Button
    const sourceButton = document.getElementById("source-button");
    sourceButton.addEventListener("click", () => {
        window.open("https://github.com/CarnegieLearningWeb/quiz-app", "_blank");
    });
});