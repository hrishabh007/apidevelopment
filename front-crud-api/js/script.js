const apiUrl = 'http://localhost:3000/api/users';

const userForm = document.querySelector('.loginForm');

const userRegisterForm = document.querySelector('.registerForm');

// 🔹 Auto redirect if token exists
if (localStorage.getItem('token')) {
    window.location.href = '/students';
}

if (userRegisterForm) {
    userRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const res = await fetch(apiUrl + '/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, email, password})
        })
        const data = await res.json();
        console.log(data);
        if (res.ok) {
            alert('User registered successfully');
            window.location.href = '/';
        } else {
            alert(data.message || 'Registration failed');
        }
    })


}

if (userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const res = await fetch(apiUrl + '/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})  // FIXED
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);

            // REDIRECT HERE
            window.location.href = '/students';
        } else {
            alert(data.message || 'Login failed');
        }
    });


}
