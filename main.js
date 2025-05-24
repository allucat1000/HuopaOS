if (typeof window === "undefined" || typeof localStorage === "undefined") {
  console.error("HuopaOS requires a browser with localStorage capabilities.");
  throw new Error("HuopaOS requires a browser environment.");
}


let termInput = "";
const termDiv = document.getElementById("termDiv");
let inputAnswerActive = false;
let inputAnswer = undefined;
addLine("## Booting system...")
addLine("### [color=rgb(100, 175, 255)]HuopaOS [/color] beta build.")
addLine("### Made by [color=rgb(100, 175, 255)]Allucat1000.[/color]")
addLine("Thank you for trying this demo! If you have any suggestions or bugs, make sure to let me know!")
addLine("[color=lime]Use the \"hpkg install\" to install a package.[/color]")
addLine("[color=lime]Make sure to update your packages often using \"hpkg update\".[/color]")
const currentVer = "0.3.1"
const verBranch = "main";
if (verBranch === "dev") {
  addLine("## Hold up!")
  addLine("### The dev branch is in use currently!")
  addLine("### Be ready for bugs!")
}


const textInput = document.getElementById("textInput");
textInput.focus()

  
textInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const cmd = textInput.value.split(' ')[0]
    const params = textInput.value
        .split(' ')
        .slice(1);

    addLine("$" + textInput.value)
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
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/modules/${name}.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Module downloaded! Installing...")
                const moduleData = await response.text();
                internalFS.createPath(`/system/modules/${name}.js`, "file", moduleData);
  
                await addLine("Module installed.")
                await internalFS.loadPackage(`/system/modules/${name}.js`);
            } else {
                await addLine(`[bg=red]Failed to fetch module, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch module: ${name}.[/bg]`);
            await addLine(`Error: ${e}`);
        }

  },
  async runCMD(input, params = []) {
  if (!input) return;

  await internalFS.loadPackage(`/system/terminalcmd.js`, "silent");
  await new Promise(resolve => setTimeout(resolve, 500));

  const command = input.toLowerCase();
  const args = params;

  try {
    const cmd = window.terminalcmd[command];
    if (typeof cmd === "function") {
      console.log(args)
      await cmd(args);
    } else {
      addLine(`[bg=red]${command} is not a command, package or app.[/bg]`);
    }
  } catch (e) {
    addLine("[bg=red]Failed to run command[/bg]");
    console.error(`Failed to run command "${command}".\nError:\n\n`, e);
  }
}

}

const internalFS = {
    getFile(path) {
        return localStorage.getItem(path);
    },
    async createPath(path, type = "dir", content = "") {
      const parts = path.split("/");
      for (let i = 1; i < parts.length - 1; i++) {
        const parentPath = "/" + parts.slice(1, i + 1).join("/");
        if (!internalFS.getFile(parentPath)) {
          await internalFS.createPath(parentPath, "dir");
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
      const parentData = internalFS.getFile(parentPath) || "[]";
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
    },


    async delDir(dir, visited = new Set(), recursive = false, force = false) {
      if (visited.has(dir)) return;
      visited.add(dir);

      const contentsRaw = internalFS.getFile(dir);
      let contents = [];

      try {
        contents = JSON.parse(contentsRaw || "[]");
      } catch (e) {
        if (!force === true) console.warn(`Failed to parse contents of ${dir}`, e);
        return;
      }

      for (const item of contents) {
        const itemData = internalFS.getFile(item);
        const isDir = itemData && itemData.trim().startsWith("[");

        if (isDir) {
          if (recursive === true) {
            await internalFS.delDir(item, visited, recursive, force);
          } else {
            if (!force === true) addLine(`[bg=red]Cannot delete directory ${item} without recursive flag[/bg]`);
            return;
          }
        } else {
          localStorage.removeItem(item);
        }
      }

      localStorage.removeItem(dir);

      if (dir !== "/") {
        const parts = dir.split("/");
        const parent = parts.slice(0, -1).join("/") || "/";
        const parentRaw = internalFS.getFile(parent);
        if (parentRaw) {
          try {
            const parentItems = JSON.parse(parentRaw);
            const updated = parentItems.filter(i => i !== dir);
            internalFS.createPath(parent, "dir", JSON.stringify(updated));
          } catch (e) {
            if (!force === true) console.error(`Error updating parent ${parent}`, e);
          }
        }
      }
    },


  async removeFromDir(dir, target) {
    const data = JSON.parse(internalFS.getFile(dir) || "[]");
    const newData = data.filter(item => item !== target);
    await internalFS.createPath(dir, "file", JSON.stringify(newData));
  },

  async downloadPackage(pkgName){
    try {
      await addLine(`[bg=blue]Downloading ${pkgName}...[/bg]`)
      const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/packages/${pkgName}.js?v=${Date.now()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        await addLine("Package downloaded! Installing...")
        const packageData = await response.text();
        await internalFS.createPath(`/system/packages/${pkgName}.js`, "file", packageData);
        if (internalFS.getFile("/system/packages").includes(`/system/packages/${pkgName}.js`)) {
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
  },

  async loadPackage(pkgName) {
    const code = internalFS.getFile(`${pkgName}`);

    if (code) {
      try {
        sandboxEval(code, {
          window,
          console,
          internalFS,
          sys,
          fetch: window.fetch
        });


      } catch (e) {
        console.error(`Failed to execute package '${pkgName}'.`);
        console.error(`Error: ${e}`);
      }
    } else {
      
      await addLine(`[color=red]Package "${pkgName}" not found in file system.[/color]`);
    }
  },
  async getMeta(path) {
  const entry = internalFS.getFile(path);
  if (!entry) {
    return { exists: false };
  }
  return {
    exists: true,
    type: entry.type || 'file', 
    size: entry.size || 0,
  };
  }
}

function checkFileSystemIntegrity() {
  const requiredDirs = ["/system", "/home",  "/system/packages"];
  const issues = [];

  for (const dir of requiredDirs) {
    const raw = internalFS.getFile(dir);
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

async function callCMD(input, params) {
    
  if (input.length > 0) {
    if (input.toLowerCase() === "hpkg") {
      if (params[0].toLowerCase() === "install") {
        if (params[1].toLowerCase())
        await internalFS.downloadPackage(params[1].toLowerCase())
      } else if (params[0].toLowerCase() === "update") {
        const packageList = JSON.parse(internalFS.getFile("/system/packages"));
        for (let i = 0; i < packageList.length; i++) {
          await internalFS.downloadPackage(packageList[i].replace("/system/packages/","").replace(".js",""));
        }
        try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                internalFS.createPath(`/system/terminalcmd.js`, "file", fetchData);
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
      const rawList = internalFS.getFile("/system/packages") || "[]";
      const packageList = JSON.parse(rawList);

      for (let i = 0; i < packageList.length; i++) {
        const pkgName = packageList[i].replace("/system/packages/", "").replace(".js", "");
        if (input.toLowerCase() === pkgName.toLowerCase()) {
          if (params && Array.isArray(params) && params.length > 0) {
            const method = params[0];
            const args = params.slice(1);

            await internalFS.loadPackage(`/system/packages/${input.toLowerCase()}.js`);
            await new Promise(resolve => setTimeout(resolve, 500));

            const pkg = window[input.toLowerCase()];
            if (pkg && typeof pkg[method] === "function") {
              await pkg[method](...args);
            } else {
              console.warn("Invalid package or method:", input.toLowerCase(), method);
            }
          } else {
            console.warn("Params are undefined!");
          }
          return;
        }
      }

    }
  sys.runCMD(input, params)
  }

}
// Bootloader / Installer

async function init() {
  let root = internalFS.getFile("/");
  const isInstalled = isSystemInstalled()


  if (!isInstalled) {
    await addLine("### System files are not installed yet. Install? [Y/n]");
    inputAnswerActive = true;
    await waitUntil(() => !inputAnswerActive);
    if (inputAnswer.toLowerCase() === "y") {
      await addLine("Creating system directories and files...")
      await internalFS.createPath("/");
      await internalFS.createPath("/system");
      await internalFS.createPath("/system/modules");
      await internalFS.createPath("/system/packages");
      await addLine("Fetching required modules...");
      await window.sys["import"]("examplemodule");
      await internalFS.createPath("/home");
      await internalFS.createPath("/home/applications");

      localStorage.setItem("/system/manifest.json", JSON.stringify({
        version: currentVer,
        installedAt: Date.now(),
        corePaths: [
        "/", "/home", "/system"]
      }));

      try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                internalFS.createPath(`/system/terminalcmd.js`, "file", fetchData);
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
    const issues = checkFileSystemIntegrity();
    if (issues && issues.length > 0 || isSystemInstalled === "recovery") {
      addLine("[bg=red][color=black]System issues detected. Attempting recovery...[/color][/bg]");
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
    if (internalFS.getFile("/system/env/boot.js")) {
      bootType = "envBoot";
      addLine("[bg=green]Environment boot directory found (/system/env/boot.js).[/bg]");
      addLine("Attempting to boot...");
      internalFS.loadPackage("/system/env/boot.js");
    }
    
  }
  if (!bootType) {
    addLine("[bg=blue]Loading packages...[/bg]")
    const packageAmount = JSON.parse(internalFS.getFile("/system/packages") || []).length;
          
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



function recoveryCheck() {
  const issues = checkFileSystemIntegrity();
  if (!issues) return;


  localStorage.setItem("/system/manifest.json", JSON.stringify({
    version: currentVer,
    installedAt: Date.now(),
    corePaths: [
      "/", "/home", "/system"]
    }));

  for (const issue of issues) {
    const dir = issue.split(" ")[0];
    localStorage.setItem(dir, JSON.stringify([]));
    console.warn(`Recovered: ${dir}`);
    addLine(`[bg=green][color=black]Recovered directory: ${dir}[/color][/bg]`);
  }
}

function isSystemInstalled() {
  const rootDir = JSON.parse(internalFS.getFile("/"));
  if (!rootDir) { return false };
  if (rootDir.includes("/home") || rootDir.includes("/manifest.json") || rootDir.includes("/system")) {
    if (rootDir.includes("/home") && rootDir.includes("/manifest.json") && rootDir.includes("/system")) {
      return true;
    } else {
      return "recovery";
    }
  } else {
    return false;
  }
}

function sandboxEval(code, context = {}) {
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);

  const sandboxFunction = new Function(...contextKeys, `"use strict";\n${code}`);
  return sandboxFunction(...contextValues);
}

function isDirectory(path) {
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(normalizedPath + "/")) {
      return true;
    }
  }
  return false;
}