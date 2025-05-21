window.terminalcmd = {
  async listpkgs() {
    const pkgs = localStorage.getItem("/system/packageList.txt");
    if (pkgs) {
      addLine(`[bg=palevioletred]Packages: ${pkgs.replace(/ /g, ", ")}[/bg]`);
    } else {
      addLine("[bg=red]No packages installed![/bg]");
    }
  }
};
