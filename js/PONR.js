export default class PONR {

    listPONR(){
        return [
            "Tension Compression Spring"
            , "PressureVessel"
            , "Design Reinforced Concrete Beam"
            , "Quadratically Constrained Quadratic Program"
            , "Process Synthesis Kocis 98"
            , "Process Synthesis Yuan 88"
        ];
    }

    tensionCompressionSpring() {

        let rangesVariables = [
            [0.05, 2],              //x1
            [0.25, 1.3],            //x2
            [2, 15]                 //x3
        ];

        let fo = '(x3 + 2) * x2 * x1^2';
        let bvkn = 0.012681;

        let constrains = [];


        constrains[0] = {
            constrains: '1-(x2^3*x3)/(71785*x1^4)',
            comparator: '<=',right: 0, result: 0, vc: false
        };

        constrains[1] = {
            constrains: '((4*(x2^2)-x1*x2)/(12566*(x2*(x1^3)-(x1^4)))) + (1.0/(5108*(x1^2)))-1',
            comparator: '<=', right: 0, result: 0, vc: false
        };

        constrains[2] = {
            constrains: '1.0-(140.45*x1/((x2^2)*x3))',
            comparator: '<=', right: 0, result: 0, vc: false
        };
        constrains[3] = {
            constrains: '((x2+x1)/1.5)-1',
            comparator: '<=', right: 0, result: 0, vc: false
        };

        const ponr = {
            rangesVariables: rangesVariables,
            fo: fo,
            bvkn: bvkn,
            constrains: constrains
        };
    
        return ponr;

    }

    pressureVessel() {

        let rangesVariables = [
            [0.0625, (99*0.0625)],              //x1
            [0.0625, (99*0.0625)],            //x2
            [10, 200],                 //x3
            [10, 200]                 //x4
        ];

        let fo = '0.6224 * x1 * x3 * x4 + 1.7781 * x2 * x3^2  + 3.1661 * x1^2 * x4  + 19.84 * x1^2 * x3';
        let bvkn = 5896.94890;

        let constrains = [];


        constrains[0] = {
            constrains: '(-1 * x1) + (0.0193*x3)',
            comparator: '<=',right: 0, result: 0, vc: false
        };

        constrains[1] = {
            constrains: '(-1 * x2) + (0.00954*x3)',
            comparator: '<=', right: 0, result: 0, vc: false
        };

        constrains[2] = {
            constrains: '(-3.1416 * x3^2 * x4) - ((4.0/3.0) * 3.1416 * x3^3) + 1296000.0',
            comparator: '<=', right: 0, result: 0, vc: false
        };
        constrains[3] = {
            constrains: 'x4 - 240',
            comparator: '<=', right: 0, result: 0, vc: false
        };

        const ponr = {
            rangesVariables: rangesVariables,
            fo: fo,
            bvkn: bvkn,
            constrains: constrains
        };
    
        return ponr;

    }

    designReinforcedConcreteBeam() {

        let rangesVariables = [
            [0,115.8],              //x1
            [0.00001,30.0]            //x2
        ];

        let fo = '29.4*x1 + 18*x2';
        let bvkn = 376.2919;

        let constrains = [];


        constrains[0] = {
            constrains: '-(x1)+(0.2458*(x1^2.0 /x2))+6',
            comparator: '>',right: 0, result: 0, vc: false
        };

        const ponr = {
            rangesVariables: rangesVariables,
            fo: fo,
            bvkn: bvkn,
            constrains: constrains
        };
    
        return ponr;

    }
//------------------------------------------------- -------------------------
    quadraticallyConstrainedQuadraticProgram() {

        let rangesVariables = [
            [-8,10],              //x1
            [0,10]            //x2
        ];

        let fo = 'x1^4 - 14 * x1^2 + 24 * x1 - x2^2';
        let bvkn = -118.7048;

        let constrains = [];

        constrains[0] = {
            constrains: '-x1 + x2 - 8',
            comparator: '<=',right: 0, result: 0, vc: false
        };
        constrains[1] = {
            constrains: 'x1 - 10',
            comparator: '<=',right: 0, result: 0, vc: false
        };
        constrains[2] = {
            constrains: '-x2',
            comparator: '<=',right: 0, result: 0, vc: false
        };
        constrains[3] = {
            constrains: 'x2 - x1^2 - 2 * x1 + 2',
            comparator: '<=',right: 0, result: 0, vc: false
        };

        const ponr = {
            rangesVariables: rangesVariables,
            fo: fo,
            bvkn: bvkn,
            constrains: constrains
        };
    
        return ponr;

    }

    //------------------------------------------------- -------------------------
    ProcessSynthesisKocis98() {

        let rangesVariables = [
            [0,1.6],[0, 1]          
        ];

        let fo = 'x2 + 2 * x1';
        let bvkn = 2.0;

        let constrains = [];

        constrains[0] = {
            constrains: 'x1^2 - x2 + 1.25',
            comparator: '<=',right: 0, result: 0, vc: false
        };
        constrains[1] = {
            constrains: 'x1 + x2',
            comparator: '<=', right: 1.6, result: 0, vc: false
        };
       
        const ponr = {rangesVariables: rangesVariables, fo: fo,bvkn: bvkn,constrains: constrains };
    
        return ponr;

    }

    //------------------------------------------------- -------------------------
    ProcessSynthesisYuan88() {

        let rangesVariables = [
            [0, 1.2],[0, 1.8], [0, 2.5], [0,1], [0,1], [0, 1], [0, 1]          
        ];

        let fo = '(x4 - 1)^2 + (x5 - 2)^2 + (x6 - 1)^2 - log10(x7 + 1) + (x1 - 1)^2 + (x2 - 2)^2 + (x3 - 3)^2';
        let bvkn = 4.579582;

        let constrains = [];
        constrains[0] = {
            constrains: 'x4 + x5 + x6 + x1 + x2 + x3',
            comparator: '<=',right: 5, result: 0, vc: false
        };
        constrains[1] = {
            constrains: 'x6^2 + x1^2 + x2^2 + x3^2',
            comparator: '<=', right: 5.5, result: 0, vc: false
        };
        constrains[2] = {
            constrains: 'x4 + x1',
            comparator: '<=', right: 1.2, result: 0, vc: false
        };
        constrains[3] = {
            constrains: 'x5 + x2',
            comparator: '<=', right: 1.8, result: 0, vc: false
        };
        constrains[4] = {
            constrains: 'x6 + x3',
            comparator: '<=', right: 2.5, result: 0, vc: false
        };
        constrains[5] = {
            constrains: 'x7 + x4',
            comparator: '<=', right: 1.2, result: 0, vc: false
        };
        constrains[6] = {
            constrains: 'x5^2 + x2^2',
            comparator: '<=', right: 1.64, result: 0, vc: false
        };
        constrains[7] = {
            constrains: 'x6^2 + x3^2',
            comparator: '<=', right: 4.25, result: 0, vc: false
        };
        constrains[8] = {
            constrains: 'x5^2 + x3^2',
            comparator: '<=', right: 4.64, result: 0, vc: false
        };

        
       
        const ponr = {rangesVariables: rangesVariables, fo: fo,bvkn: bvkn,constrains: constrains };
    
        return ponr;

    }

    


}// close class