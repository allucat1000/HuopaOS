window.terminalcmd = {
  async listpkgs() {
    const pkgsRaw = localStorage.getItem("/system/packageList.txt");
    if (pkgsRaw) {
      const pkgsClean = pkgsRaw
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join(", ");
      addLine(`[bg=palevioletred]Packages: ${pkgsClean}[/bg]`);
    } else {
      addLine("[bg=red]No packages installed![/bg]");
    }
  }
};
