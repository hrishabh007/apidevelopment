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
$(document).ready(function () {

    $('#userTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/api/students',
            type: 'GET',
            dataSrc: function (json) {
                console.log(json);
                return json.students; // IMPORTANT FIX
            }
        },

        columns: [
            { data: 'first_name' },
            { data: 'email' },
            { data: 'gender' },

            {
                data: '_id',
                render: function (id, type, row) {
                    return `
                        <button onclick="viewUser('${id}')" class="btn btn-sm btn-primary">View</button>
                        <button onclick="updateUser('${id}')" class="btn btn-sm btn-warning">Update</button>
                        <button onclick="deleteUser('${id}')" class="btn btn-sm btn-danger">Delete</button>
                    `;
                }
            }
        ]
    });

});
