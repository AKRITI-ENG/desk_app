const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('notesAPI', {
  list: () => ipcRenderer.invoke('notes:list'),
  read: (name) => ipcRenderer.invoke('notes:read', name),
  save: (name, text) => ipcRenderer.invoke('notes:save', name, text),
  remove: (name) => ipcRenderer.invoke('notes:delete', name)
});
