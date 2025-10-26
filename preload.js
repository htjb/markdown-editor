console.log('preload.js loaded');
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('api', {
  readDir: (dirPath) => ipcRenderer.invoke('read-dir', dirPath),
  openDialog: () => ipcRenderer.invoke('show-open-dialog'),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content)
});