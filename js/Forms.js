
export const formulario1 = () => {
    return `
    ${divH('Información de su problema de optimización',3)}
    <form id="optimization-form" class="row">
        <div class="col-md-4">
            <div class="row">
                <div class="col-12">
                    <input type="text" id="funcion-objetivo" name="funcion-objetivo" class="form-control" placeholder="Función objetivo" required>
                </div>
                <div class="col-12 mt-1">
                    <input type="text" id="mejor-conocido" name="mejor-conocido" class="form-control" placeholder="Mejor conocido">
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <textarea id="foLatex" name="foLatex" class="form-control" rows="2" cols="50" placeholder="Código LaTeX"></textarea>
        </div>

        <div class="col-md-5" id="outputFO">                        
        </div>
    `;
}

export const formulario2 = (i) => {
    return `
    <div class="col-md-5">
        <div class="row">
            <div class="col-12">  
                    <div class="row mt-2">
                        <div class="col-7">
                            <input type="text" id="restriccion-${i}" name="restriccion-${i}"  class="form-control"  placeholder="Restricción ${i}" required>
                        </div>

                        <div class="col">
                            <select id="operador-r${i}" name="operador1" class="form-control">
                                <option value="menor-igual">&le;</option>
                                <option value="mayor-igual">&ge;</option>
                                <option value="igual">&#61;</option>
                                <option value="menor-que">&lt;</option>
                                <option value="mayor-que">&gt;</option>
                            </select>
                        </div>

                        <div class="col">
                            <input type="text" id="r-${i}" name="r-${i}" class="form-control" placeholder="0" required>
                        </div>
                    </div>
            </div>    
        </div>
    </div>
    <div class="col-md-3">
        <textarea id="latex-R${i}" name="latex-R${i}" class="form-control" rows="1" cols="50" placeholder="Código LaTeX R-${i}"></textarea>
    </div>

    <div id="outputLaTeX-R${i}" class="col">
    </div>

        `;
}

export const formulario3 = (i) => {
    return `
    <div class="row mt-1">
        <div class="col-md-3">
            <input type="text" id="li-x${i}" name="li-x${i}" class="form-control" placeholder="li-x${i}" required>
        </div>

        <div class="col text-center"><h4><b>&#8804;</b></h4></div>
        <div class="col">
            <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>x</mi>
                <sub>${i}</sub>
            </math>
        </div>
        <div class="col text-center"><h4><b>&#8804;</b></h4></div>
        <div class="col-md-3">
            <input type="text" id="ls-x${i}" name="ls-x${i}" class="form-control" placeholder="ls-x${i}" required>
        </div>
    </div>
    `;
}

export const formulario4 = (i) => {
    return `
<input type="text" id="value-x${i}" name="value-x${i}" class="form-control" placeholder="Value for x${i}" required></input>
`;

}

export const divH = (mensaje, h) => {
    return `<div class="col-12 mt-3 mb-3 text-center">
                <h${h} class="h${h}">${mensaje}</h${h}>
            </div>`
    ;
}