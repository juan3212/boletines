const usId = window.sessionStorage.getItem('usuariosLogId');

const apiUrl = window.localStorage.getItem('apiUrl');
const urlValues = new URLSearchParams(window.location.search);
const subject = urlValues.get('subject');
let period = urlValues.get('period');
let grade;
let rateCells = 0;
let actitudinal = [1];
let procedimental = [2];
let cognitiva = [3];
let sA =[];
let ex = 0;
let target = -1;
let engl, notEngl;
let typesEngl = [[0],[1],[2],[3]];

let percentage = {
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0,
    C5: 0,
    C6: 0,
    E: 0
}


let skills = {
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0,
    C5: 0,
    C6: 0,
    E: 0
}


setInterval(()=> {
    const rel = window.localStorage.getItem('rel');
    
    if (rel == 1) {
        window.localStorage.setItem('rel', 0);
        window.location.reload();
        
    }
}, 200)

function addText(id, text) {
    document.getElementById(id).innerHTML += text;
}

//verificar identificacion del usuario
if (usId === undefined || usId === null) {
    cerrarSesion();
}

function cerrarSesion() {
    window.sessionStorage.clear();
    window.location.href = '../index.html';
}


//obtener datos de la materia y la competencia
fetch(`${apiUrl}materiasId/${subject}`)
.then(response => response.json())
.then(data => {
    grade = data.materia.grado_id;
    addText("subject", data.materia.nombre_materia);
    engl = data.materia.nombre_materia.includes("ENGLISH") || data.materia.nombre_materia.includes("FRENCH");
    notEngl = data.materia.nombre_materia.includes("USAGE");

    if (engl === true && notEngl === false){engl = 1}else{engl =0};

})


fetch(`${apiUrl}competenciasMateriaPeriodo/${subject}/${period}`)
.then(response => response.json())
.then(data => {
    
    console.log(data)
    let tableSkill = document.getElementById('skills');
    let tableHead = document.getElementById('tableHead');
    let type = document.getElementById('type');
    let types = [['A', 'P', 'C'], ['L','S','R','W']];

   

    rateCells = (data.competencia.length)*(3+engl)+(5);
    
    for(i=0; i < data.competencia.length; i++) {
        let con = data.competencia[i].titulo;
        skills[con] = data.competencia[i].id;
        percentage[con] = data.competencia[i].porcentaje;

       let row = tableSkill.insertRow();
       let cell1 = row.insertCell(0)
        cell1.colSpan = '3';
        cell1.className = 'table-active'
        cell1.textContent = `${con}: ${data.competencia[i].descripcion}`;

        if(data.competencia[i].titulo === "E"){ ex = 1; rateCells -= (2+engl)};


    }

    for(i=0; i<data.competencia.length-ex; i++){  
        actitudinal.push(actitudinal[i]+3);
        procedimental.push(procedimental[i]+3);
        cognitiva.push(cognitiva[i]+3);

        typesEngl[0].push(typesEngl[0][i]+4);
        typesEngl[1].push(typesEngl[1][i]+4);
        typesEngl[2].push(typesEngl[2][i]+4);
        typesEngl[3].push(typesEngl[3][i]+4);

        tableHead.insertCell(i+4).colSpan = 3+engl;
        tableHead.cells[i+4].textContent = 'C'+(i+1);
        for(j=0; j<3+engl; j++){
            type.insertCell(j).textContent = types[engl][j];
        }

        count = i*(2+engl)+4+i;
        if(engl > 0){
            sA.push([count,count+1,count+2, count+3])  
        }
        else{
            sA.push([count,count+1,count+2])
        }
        

        console.log(actitudinal);
        console.log(procedimental);
        console.log(cognitiva); 
    }

    console.log(sA)
    console.log(typesEngl)

    tableHead.insertCell().textContent = 'E';
    tableHead.insertCell().textContent = 'Final';
    tableHead.cells[tableHead.cells.length-2].setAttribute('rowSpan', '2');
    tableHead.cells[tableHead.cells.length-1].setAttribute('rowSpan', '2');
    if(ex === 0) {
       tableHead.deleteCell(tableHead.cells.length-2)
    }
    
    
    
    

})

addText("period", `Periodo: ${period}`);


//mostrar notas

//mostrar tabla de estudiantes con retraso de 500ms

setTimeout(() => {
   
    fetch(`${apiUrl}estudiantesGrado/${grade}`)
    .then(response => response.json())
    .then(data => {
        crear_tabla(data)
    })

    function crear_tabla(datos) {
        

        console.log(datos)
        const studentsLength = datos['estudiantes'].length
        
        var table = document.getElementById("datos-estudiantes");
    
        for (let i = 0; i < studentsLength; i++) {

            let studentId = datos['estudiantes'][i]['id'];


            fetch(`${apiUrl}notasEstudianteMateriaPeriodo/${studentId}/${subject}/${period}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)

                    function filtrar(id, type) {
                        let rating = " ";
                        let ratingId = 0;
                        let form=3

                        const notasFiltradas = data.notas
                        notasFiltradas.filter(objeto => objeto.competencia_id === id && objeto.tipo_nota_id === type).map(function(x) {
                            rating = x.nota;
                            
                            if(rating != undefined || rating > 0){
                                ratingId = x.id;
                                form = 4;
                            }
                        })

                        const res = {
                            rating: rating,
                            ratingId: ratingId,
                            form: form
                        }
                        
                        return res;
                    }

                   
                    var row = table.insertRow();

                    for (k=0; k<rateCells; k++) {
                        row.insertCell(k);
                    }

                    let rating=[];
                    const ratingE = filtrar(skills.E, 8).rating;

                    let perProm = [];
                    let ct = 1;
                    for(let key in skills) {
                        if(engl > 0){
                            rating.push(filtrar(skills[key], 4).rating);
                            rating.push(filtrar(skills[key], 5).rating);
                            rating.push(filtrar(skills[key], 6).rating);
                            rating.push(filtrar(skills[key], 7).rating);
                            perProm.push(percentage[key]);
                        }else {
                            rating.push(filtrar(skills[key], 1).rating);
                            rating.push(filtrar(skills[key], 2).rating);
                            rating.push(filtrar(skills[key], 3).rating);
                            perProm.push(percentage[key]);
                        }


                    }

                    console.log('notas = '+ rating);
                    let con = 0;
                    let b =4;
                    let nt = 0;
                    let prom = [];
                    for (l=4; l<rateCells-2; l+= 3+engl) {

                        if(engl > 0) {
                            row.cells[l].textContent = rating[nt];
                            row.cells[l+1].textContent = rating[nt+1];
                            row.cells[l+2].textContent = rating[nt+2];
                            row.cells[l+3].textContent = rating[nt+3];

                        
                            prom.push((rating[nt]+rating[nt+1]+rating[nt+2]+rating[nt+3])/4*(perProm[con]/100));
                             nt += 4;
                             con++;
                             b += 4;
                        }else{
                            row.cells[l].textContent = rating[nt];
                            row.cells[l+1].textContent = rating[nt+1];
                            row.cells[l+2].textContent = rating[nt+2];
                        
                            prom.push((rating[nt]+rating[nt+1]+rating[nt+2])/3*(perProm[con]/100));
                            
                            con ++;
                            nt += 3
                        }

                    }

                    if(ex > 0 ){
                        row.cells[row.cells.length-2].textContent = ratingE;
                        prom.push(ratingE*percentage.E/100);
                    }

                    let average = prom.reduce((a,b) => a+b,0)
  

                    row.cells[0].textContent = datos['estudiantes'][i]['id'];
                    row.cells[1].innerHTML = datos['estudiantes'][i]['nuip_estudiante'];
                    row.cells[2].innerHTML = datos['estudiantes'][i]['nombre_estudiante'];
                    row.cells[3].innerHTML = datos['estudiantes'][i]['apellido_estudiante'];
                    row.cells[row.cells.length-1].innerHTML = average.toFixed(2);
                    if(average.toFixed(2) < 6 || average.toFixed(2) >10){
                        row.cells[row.cells.length-1].classList.add('outRange');
                    }

                    for(j=0; j<row.cells.length ; j++) {
                        row.cells[j].contentEditable = 'true';
                        row.cells[j].addEventListener('click', function(e) {
                            const range = document.createRange();
                            range.selectNodeContents(this);
                          
                            const selection = window.getSelection();
                            selection.removeAllRanges();
                            selection.addRange(range);
                          });

                        row.cells[j]. addEventListener('input', function() {
                            if(parseFloat(this.textContent) > 10) this.classList.add('outRange');
                            else this.classList.remove('outRange')
                        })

                      }
                                
            });
        }

        //moverse por las celdas con las flechas
        const table1 = document.getElementById('tabla-estudiantes');
        // Agregar el event listener para detectar las flechas del teclado
        table1.addEventListener('keydown', (event) => {
            const currentCell = event.target;
            const currentRow = currentCell.parentNode;
            const currentIndex = Array.from(currentRow.children).indexOf(currentCell);
        
            let nextCell;
        
            switch (event.key) {
                case 'ArrowUp':
                event.preventDefault();
                const prevRow = currentRow.previousElementSibling;
                nextCell = prevRow ? prevRow.children[currentIndex] : null;
                break;
                case 'ArrowDown':
                event.preventDefault();
                const nextRow = currentRow.nextElementSibling;
                nextCell = nextRow ? nextRow.children[currentIndex] : null;
                break;
                case 'ArrowLeft':
                event.preventDefault();
                nextCell = currentCell.previousElementSibling;
                break;
                case 'ArrowRight':
                event.preventDefault();
                nextCell = currentCell.nextElementSibling;
                break;
            }
        
            if (nextCell) {
                nextCell.focus();
                selectText(nextCell);
            }
        });    
        
        function selectText(element) {
            const range = document.createRange();
            range.selectNodeContents(element);
          
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
        
        
       setTimeout(() => {
        $('#tabla-estudiantes').DataTable({
            "pageLength": 30,
 
        });
        let val1 = document.getElementById(`04`).textContent;
        if(val1 != " ") target = val1;
        console.log(target)
       }, 2500) 
      
 
    }



}, 500);

//obtener los datos de la tabla

function readData() {

    document.getElementById('read').disabled= true;
    const tabla = document.getElementById('datos-estudiantes');
    const filas = tabla.querySelectorAll('tr');

    const filasArray = [];
    filas.forEach((fila) => {
    const celdas = fila.querySelectorAll('td');
    const filaArray = [];
    celdas.forEach((celda) => {
        filaArray.push(celda.textContent.trim());
    });
    filasArray.push(filaArray);
    });

    let rating = [];
    
    console.log(filasArray);

        for(j=0; j<filasArray.length; j++) {
            let a = 0;
        
            for(k=0; k<filasArray[j].length-5; k++){



                function asignarTipo(numero) {

                    let tipo;

                    if(engl === 0) {
                        if (actitudinal.includes(numero)) {
                            tipo = 1;
                        } else if (cognitiva.includes(numero)) {
                            tipo = 3;
                        } else if (procedimental.includes(numero)) {
                            tipo = 2;
                        } else {
                            tipo = 8;
                        }
                    }

                    else {
                        if(typesEngl[0].includes(numero)) {tipo = 4;}
                        else if(typesEngl[1].includes(numero)) {tipo = 5;}
                        else if(typesEngl[2].includes(numero)) {tipo = 6;}
                        else if(typesEngl[3].includes(numero)) {tipo = 7;}
                        else{tipo = 8;}
                    }
                    

                    
                    return tipo;
                }

                    function skillAssign(number) {
                    let sId;

                    


                    if(sA[0] != undefined && sA[0].includes(number)) sId = skills.C1
                    else if (sA[1] != undefined && sA[1].includes(number)) sId = skills.C2
                    else if (sA[2] != undefined && sA[2].includes(number)) sId = skills.C3
                    else if (sA[3] != undefined && sA[3].includes(number)) sId = skills.C4
                    else if (sA[4] != undefined && sA[4].includes(number)) sId = skills.C5
                    else if (sA[5] != undefined && sA[5].includes(number)) sId = skills.C6
                    else if (number === (sA[sA.length - 1][sA[sA.length - 1].length - 1])+1) sId = skills.E
                    return sId;
                    }

                    let nota = filasArray[j][k+4].replace(',','.');

                
                rating.push({
                    'materia_id': parseInt(subject),
                    'periodo_id': parseInt(period),
                    'competencia_id': skillAssign(k+4),
                    'estudiantes_id': parseInt(filasArray[j][0]),
                    'tipo_nota': asignarTipo(k+4),
                    'nota': parseFloat(nota!=""?nota:0)
                });
        
                a =1;
            }

        
        }   


        fetch(`${apiUrl}updateRate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(rating),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.mensaje);
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });
/*
        if (target != -1){
            fetch(`${apiUrl}updateRate`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(rating),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.mensaje);
                window.localStorage.setItem('rel', 1);
                window.close();
            });
        }
        else{
            fetch(`${apiUrl}addRate`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(rating),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.mensaje);
                window.localStorage.setItem('rel', 1);
                window.close();
            });
        }     */
    
    console.log(rating)      

}



