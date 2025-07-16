/*
 * HuopaOS - Operating system environment in the browser
 * Copyright (C) 2025 Allucat1000
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


if (typeof window === "undefined") {
  console.error("HuopaOS requires a browser with storage capabilities.");
  throw new Error("HuopaOS requires a browser environment.");
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
    .then(reg => console.log("SW registered", reg))
    .catch(err => console.error("SW registration failed", err));
}
let sessionType = "terminal"
const customColors = {
  red: "#ff5454", 
  green: "#4eff33",
  blue: "#338fff", 
};

const textInput = document.getElementById("textInput");

window.sys = {
  async import(name) {
    try {
            await sys.addLine(`[line=blue]Downloading ${name}...[/line]`)
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/modules/${name}.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await sys.addLine("Module downloaded! Installing...")
                const moduleData = await response.text();
                internalFS.createPath(`/system/modules/${name}.js`, "file", moduleData);
  
                await sys.addLine("Module installed.")
                await internalFS.loadPackage(`/system/modules/${name}.js`);
            } else {
                await sys.addLine(`[line=red]Failed to fetch module, response: ${response.status}[/line]`);
            }

        } catch (e) {
            await sys.addLine(`[line=red]Failed to fetch module: ${name}.[/line]`);
            await sys.addLine(`Error: ${e}`);
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
        await cmd(args);
      } else {
       sys.addLine(`[line=red]${command} is not a command, package or app.[/line]`);
      }
    } catch (e) {
     sys.addLine("[line=red]Failed to run command[/line]");
      console.error(`Failed to run command "${command}".\nError:\n\n`, e);
    }
  },

  async addLine(text) {
    if (sessionType === "graphical") {
      console.log(text);
      return;
    }
    const newText = preprocessLineTag(text);
    const escapedText = escapeWithBackslashes(newText);
    const coloredText = parseColorsAndBackgrounds(escapedText);
    const html = marked.parse(coloredText);

    const termContentDiv = document.createElement('div');
    termContentDiv.innerHTML = html;
    termDiv.appendChild(termContentDiv);
    termDiv.scrollTop = termDiv.scrollHeight;
    if (textInput) {
      textInput.scroll();
    }
    
  }
}

function createSafeWindow() {
  const allowedProps = ['setTimeout', 'clearTimeout', 'fetch', 'console', 'Math', 'Date'];
  const customProps = {};

  return new Proxy({}, {
    get(target, prop) {
      if (prop in customProps) {
        return customProps[prop];
      }
      if (allowedProps.includes(prop)) {
        return window[prop];
      }
      if (prop in window) {
        throw new Error(`Access to window.${prop} is forbidden`);
      }
      throw new Error(`window.${prop} is not defined`);
    },

    set(target, prop, value) {
      if (allowedProps.includes(prop)) {
        throw new Error(`Modification of window.${prop} is forbidden`);
      }
      if (prop in window) {
        throw new Error(`Cannot overwrite existing window.${prop}`);
      }
      if (prop in customProps) {
        throw new Error(`window.${prop} has already been defined and cannot be changed`);
      }
      customProps[prop] = value;
      return true;
    },

    has(target, prop) {
      return allowedProps.includes(prop) || (prop in customProps);
    },

    ownKeys(target) {
      return allowedProps.concat(Object.keys(customProps));
    },

    getOwnPropertyDescriptor(target, prop) {
      if (allowedProps.includes(prop) || (prop in customProps)) {
        return {
          configurable: true,
          enumerable: true,
          writable: false,
          value: this.get(target, prop)
        };
      }
      return undefined;
    }
  });
}

const safeConsole = Object.freeze({
  log: (...args) => console.log(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
});

function createSafeDocument() {
  return new Proxy({}, {
    get(target, prop) {
      throw new Error(`Access to document.${prop} is forbidden in sandbox.`);
    },
    set() {
      throw new Error("Modification of document is forbidden in sandbox.");
    }
  });
}

function sandboxEval(code, context = {}) {
  const safeContext = {
    window: createSafeWindow(),
    document: createSafeDocument(),
    console: safeConsole,
    fetch: window.fetch.bind(window),
    internalFS: context.internalFS,
    sys: context.sys,
    ...context,
  };

  const contextKeys = Object.keys(safeContext);
  const contextValues = Object.values(safeContext);

  const sandboxFunction = new Function(
    ...contextKeys,
    `"use strict";\n${code}`
  );

  return sandboxFunction(...contextValues);
}



let termInput = "";
const termDiv = document.getElementById("termDiv");
let inputAnswerActive = false;
let keysLocked = false;
let inputAnswer = undefined;
sys.addLine("## Booting system...");
sys.addLine("### Made by [color=rgb(100, 175, 255)]Allucat1000.[/color]");
sys.addLine("Use the \"hpkg install\" to install a package. \n Make sure to update your packages often using \"hpkg update\".")
const currentVer = "0.5.0"
const verBranch = "main";
if (verBranch === "dev") {
  sys.addLine("### [line=yellow]Hold up![/line]")
  sys.addLine("### [line=yellow]The dev branch is in use currently! Be ready for bugs![/line]")
}

textInput.focus()

const keysDown = {};

document.addEventListener("keydown", (event) => {
    keysDown[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
    keysDown[event.key.toLowerCase()] = false;
});

function isKeyDown(key) {
    return !!keysDown[key.toLowerCase()];
}

textInput.addEventListener('keydown', function(event) {
  if (keysLocked) return;
  if (event.key === 'Enter') {
    const cmd = textInput.value.split(' ')[0]
    const params = textInput.value
        .split(' ')
        .slice(1);
    
  const replaced = params.map(str =>
    str.replace(/\\@/g, "@")
      .replace(/(?<!\\)@/g, "#")
  );
    sys.addLine("$ " + textInput.value)
    if (!inputAnswerActive) {
        callCMD(cmd, replaced)
    } else {
        inputAnswer = cmd;
        inputAnswerActive = false
    }

    textInput.value = "";
  }
});


const DB_NAME = "HuopaOS";
const STORE_NAME = "files";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const idbFS = {
  async getFile(path) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(path);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async setFile(path, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, path);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async deleteFile(path) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(path);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async getAllKeys() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
};

const internalFS = {
  async getFile(path, permissions = {"read":"SYSTEM", "write":"SYSTEM", "modify":"SYSTEM"}) {
    if (permissions.read = "SYSTEM") {
      return await idbFS.getFile(path);
    }
    const currentPerms = JSON.parse(await internalFS.getFile(path + ".perms"))
    if (currentPerms.read === permissions || currentPerms.read === "" || !await internalFS.getFile(path + ".perms")) {
      return await idbFS.getFile(path);
    } else {
      console.warn("Not right permissions!")
      return "Not right permissions!";
    }
  },

  async createPath(path, type = "dir", content = "", permissions = {
    "read":"",
    "write":"",
    "modify":"",
  }) {
    if (await internalFS.getFile(path)) {
      const currentPerms = JSON.parse(await internalFS.getFile(path + ".perms") || "{\"read\":\"\", \"write\":\"\", \"modify\":\"\"}")
      if (currentPerms.write === (permissions.write || permissions)|| currentPerms.write === "" || permissions.write === "SYSTEM" || !await internalFS.getFile(path + ".perms") || !currentPerms.write && currentPerms === permissions) {
      } else {
        console.warn("Not right permissions!")
        return "Not right permissions!";
      }
    }
    const parts = path.split("/");
    for (let i = 1; i < parts.length - 1; i++) {
      const parentPath = "/" + parts.slice(1, i + 1).join("/");
      if (!(await internalFS.getFile(parentPath))) {
        await internalFS.createPath(parentPath, "dir");
      }
    }

    if (type === "dir") {
      await idbFS.setFile(path, content === "" ? "[]" : content);
      await idbFS.setFile(path + ".perms", JSON.stringify(permissions || { "write":"SYSTEM", "read":"SYSTEM", "modify":"SYSTEM"}));
    } else if (type === "file") {
      await idbFS.setFile(path, content);
      await idbFS.setFile(path + ".perms", JSON.stringify(permissions || { "write":"SYSTEM", "read":"SYSTEM", "modify":"SYSTEM"}));
    } else {
      throw new Error("Unknown path type: " + type);
    }
    if (path.endsWith(".icon")) return;
    const parentPath = parts.slice(0, -1).join("/") || "/";
    const parentData = await internalFS.getFile(parentPath) || "[]";
    if (parentPath === "/" && path === parentPath) return;
    try {
      const parentList = JSON.parse(parentData);
      if (!parentList.includes(path)) {
        parentList.push(path);
        await idbFS.setFile(parentPath, JSON.stringify(parentList));
      }
    } catch (e) {
      console.error(`Failed to update parent directory "${parentPath}":`, e);
    }
  },

  async delDir(dir, permissions = {"read":"SYSTEM","write":"SYSTEM", "modify":"SYSTEM"}, recursive = false, force = false, visited = new Set()) {
    if (visited.has(dir)) return;
    visited.add(dir);

    const contentsRaw = await internalFS.getFile(dir);
    let contents = [];

    try {
      contents = JSON.parse(contentsRaw || "[]");
    } catch (e) {
      if (!force) console.warn(`Failed to parse contents of ${dir}`, e);
    }
    const isDir = await this.isDirectory(dir);
    if (!isDir) {
      contents = [];
    }
    for (const item of contents) {
      const isDir = await this.isDirectory(item);

      if (isDir) {
        if (recursive) {
          await internalFS.delDir(item, permissions, recursive, force, visited);
        } else {
          if (!force) sys.addLine(`[line=red]Cannot delete directory ${item} without recursive flag[/line]`);
          return;
        }
      } else {
        const currentPerms = JSON.parse(await internalFS.getFile(item + ".perms")) || {"read":"","write":"", "modify":""}
        if (currentPerms.modify === permissions || currentPerms.modify === "" || permissions.modify === "SYSTEM" || !await internalFS.getFile(item + ".perms")) {
          await idbFS.deleteFile(item);
          await idbFS.deleteFile(item + ".perms");
        } else {
          console.warn("Not right permissions!")
          return "Not right permissions!";
        }
        
      }
    }
    const currentPerms = JSON.parse(await internalFS.getFile(dir + ".perms")) || {"read":"","write":"", "modify":""}
    if (currentPerms.modify === permissions || currentPerms.modify === "" || permissions.modify === "SYSTEM" || !await internalFS.getFile(item + ".perms")) {
    await idbFS.deleteFile(dir);
    await idbFS.deleteFile(dir + ".perms");
    } else {
      console.warn("Not right permissions!")
      return "Not right permissions!"
    }

    if (dir !== "/") {
      const parts = dir.split("/");
      const parent = parts.slice(0, -1).join("/") || "/";
      const parentRaw = await internalFS.getFile(parent);
      if (parentRaw) {
        try {
          const parentItems = JSON.parse(parentRaw);
          const updated = parentItems.filter(i => i !== dir);
          await internalFS.createPath(parent, "dir", JSON.stringify(updated));
        } catch (e) {
          if (!force) console.error(`Error updating parent ${parent}`, e);
        }
      }
    }
  },


  async downloadPackage(pkgName) {
    try {
      await sys.addLine(`[line=blue]Downloading ${pkgName}...[/line]`);
      const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/packages/${pkgName}.js?v=${Date.now()}`;
      const response = await fetch(url);

      if (response.ok) {
        await sys.addLine("Package downloaded! Installing...");
        const packageData = await response.text();
        await internalFS.createPath(`/system/packages/${pkgName}.js`, "file", packageData);

        const pkgList = await internalFS.getFile("/system/packages") || "[]";
        if (!JSON.parse(pkgList).includes(`/system/packages/${pkgName}.js`)) {
          await sys.addLine("[line=green] [/line] Package updated.");
        }

        await sys.addLine("Package installed.");
      } else {
        await sys.addLine(`[line=red]Failed to fetch package, response: ${response.status}[/line]`);
      }
    } catch (e) {
      await sys.addLine(`[line=red]Failed to fetch package: ${pkgName}.[/line]`);
      await sys.addLine(`Error: ${e}`);
    }
  },

  async loadPackage(pkgName) {
    const code = await internalFS.getFile(pkgName);
    if (code) {
      try {
        sandboxEval(code, { window, console, internalFS, sys, fetch: window.fetch });
      } catch (e) {
        console.error(`Failed to execute package '${pkgName}'. Error:`, e);
      }
    } else {
      await sys.addLine(`[line=red]Package "${pkgName}" not found in file system.[/line]`);
    }
  },

  async getMeta(path) {
    const entry = await internalFS.getFile(path);
    if (!entry) return { exists: false };
    return { exists: true, type: "file", size: entry.length || 0 };
  },

  async runUnsandboxed(path) {
    const safepkgPath = "/system/security/safepkgs.json";
    const safepkgRaw = await internalFS.getFile(safepkgPath) || "[]";
    let allowList = JSON.parse(safepkgRaw);
    if (allowList.includes(path)) {
      try {
        sys.addLine("Running whitelisted unsandboxed script...");
        const code = await internalFS.getFile(path);
        const unsandboxedFunction = new Function(code);
        return unsandboxedFunction();
      } catch (error) {
        sys.addLine(`[line=red]Error running unsandboxed script: ${error}[/line]`);
      }
    }

    await sys.addLine(`Do you want to run a script from the path: ${path} unsandboxed? [A/y/n]`);
    inputAnswerActive = true;
    await waitUntil(() => !inputAnswerActive);

    const answer = inputAnswer.toLowerCase();
    if (["y", "", "a"].includes(answer)) {
      try {
        if (["a", ""].includes(answer) && !allowList.includes(path)) {
          allowList.push(path);
          await internalFS.createPath(safepkgPath, "file", JSON.stringify(allowList));
        }
        const code = await internalFS.getFile(path);
        const unsandboxedFunction = new Function(code);
        return unsandboxedFunction();
      } catch (error) {
        sys.addLine(`[line=red]Error running unsandboxed script: ${error}[/line]`);
      }
    } else {
      await sys.addLine("Execution cancelled.");
    }
  },

  async isDirectory(path) {
    const keys = await idbFS.getAllKeys();
    const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
    return keys.some(key => key.startsWith(normalizedPath + "/"));
  }
};



async function checkFileSystemIntegrity() {
  const requiredDirs = ["/system", "/home",  "/system/packages"];
  const issues = [];

  for (const dir of requiredDirs) {
    const raw = await internalFS.getFile(dir);
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
  if (keysLocked) return;
  if (input.length > 0) {
    if (input.toLowerCase() === "hpkg") {
      if (params.length < 1) {
        sys.addLine("[line=red]You need at least 1 argument for this command.[/line]")
        return;
      }
      if (params[0].toLowerCase() === "install") {
        if (params.length < 2 || !params[1]) {
          sys.addLine("[line=red]You need at least 2 arguments for this command.[/line]")
          return;
        }
        if (params[1].toLowerCase())
        await internalFS.downloadPackage(params[1].toLowerCase());
        const manifestFetch = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/packages/${params[1].toLowerCase()}.js.config?v=${Date.now()}`);
        let data
        if (manifestFetch.ok) {
          data = await manifestFetch.text()
          data = JSON.parse(data);
          await internalFS.createPath(`/system/packages/${data.name}.js.config`, "file", data);
        } else {
          console.error("Failed to fetch package manifest file!");
          await sys.addLine("[line=red]Failed to fetch package manifest file![/line]");
          return
        }
        if (data.installcmd) {
          callCMD(params[1].toLowerCase(), `["${installcmd}"]`);
        }

      } else if (params[0].toLowerCase() === "update") {
        const packageList = JSON.parse(await internalFS.getFile("/system/packages") || []);
        
        for (let i = 0; i < packageList.length; i++) {
          if (packageList[i].endsWith(".config")) return;
          let oldManifest = await internalFS.getFile(`${packageList[i]}.config`);
          let updatePackage = false;
          const manifestFetch = await fetch(`https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/packages/${packageList[i].replace("/system/packages/","")}.config?v=${Date.now()}`);
          if (manifestFetch.ok) {
            let data = await manifestFetch.text()
            data = JSON.parse(data);
            if (oldManifest) {
              if (data?.version && data.version > oldManifest.version) {
                await internalFS.createPath(`/system/packages/${data.name}.js.config`, "file", data);
                updatePackage = true;
              }
            } else {
              await internalFS.createPath(`/system/packages/${data.name}.js.config`, "file", data);
              updatePackage = true;
            }
          } else {
              console.error("Failed to fetch package manifest file!");
              await sys.addLine("[line=red]Failed to fetch package manifest file![/line]")
          }
          if (updatePackage === true) {
            await internalFS.downloadPackage(packageList[i].replace("/system/packages/","").replace(".js",""));
          }
          
        }
        try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await sys.addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                internalFS.createPath(`/system/terminalcmd.js`, "file", fetchData);
                sys.addLine("[line=green]Terminal commands succesfully installed![/line]")
            } else {
                await sys.addLine(`[line=red]Failed to fetch terminal commands, response: ${response.status}[/line]`);
            }

        } catch (e) {
            await sys.addLine(`[line=red]Failed to fetch terminal commands.[/line]`);
            await sys.addLine(`Error: ${e}`);
        }
      } else {
        sys.addLine(`[line=red]Unknown hPKG command: ${params[0]}[/line]`)
      }
      return;


    
    } else {
      if (input.toLowerCase() === "sysfix") {
        await sys.addLine("Reinstalling core system files...");
        inputAnswer = "";
        init(true);
        return;

      }
      const rawList = await internalFS.getFile("/system/packages") || "[]";
      const packageList = JSON.parse(rawList);

      for (let i = 0; i < packageList.length; i++) {
        const pkgName = packageList[i].replace("/system/packages/", "").replace(".js", "");
        const inputName = input.toLowerCase();
        const pkgNameLower = pkgName.toLowerCase();
        let unsandboxed = params[0] === "-nsbx" ? 1 : 0;

        if (inputName === pkgNameLower) {
            
            let method = params[0 + unsandboxed] || "init";
            let args = params.slice(1 + unsandboxed);

            if (unsandboxed === 1) {
              await internalFS.runUnsandboxed(`/system/packages/${pkgName}.js`);
              const pkg = window[pkgNameLower];
              if (!pkg) {
                sys.addLine("Unsandboxed run cancelled!")
                return;
              }
            } else {
              await internalFS.loadPackage(`/system/packages/${pkgName}.js`);
            }

            await new Promise(resolve => setTimeout(resolve, 500));

            const pkg = window[pkgNameLower];
            if (pkg && typeof pkg[method] === "function") {
              try {
                await pkg[method](...args);
              } catch (error) {
                sys.addLine(`Error: ${error}`);
              }
            } else {
              await sys.addLine("[line=red]Invalid method[/line]");
              console.warn("Invalid package or method:", inputName, method);
            }
          return;
        }
      }


    }
  sys.runCMD(input, params)
  }

}
// Bootloader / Installer

async function init(reinstall) {
  let root = await internalFS.getFile("/");
  const isInstalled = await isSystemInstalled()

  if (!isInstalled || reinstall) {
    if (!reinstall) {
      await sys.addLine("### System files are not installed yet. Install? [Y/n]");
      inputAnswerActive = true;
      await waitUntil(() => !inputAnswerActive);
    }
    if (inputAnswer.toLowerCase() === "y" || inputAnswer.toLowerCase() === "" || reinstall) {
      await sys.addLine("Creating system directories and files...")
      await internalFS.createPath("/");
      await internalFS.createPath("/system");
      await internalFS.createPath("/system/modules");
      await internalFS.createPath("/system/packages");
      await internalFS.createPath("/home");
      await internalFS.createPath("/home/applications");

      internalFS.createPath("/system/manifest.json", "file", JSON.stringify({
        version: currentVer,
        installedAt: Date.now(),
        corePaths: [
        "/", "/home", "/system"]
      }));

      try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/${verBranch}/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await sys.addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                internalFS.createPath(`/system/terminalcmd.js`, "file", fetchData);
            } else {
                await sys.addLine(`[line=red]Failed to fetch terminal commands, response: ${response.status}[/line]`);
            }

        } catch (e) {
            await sys.addLine(`[line=red]Failed to fetch terminal commands.[/line]`);
            await sys.addLine(`Error: ${e}`);
        }
      sys.addLine("[line=green]Terminal commands installed[/line]");
      await internalFS.downloadPackage("huopadesktop");
      await callCMD("huopadesktop", ["install"]);
      
    } else {
        await sys.addLine("**System file creation cancelled.**")
        await sys.addLine("[line=red]**_You will be unable to use the system, since you don't have core system files._**[/line]")
    }
  } else {
    const issues = await checkFileSystemIntegrity();
    if (issues && issues.length > 0 || isSystemInstalled() === "recovery") {
      sys.addLine("[line=red]System issues detected. Attempting recovery...[/line]");
      await recoveryCheck(issues);
    }

    if (verBranch === "dev") {
      if (!await internalFS.getFile("/system/packages/sideloader.js")) {
        await internalFS.downloadPackage("sideloader");
        await sys.addLine("Sideloader automatically installed!");
      }

    }

    await bootMGR()
    
  }
}



async function bootMGR() {
  sys.addLine("Root directory detected.");
  if (await internalFS.getFile("/system/env/config.json")) {
    sys.addLine("Press \"c\" to boot into the Terminal")
  }
  keysLocked = true;
  let loadEnv = false
  if (await internalFS.getFile("/system/env/config.json")) {
    const currentTime = Date.now();
    const waitTime = currentTime + 1000;
    await waitUntil(() => Date.now() > waitTime || textInput.value.toLowerCase() === "c");
    if (Date.now() > waitTime) {loadEnv = true;} else {textInput.value = "";}
  }
  if (loadEnv) {
      keysLocked = false;
      sys.addLine("[line=green]Environment boot config found (/system/env/config.json).[/line]");

      const config = JSON.parse(await internalFS.getFile("/system/env/config.json"));

      if (!config.bootpath || !config.bootname || !config.bootcmd) {
          sys.addLine("[line=red]Corrupted config! Missing bootpath, bootname, or bootcmd.[/line]");
          return;
      }

      try {
          await internalFS.loadPackage(config.bootpath);

          const cmd = window[config.bootname]?.[config.bootcmd];

          if (typeof cmd === "function") {
              await cmd();
          } else {
              sys.addLine(`[line=red]Boot command "${config.bootcmd}" not found in "${config.bootname}".[/line]`);
          }
      } catch (e) {
          sys.addLine(`[line=red]Boot failed: ${e}[/line]`);
          console.error("BootMGR error:", e);
      }
      return;
  }

    await new Promise(resolve => setTimeout(resolve, 500));
    keysLocked = false;

    

    
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

function getColor(colorName) {
  return customColors[colorName.toLowerCase()] || colorName;
}

function preprocessLineTag(text) {
  return text.replace(/\[line=(.+?)\]([\s\S]*?)\[\/line\]/g, (match, color, content) => {
    const actualColor = getColor(color);
    return `[color=${actualColor}]┃ [/color]${content}`;
  });
}


function parseColorsAndBackgrounds(text) {
  text = text.replace(/\[color=(.+?)\](.+?)\[\/color\]/g, (m, color, content) => {
    const actualColor = getColor(color);
    return `<span style="color:${actualColor};">${content}</span>`;
  });

  text = text.replace(/\[bg=(.+?)\](.+?)\[\/bg\]/g, (m, color, content) => {
    const actualColor = getColor(color);
    return `<span style="background-color:${actualColor};">${content}</span>`;
  });

  return text;
}



function escapeWithBackslashes(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
}



async function recoveryCheck() {
  const issues = await checkFileSystemIntegrity();
  if (!issues) return;


  internalFS.createPath("/system/manifest.json", "file", JSON.stringify({
    version: currentVer,
    installedAt: Date.now(),
    corePaths: [
      "/", "/home", "/system"]
    }));
  for (const issue of issues) {
    const dir = issue.split(" ")[0];
    await internalFS.createPath(dir, "file", JSON.stringify([]));
    console.warn(`Recovered: ${dir}`);
    await sys.addLine(`[line=green]Recovered directory: ${dir}[/line]`);
  }
}

async function isSystemInstalled() {
  let rootDir;
  try {
    rootDir = JSON.parse(await internalFS.getFile("/"));
  } catch {
    return false;
  }
  
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
