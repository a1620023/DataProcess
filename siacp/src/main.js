/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/* from the electron quick-start */
var electron = require('electron');
var XLSX = require('xlsx');
var app = electron.app;

var win = null;

function createWindow() {
	if (win) return;
	win = new electron.BrowserWindow({
		width: 1200, height: 950,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});
	//win.setMenu(null); // oculta menu de archivo superior
	win.loadURL("file://" + __dirname + "/ui/index.html");
	win.webContents.openDevTools(false); // Al desplegar abre el inspector de pagina
	win.on('closed', function () { win = null; });
}
if (app.setAboutPanelOptions) app.setAboutPanelOptions({ applicationName: 'siacp', applicationVersion: "XLSX " + XLSX.version, copyright: "(C) 2020" });
app.on('open-file', function () { console.log(arguments); });
app.on('ready', createWindow);
app.on('activate', createWindow);
app.on('window-all-closed', function () { if (process.platform !== 'darwin') app.quit(); });