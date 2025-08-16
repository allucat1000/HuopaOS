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
const logs = rawLogs.split("\n\n");
for (const log of logs) {
    const logDiv = document.createElement("div");
    await setAttrs(logDiv, {
        "style":"margin: 0.5em; padding: 0.5em; border-radius: 0.5em;",
        "class":"primary",
        "textContent":log
    });
    document.body.append(logDiv);
}