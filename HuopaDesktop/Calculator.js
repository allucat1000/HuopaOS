
const display = document.createElement("div");
await setAttrs(display, {
    "style":"position: absolute; left: 0; top: 0; width: 100%; height: 100%;"
});
const result = document.createElement("h1");
const input = document.createElement("input");
await setAttrs(result, {
    "style":"color: white; padding 0.5em; text-align: center; font-size: 2em; user-select: text;"
})
await setAttrs(input, {
    "style":"color: white; padding 0.5em; position: absolute; bottom: 1em; left: 50%; transform: translateX(-50%); width: calc(100% - 3em); text-align: center;",
    "placeholder":"Type a calculation here",
    "onkeydown":async(e) => {
        if (e.key === "Enter") {
            const calculation = input.value;
            if (calculation) {
                const calcResult = await huopaAPI.calculate(calculation);
                if (!calcResult) {
                    result.textContent = "Invalid calculation!";
                    input.value = "";
                } else {
                    result.textContent = calcResult;
                    input.value = calcResult;
                }
                
            }
        }
    }
});
display.append(result);
display.append(input);
document.body.append(display);