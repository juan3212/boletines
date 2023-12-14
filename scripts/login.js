const apiUrl = localStorage.getItem('apiUrl');

function login () {
    event.preventDefault();

    let usuario = document.getElementById('username').value;
    let clave = document.getElementById('password').value;

    const datos = {
        'username': `${usuario}`,
        'password': `${clave}`
    }

    fetch(apiUrl+'usuariosLogId', {
        method: 'POST', // *GET,POST,PUT,DELETE,OPTIONS,HEAD,TRACE,CONNECT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.status)

        if(data.status === true) {
            window.sessionStorage.setItem('usuariosLogId', data.id);
            window.location.href = './views/dashboard.html'; 
          }
          else {
            alert('Usuario o contraseña incorrectos');
          }
    })
}

