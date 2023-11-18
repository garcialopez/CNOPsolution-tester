import { formVariables, formFO, formConstrains, formValues } from './Forms.js'
import PONR from "./PONR.js";


let ponr = new PONR();
let flag = true;
let active = 'enabled';

// elementos de radio
let radioDefine = document.getElementById("btnradio1");
let radioBenchmark = document.getElementById("btnradio2");

// elementos a mostrar u ocultar
let divDefine = document.getElementById("div-define");
let divBenchmark = document.getElementById("div-benchmark");

//extraer numeros de variables y restricciones
let numVariables = document.getElementById('num-variables').value;
let numConstrains = document.getElementById('num-restricciones').value;

//variables para el problema de optimización
let rangesVariables = [];
let fo = '';
let bvkn = 1000000;
let constrains = [];

//--------------------------------------------------------------------

radioDefine.addEventListener("change", function () {
    if (radioDefine.checked) {
        flag = true;
        active = 'enabled';
        divDefine.style.display = "block"; // Muestra el componente "Define"
        divBenchmark.style.display = "none"; // Oculta el componente "Benchmark"

    }
});

radioBenchmark.addEventListener("change", function () {
    if (radioBenchmark.checked) {

        let listP = ponr.listPONR();
        active = 'disabled';
        let field = `
            <label for="num-variables" class="form-label">Benchmark problems</label>
            <select id="ponr-select" class="form-select form-select-sm" aria-label="Small select example"> 
        `;

        for (let i = 0; i < listP.length; i++) {
            if (i == 0) {
                field += `<option value="${i}" selected>${listP[i]}</option>`;
            } else {
                field += `<option value="${i}">${listP[i]}</option>`;
            }
        }

        field += `</select>
        <a href="https://github.com/garcialopez/JMetaBFOP-UI/tree/main/Results/JMetaBFOP" target="_blank" style="font-size: 14px;">Results of some problems</a>
        `;

        divBenchmark.innerHTML = field;
        flag = false;
        divDefine.style.display = "none"; // Oculta el componente "Define"
        divBenchmark.style.display = "block"; // Muestra el componente "Benchmark"
    }
});


//--------------------------------------------------------------------

document.getElementById('config-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const htmlVariables = document.getElementById('div-variable');
    const htmlFO = document.getElementById('div-fo');
    const htmlConstrains = document.getElementById('div-constrains');

    if (flag) {
        //obtener numeros de variables y restricciones
        numVariables = document.getElementById('num-variables').value;
        numConstrains = document.getElementById('num-restricciones').value;

        //generamos los campos de las variables, FO, restricciones
        htmlVariables.innerHTML = fieldsVariables(numVariables);
        htmlFO.innerHTML = formFO(active);
        htmlConstrains.innerHTML = fieldsConstrains(numConstrains);

    } else {
        let valSelect = +document.getElementById('ponr-select').value;
        let problem = null;
        switch (valSelect) {
            case 0:
                problem = ponr.tensionCompressionSpring();
                break;
            case 1:
                problem = ponr.pressureVessel();
                break;
            case 2:
                problem = ponr.designReinforcedConcreteBeam();
                break;
            case 3:
                problem = ponr.quadraticallyConstrainedQuadraticProgram();
                break;
        }

        rangesVariables = problem.rangesVariables;
        fo = problem.fo;
        bvkn = problem.bvkn;
        constrains = problem.constrains;

        numVariables = rangesVariables.length;
        numConstrains = constrains.length;

        //generamos los campos de las variables, FO, restricciones
        htmlVariables.innerHTML = fieldsVariables(numVariables);
        htmlFO.innerHTML = formFO(active);
        htmlConstrains.innerHTML = fieldsConstrains(numConstrains);

        document.getElementById('funcion-objetivo').value = fo;
        document.getElementById('mejor-conocido').value = bvkn;

        for (let i = 0; i < numVariables; i++) {
            document.getElementById('li-x' + (i + 1)).value = rangesVariables[i][0];
            document.getElementById('ls-x' + (i + 1)).value = rangesVariables[i][1];
        }

        for (let i = 0; i < numConstrains; i++) {
            document.getElementById('restriccion-' + (i + 1)).value = constrains[i].constrains;
            document.getElementById('operador-r' + (i + 1)).value = constrains[i].comparator;
            document.getElementById('r-' + (i + 1)).value = constrains[i].right;
        }



    }//close else

    //generamos los campos para los rangos
    const htmlValues = document.getElementById('div-values');
    htmlValues.innerHTML = fieldsValues(numVariables);

    //generamos el botón
    const htmlBoton = document.getElementById('div-button');
    htmlBoton.innerHTML = `<button type="submit" class="btn btn-success btn-block">Evaluate</button>`;

    //preparamos las variables que almacenaran los valores

    document.getElementById('optimization-form').addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        //--------------------------------------------------------------Extraer valores
        //para los rangos de variables

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

            //extraer función objetivo
            fo = document.getElementById('funcion-objetivo').value;            

            //mejor valor conocido

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

            let colorFO = "text-primary";

            for (let i = 0; i < rangesVariables.length; i++) {
                const key = 'x' + (i + 1);
                const value = values[key];
                const li = rangesVariables[i][0];
                const ls = rangesVariables[i][1];
                rangesVariables[i][2] = value >= li && value <= ls;
                
                if(rangesVariables[i][2] == false){
                    colorFO = "text-danger";
                }

            }//cierre for 

            //evaluamos la función objetivo
            let resultFO = NaN;


            try {
                //objetive function
                resultFO = math.evaluate(fo, values);
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Objective function...',
                    text: 'The objective function contains unrecognized variables. Please remember that you can only use variables like x1, x2, x3, ..., xn.'
                });
                return;
            }


            //verificamos las restricciones
            for (let i = 0; i < constrains.length; i++) {
                const funConstrains = constrains[i].constrains;
                const comparator = constrains[i].comparator;
                const right = parseFloat(constrains[i].right);

                let valueRes = NaN;

                try {
                    
                    valueRes = math.evaluate(funConstrains, values);
                } catch (error) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Constraints ...',
                        text: 'The constraints contains unrecognized variables. Please remember that you can only use variables like x1, x2, x3, ..., xn.'
                    });
                    return;
                }

                constrains[i].result = valueRes;

                switch (comparator) {
                    case "<=":
                        constrains[i].vc = (valueRes <= right);
                        break;
                    case ">=":
                        constrains[i].vc = (valueRes >= right);
                        break;
                    case "=":
                        constrains[i].vc = (valueRes == right);
                        break;
                    case "<":
                        constrains[i].vc = (valueRes < right);
                        break;
                    case ">":
                        constrains[i].vc = (valueRes > right);
                        break;
                    default:
                        console.log("Opción no válida");
                }

                if(constrains[i].vc == false){
                    colorFO = "text-danger";
                }

            }//close for


            //generamos los campos de las variables
            const htmlFOResult = document.getElementById('div-fo-result');

            htmlFOResult.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-sm-12 col-xl-3 text-center">
                        <p class="mb-0">Objective function result</p>
                        <h6 class="${colorFO}">f(x) = ${resultFO}</h6>
                    </div>
                    <div class="col-sm-12 col-xl-3  text-center">
                        <p class="mb-0">Best Known Value</p>
                        <h6>${bvkn}</h6>
                    </div>
                    <div class="col-sm-12 col-xl-3  text-center">
                        <button id="btnImprimir" class="btn btn-warning w-100 mt-3">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
            `;

             // se asocia la funcion al evento click del boton
            document.getElementById('btnImprimir').addEventListener('click', imprimirPagina);


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
                        <th scope="col">Feasible</th>
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
                        <td><i class="${classIcon}"></i> ${(rangesVariables[i][2]?"Yes":"No")}</td>
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
            <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Value</th>
                        <th scope="col">Feasible</th>
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
                            <td>g${i + 1}</td>
                            <td>${constrains[i].result}</td>
                            <td><i class="${classIcon}"></i> ${(auxVC?"Yes":"No")}</td>
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
        <hr>
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

        fields += `
        <label>Details of constraints</label>
        <hr>
        <div class = "row">
            <div class = "col-6">
                <h6 class = "h6"> Expression </h6>
            </div>
            <div class = "col-6">
                <h6 class = "h6"> Type </h6>
            </div>
        </div>
        `;
        for (let i = 0; i < numConstrains; i++) {
            fields += `<div class="col-12">`;
            fields += formConstrains((i + 1), active);
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
        fields += formVariables((i + 1), active);
        fields += `</div> `;
    }//close for 

    return fields;
} // close fieldsVariables

function imprimirPagina() {
    // Llamar a la función de impresión
    window.print();
}

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