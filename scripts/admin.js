const apiUrl = localStorage.getItem('apiUrl');
const gradeSelect = document.getElementById('gradeSelect');
let grade;
let studentSel = document.getElementById('students'); 
let subjectSel = document.getElementById('subjects');
let skillSel = document.getElementById('skills');
let periodSel = document.getElementById('period');

fetch(`${apiUrl}grados`)
.then(res => res.json())
.then(data => {
    console.log(data)
    data.grados.forEach(element => {
    createOption(gradeSelect, element.id, element.nombre_grado);
    });
})

gradeSelect.addEventListener('change', () => {
    studentSel.innerHTML = "";
    subjectSel.innerHTML = "";
    createOption(studentSel, "", "Estudiante");
    createOption(subjectSel, "", "Materia");

    grade = gradeSelect.value;
    fetch(`${apiUrl}estudiantesGrado/${grade}`)
    .then(res => res.json())
    .then(data => {
        data.estudiantes.forEach(element =>{
            createOption(studentSel, element.id, element.nombre_estudiante + " " + element.apellido_estudiante);
        }) 

        $('#students').select2();
    })

    fetch(`${apiUrl}materiasGrado/${grade}`)
    .then(res => res.json())
    .then(data => {
        data.materias.forEach(element => {
            createOption(subjectSel, element.id, element.nombre_materia);
        });

        $('#subjects').select2();
    })

    $("#subjects").on("change", function() {
        listSkills();
 });

 $("#period").on("change", function() {
    listSkills();
});

})

function listSkills () {
    skillSel.innerHTML = ""
    createOption(skillSel, "", "Competencia");
    fetch(`${apiUrl}competenciasMateriaPeriodo/${subjectSel.value}/${periodSel.value}`)
    .then(res => res.json())
    .then(data => {
        data.competencia.forEach(element => {
            createOption(skillSel, element.id, element.titulo);
        });
    }) 
}


function createOption(id, value, text) {
    let op = document.createElement('option');
    op.setAttribute('value', value);
    op.textContent = text;
    id.appendChild(op);
}



function enviarDatos () {

    document.getElementById('rating').innerHTML = '';

    const filter = {
        'estudiante': studentSel.value,
        'nombreEstudiante': cutName(studentSel.options[studentSel.selectedIndex].text,2),
        'grado': grade,
        'materia': subjectSel.value,
        'competencia': skillSel.value,
        'periodo': periodSel.value
    }
    
    console.log(filter);
    fetch(`${apiUrl}filtroNotas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(filter)
    })
    .then(res => res.json())
    .then(data => {
        paintData(data)
    })
}


function paintData (data) {
    console.log(data)
    let maxSkill = 0;
    let totalColumns = 0;
    let tableHead = document.getElementById('tableHead');
    let tableAbilities = document.getElementById('abilities');
    let rating = document.getElementById('rating');

    data.notas.forEach(element => {
        if(element.titulo.split('')[1] > maxSkill) {maxSkill = element.titulo.split('')[1]};
     
    });

    totalColumns = 5+parseInt(maxSkill);
    const elementos = document.querySelectorAll('[name="sk"]');

    if(elementos.length > 0) {
        elementos.forEach(elemento => {
        elemento.parentNode.removeChild(elemento);
        });
    }
    
        
    for (let i = 0; i < maxSkill; i++) {
       

        let a = i+(i*3);
        if(periodSel.value > 2){
            tableHead.insertCell(i+4).textContent = `C${i+1}`;
            tableHead.cells[i+4].setAttribute('colSpan', '4');
            tableHead.cells[i+4].setAttribute('name', 'sk');

            tableAbilities.insertCell(a).textContent = 'A/L';
            tableAbilities.cells[a].setAttribute('name', 'sk');
            tableAbilities.cells[a].setAttribute('id', `C${i+1}N1`);
            tableAbilities.insertCell(a+1).textContent = 'P/S';
            tableAbilities.cells[a+1].setAttribute('name', 'sk');
            tableAbilities.cells[a+1].setAttribute('id', `C${i+1}N2`);
            tableAbilities.insertCell(a+2).textContent = 'C/R';
            tableAbilities.cells[a+2].setAttribute('name', 'sk');
            tableAbilities.cells[a+2].setAttribute('id', `C${i+1}N3`);
            tableAbilities.insertCell(a+3).textContent = 'W'
            tableAbilities.cells[a+3].setAttribute('name', 'sk');
            tableAbilities.cells[a+3].setAttribute('id', `C${i+1}N4`);
        }
        else{
            tableHead.insertCell(i+4).textContent = `C${i+1}`;
            tableHead.cells[i+4].setAttribute('rowSpan', '2');
            tableHead.cells[i+4].setAttribute('name', 'sk');
            tableHead.cells[i+4].setAttribute('id', `C${i+1}N8`);
        }
    }

   
    let cont = -1;
    const existingRows = {};
    for(j=0; j<data.notas.length; j++){

     
        const nota = data.notas[j];

        // Crear una clave única para el estudiante y la materia
        const key = `${nota.id}-${nota.nombre_materia}`;
    
        if (existingRows[key]) {
            // Si la fila ya existe, agrega la nota como una nueva celda
            const newNotaColumn = existingRows[key].insertCell();
            newNotaColumn.textContent = nota.nota;
            newNotaColumn.contentEditable = true;
        } else {
            // Si la fila no existe, crea una nueva fila y actualiza el objeto 'existingRows'
            const ratingRow = rating.insertRow();
            ratingRow.insertCell(0).textContent = nota.id;
            ratingRow.insertCell(1).textContent = nota.nombre_estudiante;
            ratingRow.insertCell(2).textContent = nota.apellido_estudiante;
            ratingRow.insertCell(3).textContent = cutName(nota.nombre_materia, 2);
            
            // Agrega la nota como una nueva celda
            const newNotaColumn = ratingRow.insertCell();
            newNotaColumn.textContent = nota.nota;
            newNotaColumn.contentEditable = true;
            
            existingRows[key] = ratingRow;
        }

    }

    
}

function cutName(name, strl) {
    name = name.split(" ");
    let nameCuted ="";
    for(i=0; i<name.length-strl; i++){
        nameCuted += name[i]+" ";
    }

    return nameCuted
}

function listRate(nId){
    if(nId === 1 || nId === 4){
        
    }
}
