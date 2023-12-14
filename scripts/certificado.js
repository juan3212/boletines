const urlValues = new URLSearchParams(window.location.search);
const studentId = urlValues.get('studentId');
const apiUrl = window.localStorage.getItem('apiUrl');
let studentName, studentNuip, grade, gradeName; 

const subjectGroup = [
  {name: 'ARTS', type: 'arts'}, 
  {name:'RECREATION AND SPORT', type: 'sport'}, 
  {name:'HUMANITIES AND LANGUAGES', type:'language'},
  {name:'TECHNOLOGY AND INFORMATIC', type:'tech'}, 
  {name:'MATH', type:'math'}, 
  {name:'NATURAL AND ENVIROMENT SCIENCE', type:'science'},
  {name:'SOCIAL AND CULTURAL SCIENCE', type:'social'}, 
  {name:'SCHOOL ENVIROMENT', type: 'environment'}
];

const subjectGroupPreschool = [
  { name: 'STETIC AND ARTISTIC DIMENSION', type: 'stetic' },
  { name: 'BODILY DIMENSION', type: 'bodily' },
  { name: 'COMMUNICATIVE DIMENSION', type: 'communicative' },
  { name: 'COGNITIVE DIMENSION', type: 'cognitive' },
  { name: 'MANAGERIAL', type: 'managerial' }
];


const subjectsTree = [
  { name: 'ARTISTIC EXPRESSION', type: 'arts' },
  { name: 'ARTS', type: 'arts' },
  { name: 'DRAMA', type: 'arts' },
  { name: 'MUSIC', type: 'arts' },
  { name: 'DANCING', type: 'arts' },
  { name: 'MUSICAL DRAMA', type: 'sport' },
  { name: 'ARTISTIC EXPRESSION', type: 'arts' },
  { name: 'ARTS', type: 'stetic' },
  { name: 'DRAMA', type: 'stetic' },
  { name: 'MUSIC', type: 'stetic' },
  { name: 'PHYSICAL EDUCATION', type: 'sport' },
  { name: 'CALLIGRAPHY', type: 'language' },
  { name: 'ENGLISH', type: 'language' },
  { name: 'ENGLISH USAGE', type: 'language' },
  { name: 'HUMANITIES AND SPANISH LANGUAGE', type: 'language' },
  { name: 'SPANISH', type: 'language'},
  { name: 'LITERACY', type: 'language' },
  { name: 'PHILOSOPHY', type: 'language' },
  { name: 'FRENCH', type: 'language' },
  { name: 'INTERACTIVE ENGLISH', type: 'language' },
  { name: 'SYSTEMS AND DESIGN', type: 'tech' },
  { name: 'MATH', type: 'math' },
  { name: 'SABER', type: 'math' },
  { name: 'MATHEMATICAL LOGIC CONNECTION', type: 'math' },
  { name: 'PHYSICS', type: 'SCIENCE' },
  { name: 'CHEMISTRY', type: 'SCIENCE' },
  { name: 'SCIENCE', type: 'SCIENCE' },
  { name: 'SOCIAL STUDIES', type: 'social' },
  { name: 'ETHICS AND SOCIAL COEXISTENCE', type: 'social' },
  { name: 'RELIGION', type: 'social' },
  { name: 'SOCIAL AND CULTURAL ENVIRONMENT', type: 'social' },
  { name: 'POLITICAL SCIENCES', type: 'social' },
  { name: 'SCHOOL BEHAVIOR', type: 'ENVIRONMENT' },
  { name: "PARENT'S COMMITMENT", type: 'ENVIRONMENT' },
  { name: 'FINE MOTOR', type: 'arts' },
  { name: 'PHYSICAL EDUCATION', type: 'bodily' },
  { name: 'PHYSICAL EDUCATION', type: 'communicative' },
  { name: 'ENGLISH', type: 'communicative' },
  { name: 'LITERACY', type: 'communicative' },
  { name: 'SOCIAL AND CULTURAL ENVIRONMENT', type: 'cognitive' },
  { name: 'MATHEMATICAL LOGIC CONNECTION', type: 'cognitive' },
  { name: 'SCHOOL BEHAVIOR', type: 'MANAGERIAL' },
  { name: "PARENT'S COMMITMENT", type: 'MANAGERIAL' }
];

function writePersonalData(data) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();
  const fullDate = `${year}-${month}-${day}`;
  const commentGraduated = 'FELICITACIONES. GRADUADO. "BACHILLER BILINGÜE ACADÉMICO CON ÉNFAIS ARTÍSTICO"';
  const commentText = 'FELICITACIONES. SE PROMUEVE AL SUGUIENTE GRADO.'

  const studentNameSpace = document.getElementById('studentName');
  const studentNuipSpace = document.getElementById('studentNuip');
  const courseSpace = document.getElementById('studentCourse');
  const yearSpace = document.getElementById('year');
  const dateSpace = document.getElementById('date');
  const commentSpace = document.getElementById('comment');

  const studentName = `${data.nombre_estudiante} ${data.apellido_estudiante}`;
  const studentNuip = `${data.nuip_estudiante}`;
  const course = data.nombre_grado;

  studentNameSpace.innerHTML = `${studentName}`;
  studentNuipSpace.innerText = `NUIP. ${studentNuip}`;
  courseSpace.innerText = course;
  yearSpace.innerText = year;
  dateSpace.innerText = fullDate;
  commentSpace.innerText = course.includes('ONCE')?commentGraduated:commentText;
}



function subject (string) {
  const palabras = string.split(' ');
  const palabrasSinUltimasDos = palabras.slice(0, -2);
  return palabrasSinUltimasDos.join(' ');
}

function evaluation(grade) {
  if (grade >= 1 && grade < 6) {
    return 'DESEMPEÑO BAJO';
  } else if (grade >= 6 && grade < 8) {
    return 'DESEMPEÑO BASICO';
  } else if (grade >= 8 && grade < 9.3) {
    return 'DESEMPEÑO ALTO';
  } else if (grade >= 9.3) {
    return 'DESEMPEÑO SUPERIOR';
  } else {
    return 'Grado no válido'; // Manejo de casos no contemplados
  }
}

function gradeTable(subjectGroup) {  
  subjectGroup.forEach(element => {
    const main = document.getElementsByTagName('main');
    const table = document.createElement('table');
    table.setAttribute('id', `subject-${element.type}`);
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headerSubject = document.createElement('th');
    const headerFinal = document.createElement('th');
    const headerEvaluation = document.createElement('th');
    headerSubject.textContent = element.name;
    headerFinal.textContent = 'Final';
    headerEvaluation.textContent = 'Evaluation';
    headerSubject.setAttribute('colspan', 2);
    headerRow.appendChild(headerSubject);
    headerRow.appendChild(headerFinal);
    headerRow.appendChild(headerEvaluation);
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
    main[0].appendChild(table);
  });
}

function gradeTableRows(subjectData){
  const table = document.getElementById(`subject-${subjectData.type}`);
  const tableBody = document.createElement('tbody');
  const tableRow = document.createElement('tr');
  const tableCellEmpty = document.createElement('td');
  const tableCellSubject = document.createElement('td');
  const tableCellFinal = document.createElement('td');
  const tableCellEvaluation = document.createElement('td');
  tableCellEmpty.setAttribute('class', 'empty');
  tableCellSubject.textContent = subjectData.subject;
  tableCellFinal.textContent = subjectData.grade;
  tableCellEvaluation.textContent = subjectData.evaluation;

  tableCellFinal.className = "nota"

  tableRow.appendChild(tableCellEmpty);
  tableRow.appendChild(tableCellSubject);
  tableRow.appendChild(tableCellFinal);
  tableRow.appendChild(tableCellEvaluation);
  tableBody.appendChild(tableRow);
  table.appendChild(tableBody);
}

gradeTable(subjectGroup);

// fetch(`${apiUrl}estudiantesMaterias/${studentId}`)
// .then(response => response.json())
// .then(data => {
//     grade(data);
// });

// function grade(datos) {

//   writePersonalData(datos[0]);

//   datos.forEach(element => {
//     fetch(`${apiUrl}avgEstudianteMateria/${studentId}/${element.id}`)
//     .then(response => response.json())
//     .then(data => {
//       printGrade(data);
//     })
//   });
// }

function filtrarNotas(notas, titulo, periodo) {
  let rating = 0;
  let skillDesc = "";
  let percent = 0;
  let cont = 0;
  const notasFiltro = notas.notas;
  notasFiltro.filter(objeto => objeto.titulo === titulo && objeto.periodo_id === periodo).map(function(x) {
      rating += x.nota;
      skillDesc = x.descripcion;
      percent = x.porcentaje
      cont ++
  })

  cont>0?cont=cont:cont=1;

  const res = {
      rating: (rating/cont).toFixed(2),
      skill: skillDesc,
      percent: percent
  }
  
  return res;
}

fetch(`${apiUrl}estudiantesMaterias/${studentId}`)
.then(response => response.json())
.then(data => {
    materias(data);
});

function materias(data) {

  writePersonalData(data[0]);

  let finalAverage = 0;
  let termAverage = 0;

      for (let i = 0; i < data.length; i++) {

          const subjectId = data[i].id;
          const totalSub = data.length;
          const subjectName = data[i].nombre_materia;


          fetch(`${apiUrl}notasEstudianteMateria/${studentId}/${subjectId}`)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              console.log(filtrarNotas(data, 'E', 2));
              let period = 4;
              let skills = {
                  C1: filtrarNotas(data, 'C1', period),
                  C2: filtrarNotas(data, 'C2', period),
                  C3: filtrarNotas(data, 'C3', period),
                  C4: filtrarNotas(data, 'C4', period),
                  C5: filtrarNotas(data, 'C5', period),
                  E: filtrarNotas(data, 'E', period),
                  R: filtrarNotas(data, 'R', period)
              }

              let skills1 = {
                  C1: filtrarNotas(data, 'C1', 1),
                  C2: filtrarNotas(data, 'C2', 1),
                  C3: filtrarNotas(data, 'C3', 1),
                  C4: filtrarNotas(data, 'C4', 1),
                  C5: filtrarNotas(data, 'C5', 1),
                  E: filtrarNotas(data, 'E', 1),
                  R: filtrarNotas(data, 'R', 1)
              }

              let skills2 = {
                  C1: filtrarNotas(data, 'C1', 2),
                  C2: filtrarNotas(data, 'C2', 2),
                  C3: filtrarNotas(data, 'C3', 2),
                  C4: filtrarNotas(data, 'C4', 2),
                  C5: filtrarNotas(data, 'C5', 2),
                  E: filtrarNotas(data, 'E', 2),
                  R: filtrarNotas(data, 'R', 2)
              }

              let skills3 = {
                  C1: filtrarNotas(data, 'C1', 3),
                  C2: filtrarNotas(data, 'C2', 3),
                  C3: filtrarNotas(data, 'C3', 3),
                  C4: filtrarNotas(data, 'C4', 3),
                  C5: filtrarNotas(data, 'C5', 3),
                  E: filtrarNotas(data, 'E', 3),
                  R: filtrarNotas(data, 'R', 3)
              }

              let skills4 = {
                  C1: filtrarNotas(data, 'C1', 4),
                  C2: filtrarNotas(data, 'C2', 4),
                  C3: filtrarNotas(data, 'C3', 4),
                  C4: filtrarNotas(data, 'C4', 4),
                  C5: filtrarNotas(data, 'C5', 4), 
                  E: filtrarNotas(data, 'E', 4),
                  R: filtrarNotas(data, 'R', 4)
              }

                  let skillAverage = skills.C1.rating*(skills.C1.percent/100)+skills.C2.rating*(skills.C2.percent/100)+skills.C3.rating*(skills.C3.percent/100)+skills.C4.rating*(skills.C4.percent/100)+skills.C5.rating*(skills.C5.percent/100)+skills.E.rating*(skills.E.percent/100);
                  let F1 = skills1.C1.rating*(skills1.C1.percent/100)+skills1.C2.rating*(skills1.C2.percent/100)+skills1.C3.rating*(skills1.C3.percent/100)+skills1.C4.rating*(skills1.C4.percent/100)+skills1.C5.rating*(skills1.C5.percent/100)+skills1.E.rating*(skills1.E.percent/100);
                  let F2 = skills2.C1.rating*(skills2.C1.percent/100)+skills2.C2.rating*(skills2.C2.percent/100)+skills2.C3.rating*(skills2.C3.percent/100)+skills2.C4.rating*(skills2.C4.percent/100)+skills2.C5.rating*(skills2.C5.percent/100)+skills2.E.rating*(skills2.E.percent/100);
                  let F3 = skills3.C1.rating*(skills3.C1.percent/100)+skills3.C2.rating*(skills3.C2.percent/100)+skills3.C3.rating*(skills3.C3.percent/100)+skills3.C4.rating*(skills3.C4.percent/100)+skills3.C5.rating*(skills3.C5.percent/100)+skills3.E.rating*(skills3.E.percent/100);
                  let F4 = skills4.C1.rating*(skills4.C1.percent/100)+skills4.C2.rating*(skills4.C2.percent/100)+skills4.C3.rating*(skills4.C3.percent/100)+skills4.C4.rating*(skills4.C4.percent/100)+skills4.C5.rating*(skills4.C5.percent/100)+skills4.E.rating*(skills4.E.percent/100);
             
               let average1 = skills1.R.rating>F1?parseFloat(skills1.R.rating):F1; 
               let average2 = skills2.R.rating>F2?parseFloat(skills2.R.rating):F2; 
               let average3 = skills3.R.rating>F3?parseFloat(skills3.R.rating):F3; 
               let average4 = skills4.R.rating>F4?parseFloat(skills4.R.rating):F4;
           

              let average = (average1 + average2 + average3 + average4) / period;
              let print= {
                  name: subjectName,
                  finalAverage: average.toFixed(2)
              }

              printGrade(print);
      
          })

    
      }


}


function printGrade(datos) {
  const subjects = subject(datos.name);
  const grade = datos.finalAverage;
  const evaluations = evaluation(grade);
  const type = getTypeFromName(subjects);
  gradeTableRows({type:type, subject: subjects, grade: grade, evaluation: evaluations})
}

function getTypeFromName(name) {
  for (const subject of subjectsTree) {
    if (subject.name === name) {
      return subject.type.toLowerCase();
    }
  }
  return null;
}

function printDoc(){
  useCORS: true;
  const $elementoParaConvertir = document.getElementById('printArea'); 
  html2pdf()
      .set({
         margin: [0.2,0,0.4,0],
          //margin: 0.3,
          html2canvas: {
              scale: 4, 
              useCORS: true,
              letterRendering: true,
          },
        
          jsPDF: {
              unit: "in",
              format: "letter",
              orientation: 'portrait' 
          }, 

         

      })
      .from($elementoParaConvertir)
      .save()
      .catch(err => console.log(err));
}

