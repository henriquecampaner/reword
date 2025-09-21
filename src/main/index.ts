import { app, shell, BrowserWindow, globalShortcut, clipboard } from 'electron';
import { join } from 'path';
import { execSync } from 'child_process';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getRephrasedText } from '../lib/getCopyText';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Test that environment variables are loaded
console.log('Environment setup check:');
console.log('OPENAI_API_KEY loaded:', process.env.OPENAI_API_KEY ? 'Yes (Key found)' : 'No');
const icon = join(__dirname, '../../resources/icon.png');

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

async function getSelectedText(): Promise<string> {
  // Store current clipboard content
  const originalClipboard = clipboard.readText();

  // Simulate Ctrl+C (Cmd+C on Mac) to copy selected text

  try {
    if (process.platform === 'darwin') {
      // macOS
      execSync(
        'osascript -e "tell application \\"System Events\\" to keystroke \\"c\\" using command down"'
      );
    } else if (process.platform === 'win32') {
      // Windows
      execSync(
        'powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'^c\')"'
      );
    } else {
      // Linux
      execSync('xdotool key ctrl+c');
    }

    // Wait a moment for clipboard to update
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Get the selected text from clipboard
    const selectedText = clipboard.readText();

    // Restore original clipboard content after a short delay
    setTimeout(() => {
      clipboard.writeText(originalClipboard);
    }, 1000);

    return selectedText || 'No text selected';
  } catch (error) {
    console.error('Error getting selected text:', error);
    return 'Error getting selected text';
  }
}

async function createPopupWindow(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Get selected text first
  const selectedText = await getSelectedText();

  // Create a small popup window
  const popupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Center the popup window
  popupWindow.center();

  popupWindow.on('ready-to-show', () => {
    popupWindow.show();
    popupWindow.focus();

    getRephrasedText({ text: selectedText, mainWindow: popupWindow });
  });

  // // Close popup when clicking outside or pressing escape
  // popupWindow.on('blur', () => {
  //   popupWindow.close();
  // });

  // Load popup content
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    popupWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/popup-react.html`);
  } else {
    popupWindow.loadFile(join(__dirname, '../renderer/popup-react.html'));
  }
}

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+C', async () => {
    await createPopupWindow();
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
