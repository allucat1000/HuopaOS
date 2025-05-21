window.terminalcmd = {
  async listpkgs(){
    if (localStorage.getItem("/system/packageList.txt") {
      addLine(`[bg=palevioletred]Packages: ${localStorage.getItem("/system/packageList.txt")}[/bg]`)
    else {
      addLine("[bg=red]No packages installed![/bg]")
    }
  }
};
