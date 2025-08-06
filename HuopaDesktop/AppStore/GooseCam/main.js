const img = document.createElement("img");
await setAttrs(img, {
    "src":"https://goose.izkuipers.nl/feed",
    "style":"width: 100%; height: 100%;"
});
document.body.append(img)
huopaAPI.setMaxWindowSize(640, 480);
huopaAPI.setMinWindowSize(640, 480);
huopaAPI.setWindowConfig("ignoreTile");
huopaAPI.removeTitlebar();
async function setWinPos() {
    huopaAPI.setWindowPosition("0", "0");
    huopaAPI.setWindowSize("640px", "480px");
    setTimeout(setWinPos, 250)
}
setWinPos()