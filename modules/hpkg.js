window.hpkg = {
  async import(name) {
    await addLine("[bg=blue]Downloading module...[/bg]");
    try {
            await addLine(`[bg=blue]Downloading ${name}.js...[/bg]`)
            const url = `https://raw.githubusercontent.com/allucat1000/HuopaOS/refs/heads/main/hPKG/${name}.js`;
            const response = await fetch(url);
    
            if (response.ok) {
                await addLine("Module downloaded! Installing...")
                const moduleData = await response.text();
                localStorage.setItem(`/system/modules/${name}.js`, moduleData);
  
                const currentList = localStorage.getItem("/system/moduleList.txt") || "";
                addResultToDir("/system/modules",`/system/modules/${name}.js`)
                localStorage.setItem("/system/moduleList.txt", currentList + name + " ");
                await addLine("Module installed.")
                await loadModule(`/system/modules/${name}.js`);
            } else {
                await addLine(`[bg=red]Failed to fetch module, response: ${response.status}[/bg]`);
            }

        } catch (e) {
            await addLine(`[bg=red]Failed to fetch module: ${name}.[/bg]`);
            await addLine(`Error: ${e}`);
        }

  }
}
