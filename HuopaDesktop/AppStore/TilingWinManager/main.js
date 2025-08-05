const elevated = await huopaAPI.requestElevation();
if (!elevated) {
    await huopaAPI.createNotification("TilingWinManager", "You have to run as elevated!");
    huopaAPI.closeApp();
}
huopaAPI.hideWindow();
let config = await huopaAPI.applicationStorageRead("config.json");
if (!config) {
    config = `{"transition":"0.1s", "padding":"10", "reservedHeight":"7em", "dockPos":"bottom"}`;
    await huopaAPI.applicationStorageWrite("config.json", "file", config);
}
config = JSON.parse(config);
if (!config.reservedHeight) { config.reservedHeight = "7em"; config.dockPos = "bottom"; await huopaAPI.applicationStorageWrite("config.json", "file", JSON.stringify(config)); }

let [rawWinArrList, winDigitList] = JSON.parse(await huopaAPI.getProcesses());
async function processFetch () {
    while (true) {
        const parsed = JSON.parse(await huopaAPI.getProcesses());
        rawWinArrList = parsed[0];
        winDigitList = parsed[1];
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

async function setWindowPositions() {
    while (true) {

        const winArrList = rawWinArrList.filter(win => {
            const extra = winDigitList[win]?.extra;
            const config = winDigitList[win]?.config;
            const hidden = winDigitList[win]?.hidden;
            console.log(config)
            if (hidden) return false;
            if (extra === "core") return false;
            if (config && config.includes("ignoreTile")) return false;
            if (!extra || extra === "elevated") return true;
        });

        const total = winArrList.length;
        if (total !== 0) {

            const reservedHeight = config.reservedHeight;

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
                let top;
                const left = `calc(${leftPercent}% + ${borderHalfPx}px)`;
                if (config.dockPos === "bottom") {
                    top = `calc(${row} * ${winHeight} + ${borderHalfPx}px)`;
                } else {
                    top = `calc(${reservedHeight} + ${row} * ${winHeight} + ${borderHalfPx}px)`;
                }
                const width = `calc(${widthPercent}% - ${borderTotalPx}px)`;
                const height = `calc(${winHeight} - ${borderTotalPx}px)`;

                huopaAPI.setProcessWindowPosition(win, left, top);
                huopaAPI.setProcessWindowSize(win, width, height);
                huopaAPI.setProcessWindowAnimation(win, `opacity 0.15s ease, transform 0.15s ease, width ${config.transition} ease, height ${config.transition} ease, left ${config.transition} ease, top ${config.transition} ease`);
            }

        };
        await new Promise(resolve => setTimeout(resolve, 16));
    }
}
processFetch();
setWindowPositions();
