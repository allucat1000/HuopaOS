const elevated = await huopaAPI.requestElevation()
if (elevated) huopaAPI.setTitle("Processes [Elevated]")
let procListDiv;
let oldProcList;
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