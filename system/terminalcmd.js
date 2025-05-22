window.terminalcmd = {
  async listpkgs() {
    const packages = localStorage.getItem("/system/packageList.txt");
    if (packages) {
      addLine(`[bg=palevioletred]Packages: ${packages}[/bg]`);
    } else {
      addLine("[bg=red]No packages installed![/bg]");
    }
  },
  async clear() {
    termContentChange("clear")
  }
};
