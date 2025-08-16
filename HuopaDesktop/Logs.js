const elevated = await huopaAPI.requestElevation()
if (!elevated) {
    huopaAPI.createNotification("Logs","Elevation required to view logs!");
    await huopaAPI.closeApp();
    return;
}
const rawLogs = await huopaAPI.getFile("/system/env/logs.txt");
if (!rawLogs) {
    const info = document.createElement("p");
    await setAttrs(info, {
        "style":"text-align: center; margin: 1em;",
        "textContent":"No logs yet!"
    })
    document.body.append(info);
    return;
}
const logs = rawLogs.split("\n\n").reverse();
let currentTime = logs[0].split("[")[1].split("]")[0].split(":")[1].split(" ").slice(1, 5).join(" ")
const currentTimelabel = document.createElement("p");
await setAttrs(currentTimelabel, {
    "style":"margin: 0.5em; text-align: left;",
    "textContent":currentTime
});
document.body.append(currentTimelabel);

for (const log of logs) {
    const logType = log.split("[")[1].split(":")[0].toLowerCase()
    const logDate = log.split("[")[1].split("]")[0].split(":")[1].split(" ").slice(1, 5).join(" ");
    const logTime = log.split("[")[1].split("]")[0].split(" ")[5];
    const cleanedLog = logTime + log.replace(`[${logType.toUpperCase()}:`,"").replace("]","").split(":").slice(3).join(":");
    if (logDate !== currentTime) {
        currentTime = logDate;
        const label = document.createElement("p");
        await setAttrs(label, {
            "style":"margin: 0.5em; text-align: left;",
            "textContent":logDate
        });
        document.body.append(label);
    }
    const logDiv = document.createElement("div");
    await setAttrs(logDiv, {
        "style":"margin: 0.5em; padding: 0.5em; border-radius: 0.5em;",
        "class":"primary",
        "textContent":cleanedLog
    });
    if (logType === "warn") logDiv.style.color = "rgba(255, 145, 0, 1)";
    if (logType === "error") logDiv.style.color = "rgba(255, 0, 0, 1)"
    document.body.append(logDiv);
}