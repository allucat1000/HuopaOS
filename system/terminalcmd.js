window.terminalcmd = {

  async clear(args) {
    termContentChange("clear");
  },

  async rm(args) {
    if (!args || args.length === 0) {
      sys.addLine("Usage: rm [-rf] <path>");
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
      sys.addLine("Usage: rm [-rf] <path>");
      return;
    }
  
    if (path === "/" && !force) {
      sys.addLine("[line=red]Refusing to delete / unless -f is provided.[/line]");
      return;
    }
  
    try {
      const meta = await internalFS.getMeta(path);
      if (!meta) {
        if (!force) sys.addLine(`[line=red]File not found: ${path}[/line]`);
        return;
      }
  
      if (meta.type === "dir" && !recursive) {
        sys.addLine(`[line=red]Cannot delete directory without -r: ${path}[/line]`);
        return;
      }
  
      await internalFS.delDir(path, {"read":"SYSTEM","write":"SYSTEM", "modify":"SYSTEM"}, recursive, force, new Set())
      sys.addLine(`[line=green]Deleted: ${path}[/line]`);
  
    } catch (e) {
      if (!force) {
        sys.addLine(`[line=red]Error deleting ${path}[/line]`);
        console.error(e);
      }
    }
  },

async ls(args) {
  let path = "/system";

  for (const arg of args || []) {
    if (arg.startsWith("-")) {
      sys.addLine("No args available for ls currently, sorry!");
    } else {
      path = arg;
    }
  }

  try {
    const meta = await internalFS.getMeta(path);
    if (!meta) {
      sys.addLine(`[line=red]File not found: ${path}[/line]`);
      return;
    }


    const fileArray = JSON.parse(await internalFS.getFile(path) || "[]");
    const fileList = fileArray.map(f => f.replace(`${path}/`, "")).join("\n");
    sys.addLine(`All files in directory: ${path}`);
    sys.addLine(fileList);
    
    } catch (e) {
      if (e.message.includes("is not valid JSON")) {
        sys.addLine(`[line=red]You cannot run ls on a file![/line]`);
      } else {
        sys.addLine(`[line=red]Unknown error occurred: ${e}[/line]`);
      }
    }
  },
  
  async help() {
    sys.addLine("# Terminal commands");
    
    sys.addLine("* rm");
    sys.addLine("> Delete a directory / file. Usage: rm [options] <path>");
    sys.addLine("> Options: -r (recursive), -f (force)");
    
    sys.addLine("* listpkgs");
    sys.addLine("> View your installed packages.");
    
    sys.addLine("* clear");
    sys.addLine("> Clear the terminal.");
    
    sys.addLine("* ls");
    sys.addLine('> List files and directories in the specified path (default: "/system"). Usage: ls <path>');
  }

};
