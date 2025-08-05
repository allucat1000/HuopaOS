const img = document.createElement("img");
await setAttrs(img, {
    "src":"https://goose.izkuipers.nl/feed",
    "style":"width: 100%; height: 100%;"
});
document.body.append(img)
huopaAPI.setMaxWindowSize(640, 360);
huopaAPI.setMinWindowSize(640, 360);
huopaAPI.removeTitlebar();
async function setWinPos() {
    huopaAPI.setWindowPosition("0", "0");
    huopaAPI.setWindowSize("640px", "360px");
    setTimeout(setWinPos, 250)
}
setWinPos()