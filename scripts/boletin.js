const usId = window.sessionStorage.getItem('usuariosLogId');
const apiUrl = window.localStorage.getItem('apiUrl');
const urlValues = new URLSearchParams(window.location.search);
const studentId = urlValues.get('studentId');

let studentName, studentNuip, grade, gradeName; 

function subject (string) {
    const palabras = string.split(' ');
    const palabrasSinUltimasDos = palabras.slice(0, -2);
    return palabrasSinUltimasDos.join(' ');
}



function tableNotas(materia, c1, c2, c3, c4, c5, e, n1, n2, n3, n4, n5, ne, F1, R1, F2, R2, F3, R3, F4, R4, Ft, ih) {


    const table = document.createElement('table');
    table.id = 'boletin';
    table.classList.add('boletin');

    // Crear el encabezado de la tabla (thead)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Subject', 'I.H', 'P I', 'Rec', 'P II', 'Rec', 'P III', 'Rec', 'P IV', 'Rec', 'Final'];
    headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Crear el cuerpo de la tabla (tbody)
    const tbody = document.createElement('tbody');

    // Datos de las filas
    const rowsData = [
    {
        className: 'subjectrow',
        cells: [
        { className: 'subjectname', content: materia },
        {content: ih+" h"},
        {content: F1},
        {content: R1},
        {content: F2},
        {content: R2},
        {content: F3},
        {content: R3},
        {content: F4},
        {content: R4},
        {className: 'finalAvg' ,content: Ft}
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'C1'},
        { className: 'skills', content: c1, colspan: 9},
        { content: n1>0?n1:"" }
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'C2'},
        { className: 'skills', content: c2, colspan: 9  },
        { content: n2>0?n2:'' }
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'C3'},
        { className: 'skills', content: c3, colspan: 9 },
        { content: n3>0?n3:'' }
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'C4'},
        { className: 'skills', content: c4, id: 'skill4', colspan: 9  },
        { content: n4>0?n4:'' }
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'C5'},
        { className: 'skills', content: c5, id: 'skill5', colspan: 9  },
        { content: n5>0?n4:'' }
        ]
    },
    {
        className: 'skillrow',
        cells: [
        { className: 'tit', content: 'Assessment'},
        { className: 'skills', content: '', id: 'skill6', colspan: 9  },
        { content: ne>0?ne:"" }
        ]
    }
    ];

    rowsData.forEach(rowData => {
    const row = document.createElement('tr');
    row.className = rowData.className;

    rowData.cells.forEach(cellData => {
        const cell = document.createElement('td');
        cell.textContent = cellData.content;

        if (cellData.className) {
        cell.className = cellData.className;
        }

        if (cellData.className === "finalAvg" && cellData.content < 6) {
            cell.style.backgroundColor = '#DB4040';
            cell.style.fontWeight = 'bold';
        }

        if (cellData.colspan) {
        cell.setAttribute('colspan', cellData.colspan);
        }

        if (cellData.id) {
        cell.id = cellData.id;
        }

        row.appendChild(cell);
    });

    tbody.appendChild(row);
    });

    // Agregar el encabezado y el cuerpo a la tabla
    table.appendChild(thead);
    table.appendChild(tbody);

    // Agregar la tabla al documento HTML (en este ejemplo, al body)
    //document.body.appendChild(table);
    document.getElementById('tabla').appendChild(table);
}



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

fetch(`${apiUrl}estudianteIdGrado/${studentId}`)
.then(response => response.json())
.then(data => {

    materias(data)

})

function materias(data) {
    studentName = data['estudiante'][0]['nombre_estudiante']+" "+data['estudiante'][0]['apellido_estudiante'];
    studentNuip = data['estudiante'][0]['nuip_estudiante'];
    grade = data['estudiante'][0]['id'];
    gradeName = data['estudiante'][0]['nombre_grado'];

    //grade = 31
    document.getElementById('studentName').textContent = studentName;
    document.getElementById('studentNuip').textContent = studentNuip;
    document.getElementById('studentGrade').textContent = dicGrade(gradeName);

    fetch(`${apiUrl}materiasGrado/${grade}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let subjectId;
        period = 2;
        let subjectName;
        let subjects = data['materias'];
        let finalAverage = 0;
        let termAverage = 0;

        console.log(subjects[0]['id'])

        for (let i = 0; i < subjects.length; i++) {

            subjectId = subjects[i]['id'];
            subjectName = subject(subjects[i]['nombre_materia']);
            let ih = subjects[i]['intensidad']

            if(subjectName === "SCHOOL BEHAVIOR") {
                fetch(`${apiUrl}usuarioId/${subjects[i]['usuario_id']}`).then(response => response.json())
                .then(data => {
                    document.getElementById('teacherName').textContent = `${data.usuario.nombre_usuario} ${data.usuario.apellido_usuario}`
                })
            }

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
                termAverage += skillAverage/subjects.length;
                finalAverage += average/subjects.length;
           
                console.log('rec'+skills.R.rating + ' average')
          
            console.log(F2.toFixed(2))
                tableNotas(subject(subjects[i]['nombre_materia']), skills.C1.skill, skills.C2.skill, skills.C3.skill, skills.C4.skill, skills.C5.skill, skills.E.skill, skills.C1.rating, skills.C2.rating, skills.C3.rating, skills.C4.rating, skills.C5.rating, skills.E.rating, F1.toFixed(2), skills1.R.rating, F2.toFixed(2), skills2.R.rating, F3.toFixed(2), skills3.R.rating, F4.toFixed(2), skills4.R.rating, average.toFixed(2), ih)
                document.getElementById('finalAverage').textContent= finalAverage.toFixed(2);
                document.getElementById('termAverage').textContent= termAverage.toFixed(2);
            })

      
        }

        console.log(termAverage)

        //escribir final y term average
        
    })

}


document.addEventListener("DOMContentLoaded", () => {
    // Escuchamos el click del botón
    const $boton = document.querySelector("#btnCrearPdf");
    $boton.addEventListener("click", () => {
        useCORS: true;
        const $elementoParaConvertir = document.getElementById('reportcard'); 
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
                    format: "a3",
                    orientation: 'portrait' 
                }, 

               

            })
            .from($elementoParaConvertir)
            .save()
            .catch(err => console.log(err));
    });
});

function dicGrade (grade) {
    const gradeNumber = {
        prekinder: 'PREKINDER',
        kinder: 'KINDER',
        transicion: 'TRANCISION',
        primero: 1,
        segundo: 2,
        tercero: 3,
        cuarto: 4,
        quinto: 5,
        sexto: 6,
        septimo: 7,
        octavo: 8,
        noveno: 9,
        decimo: 10,
        once: 11
      };

     let gradeLetter = grade.toLowerCase().split(' ');
  

     
    return  `${gradeNumber[gradeLetter[0]]}° ${gradeLetter[1].toUpperCase()}`;
}