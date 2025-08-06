const img = document.createElement("img");
await setAttrs(img, {
    "src":"https://goose.izkuipers.nl/feed",
    "style":"width: 100%; height: 100%; object-fit: contain;"
});
let sizeConfig = await huopaAPI.applicationStorageRead("config.json");
if (!sizeConfig) {
    sizeConfig = '{"sizemult":0.5, "forcepos":false}';
    await huopaAPI.applicationStorageWrite("config.json", "file", sizeConfig);
}
sizeConfig = JSON.parse(sizeConfig);
huopaAPI.removeTitlebar();
document.body.append(img)
if (sizeConfig.forcepos) {
    huopaAPI.setMaxWindowSize(640 * sizeConfig.sizemult, 480 * sizeConfig.sizemult);
    huopaAPI.setMinWindowSize(640 * sizeConfig.sizemult, 480 * sizeConfig.sizemult);
    huopaAPI.setWindowConfig("ignoreTile");
    async function setWinPos() {
        huopaAPI.setWindowPosition("0", "0");
        huopaAPI.setWindowSize(640 * sizeConfig.sizemult + "px", 480 * sizeConfig.sizemult + "px");
        setTimeout(setWinPos, 250)
    }
    setWinPos();
}