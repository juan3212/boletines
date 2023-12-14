//variables globales
const urlVal = window.location.search;
const urlValues = new URLSearchParams(urlVal);
const currentForm = urlValues.get('form');
const currentSubject = urlValues.get('subject');
const skillId = urlValues.get('skill');
const student = urlValues.get('student');
const ratingId = urlValues.get('rating');

const apiUrl = window.localStorage.getItem('apiUrl');
const usId = window.sessionStorage.getItem('usuariosLogId');
const period = window.localStorage.getItem('periodo');

let grade;
let gradeSelected;
let nivel;
let nivelSelected;
let url;
let timer;
let gradeName;



//verificar identificacion del usuario
if (usId === undefined || usId === null) {
cerrarSesion();
}

//cambiar de formulario
const forms = ["materias", "competencias", "notas", "notasEdit", "competenciasEdit", "competenciasMaterias"];
for(i=0; i<forms.length; i++){
    if(i == currentForm-1){
        document.getElementById(forms[i]).style.display = "block";
    }
    else{
        document.getElementById(forms[i]).style.display = "none";
    }
}



function cerrarSesion() {
window.sessionStorage.clear();
window.location.href = '../index.html';
}

//obtener datos del usuario
fetch(`${apiUrl}usuarioId/${usId}`)
.then(response => response.json())
.then(data => {
    document.getElementById('responsable').setAttribute('value', `${data.usuario.nombre_usuario} ${data.usuario.apellido_usuario}`);
})

//obtener datos del estudiante
fetch(`${apiUrl}estudianteId/${student}`)
.then(response => response.json())
.then(data => {
    console.log(data)
    document.getElementById("studentName").setAttribute('value', `${data.estudiante.nombre_estudiante} ${data.estudiante.apellido_estudiante}`);
    document.getElementById("studentNameEdit").setAttribute('value', `${data.estudiante.nombre_estudiante} ${data.estudiante.apellido_estudiante}`);
})

//obtener datos de la nota
fetch(`${apiUrl}notas/${ratingId}`)
.then(response =>response.json())
.then(data => {
    console.log(data)
    document.getElementById("ratingEdit").setAttribute('value', `${data.notas.nota}`)
})

//obtener datos de los niveles
fetch(`${apiUrl}niveles`)
.then(response => response.json())
.then(data => {
    listarNiveles(data.niveles)
});

function listarNiveles(datos) {
    let niveles = datos.map(datos => datos.niveles);
    console.log(niveles);
    $('#nivel').autocomplete({
        source: niveles
    })

    // agregar el id del nivel
    document.getElementById('nivel').addEventListener('change',function() {
        nivelSelected = document.getElementById('nivel');

        let nivelId = datos.filter(datos => datos.niveles ===  nivelSelected.value);     
        console.log(nivelId[0].id);  
         nivel = nivelId[0].id;
       
    })
}

// obtener datos de los grados
function grados() {
    fetch(`${apiUrl}gradosNivel/${nivel}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        listarGrados(data.grados)
    });

    function listarGrados(datos){
        var grados = datos.map(datos => datos.nombre_grado);
        grados.push('Todos')
        console.log(grados);

        $('#grado').autocomplete({
            source: grados
        })

    // agregar el id de la materia
        document.getElementById('grado').addEventListener('change',function() {
            gradeSelected = document.getElementById('grado').value;

            if(gradeSelected === 'Todos') {
                grade = datos.map(datos => datos.id);
                gradeName = datos.map(datos => datos.nombre_grado);
            }
            else {
                let gradeId = datos.filter(datos => datos.nombre_grado ===  gradeSelected);       
                grade = [gradeId[0].id];
                gradeName = [gradeId[0].nombre_grado];}
                
            console.log(grade);
            console.log(gradeName);
             
        })
    }
};

document.getElementById('nivel').addEventListener('change',function() {
    clearTimeout(timer);

  // Establece un retraso de 1 segundo antes de ejecutar la función
  timer = setTimeout(grados, 1000);
});


    fetch(`${apiUrl}materiasId/${currentSubject}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log(data.materia.nombre_materia)
        document.getElementById('materia').setAttribute('value', data.materia.nombre_materia);
        document.getElementById('materiaEdit').setAttribute('value', data.materia.nombre_materia);
    })


//obtener datos materia por usuario
fetch(`${apiUrl}materiasUsuario/${usId}`)
.then(response => response.json())
.then(data => {
    console.log(data)
    data.materias.forEach(element => {
        createCheckbox(element.id, element.nombre_materia);
    });
})

//crear checkbox 
function createCheckbox(id, materia){
    const check = document.getElementById('check');
    var div = document.createElement('div');
    div.className = 'form-check form-check-inline';

    var input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'form-check-input';
    input.value = id;
    input.id = '';

    var label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = 'flexCheckDefault';
    label.appendChild(document.createTextNode(materia));

    div.appendChild(input);
    div.appendChild(label);
    check.appendChild(div);
}

//completar datos de competencias
fetch(`${apiUrl}competenciasId/${skillId}`)
.then(response => response.json())
.then(data => {
    console.log(data);
    document.getElementById('descripcionEdit').innerHTML = data.competencia.descripcion; 
    document.getElementById('porcentajeEdit').setAttribute('value', data.competencia.porcentaje)
})

//agregar materia
function addSubject(){
    event.preventDefault();

    let subjectName = document.getElementById('nombre').value;
    let hourlyIntensity = document.getElementById('intensidad').value;

    if (subjectName == "0") {
        alert("Por favor, selecciona una Materia válida.");
    }

    else{
    
        for(i=0; i<grade.length; i++){


            const subjectData = {
                'nombre_materia': subjectName+" "+gradeName[i],
                'usuario_id': usId,
                'grado_id': grade[i],
                'intensidad': hourlyIntensity
            }

            fetch(`${apiUrl}crearMateria/`, {
                method: 'POST', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subjectData),
            })
            .then(response => response.json())
            .then(data => alert(data.mensaje));

        }
    }
}

//agregar competencias
function addSkill(){
    event.preventDefault();
    let subjectName = document.getElementById('titulo-competencia').value;
    let description = document.getElementById('descripcion').value;
    let percentage = document.getElementById('porcentaje').value;
    let periodSelected = document.getElementById('periodo').value;
    let title = document.getElementById('titulo').value;

    if (title == "0") {
        alert("Por favor, selecciona una Materia válida.");
    }
    else {
    

        const skillData = {
            'materias_id': currentSubject,
            'periodo_id': periodSelected,
            'titulo': title,
            'porcentaje': percentage,
            'descripcion': `${description}`
        }

        console.log(JSON.stringify(skillData));
        fetch(`${apiUrl}crearCompetencia/`, {
            method: 'POST', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });
    }

}

//agregar competencias materias
function addSkillSubject(){
    event.preventDefault();

    // var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    //     var values = Array.prototype.map.call(checkboxes, function(checkbox) {
    //     return checkbox.value;
    // });

 
    var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var checkValues = [];
    for (var i = 0; i < checkboxes.length; i++) {
        
            checkValues.push(checkboxes[i].value);
        
    }



    console.log(checkValues);
    let subjectName = document.getElementById('titulo-competencia').value;
    let description = document.getElementById('descripcionMaterias').value;
    let percentage = document.getElementById('porcentajeMaterias').value;
    let periodSelected = document.getElementById('periodoMaterias').value;
    let title = document.getElementById('tituloMaterias').value;
    
    if (title == "0") {
        alert("Por favor, selecciona una Competencia válida.");
    }

    else{
        const skillData = {
            'materias_id': checkValues,
            'periodo_id': periodSelected,
            'titulo': title,
            'porcentaje': percentage,
            'descripcion': `${description}`
        }

        console.log(JSON.stringify(skillData));
        fetch(`${apiUrl}crearCompetenciaMaterias/`, {
            method: 'POST', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });
    }

}

//editar competencias
function editSkill(){
    event.preventDefault();
    let description = document.getElementById('descripcionEdit').value;
    let percentage = document.getElementById('porcentajeEdit').value;
    let periodSelected = document.getElementById('periodoEdit').value;
    let title = document.getElementById('tituloEdit').value;

        const skillData = {
            'materias_id': currentSubject,
            'periodo_id': periodSelected,
            'titulo': title,
            'porcentaje': percentage,
            'descripcion': `${description}`
        }

        console.log(JSON.stringify(skillData));
        fetch(`${apiUrl}actualizarCompetencia/${skillId}`, {
            method: 'PUT', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });

}

function addRating () {
    event.preventDefault();
    let rating = document.getElementById('rating').value;
    let type = document.getElementById('type').value;
    let period = urlValues.get('period');
    if (rating > 10) { 
        alert('El valor de la nota no debe ser superior a 10');
    }
    else {
        const ratingData = {
            'materia_id': currentSubject,
            'periodo_id': period,
            'competencia_id': skillId,
            'estudiantes_id': student,
            'tipo_nota': type,
            'nota': rating
            }
            console.log(JSON.stringify(ratingData));
        fetch(`${apiUrl}crearNota/`, {
            method: 'POST', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ratingData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });
    }
}

function editRating () {
    event.preventDefault();
    let rating = document.getElementById('ratingEdit').value;
    let type = document.getElementById('typeEdit').value;
    let period = urlValues.get('period');
    if(rating > 10){
        alert('El valor de la nota no debe ser mayor a 10');
    }
    else{
        const ratingData = {
            'materia_id': currentSubject,
            'periodo_id': period,
            'competencia_id': skillId,
            'estudiantes_id': student,
            'tipo_nota': type,
            'nota': rating
            }
            console.log(JSON.stringify(ratingData));
        fetch(`${apiUrl}actualizarNota/${ratingId}`, {
            method: 'PUT', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ratingData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            window.localStorage.setItem('rel', 1);
            window.close();
        });
    }
}