import { formVariables, formFO, formConstrains, formValues } from './Forms.js'

document.getElementById('config-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    //obtener numeros de variables y restricciones
    const numVariables = document.getElementById('num-variables').value;
    const numConstrains = document.getElementById('num-restricciones').value;

    //generamos los campos de las variables
    const htmlVariables = document.getElementById('div-variable');
    htmlVariables.innerHTML = fieldsVariables(numVariables);

    //generamos los campos de la FO and Best
    const htmlFO = document.getElementById('div-fo');
    htmlFO.innerHTML = formFO();

    //generamos los campos para las restricciones
    const htmlConstrains = document.getElementById('div-constrains');
    htmlConstrains.innerHTML = fieldsConstrains(numConstrains);

    //generamos los campos para los rangos
    const htmlValues = document.getElementById('div-values');
    htmlValues.innerHTML = fieldsValues(numVariables);

    //generamos el botón
    const htmlBoton = document.getElementById('div-button');
    htmlBoton.innerHTML = `<button type="submit" class="btn btn-success btn-block">Evaluar</button>`;

    //preparamos las variables que almacenaran los valores

    document.getElementById('optimization-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        //--------------------------------------------------------------Extraer valores
        //para los rangos de variables
        let rangesVariables = [];
        let rangesSuccess = false;

        for (let i = 0; i < numVariables; i++) {
            rangesVariables[i] = [];
            let ll = +document.getElementById('li-x' + (i + 1)).value;
            let lu = +document.getElementById('ls-x' + (i + 1)).value;

            if (lu > ll) {
                rangesVariables[i][0] = ll;
                rangesVariables[i][1] = lu;
                rangesSuccess = true;
            } else {
                rangesSuccess = false;

                Swal.fire({
                    icon: 'warning',
                    title: 'Variables...',
                    text: 'Check variable ranges!'
                  });    

                document.getElementById('ls-x' + (i + 1)).value = '';
                break;
            }

        } //close for i 

        if (rangesSuccess) {
            //funcion objetivo
            let fo = '';

            //extraer función objetivo
            fo = document.getElementById('funcion-objetivo').value;

            if (contieneVarNoValidas(fo, numVariables)) {                
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Objective function...',
                    text: 'The objective function contains unrecognized variables. Please remember that you can only use variables like x1, x2, x3, ..., xn.'
                  }); 

                return;
            }//close if

            //mejor valor conocido
            let bvkn = 1000000;

            //extraer mejor valor conocido
            bvkn = +document.getElementById('mejor-conocido').value;

            //evaluamos que el mejor valor conocido sea correcto
            if (isNaN(bvkn)) {
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Best-known...',
                    text: 'The best-known value should be numeric. Since you have not entered a valid value, it will be assigned a value of 1,000,000.'
                  }); 
                bvkn = 1000000;
                document.getElementById('mejor-conocido').value = '1000000';
            } //close if isNaN

            //extraer las restricciones si las hay
            //restricciones
            let constrains = [];

            if (numConstrains > 0) {
                for (let i = 0; i < numConstrains; i++) {

                    let auxConstrains = document.getElementById('restriccion-' + (i + 1)).value;
                    let auxComparator = document.getElementById('operador-r' + (i + 1)).value
                    let auxRight = +document.getElementById('r-' + (i + 1)).value

                    //evaluamos que el lado derecho sea correcto
                    if (isNaN(auxRight)) {
                        auxRight = 0;
                        document.getElementById('r-' + (i + 1)).value = 0;
                        Swal.fire({
                            icon: 'warning',
                            title: 'Right-hand...',
                            text: 'The right-hand side of constraint ' + (i + 1) + ' is not correct. It will be assigned a value of 0.'
                          }); 
                    }// close if 

                    constrains[i] = {
                        constrains: auxConstrains,
                        comparator: auxComparator,
                        right: auxRight,
                        result: 0,
                        vc: false
                    };

                } //close if constrains

            } //close if constrains

            //extraer los valores de las variables
            //values for variables
            let values = {};

            for (let i = 0; i < numVariables; i++) {
                let auxValue = +document.getElementById('value-x' + (i + 1)).value;

                if (isNaN(auxValue)) {
                    auxValue = 0;
                    document.getElementById('value-x' + (i + 1)).value = 0;
                    Swal.fire({
                        icon: 'warning',
                        title: 'Values...',
                        text: 'The value for variable x' + (i + 1) + ' is not a number, we will assign it a value of 0.'
                      }); 
                } //close if
                values['x' + (i + 1)] = auxValue;
            } //close for

            //-------------------------------------------------------------- Termina Extraer valores
            //-------------------------------------------------------------- Evaluamos
            //Iniciamos evaluando que los rangos de variables sean correctos

            for (let i = 0; i < rangesVariables.length; i++) {
                const key = 'x' + (i + 1);
                const value = values[key];
                const li = rangesVariables[i][0];
                const ls = rangesVariables[i][1];
                rangesVariables[i][2] = value >= li && value <= ls;
            }//cierre for 

            //evaluamos la función objetivo
            let resultFO = math.evaluate(fo, values); //objetive function

            //verificamos las restricciones
            for (let i = 0; i < constrains.length; i++) {
                const funConstrains = constrains[i].constrains;
                const comparator = constrains[i].comparator;
                const right = parseFloat(constrains[i].right);

                let valueRes = math.evaluate(funConstrains, values);
                constrains[i].result = valueRes;

                switch (comparator) {
                    case "menor-igual":
                        constrains[i].vc = (valueRes <= right);
                        break;
                    case "mayor-igual":
                        constrains[i].vc = (valueRes >= right);
                        break;
                    case "igual":
                        constrains[i].vc = (valueRes == right);
                        break;
                    case "menor-que":
                        constrains[i].vc = (valueRes < right);
                        break;
                    case "mayor-que":
                        constrains[i].vc = (valueRes > right);
                        break;
                    default:
                        console.log("Opción no válida");
                }
            }//close for


            //generamos los campos de las variables
            const htmlFOResult = document.getElementById('div-fo-result');

            htmlFOResult.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-sm-12 col-xl-3 text-center">
                        <p class="mb-0">Objective function result</p>
                        <h6 class="text-primary">f(x) = ${resultFO}</h6>
                    </div>
                    <div class="col-sm-12 col-xl-3  text-center">
                        <p class="mb-0">Best Known Value</p>
                        <h6>${bvkn}</h6>
                    </div>
                </div>
            `;

            //generamos los campos de los rangos de variables
            const htmlRangesResult = document.getElementById('div-ranges-result');

            let auxRan = `
            <h6 class="h6" style="text-align: center;">Variable Ranges</h6>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Range</th>
                        <th scope="col">Value</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
            `;

            for (let i = 0; i < rangesVariables.length; i++) {
                const key = 'x' + (i + 1);

                let classIcon = 'fas fa-times-circle text-danger';
                let classRow = 'text-danger';

                if (rangesVariables[i][2]) {
                    classIcon = 'fas fa-check-circle text-success';
                    classRow = '';
                }//close if

                auxRan += `
                    <tr class = "${classRow}">
                        <td>${key}</td>
                        <td>[${rangesVariables[i][0]} - ${rangesVariables[i][1]}]</td>
                        <td>${values[key]}</td>
                        <td><i class="${classIcon}"></i></td>
                    </tr>
                `;
            } //close for


            auxRan += `
                </tbody>
            </table>`;

            htmlRangesResult.innerHTML = auxRan;

            //generamos los campos de las restricciones
            const htmlConstrainsResult = document.getElementById('div-constrains-result');
            let auxConst = `
            <h6 class="h6" style="text-align: center;">Constraints</h6>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Value</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                `;

                for (let i = 0; i < constrains.length; i++) {
                    const auxVC = constrains[i].vc;
    
                    let classIcon = 'fas fa-times-circle text-danger';
                    let classRow = 'text-danger';
    
                    if (auxVC) {
                        classIcon = 'fas fa-check-circle text-success';
                        classRow = '';
                    }//close if
    
                    auxConst += `
                        <tr class = "${classRow}">
                            <td>g${i+1}</td>
                            <td>${constrains[i].result}</td>
                            <td><i class="${classIcon}"></i></td>
                        </tr>
                    `;
                } //close for


            auxConst += `
                </tbody>
            </table>
                `;
                htmlConstrainsResult.innerHTML = auxConst;

                htmlConstrainsResult.scrollIntoView({ behavior: "smooth" });

        } //close cierre de if validador de rangos


    });
}); //submit del boton Next

function fieldsValues(numVariables) {
    let fields = '';
    fields += `
        <label>Value of the variables</label>
    `;

    for (let i = 0; i < numVariables; i++) {
        //para los rangos 
        fields += `<div class="col-12 mb-1">`;
        fields += formValues(i + 1);
        fields += `</div> `;
    }//close for 

    return fields;
} //close fieldsValues

function fieldsConstrains(numConstrains) {
    let fields = '';
    if (numConstrains > 0) {

        fields += `<label>Details of constraints</label>`;
        for (let i = 0; i < numConstrains; i++) {
            fields += `<div class="col-12">`;
            fields += formConstrains(i + 1);
            fields += `</div> `;
        }
        fields += `</div></div>`;
    } else {
        fields += `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                Unrestricted problem
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    return fields;
}//close fieldsConstrains

function fieldsVariables(numVariables) {
    let fields = '';
    fields += `
        <label>Details of variables</label>
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4"><h6 class="h6">Lower</h6></div>
            <div class="col-4"><h6 class="h6">Upper</h6></div>
        </div>
    `;

    for (let i = 0; i < numVariables; i++) {
        //para los rangos 
        fields += `<div class="col-12">`;
        fields += formVariables(i + 1);
        fields += `</div> `;
    }//close for 

    return fields;
} // close fieldsVariables

function contieneVarNoValidas(fo, numVariables) {
    return false;
}

/*
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
*/
/*
(0.05, 2);(0.25, 1.3);(2, 15)

(x3 + 2) * x2 * x1^2

1-(x2^3*x3)/(71785*x1^4)

((4*(x2^2)-x1*x2)/(12566*(x2*(x1^3)-(x1^4)))) + (1.0/(5108*(x1^2)))-1

1.0-(140.45*x1/((x2^2)*x3))

((x2+x1)/1.5)-1



0.051708539528959534
0.3571847938513473
11.261734071828137
*/