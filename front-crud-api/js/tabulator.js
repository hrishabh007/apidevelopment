const dataUrl = 'http://localhost:3000/api/students';

var table = new Tabulator("#userTable", {
    ajaxURL: dataUrl,

    pagination: true,
    paginationMode: "remote",
    paginationSize: 5,
    paginationSizeSelector: [5, 10, 15],

    // map request params
    dataSendParams: {
        page: "page",   // default is already "page", but explicit is fine
        size: "limit"   // 👈 this is the important one
    },

    ajaxResponse: function(url, params, response){
        return {
            last_page: response.totalPages,
            data: response.students
        };
    },

    layout: "fitColumns",
    columns: [
        {
            title: "S.No",
            width: 60,
            formatter: function (cell) {
                var table = cell.getTable();
                var page = table.getPage() || 1;
                var size = table.getPageSize() || 5;
                var pos = cell.getRow().getPosition(false);
                return ((page - 1) * size) + pos;
            }
        },
        {title: "First Name", field: "first_name"},
        {title: "Email", field: "email"},
        {title: "Gender", field: "gender"},
        {
            title: "Action",
            formatter: function(cell){
                var rowData = cell.getData();
                var id = rowData._id || rowData.id;

                return `
                <button onclick="viewUser('${id}')" class="btn btn-sm btn-primary">View</button>
                <button onclick="updateUser('${id}')" class="btn btn-sm btn-warning">Update</button>
                <button onclick="deleteUser('${id}')" class="btn btn-sm btn-danger">Delete</button>
            `;
            }
        }
    ]
});