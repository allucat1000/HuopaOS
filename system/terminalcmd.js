window.terminalcmd = {
  async listpkgs(args) {
    const packages = localStorage.getItem("/system/packageList.txt");
    if (packages) {
      addLine(`[bg=palevioletred]Packages: ${packages}[/bg]`);
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

    let recursive = false;
    let force = false;
    let path = null;

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

    try {
      const meta = internalFS.getMeta(path);
      if (!meta) {
        if (!force) addLine(`[bg=red]File not found: ${path}[/bg]`);
        return;
      }

      if (meta.type === "dir" && !recursive) {
        addLine(`[bg=red]Cannot remove directory without -r: ${path}[/bg]`);
        return;
      }

      internalFS.delDir(path);
      addLine(`[bg=green]Deleted: ${path}[/bg]`);

    } catch (e) {
      if (!force) {
        addLine(`[bg=red]Failed to delete ${path}[/bg]`);
        console.error(e);
      }
    }
  }
};
