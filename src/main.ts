import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true,
    resizable: true,
    backgroundColor: '#667eea'
  });

  // Caminho absoluto para o HTML
  const htmlPath = path.join(__dirname, '..', 'src', 'view', 'index.html');
  
  console.log('Diretório atual:', __dirname);
  console.log('Tentando carregar HTML de:', htmlPath);

  mainWindow.loadFile(htmlPath).catch(err => {
    console.error('Erro ao carregar HTML:', err);
  });

  // Abrir DevTools para debug
  mainWindow.webContents.openDevTools();

  // Log quando a página carregar
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Página carregada com sucesso!');
  });

  // Log de erros
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Falha ao carregar:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});