let termInput = "";
let termContent = "";
const termText = document.createElement("p");
termText.textContent = termContent;
const termDiv = document.getElementById("termDiv");
let inputAnswerActive = false;
let inputAnswer = undefined;
termDiv.append(termText);
addLine("## Booting system...")
addLine("### [color=rgb(185, 15, 185)]HuopaOS [/color] [color=lime]beta build.[/color]")
addLine("### Made by [color=rgb(100, 170, 255)]Allucat1000.[/color]")
addLine("Thank you for trying this demo! If you have any suggestions or bugs, make sure to let me know!")
addLine("[color=lime]Use the \"hpkg install\" to install a package.[/color]")
addLine("[color=lime]Make sure to update your packages often using \"hpkg update\".[/color]")
async function updateScreen() {
    termText.textContent = termContent;
}
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
    updateScreen()
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
                localStorage.setItem(`/system/modules/${name}.js`, moduleData);
  
                const currentList = localStorage.getItem("/system/moduleList.txt") || "";
                addResultToDir("/system/modules",`/system/modules/${name}`)
                localStorage.setItem("/system/moduleList.txt", currentList + name + " ");
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
              await window["terminalcmd"][input]()
            } catch (e) {
              if (e.message.includes("] is not a function")) {
                addLine(`[bg=red]${input} is not a command, package or app.[/bg]`)
              } else {
                addLine("[bg=red]Failed to run command[/bg]")
                console.error("Failed to run command. \n Error: \n\n" + e)
              }
              
            }
          }
          

  }
}

async function callCMD(input, params) {
  if (input.length > 0) {
    if (input.toLowerCase() === "hpkg") {
      if (params[0].toLowerCase() === "install") {
        downloadPKG(params[1].toLowerCase())
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
                localStorage.setItem(`/system/terminalcmd.js`, fetchData);
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
            const pkg = window[input.toLowerCase()];
            const func = pkg?.[params[0]];
            await loadPackage(`/system/packages/${input.toLowerCase()}.js`)
            await new Promise(resolve => setTimeout(resolve, 500));
            await window[input.toLowerCase()][params[0]]()
            return;
        }

      }
    }
  sys.runCMD(input, params)
  }
}
// Bootloader / Installer

async function init() {
  const root = localStorage.getItem("/");

  if (!root) {
    await addLine("### System files are not installed yet. Install? [Y/n]");
    inputAnswerActive = true;
    await waitUntil(() => !inputAnswerActive);
    if (inputAnswer.toLowerCase() === "y") {
      await addLine("Creating system directories and files...")
      createDir("/")
      createDir("/system")
      addResultToDir("/", "system")
      createDir("/system/modules")
      createDir("/system/packages")
      addResultToDir("/system", "/system/modules")
      addResultToDir("/system", "/system/packages")
      await addLine("Fetching required modules...")
      await window.sys["import"]("examplemodule.js");
      createDir("/home")
      addResultToDir("/","/home")
      createDir("/home/applications")
      addResultToDir("/home/", "/home/applications")
      try {
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/system/terminalcmd.js?v=${Date.now()}`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Terminal CmdList downloaded! Installing...")
                const fetchData = await response.text();
                localStorage.setItem(`/system/terminalcmd.js`, fetchData);
            } else {
                await addLine(`[bg=red]Failed to fetch terminal commands, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch terminal commands.[/bg]`);
            await addLine(`Error: ${e}`);
        }

      
    } else {
        await addLine("**System file creation cancelled.**")
        await addLine("[color=red]**_You will be unable to use the system, since you don't have a core system files._**[/color]")
    }
  } else {
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

  const p = document.createElement('div');
  p.innerHTML = html;
  termDiv.appendChild(p);
  termDiv.scrollTop = termDiv.scrollHeight;
}

function escapeWithBackslashes(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/</g, "\\<")
    .replace(/>/g, "\\>")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
}

async function downloadPKG(pkgName){
  try {
    await addLine(`[bg=blue]Downloading ${pkgName}...[/bg]`)
    const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/main/packages/${pkgName}.js?v=${Date.now()}`;
    const response = await fetch(url);
    
    if (response.ok) {
      await addLine("Package downloaded! Installing...")
      const packageData = await response.text();
      localStorage.setItem(`/system/packages/${pkgName}.js`, packageData);
      const currentList = localStorage.getItem("/system/packageList.txt") || "";
      if (!currentList.split(" ").includes(pkgName)) {
        addResultToDir("/system/packages",`/system/packages/${pkgName}.js`)
        localStorage.setItem("/system/packageList.txt", currentList + pkgName + " ");
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

async function createDir(dirName) {
  if (!localStorage.getItem(dirName)) {
    localStorage.setItem(dirName, "[]")
  } else {
    console.warn("Directory created already: " + dirName)
  }
}
async function addResultToDir(dir, newFile) {
  if ((localStorage.getItem(dir) === null) || (localStorage.getItem(dir) === "")) {
    localStorage.setItem(dir, "[]");
  }

  const dirData = JSON.parse(localStorage.getItem(dir));
  dirData.push(newFile);
  localStorage.setItem(dir, JSON.stringify(dirData));
}
