const fs = require('fs');
const path = require('path');
const {ipcMain, dialog} = require('electron');

function setupFileManagement() {
    // code to read directory contents
    ipcMain.handle('read-dir', async (_, dirPath) => {
    console.log(`Reading directory: ${dirPath}`);
    let output = fs.readdirSync(dirPath).map(file => ({
        name: file,
        isDir: fs.statSync(path.join(dirPath, file)).isDirectory()
    }))
    return output;
    });

    ipcMain.handle('show-open-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (result.canceled) {
        return null;
    } else {
        return result.filePaths[0];
    }
    });

    ipcMain.handle('save-file', async (_, filePath, content) => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Save File',
            message: `Saving file to: ${filePath}`
        });
        fs.writeFileSync(filePath, content, 'utf-8');
        return {success: true};
    });
}

module.exports = {setupFileManagement};