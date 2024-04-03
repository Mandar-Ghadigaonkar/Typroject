function registerUser() {
    const name = document.getElementById("name").value;
    const clas = document.getElementById("clas").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const err = document.getElementById('err')


    const userData = {
        name: name,
        clas: clas,
        contact: contact,
        email: email,
        password: password
    };


    fetch('http://localhost:8000/userss', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');

            }
            return response.json();
        })
        .then(data => {
            console.log('Registration successful:', data);

            // window.location.href = 'sigin.html';
            // Optionally, you can redirect the user or show a success message here
        })
        .catch(error => {
            console.error('Registration error:', error);
            // err.innerHTML="password not tmatch";
            // Optionally, you can display an error message to the user
        });
}