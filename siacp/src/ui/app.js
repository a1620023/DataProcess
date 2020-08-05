/* xlsx.js (C) 2013-present SheetJS -- https://sheetjs.com */
const XLSX = require('xlsx');
const e = require('express');
const electron = require('electron').remote;

const EXTENSIONS = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|");

const processWb = function(wb) {
	const HTMLOUT = document.getElementById('htmlout');
	const XPORT = document.getElementById('exportBtn');
	XPORT.disabled = false;
	HTMLOUT.innerHTML = "";

	wb.SheetNames.forEach(function(sheetName) {
		const htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[sheetName],{editable:true});
        HTMLOUT.innerHTML += htmlstr;
	});
};

const procesarLibro = function(wb) {
	
	const nombreHoja = wb.SheetNames;
	console.log(nombreHoja[0]);

	wb.SheetNames.forEach(function(sheetName) {
		const json = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
		return json
		
	});
	console.log(json);

	// const datosFiltrados = getFilteredByKey(json, "ESTADO", "S");
        // function getFilteredByKey(array, key, value) {
        //     return array.filter(function(e) {
        //         return e[key] == value;
        //     });
        // }
};

const readFile = function(files) {
	const f = files[0];
	const reader = new FileReader();
	
	reader.onload = function(e) {
		let data = e.target.result;
		data = new Uint8Array(data);
		processWb(XLSX.read(data, {type: 'array'})); 
		procesarLibro(XLSX.read(data, {type: 'array'}));
    };
    
	reader.readAsArrayBuffer(f);
};

const handleReadBtn = async function() {
	const o = await electron.dialog.showOpenDialog({
		title: 'Select a file',
		filters: [{
			name: "Spreadsheets",
			extensions: EXTENSIONS
		}],
		properties: ['openFile']
    });
    
    if(o.filePaths.length > 0) processWb(XLSX.readFile(o.filePaths[0]));
    
};

const exportXlsx = async function() {
	const HTMLOUT = document.getElementById('htmlout');
	const wb = XLSX.utils.table_to_book(HTMLOUT);
	const o = await electron.dialog.showSaveDialog({
		title: 'Guardar como',
		filters: [{
			name: "Spreadsheets",
			extensions: EXTENSIONS
		}]
	});
	console.log(o.filePath);
	XLSX.writeFile(wb, o.filePath);
	electron.dialog.showMessageBox({ message: "Exported data to " + o.filePath, buttons: ["OK"] });
};

// add event listeners
const readBtn = document.getElementById('readBtn');
const readIn = document.getElementById('readIn');
const exportBtn = document.getElementById('exportBtn');
const drop = document.getElementById('drop');


readBtn.addEventListener('click', handleReadBtn, false);
readIn.addEventListener('change', (e) => { readFile(e.target.files); }, false);
exportBtn.addEventListener('click', exportXlsx, false);
drop.addEventListener('dragenter', (e) => {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}, false);
drop.addEventListener('dragover', (e) => {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
}, false);
drop.addEventListener('drop', (e) => {
	e.stopPropagation();
	e.preventDefault();
	readFile(e.dataTransfer.files);
}, false);



const ExcelJSON = () => {
    const excel = XLSX.readFile(o.filePath);
    const nombreHoja = excel.SheetNames;
    let datos = XLSX.utils.sheet_add_json(excel.SheetNames[nombreHoja[0]]);

    console.log(datos);
};
