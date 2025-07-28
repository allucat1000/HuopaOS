const elevated = await huopaAPI.requestElevation()
if (elevated) huopaAPI.setTitle("Processes [Elevated]")
let procListDiv;
let oldProcList;
const createProcessButton = document.createElement("button"); 
setAttrs(createProcessButton, {
    "textContent":"Create a process",
    "onclick":async() => {
        let newProcElev = false;
        const popup = document.createElement("div");
        popup.style = "background-color: rgba(0, 0, 0, 0.7); width: 100%; height: 100%; position: absolute; top: 0; left: 0; margin: 0; padding: 0; z-index: 999";
        const text = document.createElement("h2");
        text.textContent = "Create a process";
        text.style.textAlign = "center";
        text.style.margin = "1em auto";
        const input = document.createElement("input");
        input.placeholder = "Type a path for an application";
        input.style.width = "50%";
        input.style.display = "block";
        input.style.textAlign = "center";
        const elevatedCheckbox = document.createElement("input");
        await setAttrs(elevatedCheckbox, {
            "style":"display: block; margin: 0.5em auto;",
            "type":"checkbox"
        });
        const elevatedPrompt = document.createElement("h3");
        await setAttrs(elevatedPrompt, {
            "textContent":"Spawn this process as elevated?",
            "style":"text-align: center; margin: 1em auto;"
        });
        popup.append(text, input);
        if (elevated) popup.append(elevatedPrompt, elevatedCheckbox);
        document.body.append(popup);
        input.addEventListener("keydown", async(e) => {
            if (e.key === "Enter") {
                const exists = await huopaAPI.getFile(input.value)
                if (input.value.length > 0 && exists) {
                    popup.remove();
                    if (elevatedCheckbox.checked) {
                        huopaAPI.runApp(input.value, undefined, true);
                    } else {
                        huopaAPI.runApp(input.value, undefined, false);
                    }
                    
                }
                if (input.value.length < 1) popup.remove();
            }
        })
    }
})
document.body.append(createProcessButton);
async function loadProcs() {
    const procIds = JSON.parse(await huopaAPI.getProcesses())[0];
    const procInfo = JSON.parse(await huopaAPI.getProcesses())[1];
    if (!oldProcList || !arraysEqual(oldProcList, procIds)) {
        if (procListDiv) procListDiv.remove();
        procListDiv = document.createElement("div");
        for (const procI in procIds) {
            const procId = procIds[procI];
            const proc = procInfo[procId];
            const procDiv = document.createElement("div");
            procDiv.style = "width: calc(100% - 0.5em); border-radius: 0.5em; background-color: rgba(45, 45, 45, 0.65); border: rgba(105, 105, 105, 0.65) 1px solid; position: relative; margin: 0.5em auto;";
            const procName = document.createElement("p");
            const quitProcButton = document.createElement("button");
            await setAttrs(quitProcButton, {
                "textContent":"Quit",
                "onclick": async() => {
                    quitProcButton.textContent = "Quitting..."
                    huopaAPI.quitProcess(proc.id);
                },
                "style":"position: absolute; right: 0.2em; top: 50%; padding: 0.35em 0.5em; transform: translateY(-50%); border-width: 1px;"
            })
            procName.style = "margin: 0.5em;"
            if (proc.elevated) {
                procName.textContent = `${proc.name} (${procI}) [Elevated] [${proc.id}]`;
            } else {
                procName.textContent = `${proc.name} (${procI}) [${proc.id}]`;
            }
            procDiv.append(procName);
            if (elevated) procDiv.append(quitProcButton);
            procListDiv.append(procDiv);
        }
        document.body.append(procListDiv);
    }
    
    oldProcList = procIds;
    setTimeout(loadProcs, 250);
}
loadProcs()

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}