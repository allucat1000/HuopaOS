(async () => {
    let score = 0
    const button = document.createElement("button");
    const btnDiv = document.createElement("div");
    const scoreText = document.createElement("h1");
    scoreText.textContent = score;
    scoreText.style = "color: white; margin-top: 1.5em; margin-bottom: 2em; text-align: center; margin-left: auto; margin-right: auto; font-size: 2.5em;"
    btnDiv.style = "display: flex; justify-content: center; align-items: center;"
    document.body.append(scoreText);
    document.body.append(btnDiv);
    
    button.textContent = "Click me!";
    button.style = "padding: 3.5em; background-color: rgba(100, 100, 100, 0.8); border-radius: 1em; border-style: solid; border-color: rgba(65, 65, 65, 0.8); cursor: pointer; ";
    btnDiv.append(button);
    
    button.onclick = () => {
        score++;
        scoreText.textContent = score;
    };


})();