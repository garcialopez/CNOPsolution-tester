import { } from "https://cdnjs.cloudflare.com/ajax/libs/shepherd.js/7.1.2/js/shepherd.min.js";


let tour;
window.startIntro = function () {

    tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true },
            classes: 'class-1 class-2',
            scrollTo: { behavior: 'smooth', block: 'center' }
        }
    });

    // Configuración del primer paso
    tuto('Step 1'
        , 'In this component, decide whether you want to manually input the details of your optimization problem or select one from the Benchmark set.'
        , '#typeProblem'
        , 'right'
        , 0
    );

    if (isVisible('div-define')) {
        //----------------------------------------------------------------------------
        tuto('Step 2'
            , 'You must enter the number of design variables that your problem contains and define the number of constraints.'
            , '#div-define', 'right', 1
        );
        tuto('Step 3'
            , 'When you press this button, fields for variable limits and constraints are generated based on the entered values.'
            , '#btnNext', 'right', 1
        );

        tuto('Variable limits'
            , 'After clicking the button, you should enter the lower and upper bounds for each design variable in this section.'
            , '#div-variable', 'right', 1
        );
        tuto('Objective function'
            , 'After clicking the button, you will need to enter the objective function. For example:<br><br> x1 + 2<br><br> Remember that the objective function should include the design variables such as x1, x2, ..., xn, where the index corresponds to the number of inserted variables.'
            , '#div-fo', 'left', 1
        );
        tuto('Best Known Value'
            , 'If you have a known better value for your optimization problem, enter it; otherwise, the default value is 1,000,000.'
            , '#div-fo', 'bottom', 1
        );
        tuto('Constraints'
            , 'In this section, you should input the constraints of the problem.'
            , '#div-constrains', 'right', 1
        );

    } else if (isVisible('div-benchmark')) {
        //----------------------------------------------------------------------------
        tuto('Step 2'
            , 'You must select an optimization problem from the included ones.'
            , '#div-benchmark', 'right', 1
        );
        tuto('Step 3'
            , 'When you press this button, the details of the selected optimization problem are displayed.'
            , '#btnNext', 'right', 1
        );

        tuto('Variable limits'
            , 'After clicking the button, this section displays the lower and upper bounds of the selected optimization problem.'
            , '#div-variable', 'right', 1
        );
        tuto('Objective function'
            , 'After clicking the button, the objective function of the selected optimization problem is displayed.'
            , '#div-fo', 'left', 1
        );
        tuto('Best Known Value'
            , 'The best known value for the selected optimization problem is displayed.'
            , '#div-fo', 'bottom', 1
        );
        tuto('Constraints'
            , 'The constraints for the selected optimization problem is displayed.'
            , '#div-constrains', 'right', 1
        );

    }//close else if

    tuto('Value of the variables'
        , 'In this section, you should enter the values for each of the design variables.'
        , '#div-values', 'left-end', 1
    );
    tuto('Results'
        , 'In this section, the following results are displayed: the value of the objective function, value and feasibility for each constraint, and the feasibility of the variable ranges.'
        , '#div-resultados', 'top-start', 2
    );



    // Inicia el recorrido
    tour.start();
}

function isVisible(elemento) {
    const div1 = document.getElementById(elemento);
    const computedStyle = window.getComputedStyle(div1);
    return computedStyle.getPropertyValue('display') !== 'none';
}


function tuto(step, text, element, pos, index) {
    let option1 = '';
    let option2 = '';
    switch (index) {
        case 0: option1 = 'Cancel'; option2 = 'Next';
            break;
        case 1: option1 = 'Previous'; option2 = 'Next';
            break;
        case 2: option1 = 'Previous'; option2 = 'Finish';
            break;
    }

    tour.addStep({
        title: step, text: text,
        attachTo: { element: element, on: pos },
        buttons: [
            {
                action() {
                    if (index == 0) {
                        return this.cancel();
                    } else {
                        return this.back();
                    }

                },
                classes: 'shepherd-button-secondary',
                text: option1
            },
            {
                action() {
                    return this.next();
                },
                text: option2
            }
        ]
    });

}