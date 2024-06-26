const form = document.getElementById('registrationForm');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmpassword');
        const contactInput = document.getElementById('contact');

       
        contactInput.addEventListener('input', function (event) {
            const contactValue = event.target.value;

      
            const sanitizedValue = contactValue.replace(/\D/g, '');

         
            event.target.value = sanitizedValue;

          
            if (sanitizedValue.length > 10) {
                alert("Contact number should not exceed 10 digits");
                event.target.value = sanitizedValue.slice(0, 10); 
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.getElementById('name');
        
            nameInput.addEventListener('input', function(event) {
                const validName = event.target.value.replace(/[^a-zA-Z\s]/g, '');
                if (event.target.value !== validName) {
                    event.target.value = validName; // Reset the value to only valid characters
                    alert('Only alphabetic characters and spaces are allowed in names.');
                }
            });
        
            const contactInput = document.getElementById('contact');
            contactInput.addEventListener('input', function (event) {
                const contactValue = event.target.value;
                const sanitizedValue = contactValue.replace(/\D/g, '');
                event.target.value = sanitizedValue;
                if (sanitizedValue.length > 10) {
                    alert("Contact number should not exceed 10 digits");
                    event.target.value = sanitizedValue.slice(0, 10);
                }
            });
        
            // Add your existing form submission handler here
        });
        
        // Additional existing JavaScript for form handling and other validations can remain as is
        

        function registerUser() {
            const name = document.getElementById("name").value;
            const clas = document.getElementById("clas").value;
            const contact = document.getElementById("contact").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmpassword = document.getElementById("confirmpassword").value;
            const gender = document.querySelector('input[name="gender"]:checked').value;

            const userData = {
                name: name,
                clas: clas,
                contact: contact,
                email: email,
                password: password,
                confirmpassword: confirmpassword,
                gender: gender
            };

            fetch('http://localhost:8001/userss', {
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
                    
                })
                .catch(error => {
                    
                    const errorMessageDiv = document.getElementById('errorMessage');
                    errorMessageDiv.textContent = error.message;
                    console.error('Registration error:', error);
                   
                });
        }