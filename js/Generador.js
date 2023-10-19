import { formulario1, formulario2, formulario3, formulario4, divH } from './Forms.js'

document.getElementById('config-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    generarFormulario();
});


function generarFormulario() {
    const numVariables = document.getElementById('num-variables').value;
    const numRestricciones = document.getElementById('num-restricciones').value;
    const formularioGenerado = document.getElementById('formulario-generado');
    formularioGenerado.innerHTML = '';

    // Crear un nuevo formulario concatenando el código HTML
    let nuevoFormularioHTML = formulario1();

    //Restriciones
    nuevoFormularioHTML += divH('Ingresa las restricciones', 3);
    nuevoFormularioHTML += `<div class="col-12">`;
    nuevoFormularioHTML += `<div class="row">`;
    for (let i = 1; i <= numRestricciones; i++) {
        nuevoFormularioHTML += formulario2(i);
    }
    nuevoFormularioHTML += `</div></div>`;

    //Creando los encabezados para las columnas de generación de variables
    nuevoFormularioHTML += `<div class="col-6">`;
    nuevoFormularioHTML += divH('Ingresa los rangos de variables', 5);
    nuevoFormularioHTML += `</div>`;

    nuevoFormularioHTML += `<div class="col-6">`;
    nuevoFormularioHTML += divH('Ingresa valores para cada variables', 5);
    nuevoFormularioHTML += `</div> `;

    //casillas para revisar los rangos de variables
    nuevoFormularioHTML += `<div class="col-12">`;
    nuevoFormularioHTML += `<div class="row">`;
    for (let i = 1; i <= numVariables; i++) {
        //para los rangos 
        nuevoFormularioHTML += `<div class="col-6">`;
        nuevoFormularioHTML += formulario3(i);
        nuevoFormularioHTML += `</div> `;

        //para los valores
        nuevoFormularioHTML += `<div class="col-6">`;
        nuevoFormularioHTML += formulario4(i);
        nuevoFormularioHTML += `</div> `;

    }
    nuevoFormularioHTML += `</div> `;
    nuevoFormularioHTML += `</div> `;

    //generar el boton
    nuevoFormularioHTML += ` <div class="col-4"></div>`; //genero una col vacia

    nuevoFormularioHTML += ` 
    <div class="col-4 mt-4">
        <div class="form-group">
            <button type="submit" class="btn btn-success btn-block">Evaluar</button>
        </div>
    </div>
    `;
    nuevoFormularioHTML += `</form>`;

    formularioGenerado.innerHTML = nuevoFormularioHTML;

    //genero los eventos para el editor latex
    for (let i = 1; i <= numRestricciones; i++) {
        generarEventoLaTeX('latex-R' + i, 'outputLaTeX-R' + i);
    }

    //generar función latex
    generarEventoLaTeX('foLatex', 'outputFO');

    document.getElementById('optimization-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto


        //extraer función objetivo
        let fo = document.getElementById('funcion-objetivo').value;

        //extraer mejor valor conocido
        let mvc = document.getElementById('mejor-conocido').value;

        //extraer las restricciones

        let restricciones = [];

        for (let i = 1; i <= numRestricciones; i++) {

            restricciones[i - 1] = {
                res: document.getElementById('restriccion-' + i).value,
                comp: document.getElementById('operador-r' + i).value,
                r: document.getElementById('r-' + i).value
            };

        }

        //extraer los rangos de variables
        let rangos = [];

        for (let i = 1; i <= numVariables; i++) {
            rangos[i - 1] = [];
            rangos[i - 1][0] = document.getElementById('li-x' + i).value;
            rangos[i - 1][1] = document.getElementById('ls-x' + i).value;
        }

        //extraer los valores de las variables
        let values = {};
        for (let i = 1; i <= numVariables; i++) {
            values['x' + i] = document.getElementById('value-x' + i).value;
        } //close for


        //evaluamos la función objetivo
        const resFO = math.evaluate(fo, values);
        console.log(resFO);

        //verificamos los rangos de cada variable
        let rangosEval = [];

        for (let i = 0; i < rangos.length; i++) {
            const key = 'x' + (i + 1);
            const value = values[key];
            const li = rangos[i][0];
            const ls = rangos[i][1];

            rangosEval[i] = (li <= value) && (value <= ls);
        }

        let restriccionesEval = [];

        for (let i = 0; i < restricciones.length; i++) {
            const funcionRes = restricciones[i].res;
            const comparador = restricciones[i].comp;
            const rh = parseFloat(restricciones[i].r);

            let valueRes = math.evaluate(funcionRes, values);
            let bandera = false;

            switch (comparador) {
                case "menor-igual":
                    bandera = (valueRes <= rh);
                    break;
                case "mayor-igual":
                    bandera = (valueRes >= rh);
                    break;
                case "igual":
                    bandera = (valueRes == rh);
                    break;
                case "menor-que":
                    bandera = (valueRes < rh);
                    break;
                case "mayor-que":
                    bandera = (valueRes > rh);
                    break;
                default:
                    console.log("Opción no válida");
            }

            const evaluacion = {
                ['R' + (i + 1)]: valueRes,
                paso: bandera
            };
        
            restriccionesEval.push(evaluacion);

        }

        let resultado = `
            Función objetivo: ${resFO} \n
            Restricciones:
        `;

        for (let i = 0; i < restriccionesEval.length; i++) {
            resultado += `
                R${(i+1)} = ${restriccionesEval[i]['R' + (i + 1)]} --> ${restriccionesEval[i]['paso']}
            `;
        }

        resultado += `\nRangos:`;
        for (let i = 0; i < rangosEval.length; i++) {
            resultado += `
                x${(i+1)} = ${rangosEval[i]}
            `;
        }

        console.log(rangosEval)


        


        alert(resultado);
        

    });

} //cierra generador


function generarEventoLaTeX(entrada, salida) {

    document.getElementById(entrada).addEventListener('input', function () {
        const latex = this.value;
        const outputElement = document.getElementById(salida);
        try {
            outputElement.innerHTML = katex.renderToString(latex);
        } catch (error) {
            outputElement.innerHTML = 'Error de compilación LaTeX.';
        }
    });

} //cierra generarEventoLaTeX

/*
(x3 + 2) * x2 * x1^2

1-(x2^3*x3)/(71785*x1^4)

((4*(x2^2)-x1*x2)/(12566*(x2*(x1^3)-(x1^4)))) + (1.0/(5108*(x1^2)))-1

1.0-(140.45*x1/((x2^2)*x3))

((x2+x1)/1.5)-1

(0.05, 2);(0.25, 1.3);(2, 15)

0.051708539528959534
0.3571847938513473
11.261734071828137
*/