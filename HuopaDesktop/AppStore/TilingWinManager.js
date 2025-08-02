const elevated = await huopaAPI.requestElevation();
if (!elevated) {
    await huopaAPI.createNotification("TilingWinManager", "You have to run as elevated!");
    huopaAPI.closeApp();
}
huopaAPI.hideWindow();
async function setWindowPositions() {
    let config = await huopaAPI.applicationStorageRead("config.json");
    if (!config) {
        config = `{"transition":"0.1s", "padding":"10"}`;
        await huopaAPI.applicationStorageWrite("config.json", "file", config);
    }
    config = JSON.parse(config);
    const parsed = JSON.parse(await huopaAPI.getProcesses());
    const rawWinArrList = parsed[0];
    const winDigitList = parsed[1];

    const winArrList = rawWinArrList.filter(win => {
        const extra = winDigitList[win]?.extra;
        const hidden = winDigitList[win]?.hidden;
        if (hidden) return false;
        if (extra === "core") return false;
        if (!extra || extra === "elevated") return true;
    });

    const total = winArrList.length;
    if (total !== 0) {

        const reservedHeight = "7em";

        let bestCols = 1;
        let bestRows = total;
        for (let cols = 1; cols <= total; cols++) {
            const rows = Math.ceil(total / cols);
            if (cols * rows >= total && Math.abs(cols - rows) <= Math.abs(bestCols - bestRows)) {
                bestCols = cols;
                bestRows = rows;
            }
        }

        const cols = bestCols;
        const rows = bestRows;

        const winWidth = 100 / cols;
        const winHeight = `calc((100% - ${reservedHeight}) / ${rows})`;
        const borderTotalPx = config.padding;
        const borderHalfPx = config.padding / 2 - 2.5;
        for (let i = 0; i < total; i++) {
            const win = winArrList[i];
            const row = Math.floor(i / cols);
            const col = i % cols;

            let colSpan = 1;
            const remaining = total - i;
            const spaceLeft = cols - col;

            if (i === total - 1 && spaceLeft > 1) {
                colSpan = spaceLeft;
            }

            const leftPercent = col * winWidth;
            const widthPercent = winWidth * colSpan;

            const left = `calc(${leftPercent}% + ${borderHalfPx}px)`;
            const top = `calc(${row} * ${winHeight} + ${borderHalfPx}px)`;

            const width = `calc(${widthPercent}% - ${borderTotalPx}px)`;
            const height = `calc(${winHeight} - ${borderTotalPx}px)`;

            await huopaAPI.setProcessWindowPosition(win, left, top);
            await huopaAPI.setProcessWindowSize(win, width, height);
            await huopaAPI.setProcessWindowAnimation(win, `opacity 0.15s ease, transform 0.15s ease, width ${config.transition} ease, height ${config.transition} ease, left ${config.transition} ease, top ${config.transition} ease`);
        }

    }
    setTimeout(setWindowPositions, 100);
}
setWindowPositions();
