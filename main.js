const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const notesDir = path.join(app.getPath('userData'), 'notes');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  fs.mkdirSync(notesDir, { recursive: true });
  createWindow();
});

ipcMain.handle('notes:list', () =>
  fs.readdirSync(notesDir).filter(f => f.endsWith('.txt'))
);
ipcMain.handle('notes:read', (e, name) =>
  fs.readFileSync(path.join(notesDir, name), 'utf8')
);
ipcMain.handle('notes:save', (e, name, text) => {
  fs.writeFileSync(path.join(notesDir, name + '.txt'), text);
});
ipcMain.handle('notes:delete', (e, name) => {
  fs.unlinkSync(path.join(notesDir, name));
});
ipcMain.handle('notes:export', async (e, name, text) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: name + '.txt',
    filters: [{ name: 'Text', extensions: ['txt'] }]
  });
  if (canceled) return false;
  fs.writeFileSync(filePath, text);
  return true;
});