(async () => {
    const button = await huopaAPI.createElement("button");
    const btnDiv = await huopaAPI.createElement("div");

    await huopaAPI.setStyle(btnDiv, "display: flex; justify-content: center; align-items: center; height: 100%;")
    await huopaAPI.appendToApp(btnDiv);

    await huopaAPI.setText(button, "Click me!");
    await huopaAPI.setStyle(button, "padding: 3.5em; background-color: rgba(100, 100, 100, 0.8); border-radius: 1em; border-style: solid; border-color: rgba(80, 80, 80, 0.8); cursor: pointer; color: white;");
    await huopaAPI.append(btnDiv, button);
})();