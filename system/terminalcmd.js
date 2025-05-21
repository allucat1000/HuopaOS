window.terminalcmd = {
  async listpkgs(){
    try {
      addLine(`[bg=palevioletred]Packages: ${localStorage.get("/system/packageList.txt")}[/bg]`)
    } catch (e) {
      addLine("[bg=red]No packages installed![/bg]")
    }
  }
};
