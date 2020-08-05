/* xlsx.js (C) 2013-present SheetJS -- https://sheetjs.com */

/**
 * En esta primera sección se requieren librerías y métodos a usar
 */
const XLSX = require('xlsx');
const e = require('express');
const { raw } = require('express');
const { read } = require('fs');
const electron = require('electron').remote;

// Todos los tipos de archivo que acepta la aplicación
const EXTENSIONS = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|");


// Función de alerta para que el usuario seleccione el archivo a procesarse
function miFunction() {
    alert("Cargue el archivo Excel que obtuvo del sistema RANDOM");
}

// Método getElementById para capturar el documento seleccionado en front-End (HTML)
const readIn = document.getElementById('readIn');
const exportBtn = document.getElementById('exportBtn');

/**
 * Método para exportar la tabla de datos procesados resultante 
 * que se esta mostrando en la pantalla del usuario
 */
const exportXlsx = async function() {
	const HTMLOUT = document.getElementById('myData');
	const wb = XLSX.utils.table_to_book(HTMLOUT);
	const o = await electron.dialog.showSaveDialog({
		title: 'Guardar como',
		filters: [{
			name: "Spreadsheets",
			extensions: EXTENSIONS
		}]
	});
	//console.log(o.filePath);
	XLSX.writeFile(wb, o.filePath);
	electron.dialog.showMessageBox({ message: "La tabla fue guardado en: " + o.filePath, buttons: ["OK"] });
};

// Disparador de Métodos o funciones que se ejecutan cuando un evento en el front-End (HTML) se activa 
readIn.addEventListener('change', (e) => { leerArchivo(e.target.files); }, false);
exportBtn.addEventListener('click', exportXlsx, false);

/**
 * 
 * @param {Método Leer Archivo XLSX} files 
 */
const leerArchivo = function(files) {

    // Variable de tipo array que recepciona un parámetro
    const f = files[0];
    // Método de librería XLSX para leer archivos
    const reader = new FileReader();
    
    /**
     * Se lee el archivo a procesar y se guarda la información en un formato de tipo array
     * Uint8Array representan un array de enteros sin signo de 8 bits
     * @param {Método de carga de archivo en formato array} e 
     */
	reader.onload = function(e) {
        let data = e.target.result;
        data = new Uint8Array(data);
        /**
         *Cuando finaliza la operación de lectura por readAsArrayBuffer
         *sera lanzado la función procesarLibro
         */ 
		procesarLibro(XLSX.read(data, {type: 'array'}));
    };

    /**
     *  El método readAsArrayBuffer 
     * es usado para iniciar la lectura del 
     * contenido especificado en file (variable f)
     */
    reader.readAsArrayBuffer(f);
};

/**
 * Aquí se accede a la información del array después de pasarlo a un objeto tipo json
 * @param {Función de procesamiento de datos} pl 
 */
const procesarLibro = function(pl) {
    const HTMLOUT = document.getElementById('htmlOut');
	const XPORT = document.getElementById('exportBtn');
	XPORT.disabled = false;
    HTMLOUT.innerHTML = "";


    /**
     * la siguiente función convierte al array de excel en un
     * archivo de tipo json
     * para ello es necesario iterar con un constructor forEach
     */
	pl.SheetNames.forEach(function(sheetName) {
        /**
         * json es la variable de tipo json que almacena 
         * toda la información proveniente del archivo excel
         */
        const json = XLSX.utils.sheet_to_json(pl.Sheets[sheetName], {raw: true}, {editable:true});
        console.log(json);



        /**
         * En la siguiente iteración se analiza la columna INGRESADO y SOLICITADO
         * con las condiciones if
         * el resultado se muestra en una nueva columna de nombre ESTADOS
         */
        Object.keys(json).forEach(function(key) {
            
            if (x => x.INGRESADO >= x.SOLICITADO) {
                for (let item of json) {
                    item.ESTADOS = "CERRADO";
                }
            }
            if (x => x.INGRESADO < x.SOLICITADO) {
                for (let item of json) {
                    item.ESTADOS = "ABIERTO";
                }
            }
        })


        /**
         * La siguiente función analiza las columnas INGRESADO y SOLICITADO
         * para generar una nueva columna FALTAN con valor numérico de faltantes
         * el resultados se guarda en la variable "diferencia"
         * -->Con el for
         * se añade la información de tipo json al archivo principal de 
         * nombre json
         */
        var diferencia = json.map(function(x) {
            if (x.INGRESADO == 0) {
                return x.SOLICITADO*(-1)
            } else if(x.INGRESADO != 0) {
                return (x.SOLICITADO - x.INGRESADO)*(-1)
            }
        });
        for (let i = 0; i < json.length; i++) {
            json[i].FALTAN = diferencia[i];
        }


        /**
         * La siguiente función analiza las columnas INGRESADO y SOLICITADO
         * para generar una nueva columna PESO_TOTAL con valor numérico de pero
         * que se obtiene al multiplicar las columnas peso*solicitado
         * el resultados se guarda en la variable "producto"
         * -->Con el for
         * se añade la información de la variable "producto" de tipo json al archivo principal de 
         * nombre json
         */
        var producto = json.map(function(x) {
            return x.PESO * x.SOLICITADO
        });
        for (let i = 0; i < json.length; i++) {
            json[i].PESO_TOTAL = producto[i];
        }

        /**
         * La siguiente función filtra la columna TIPO de la variable principal de tipo json
         * cuyo nombre es json
         * y es almacenada en la variable filtroTIPO de tipo json
         */
        var filtroTIPO = json.filter(function(x) {
            const caliente = x.TIPO == "LIN_CAL   "
            const frio = x.TIPO == "LIN_FRI   "
            const transformado = x.TIPO == "TRANSF    "
            return caliente + frio + transformado;
        });

        /**
         * La siguiente función filtra los datos de la variable filtroTIPO
         * y es almacenada el la variable datosFiltrados de tipo json
         * que luego sera enviado al HTML para la vista del usuario
         */
        var datosFiltrados = filtroTIPO.filter(function(x) {
            const dC = x.ESTADO != "C"
            return dC;
        });

        /**
         * Función mostrar dato que itera la variable datosFiltrados 
         * para ser enviados a una tabla 
         * que visualizara el usuario en HTML
         */
        const datoMostrado = mostrarHtml(datosFiltrados);
        function mostrarHtml(p){
            /**
             * JSON.stringify(p)
             * convierte el dato de tipo json en 
             * otro de tipo string
             */
            const jsonParaHTML = JSON.stringify(p);

            // Crea una tabla en el HTML
            var table = document.createElement("table");
            table.style.width = '50%';
            table.setAttribute('border', '1');
            table.setAttribute('cellspacing', '0');
            table.setAttribute('cellpadding', '2');

            /**
             * Verifica el nombre de las columnas
             * para iterar sobre ellas 
             * y llenar sus respectivas lineas de información la tabla
             */
            var noOfContacts = p.length;
            var col = []; // define an empty array
                for (var i = 0; i < noOfContacts; i++) {
                    for (var key in p[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                            //console.log(key);
                        }
                    }
                }
            
            // Crea las columnas de la tabla .
			var tHead = document.createElement("thead");	
				
			
			// Crea las filas de la tabla .
			var hRow = document.createElement("tr");

            // Crea el cuerpo de la tabla .
			var tBody = document.createElement("tbody");	

            // Añade las filas por cada columna de la tabla.
			for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");
                th.innerHTML = col[i];
                hRow.appendChild(th);
                //console.log(col[i]);
            }
            tHead.appendChild(hRow);
            table.appendChild(tHead);

            // Llena la cabecera de la tabla con las filas del for inferior.
			for (var i = 0; i < noOfContacts; i++) {

                // Llena una fila de información por cada recorrido de for
                var bRow = document.createElement("tr");
                for (var j = 0; j < col.length; j++) {
                    var td = document.createElement("td");
                    td.innerHTML = p[i][col[j]];
                    bRow.appendChild(td);
                }
                tBody.appendChild(bRow)
            }
            table.appendChild(tBody);

            // Pasa la información iterada el elemento HTML mediante una id "myData"
            var divContainer = document.getElementById("myData");
			divContainer.innerHTML = "";
            divContainer.appendChild(table);
            
        
        }
        
        


    });

};

