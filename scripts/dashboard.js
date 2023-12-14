const url = window.location.search;
const urlValues = new URLSearchParams(url);
const usId = window.sessionStorage.getItem('usuariosLogId');
const apiUrl = window.localStorage.getItem('apiUrl');
const currentSubject = urlValues.get('subject');
let periodo = 0;

//verificar identificacion del usuario
if (usId === undefined || usId === null) {
cerrarSesion();
}

function cerrarSesion() {
window.sessionStorage.clear();
window.location.href = '../index.html';
}

fetch(`${apiUrl}usuarioId/${usId}`)
.then(response => response.json()) 
.then(data => {
  usuario(data)
})

function usuario(datos) {
  let nombreProfesor = `${datos.usuario.nombre_usuario} ${datos.usuario.apellido_usuario}`;
  const nombre = document.querySelectorAll("#nombre-usuario");

  nombre.forEach((elemento) => {
    elemento.textContent = nombreProfesor;
  });

}

//mostrar u ocultar las secciones
if(currentSubject === null) {
  document.getElementById('competencias').style.display = 'none';
  window.sessionStorage.removeItem('periodo');

}else {
  document.getElementById('competencias').style.display = 'block';
  document.getElementById('materias').style.display = 'none';
}

//filtro para buscar materias en cartas
document.getElementById('search-input-card').addEventListener('input', function() {
    var filterValue = this.value.toLowerCase();
    var materiasContainer = document.getElementById('materias-container');
    var materiasCards = materiasContainer.getElementsByClassName('card');

    for (var i = 0; i < materiasCards.length; i++) {
      var cardTitle = materiasCards[i].getElementsByClassName('card-title')[0];
      var materiaText = cardTitle.textContent.toLowerCase();

      if (materiaText.includes(filterValue)) {
        materiasCards[i].style.display = 'block';
      } else {
        materiasCards[i].style.display = 'none';
      }
    }
  });

//filtro para buscar materias en lista
document.getElementById('search-input-list').addEventListener('input', function() {
    var filterValue = this.value.toLowerCase();
    var materiasList = document.getElementById('materias-list');
    var materiasItems = materiasList.getElementsByTagName('a');

    for (var i = 0; i < materiasItems.length; i++) {
      var materiaText = materiasItems[i].textContent.toLowerCase();

      if (materiaText.includes(filterValue)) {
        materiasItems[i].style.display = 'block';
      } else {
        materiasItems[i].style.display = 'none';
      }
    }
  });

//abre ventana modal para los diferentes foormularios
function openForms(id) {

    var x=(screen.width/2)-250;
	
    var y=(screen.height/2)-200;

    window.open(`../views/forms.html?form=${id}&subject=${currentSubject}`, "Agregar materias", `width=400, height=500, left=${x}, top=${y}`)
}

//obtener datos de materia
fetch(`${apiUrl}materiasId/${currentSubject}`)
.then(response => response.json())
.then(data => {
  console.log(data)
  document.getElementById('subject-name').textContent = data.materia.nombre_materia;
})

//abre ventana modal para los diferentes foormularios de edicion
function openFormsEdit(id, subject, skill) {

  var x=(screen.width/2)-250;

  var y=(screen.height/2)-200;

  window.open(`../views/forms.html?form=${id}&subject=${subject}&skill=${skill}`, "Agregar materias", `width=400, height=500, left=${x}, top=${y}`)
}

// crear las tarjetas de las materias
function listMaterias(nombreMaterias, idMateria, intensidad, idsMaterias) {
  // Obtén una referencia al contenedor donde deseas agregar el elemento
  const container = document.getElementById('materias-container');

  // Crea el elemento div
  const divCol = document.createElement('div');
  divCol.classList.add('col');

  const a = document.createElement('a');
  a.setAttribute('href', `?subject=${idsMaterias}`);

  // Crea el elemento div con la clase "card" y "materias-card"
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'materias-card');

  // Crea el elemento de imagen con el atributo src
  let numeroImagen =  Math.floor(Math.random() * (7 - 1)) + 1; 
  const img = document.createElement('img');
  img.src = `../images/fondos-materias/fondo-${numeroImagen}.jpg`;
  img.height = 200;
  img.classList.add('card-img-top');

  // Crea el elemento div con la clase "card-body"
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');

  // Crea el elemento h5 con el título
  const h5 = document.createElement('h5');
  h5.classList.add('card-title');
  h5.textContent = 	nombreMaterias;

  // Crea el elemento p con el texto adicional
  const p = document.createElement('p');
  p.classList.add('card-text');
  p.textContent = `intensidad horaria: ${intensidad}`;

  const btn = document.createElement('a');
  btn.setAttribute('href', "#");
  btn.classList.add('btn');
  btn.classList.add('btn-danger');
  btn.textContent = 'Eliminar';
  btn.addEventListener('click', function() {
    $('#confirmModal').modal('show'); // Mostrar ventana modal al hacer clic en el botón "Eliminar"
    $('#subjectId').val(idMateria);
  });


  //crear elemento de id oculto
  const id = document.createElement('input');
  id.setAttribute('value', idMateria);
  id.setAttribute('type', 'hidden');

  // Agrega los elementos en la estructura de árbol apropiada
  divCardBody.appendChild(h5);
  divCardBody.appendChild(p);
  divCardBody.appendChild(btn);
  divCardBody.appendChild(id);
  divCard.appendChild(img);
  divCard.appendChild(divCardBody);
  a.appendChild(divCard);
  divCol.appendChild(a);

  // Agrega el elemento al contenedor
  container.appendChild(divCol);

}


  function delSubject() {
    let idMateria = document.getElementById('subjectId').value;
    fetch(`${apiUrl}eliminarMateria/${idMateria}`, {
      method: 'DELETE',
    })
      
    .then(() =>{
      window.location.reload();
    })
  }

  function delSkill() {
    let idskill = document.getElementById('subjectId').value;
    fetch(`${apiUrl}eliminarCompetencia/${idskill}`, {
      method: 'DELETE',
    })
      
    .then(() =>{
      window.location.reload();
    })
  }

  function minimize() {
    $('#confirmModal').modal('hide');
  }

//listar competencias
function listCompetencias(description, porcentaje, num, competeciaId, currentSubject) {  
  // Crear el elemento div.card
  const skillContainer = document.getElementById('competencias-container');

  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.style.width = "18rem";

  // Crear el elemento div.card-body
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.className = "card-body";

  // Crear el elemento h5.card-title
  const cardTitleH5 = document.createElement("h5");
  cardTitleH5.className = "card-title";
  cardTitleH5.textContent = "Competencia: "+num;

  // Crear el elemento h6.card-subtitle
  const cardSubtitleH6 = document.createElement("h6");
  cardSubtitleH6.className = "card-subtitle mb-2 text-body-secondary";
  cardSubtitleH6.textContent = `Porcentaje: ${porcentaje}%`

  // Crear el elemento p.card-text
  const cardTextP = document.createElement("p");
  cardTextP.className = "card-text";
  cardTextP.textContent = description;

   // Crear el elemento a.card-link (Notas)
   const delLinkA = document.createElement("a");
   delLinkA.href = `#`;
   delLinkA.className = "card-link";
   delLinkA.textContent = "eliminar";
   delLinkA.addEventListener('click', function() {
    //document.getElementById('modalText').textContent = '¿Estás seguro de que deseas eliminar esta competencia?';
    //document.getElementById('confirmDeleteBtn').onclick = delSkill(); 
    $('#confirmModal').modal('show'); // Mostrar ventana modal al hacer clic en el botón "Eliminar"
    $('#subjectId').val(competeciaId);
  });


  // Crear el elemento a.card-link (Notas)
  const notasLinkA = document.createElement("a");
  //notasLinkA.href = `./notas.html?skill=${competeciaId}&subject=${currentSubject}`;
  notasLinkA.className = "card-link";
  notasLinkA.textContent = "";
  

  // Crear el elemento a.card-link (Editar)
  const editarLinkA = document.createElement("a");
  editarLinkA.href = `#`;
  editarLinkA.className = "card-link";
  editarLinkA.textContent = "Editar";
  editarLinkA.addEventListener("click", function() {
    openFormsEdit(5,currentSubject, competeciaId);
  });

  // Agregar los elementos creados al árbol DOM
  cardBodyDiv.appendChild(cardTitleH5);
  cardBodyDiv.appendChild(cardSubtitleH6);
  cardBodyDiv.appendChild(cardTextP);
  cardBodyDiv.appendChild(delLinkA);
  cardBodyDiv.appendChild(notasLinkA);
  cardBodyDiv.appendChild(editarLinkA);
  cardDiv.appendChild(cardBodyDiv);

  // Agregar el elemento cardDiv al documento
  skillContainer.appendChild(cardDiv);
}
// obtener todas las materias
fetch(`${apiUrl}materiasUsuario/${usId}/`) 
.then(response => response.json())
.then(data => {
  mostrarMaterias(data)
});

function mostrarMaterias(datos){
  for(var i = 0; i < datos.materias.length; i++){
    const nombreMateria = datos.materias[i].nombre_materia;
    const idMateria = datos.materias[i].id; 
    const intensidad = datos.materias[i].intensidad;
    const idsMaterias = datos.materias[i].id;
    listMaterias(nombreMateria, idMateria, intensidad, idsMaterias);
  }
}

document.getElementById('periodo').addEventListener('change', function(e){
  const skillContainer = document.getElementById('competencias-container');
  skillContainer.innerHTML = "";
  periodo = e.target.value;
  window.sessionStorage.setItem('periodo', periodo);

  document.getElementById('notasPeriodo').setAttribute('href', `./notasex.html?subject=${currentSubject}&period=${periodo}`);

  console.log(periodo);
  fetch(`${apiUrl}competenciasMateriaPeriodo/${currentSubject}/${periodo}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    for(i = 0; i<data.competencia.length; i++){
      let descripcion = data.competencia[i].descripcion;
      let porcentaje = data.competencia[i].porcentaje;
      let competeciaId = data.competencia[i].id;
      let titulo = data.competencia[i].titulo;
      listCompetencias(descripcion, porcentaje, titulo, competeciaId, currentSubject);
    }
  })
})








