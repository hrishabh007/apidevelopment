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
        processing: true,
        serverSide: true,

        // 👇 page size settings
        pageLength: 5,                 // default page size
        lengthMenu: [ [5, 10, 15],     // page size values
            [5, 10, 15] ],   // labels shown in the dropdown

        ajax: function (data, callback) {
            const page  = Math.floor(data.start / data.length) + 1;
            const limit = data.length;
            const search = data.search.value || '';

            const url = new URL('http://localhost:3000/api/students');
            url.searchParams.set('page', page);
            url.searchParams.set('limit', limit);
            if (search) url.searchParams.set('search', search);

            fetch(url)
                .then(res => res.json())
                .then(json => {
                    callback({
                        draw: data.draw,
                        recordsTotal: json.total,
                        recordsFiltered: json.total,
                        data: json.students
                    });
                })
                .catch(err => {
                    console.error(err);
                    callback({
                        draw: data.draw,
                        recordsTotal: 0,
                        recordsFiltered: 0,
                        data: []
                    });
                });
        },

        columns: [
            {
              data: null,
              title: 'S.No',
                render: function (data,type,row,meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: 'first_name' },
            { data: 'email' },
            { data: 'gender' },
            {
                data: '_id',
                render: function (id) {
                    return `
                        <button onclick="viewUser('${id}')" class="btn btn-sm btn-primary">View</button>
                        <button onclick="updateUser('${id}')" class="btn btn-sm btn-warning">Update</button>
                        <button onclick="deleteUser('${id}')" class="btn btn-sm btn-danger">Delete</button>
                    `;
                }
            }
        ],
        layout: {
            topStart: {
                buttons: ['copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5']
            }
        }
    });
});