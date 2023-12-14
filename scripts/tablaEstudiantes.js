const usId = window.sessionStorage.getItem('usuariosLogId');

const apiUrl = window.localStorage.getItem('apiUrl');
const urlValues = new URLSearchParams(window.location.search);
const skillId = urlValues.get('skill');
const subject = urlValues.get('subject');
let period = urlValues.get('period');
let grade;

let percentage = {
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0,
    C5: 0,
    C6: 0,
    E: 0
}

//let skills = [{id: 0}, {id: 0}, {id: 0}, {id: 0}, {id: 0}, {id: 0}, {id:0}];

let skills = {
    C1: 0,
    C2: 0,
    C3: 0,
    C4: 0,
    C5: 0,
    C6: 0,
    E: 0
}

/*setInterval(()=> {
    const rel = window.localStorage.getItem('rel');
    
    if (rel == 1) {
        window.localStorage.setItem('rel', 0);
        window.location.reload();
        
    }
}, 200) */

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
fetch(`${apiUrl}competenciasMateriaPeriodo/${subject}/${period}`)
.then(response => response.json())
.then(data => {
    
    console.log(data)
    let tableSkill = document.getElementById('skills');

    for(i=0; i < data.competencia.length; i++) {
        let con = data.competencia[i].titulo;
        skills[con] = data.competencia[i].id;
        percentage[con] = data.competencia[i].porcentaje;

       let row = tableSkill.insertRow();
       let cell1 = row.insertCell(0)
        cell1.colSpan = '3';
        cell1.className = 'table-active'
        cell1.textContent = `${con}: ${data.competencia[i].descripcion}`;
    }

    console.log(percentage);
})
addText("period", `Periodo: ${period}`)

//mostrar notas


fetch(`${apiUrl}materiasId/${subject}`)
.then(response => response.json())
.then(data => {
    grade = data.materia.grado_id;
    addText("subject", data.materia.nombre_materia);
})


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

                    function filtrar(id) {
                        let rating = 0;
                        let ratingId = 0;
                        let form=3

                        const notasFiltradas = data.notas
                        notasFiltradas.filter(objeto => objeto.competencia_id === id).map(function(x) {
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

                    const rating1 = filtrar(skills.C1).rating;
                    const rating2 = filtrar(skills.C2).rating;
                    const rating3 = filtrar(skills.C3).rating;
                    const rating4 = filtrar(skills.C4).rating;
                    const rating5 = filtrar(skills.C5).rating;
                    const rating6 = filtrar(skills.C6).rating;
                    const ratingE = filtrar(skills.E).rating;

                    const final = rating1*(percentage.C1 / 100)+rating2*(percentage.C2 / 100)+rating3*(percentage.C3 / 100)+rating4*(percentage.C4 / 100)+rating5*(percentage.C5 / 100)+rating6*(percentage.C6 / 100)+ratingE*(percentage.E / 100);
                   

                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    var cell8 = row.insertCell(7);
                    var cell9 = row.insertCell(8);
                    var cell10 = row.insertCell(9);
                    var cell11 = row.insertCell(10);
                    var cell12 = row.insertCell(11);
                    var cell13 = row.insertCell(12);
                    var cell14 = row.insertCell(13);
                    var cell15 = row.insertCell(14);
                    var cell16 = row.insertCell(15);
                    var cell17 = row.insertCell(16);
                    var cell18 = row.insertCell(17);
                    var cell19 = row.insertCell(18);

                    /*cell5.contentEditable = 'true';
                    cell7.contentEditable = 'true';
                    cell9.contentEditable = 'true';
                    cell11.contentEditable = 'true';
                    cell13.contentEditable = 'true';
                    cell17.contentEditable = 'true';
                    cell15.contentEditable = 'true';*/
                    

                    cell1.innerHTML = datos['estudiantes'][i]['id'];
                    cell2.innerHTML = datos['estudiantes'][i]['nuip_estudiante'];
                    cell3.innerHTML = datos['estudiantes'][i]['nombre_estudiante'];
                    cell4.innerHTML = datos['estudiantes'][i]['apellido_estudiante'];
                    cell5.innerHTML = rating1;
                    cell6.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C1).form}, ${studentId}, ${skills.C1}, ${filtrar(skills.C1).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell7.innerHTML = rating2;
                    cell8.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C2).form}, ${studentId}, ${skills.C2}, ${filtrar(skills.C2).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell9.innerHTML = rating3;
                    cell10.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C3).form}, ${studentId}, ${skills.C3}, ${filtrar(skills.C3).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell11.innerHTML = rating4;
                    cell12.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C4).form}, ${studentId}, ${skills.C4}, ${filtrar(skills.C4).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell13.innerHTML = rating5;
                    cell14.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C5).form}, ${studentId}, ${skills.C5}, ${filtrar(skills.C5).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell15.innerHTML = rating6;
                    cell16.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.C6).form}, ${studentId}, ${skills.C6}, ${filtrar(skills.C6).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell17.innerHTML = ratingE;
                    cell18.innerHTML = `<button type="button" class="btn btn-secondary" onClick="openForms(${filtrar(skills.E).form}, ${studentId}, ${skills.E}, ${filtrar(skills.E).ratingId}, ${subject}, ${period})"><i class="fa-solid fa-pencil"></i></button>`;
                    cell19.innerHTML = final.toFixed(2);
                    
            });
        }
     
       setTimeout(() => {
        $('#tabla-estudiantes').DataTable();
       }, 2500) 
      
 
    }


}, 500);

function openForms(id, student, skill, ratingId, subject, period) {

    var x=(screen.width/2)-250;
	
    var y=(screen.height/2)-200;

    window.open(`../views/forms.html?form=${id}&student=${student}&skill=${skill}&rating=${ratingId}&subject=${subject}&period=${period}`, "Agregar nota", `width=400, height=500, left=${x}, top=${y}`)
}



