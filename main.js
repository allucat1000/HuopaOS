let termInput = "";
const termDiv = document.getElementById("termDiv");
let inputAnswerActive = false;
let inputAnswer = undefined;
addLine("## Booting system...")
addLine("### [color=rgb(185, 15, 185)]HuopaOS [/color] [color=lime]beta build.[/color]")
addLine("### Made by [color=rgb(100, 170, 255)]Allucat1000.[/color]")
addLine("Thank you for trying this demo! If you have any suggestions or bugs, make sure to let me know!")
addLine("[color=lime]Use the \"hpkg install\" to install a package.[/color]")
addLine("[color=lime]Make sure to update your packages often using \"hpkg update\".[/color]")
const currentVer = "0.1.4"

const textInput = document.getElementById("textInput");
textInput.focus()

  
textInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const cmd = textInput.value.split(' ')[0]
    const params = textInput.value
        .split(' ')
        .slice(1)
        .map(p => p.replace(/^-/, ''));

    addLine("$ " + textInput.value)
    if (!inputAnswerActive) {
        callCMD(cmd, params)
    } else {
        inputAnswer = cmd;
        inputAnswerActive = false
    }

    textInput.value = "";
  }
});


window.sys = {
  async import(name) {
    await addLine("[bg=blue]Downloading module...[/bg]");
    try {
            await addLine(`[bg=blue]Downloading ${name}...[/bg]`)
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/modules/${name}?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Module downloaded! Installing...")
                const moduleData = await response.text();
                createPath(`/system/modules/${name}.js`, "file", moduleData);
  
                const currentList = localStorage.getItem("/system/moduleList.txt") || "";
                
                createPath("/system/moduleList.txt", "file", currentList + name + " ");
                await addLine("Module installed.")
                await loadPackage(`/system/modules/${name}.js`);
            } else {
                await addLine(`[bg=red]Failed to fetch module, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch module: ${name}.[/bg]`);
            await addLine(`Error: ${e}`);
        }

  },
  async runCMD(input, params) {
          if (input.length > 0) {
            await loadPackage(`/system/terminalcmd.js`, "silent")
            await new Promise(resolve => setTimeout(resolve, 500));
            try {
              await window["terminalcmd"][input.toLowerCase()]()
            } catch (e) {
              if (e.message.includes("is not a function")) {
                addLine(`[bg=red]${input.toLowerCase()} is not a command, package or app.[/bg]`)
              } else {
                addLine("[bg=red]Failed to run command[/bg]")
                console.error("Failed to run command. \n Error: \n\n" + e)
              }
              
            }
          }
          

  }
}

async function callCMD(input, params) {
  try {
    
  if (input.length > 0) {
    if (input.toLowerCase() === "hpkg") {
      if (params[0].toLowerCase() === "install") {
        await downloadPKG(params[1].toLowerCase())
      } else if (params[0].toLowerCase() === "update") {
        const packageList = JSON.parse(localStorage.getItem("/system/packages"));
        for (let i = 0; i < packageList.length; i++) {
          downloadPKG(packageList[i].replace("/system/packages/","").replace(".js",""));
        }
        try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                createPath(`/system/terminalcmd.js`, "file", fetchData);
                addLine("[bg=green]Terminal commands succesfully installed![/bg]")
            } else {
                await addLine(`[bg=red]Failed to fetch terminal commands, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch terminal commands.[/bg]`);
            await addLine(`Error: ${e}`);
        }
      } else {
        addLine(`[bg=red]Unknown hPKG command: ${params[0]}[/bg]`)
      }
      return;
    } else {
        const rawList = localStorage.getItem("/system/packageList.txt") || "";
        const packageList = rawList.split(" ");
        for (let i = 0; i < packageList.length; i++) {
          if (input.toLowerCase() === packageList[i].toLowerCase()) {
            await loadPackage(`/system/packages/${input.toLowerCase()}.js`)
            await new Promise(resolve => setTimeout(resolve, 500));
            await window[input.toLowerCase()][params[0].toLowerCase()]()
            return;
        }

      }
    }
  sys.runCMD(input, params)
  }

  } catch (error) {
    addLine("Failed to run command! Error: " + error)
  }
}
// Bootloader / Installer

async function init() {
  let root = localStorage.getItem("/");
  const isInstalled = isSystemInstalled()
  console.log(isSystemInstalled)

  if (!isInstalled) {
    await addLine("### System files are not installed yet. Install? [Y/n]");
    inputAnswerActive = true;
    await waitUntil(() => !inputAnswerActive);
    if (inputAnswer.toLowerCase() === "y") {
      await addLine("Creating system directories and files...")
      await createPath("/");
      await createPath("/system");
      await createPath("/system/modules");
      await createPath("/system/packages");
      await addLine("Fetching required modules...");
      await window.sys["import"]("examplemodule.js");
      await createPath("/home");
      await createPath("/home/applications");

      localStorage.setItem("/system/manifest.json", JSON.stringify({
        version: currentVer,
        installedAt: Date.now(),
        corePaths: [
          "/", "/home", "/system", "/user",
          "/system/bootmgr.js", "/user/settings.json"
        ]
      }));

      try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                createPath(`/system/terminalcmd.js`, "file", fetchData);
            } else {
                await addLine(`[bg=red]Failed to fetch terminal commands, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch terminal commands.[/bg]`);
            await addLine(`Error: ${e}`);
        }
      addLine("[bg=green]Terminal commands installed[/bg]")
      
    } else {
        await addLine("**System file creation cancelled.**")
        await addLine("[color=red]**_You will be unable to use the system, since you don't have a core system files._**[/color]")
    }
  } else {
    console.log(isInstalled)
    const issues = checkFileSystemIntegrity();
    if (issues && issues.length > 0 || isSystemInstalled === "recovery") {
      addLine("[bg=orange]System issues detected. Attempting recovery...[/bg]");
      recoveryCheck(issues);
    }


    bootMGR()
    
  }
}

async function bootMGR(extraParams) {
  addLine("Root directory detected.")
  let bootType = null
  if (extraParams) {
    if (extraParams === "termBoot") {
      addLine("Terminal environment booted!")
    }
  }

  if (!bootType) {
    if (localStorage.getItem("/system/env/boot.js")) {
      bootType = "envBoot";
      addLine("[bg=purple]Environment boot directory found (/system/env/boot.js).[/bg]");
      addLine("Attempting to boot...");
      loadPackage("/system/env/boot.js");
    }
    
  }
  if (!bootType) {
    addLine("[bg=blue]Loading packages...[/bg]")
    const packageAmount = JSON.parse(localStorage.getItem("/system/packages") || []).length;
          
    await addLine(`[bg=green]${packageAmount} packages found[/bg]`)
    if (packageAmount > 0) {
      await addLine("### Package loading available. Use the command \"[color=palevioletred]listpkgs[/color]\" to view your packages.")
    }
  }
    

    
}

init();

async function termContentChange(data) {
  if (data.toLowerCase() === "clear") {
    document.getElementById("termDiv").innerHTML = "";
  }
}

function waitUntil(conditionFn, checkInterval = 50) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
        if (conditionFn()) {
            clearInterval(interval);
            resolve();
        }
    }, checkInterval);
});
}

function parseColorsAndBackgrounds(text) {
  text = text.replace(/\[color=(.+?)\](.+?)\[\/color\]/g, (m, color, content) =>
    `<span style="color:${color};">${content}</span>`);
  text = text.replace(/\[bg=(.+?)\](.+?)\[\/bg\]/g, (m, color, content) =>
    `<span style="background-color:${color};">${content}</span>`);
  return text;
}


async function addLine(text) {
  const escapedText = escapeWithBackslashes(text);

  const coloredText = parseColorsAndBackgrounds(escapedText);

  const html = marked.parse(coloredText);

  const termContentDiv = document.createElement('div');
  termContentDiv.innerHTML = html;
  termDiv.appendChild(termContentDiv);
  termDiv.scrollTop = termDiv.scrollHeight;
}

function escapeWithBackslashes(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
}

async function downloadPKG(pkgName){
  try {
    await addLine(`[bg=blue]Downloading ${pkgName}...[/bg]`)
    const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/packages/${pkgName}.js?v=${Date.now()}`;
    const response = await fetch(url);
    
    if (response.ok) {
      await addLine("Package downloaded! Installing...")
      const packageData = await response.text();
      createPath(`/system/packages/${pkgName}.js`, "file", packageData);
      const currentList = localStorage.getItem("/system/packageList.txt") || "";
      if (!currentList.split(" ").includes(pkgName)) {
        createPath("/system/packageList.txt", "file", currentList + pkgName + " ");
      } else {
        addLine("[bg=green]Package updated.[/bg]")
      }

      await addLine("Package installed.")
    } else {
      await addLine(`[bg=red]Failed to fetch package, response: ${response.status}[/bg]`);
    }

  } catch (e) {
    await addLine(`[bg=red]Failed to fetch package: ${pkgName}.[/bg]`);
    await addLine(`Error: ${e}`);
  }
}

async function loadPackage(pkgName) {
  const code = localStorage.getItem(`${pkgName}`);

  if (code) {
    try {
      console.log(code);
      eval(code);

    } catch (e) {
      
      await addLine(`[color=red]Failed to execute package '${pkgName}'.[/color]`);
      await addLine(`[color=red]Error: ${e}[/color]`)
      console.error(e);
    }
  } else {
    
    await addLine(`[color=red]Package "${pkgName}" not found in file system.[/color]`);
  }
}

async function createPath(path, type = "dir", content = "") {
  const parts = path.split("/");
  for (let i = 1; i < parts.length - 1; i++) {
    const parentPath = "/" + parts.slice(1, i + 1).join("/");
    if (!localStorage.getItem(parentPath)) {
      await createPath(parentPath, "dir");
    }
  }

  if (type === "dir") {
    localStorage.setItem(path, content === "" ? "[]" : content);
  } else if (type === "file") {
    localStorage.setItem(path, content);
  } else {
    throw new Error("Unknown path type: " + type);
  }

  const parentPath = parts.slice(0, -1).join("/") || "/";
  const parentData = localStorage.getItem(parentPath) || "[]";
  if (parentPath === "/" && path === parentPath) {
    return;
  }
  try {
    const parentList = JSON.parse(parentData);
    if (!parentList.includes(path)) {
      parentList.push(path);
      localStorage.setItem(parentPath, JSON.stringify(parentList));
    }
  } catch (e) {
    console.error(`Failed to update parent directory "${parentPath}":`, e);
  }
}


async function delDir(dir, visited = new Set()) {
  if (visited.has(dir)) return;
  visited.add(dir);

  const contentsRaw = localStorage.getItem(dir);
  const contents = JSON.parse(contentsRaw || "[]");

  for (const item of contents) {
    const itemValue = localStorage.getItem(item);

    if (itemValue && itemValue.startsWith("[")) {
      await delDir(item, visited);
    } else {
      localStorage.removeItem(item);
    }
  }

  localStorage.removeItem(dir);

  if (dir !== "/") {
    const dirParts = dir.split("/");
    const parentPath = dirParts.slice(0, -1).join("/") || "/";
    const parentContentsRaw = localStorage.getItem(parentPath);

    if (parentContentsRaw) {
      try {
        const parentContents = JSON.parse(parentContentsRaw);
        const updated = parentContents.filter(item => item !== dir);
        createPath(parentPath, "file", JSON.stringify(updated));
      } catch (e) {
        console.error(`Failed to update parent dir: ${parentPath}`, e);
      }
    }
  }
}

async function removeFromDir(dir, target) {
  const data = JSON.parse(localStorage.getItem(dir) || "[]");
  const newData = data.filter(item => item !== target);
  createPath(dir, "file", JSON.stringify(newData));
}

function checkFileSystemIntegrity() {
  const requiredDirs = ["/system", "/home",  "/system/packages"];
  const issues = [];

  for (const dir of requiredDirs) {
    const raw = localStorage.getItem(dir);
    if (!raw) {
      issues.push(`${dir} doesn't exist`);
      continue;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        issues.push(`${dir} isn't a valid dir`);
      }
    } catch {
      issues.push(`${dir} is corrupted (invalid JSON)`);
    }
  }

  return issues.length > 0 ? issues : null;
}

function recoveryCheck() {
  const issues = checkFileSystemIntegrity();
  if (!issues) return;

  addLine("### [bg=orange]System issues detected! Trying to repair...[/bg]");

  localStorage.setItem("/system/manifest.json", JSON.stringify({
    version: currentVer,
    installedAt: Date.now(),
    corePaths: [
      "/", "/home", "/system", "/user",
      "/system/bootmgr.js", "/user/settings.json"
    ]
  }));

  for (const issue of issues) {
    const dir = issue.split(" ")[0];
    localStorage.setItem(dir, JSON.stringify([]));
    console.warn(`Recovered: ${dir}`);
    addLine(`[bg=yellow][color=black]Recovered directory: ${dir}[/color][/bg]`);
  }
}

function isSystemInstalled() {
  const manifestStr = localStorage.getItem("/system/manifest.json");
  if (!manifestStr) return false; // Manifest missing = system not installed

  try {
    const manifest = JSON.parse(manifestStr);
    
    if (!Array.isArray(manifest.corePaths) || typeof manifest.version !== "string") {
      return "recovery";
    }

    return manifest.corePaths.every(path => localStorage.getItem(path) !== null);
  } catch {
    return "recovery";
  }
}
