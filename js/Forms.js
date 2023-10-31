
export const formVariables = (i, active) => {
    return `
    <div class="row mb-1">
        <div class="col-3">
            <b>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                    <mi>x</mi>
                    <sub>${i}</sub>
                </math>
            </b>
        </div>

        <div class="col-4">
            <input type="text" id="li-x${i}" name="li-x${i}" class="form-control" required ${active}>
        </div>
        <div class="col-4">
            <input type="text" id="ls-x${i}" name="ls-x${i}" class="form-control" required ${active}>
        </div>
    </div>
    `;
}

export const formFO = (active) => {
    return `
        <div class="mb-3">
            <label for="funcion-objetivo" class="form-label">Objective Function</label>
            <input type="text" id="funcion-objetivo" name="funcion-objetivo" class="form-control" placeholder="x^2" required ${active}>
        </div>

        <div class="mb-3">
            <label for="mejor-conocido" class="form-label">Best Known Value</label>
            <input type="text" id="mejor-conocido" name="mejor-conocido" class="form-control" value="1000000" ${active}>
        </div>
    `;
}

export const formConstrains = (i, active) => {
    return `
        <div class="row">
            <div class="col-12">  
                    <div class="row mt-1">
                        <div class="col-sm-12 col-lg-6">
                            <input type="text" id="restriccion-${i}" name="restriccion-${i}"  class="form-control"  placeholder="x^2" required ${active}>
                        </div>

                        <div class="col">
                            <div class="h-100">
                                <select id="operador-r${i}" name="operador1" class="form-select form-select-sm mb-3" ${active}>
                                    <option value="<=">&le;</option>
                                    <option value=">=">&ge;</option>
                                    <option value="=">&#61;</option>
                                    <option value="<">&lt;</option>
                                    <option value=">">&gt;</option>
                                </select>
                            </div>
                        </div>

                        <div class="col">
                            <input type="text" id="r-${i}" name="r-${i}" class="form-control" value="0" required ${active}>
                        </div>
                    </div>
            </div>    
        </div>
        `;
}

export const formValues = (i) => {
    return `
        <input type="text" id="value-x${i}" name="value-x${i}" class="form-control" placeholder="x${i}" required></input>
    `;
}
