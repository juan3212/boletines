const usId = window.sessionStorage.getItem('usuariosLogId');

const apiUrl = window.localStorage.getItem('apiUrl');

fetch(`${apiUrl}estudiantes`)
.then(response => response.json())
.then(data => {
    var table = document.getElementById("datos-estudiantes");
    console.log(data);
   for(i=0; i < 100; i++){
                    var row = table.insertRow();
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    

                    cell1.innerHTML = data['estudiantes'][i]['id'];
                    cell2.innerHTML = data['estudiantes'][i]['nuip_estudiante'];
                    cell3.innerHTML = data['estudiantes'][i]['nombre_estudiante'];
                    cell4.innerHTML = data['estudiantes'][i]['apellido_estudiante'];
                    cell5.innerHTML = '10'
   }


   
})

document.addEventListener("DOMContentLoaded", () => {
    // Escuchamos el click del botón
    const $boton = document.querySelector("#btnCrearPdf");
    $boton.addEventListener("click", () => {
        const $elementoParaConvertir = document.getElementById('vista-estudiantes'); // <-- Aquí puedes elegir cualquier elemento del DOM
        html2pdf()
            .set({
                margin: 1,
                filename: 'documento.pdf',
        
                html2canvas: {
                    scale: 3, // A mayor escala, mejores gráficos, pero más peso
                    letterRendering: true,
                },
                jsPDF: {
                    unit: "in",
                    format: "legal",
                    orientation: 'portrait' // landscape o portrait
                }
            })
            .from($elementoParaConvertir)
            .save()
            .catch(err => console.log(err));
    });
});