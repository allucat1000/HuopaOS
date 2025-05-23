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
    if (!args.length) {
      addLine("[bg=red]Usage: rm [-rf] <path>[/bg]");
      return;
    }

    let recursive = false;
    let force = false;
    const targets = [];

    for (const arg of args) {
      if (arg.startsWith("-")) {
        if (arg.includes("r")) { recursive = true; }
        if (arg.includes("f")) { force = true; }
      } else {
        targets.push(arg);
      }
    }

    for (const path of targets) {
      const file = localStorage.getItem(path);
      if (!file && !force) {
        addLine(`[bg=red]rm: cannot remove "${path}". File not found.[/bg]`);
        continue;
      }

      if (file || force) {
        localStorage.removeItem(path);
        addLine(`[bg=limegreen]Removed ${path}[/bg]`);
      }
    }
  }
};
