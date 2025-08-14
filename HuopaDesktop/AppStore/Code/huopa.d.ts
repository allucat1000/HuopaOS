declare interface HuopaAPI {
    getWindowSize(): Promise<string>;

    getFile(path: string): Promise<any>;

    deleteFile(path: string, recursive?: boolean): Promise<void>;

    writeFile(path: string, type: string, content: string): Promise<void>;

    openFileImport(accept?: string, type?: string, allowMultiple?: boolean): Promise<void>;

    openRoturLogin(): Promise<void>;

    safeStorageWrite(data: any): Promise<void>;

    safeStorageRead(path: string): Promise<any>;

    runApp(path: string, startParams: any, elevated?: boolean): Promise<void>;

    openFileDialog(allowed: string[]): Promise<void>;

    returnToHost(returnId: string, data: any): Promise<void>;

    closeApp(): Promise<void>;

    setTitle(content: string): Promise<void>;

    getRenderedSize(id: number, type: string): Promise<string>;

    hideWindow(): Promise<void>;

    showWindow(): Promise<void>;

    createNotification(title: string, content: string): Promise<void>;

    calculate(expression: string, scope?: Record<string, any>): Promise<void>;

    parseMarkdown(html: string): Promise<void>;

    getSystemInfo(): Promise<string>;

    github_createFile(credentials: any, user: string, repo: string, path: string, content: string): Promise<void>;

    github_updateFile(credentials: any, user: string, repo: string, path: string, content: string): Promise<void>;

    github_deleteFile(credentials: any, user: string, repo: string, path: string): Promise<void>;

    github_getFile(credentials: any, user: string, repo: string, branch: string, path: string): Promise<any>;

    github_getRepoInfo(credentials: any, user: string, repo: string): Promise<any>;

    github_getIssues(credentials: any, user: string, repo: string): Promise<any>;

    github_createIssue(credentials: any, user: string, repo: string, title: string, content: string): Promise<void>;

    github_getFolder(credentials: any, user: string, repo: string, folder: string): Promise<any>;

    openSaveDialog(def: any): Promise<void>;

    removeTitlebar(): Promise<void>;

    setWindowPosition(left: string, top: string): Promise<void>;

    setWindowSize(width: string, height: string): Promise<void>;

    setWindowColor(bg: string, border: string): Promise<void>;

    getWindowPosition(): Promise<string>;

    getWindowColor(): Promise<string>;

    setWindowBlur(blur: number): Promise<void>;

    getProcesses(): Promise<string>;

    quitProcess(id: number): Promise<void>;

    setProcessWindowSize(id: number, width: string, height: string): Promise<void>;

    setProcessWindowPosition(id: number, left: string, top: string): Promise<void>;

    setProcessWindowAnimation(id: number, data: any): Promise<void>;

    getProcessWindowPosition(id: number): Promise<string>;

    getProcessWindowSize(id: number): Promise<string>;

    requestElevation(): Promise<boolean>;

    getProcessData(): Promise<string>;

    setMinWindowSize(width: number, height: number): Promise<void>;

    setMaxWindowSize(width: number, height: number): Promise<void>;

    disableWindowCollision(): Promise<void>;

    enableWindowCollision(): Promise<void>;

    setWindowConfig(config: Record<string, any>): Promise<void>;

    requestSystemReboot(): Promise<boolean>;

    clipboardWrite(): Promise<string>;

    clipboardRead(): Promise<string>;

    applicationStorageWrite(data: any): Promise<void>;

    applicationStorageRead(): Promise<any>;
}

var huopaAPI: HuopaAPI;
function setAttrs(element: HTMLElement, attrs: Record<string, any>): Promise<void>;
function importModule(moduleName: string): Promise<any>;
var systemStyles: HTMLStyleElement;