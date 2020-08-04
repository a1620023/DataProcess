/* xlsx.js (C) 2013-present SheetJS -- https://sheetjs.com */
const XLSX = require('xlsx');
const e = require('express');
const { raw } = require('express');
const { read } = require('fs');
const electron = require('electron').remote;

const EXTENSIONS = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|");


const genJSON = {};



const procesarLibro = function(pl) {
    const HTMLOUT = document.getElementById('htmlOut');
	const XPORT = document.getElementById('exportBtn');
	XPORT.disabled = false;
    HTMLOUT.innerHTML = "";

    

    


	pl.SheetNames.forEach(function(sheetName) {
        const json = XLSX.utils.sheet_to_json(pl.Sheets[sheetName], {raw: false}, {editable:true});
        //console.log(json);

        




        function getFilteredByKey(array, key, value) {
            return array.filter(function(e) {
                return e[key] == value;
            });
        }



        Object.keys(json).forEach(function(key) {
            
            if (x => x.INGRESADO >= x.SOLICITADO) {
                for (let item of json) {
                    item.ESTADOS = "CERRADO";
                }
                //console.log(newData);
            }
            if (x => x.INGRESADO < x.SOLICITADO) {
                for (let item of json) {
                    item.ESTADOS = "ABIERTO";
                }
                //console.log(newData);
            }

            //console.table(result[key]);
            //console.log(result[key]);
        })



        var diferencia = json.map(function(x) {
            return x.INGRESADO - x.SOLICITADO
        });
        //console.log(diferencia);
        for (let i = 0; i < json.length; i++) {
            json[i].FALTAN = diferencia[i];
        }





        var producto = json.map(function(x) {
            return x.PESO * x.SOLICITADO
        });
        //console.log(producto);
        for (let i = 0; i < json.length; i++) {
            json[i].PESO_TOTAL = producto[i];
        }


        //const pesoTo = JSON.stringify(producto);
        //HTMLOUT.innerHTML += pesoTo;

        const datosFiltrados = getFilteredByKey(json, "ESTADO", "C");
        console.log(datosFiltrados);

        //const jsonParaHTML = JSON.stringify(datosFiltrados);
        //console.log(jsonParaHTML);

        const datoMostrado = mostrarHtml(datosFiltrados);









        function mostrarHtml(p){
            //console.log(p);
            const jsonParaHTML = JSON.stringify(p);
            //console.log(jsonParaHTML);

            var table = document.createElement("table");
            table.style.width = '50%';
            table.setAttribute('border', '1');
            table.setAttribute('cellspacing', '0');
            table.setAttribute('cellpadding', '2');



            var noOfContacts = p.length;
            var col = []; // define an empty array
                for (var i = 0; i < noOfContacts; i++) {
                    for (var key in p[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                            console.log(key);
                            //THEADER.innerHTML += key;
                        }
                    }
                }
            
            // CREATE TABLE HEAD .
			var tHead = document.createElement("thead");	
				
			
			// CREATE ROW FOR TABLE HEAD .
			var hRow = document.createElement("tr");

            // CREATE TABLE BODY .
			var tBody = document.createElement("tbody");	

            // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
			for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = col[i];
                hRow.appendChild(th);
                //console.log(col[i]);
            }
            tHead.appendChild(hRow);
            table.appendChild(tHead);

            // ADD COLUMN HEADER TO ROW OF TABLE HEAD.
			for (var i = 0; i < noOfContacts; i++) {
			
                var bRow = document.createElement("tr"); // CREATE ROW FOR EACH RECORD .                
                
                for (var j = 0; j < col.length; j++) {
                    var td = document.createElement("td");
                    td.innerHTML = p[i][col[j]];
                    bRow.appendChild(td);
                }
                tBody.appendChild(bRow)

            }
            table.appendChild(tBody);


            var divContainer = document.getElementById("myData");
			divContainer.innerHTML = "";
            divContainer.appendChild(table);
            
        
        }
        
        


    });

};

function miFunction() {
    alert("Cargue el archivo Excel que obtuvo del sistema RANDOM");
}



const leerArchivo = function(files) {
	const f = files[0];
    const reader = new FileReader();
    
	reader.onload = function(e) {
        let data = e.target.result;
        data = new Uint8Array(data);
		procesarLibro(XLSX.read(data, {type: 'array'}));
    };

    reader.readAsArrayBuffer(f);
};



// add event listeners
const readIn = document.getElementById('readIn');
readIn.addEventListener('change', (e) => { leerArchivo(e.target.files); }, false);
