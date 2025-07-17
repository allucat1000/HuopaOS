const progBar = document.createElement("progress");
await huopaAPI.setAttribute(progBar, "max", "100");
await huopaAPI.setAttribute(progBar, "min", "0");
await huopaAPI.setAttribute(progBar, "value", "47");
document.body.append(progBar);