"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const controllerUser_1 = require("./controller/controllerUser"); // controller fica no main
function createWindow() {
    const preloadPath = path_1.default.join(__dirname, 'preload', 'preload.js');
    const mainWindow = new electron_1.BrowserWindow({
        webPreferences: { preload: preloadPath, contextIsolation: true }
    });
    mainWindow.loadFile(path_1.default.join(__dirname, '..', 'ui', 'index.html'));
}
electron_1.ipcMain.handle('get-user', async (event, args) => {
    return await (0, controllerUser_1.getUser)(args); // controller executa no main
});
electron_1.app.whenReady().then(createWindow);
