const display = await huopaAPI.createElement("div");
await setAttrs(display, {
    "style":"position: absolute; left: 0; top: 0; width: 100%; height: 100%;"
});
const result = await huopaAPI.createElement("h1");
const input = await huopaAPI.createElement("input");
await setAttrs(result, {
    "style":"color: white; padding 0.5em; text-align: center; font-size: 2em; user-select: text;"
})
await setAttrs(input, {
    "style":"color: white; padding 0.5em; position: absolute; bottom: 1em; left: 50%; transform: translateX(-50%); width: calc(100% - 3em); text-align: center;",
    "placeholder":"Type a calculation here",
    "onkeypress":async(key) => {
        if (key === "Enter") {
            const calculation = await huopaAPI.getAttribute(input, "value");
            if (calculation) {
                const calcResult = await huopaAPI.calculate(calculation);
                if (!calcResult) {
                    await huopaAPI.setAttribute(result, "textContent", "Invalid calculation!");
                    await huopaAPI.setAttribute(input, "value", "");
                } else {
                    await huopaAPI.setAttribute(result, "textContent", calcResult);
                    await huopaAPI.setAttribute(input, "value", calcResult);
                }
                
            }
        }
    }
});
await huopaAPI.append(display, result);
await huopaAPI.append(display, input);
await huopaAPI.appendToApp(display);