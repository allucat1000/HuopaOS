await huopaAPI.hideWindow();
let colors = await huopaAPI.getFile("/home/applications/BorderColorChanger/colors.json");
if (!colors) {
    colors = [
        "#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00",
        "#CCFF00", "#99FF00", "#66FF00", "#33FF00", "#00FF00", "#00FF33",
        "#00FF66", "#00FF99", "#00FFCC", "#00FFFF", "#00CCFF", "#0099FF",
        "#0066FF", "#0033FF", "#0000FF", "#3300FF", "#6600FF", "#9900FF",
        "#CC00FF", "#FF00FF", "#FF00CC", "#FF0099", "#FF0066", "#FF0033",
        "#FF0000"
    ];
    await huopaAPI.writeFile("/home/applications/BorderColorChanger/colors.json", "file", JSON.stringify(colors));
    huopaAPI.createNotification("BorderColorChanger", "Thanks for trying out this border color changer!");
} else {
    huopaAPI.createNotification("BorderColorChanger", "The border color changer has started!");
    colors = JSON.parse(colors);
}

let index = 0
const errorText = document.createElement("h2");
await setAttrs(errorText, {
    "style":"text-align: center; color: white; margin: 1em;",
    "textContent":"If you see this, you probably clicked on this app's icon in the dock, press the button below to hide the window again."
})
const hideWindowButton = document.createElement("button");
await setAttrs(hideWindowButton, {
    "textContent":"Hide the window again",
    "style":"display: block; margin: 0.5em auto;",
    "onclick": async () => {
        await huopaAPI.hideWindow()
    }
})

document.body.append(errorText);
document.body.append(hideWindowButton);
while (true) {
    await huopaAPI.writeFile("/system/env/systemconfig/settings/customization/windowbordercolor.txt", "file", colors[index]);
    index++;
    if (index + 1 > colors.length) index = 0;
    await new Promise(resolve => setTimeout(resolve, 200));
}