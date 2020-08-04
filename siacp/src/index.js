const {createWindow} = require('./main'); //requiere la función main y llama la función //createWindow
const {app} = require('electron'); //requiere de electron una constante llamada app, este es el proceso principal de electron

require('./database')

require('electron-reload')(__dirname)


app.allowRendererProcessReuse = false;
// el evento ready de electron comprueba que todo haya cargado
// app se refiere a la aplicación
app.whenReady().then(createWindow); //cuando la aplicación haya cargado ejecuta la función //createWindow


//  ______________________________________________________________________________________




