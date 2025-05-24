window.terminalcmd = {
  async listpkgs(args) {
    const packagesArray = JSON.parse(internalFS.getFile("/system/packages") || "[]");
    const cleanedPackages = packagesArray.map(pkg => pkg.replace(/^\/system\/packages\//, ""));
    const packagesString = cleanedPackages.join(" ");

    if (packagesString) {
      addLine(`[bg=palevioletred]Packages: ${packagesString}[/bg]`);
    } else {
      addLine("[bg=red]No packages installed![/bg]");
    }
  },

  async clear(args) {
    termContentChange("clear");
  },

  async rm(args) {
    if (!args || args.length === 0) {
      addLine("Usage: rm [-rf] <path>");
      return;
    }
  
    let path = null;
    let recursive = false;
    let force = false;
  
    for (const arg of args) {
      if (arg.startsWith("-")) {
        if (arg.includes("r")) recursive = true;
        if (arg.includes("f")) force = true;
      } else {
        path = arg;
      }
    }
  
    if (!path) {
      addLine("Usage: rm [-rf] <path>");
      return;
    }
  
    if (path === "/" && !force) {
      addLine("[bg=red]Refusing to delete / unless -f is provided.[/bg]");
      return;
    }
  
    try {
      const meta = internalFS.getMeta(path);
      if (!meta) {
        if (!force) addLine(`[bg=red]File not found: ${path}[/bg]`);
        return;
      }
  
      if (meta.type === "dir" && !recursive) {
        addLine(`[bg=red]Cannot delete directory without -r: ${path}[/bg]`);
        return;
      }
  
      await internalFS.delDir(path, new Set(), recursive, force)
      addLine(`[bg=green]Deleted: ${path}[/bg]`);
  
    } catch (e) {
      if (!force) {
        addLine(`[bg=red]Error deleting ${path}[/bg]`);
        console.error(e);
      }
    }
  },

async ls(args) {
  let path = "/system";

  for (const arg of args || []) {
    if (arg.startsWith("-")) {
      addLine("No args available for ls currently, sorry!");
    } else {
      path = arg;
    }
  }

  try {
    const meta = internalFS.getMeta(path);
    if (!meta) {
      addLine(`[bg=red]File not found: ${path}[/bg]`);
      return;
    }

    if (meta.type === "dir") {
      const fileArray = JSON.parse(internalFS.getFile(path) || "[]");
      const fileList = fileArray.map(f => f.replace(`${path}/`, "")).join('\n');
      addLine(`All files in directory: ${path}`);
      addLine(fileList);
    } else {
      addLine(`[bg=red]Cannot run ls on file: ${path}[/bg]`);
    }
  } catch (e) {
    addLine(`[bg=red]Failed to fetch path. Error: ${e}[/bg]`);
  }
}


};
