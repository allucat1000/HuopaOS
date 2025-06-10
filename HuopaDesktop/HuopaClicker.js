(async () => {
    let score = 0
    const button = await huopaAPI.createElement("button");
    const btnDiv = await huopaAPI.createElement("div");
    const scoreText = await huopaAPI.createElement("h1");
    await huopaAPI.setAttribute(scoreText, "textContent", score);
    await huopaAPI.setAttribute(scoreText, "style", "color: white; margin-top: 1.5em; margin-bottom: 2em; text-align: center; margin-left: auto; margin-right: auto; font-size: 2.5em;")
    await huopaAPI.setAttribute(btnDiv, "style", "display: flex; justify-content: center; align-items: center;")
    await huopaAPI.appendToApp(scoreText);
    await huopaAPI.appendToApp(btnDiv);
    
    await huopaAPI.setAttribute(button, "textContent", "Click me!");
    await huopaAPI.setAttribute(button, "style", "padding: 3.5em; background-color: rgba(100, 100, 100, 0.8); border-radius: 1em; border-style: solid; border-color: rgba(65, 65, 65, 0.8); cursor: pointer; color: white;");
    await huopaAPI.append(btnDiv, button);
    
    await huopaAPI.setAttribute(button, "onclick", () => {
        score++;
        huopaAPI.setAttribute(scoreText, "textContent", score);
    });


})();