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

    ajaxResponse: function (url, params, response) {
        return {
            last_page: response.totalPages,
            data: response.students
        };
    },
    layout: "fitColumns",
    printAsHtml: true,
    printHeader: "<h1>Example Table Header<h1>",
    printFooter: "<h2>Example Table Footer<h2>",
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
        {title: "First Name", field: "first_name",headerFilter:true},
        {title: "Email", field: "email"},
        {title: "Gender", field: "gender"},
        {
            title: "Action",
            formatter: function (cell) {
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
//Print button
document.querySelector("#print-table").addEventListener("click", function () {
    table.print(false, true)
})
//trigger download of data.csv file
document.getElementById("download-csv").addEventListener("click", function(){
    table.download("csv", "data.csv");
});

//trigger download of data.json file
document.getElementById("download-json").addEventListener("click", function(){
    table.download("json", "data.json");
});

//trigger download of data.xlsx file
document.getElementById("download-xlsx").addEventListener("click", function(){
    table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
});

//trigger download of data.pdf file
document.getElementById("download-pdf").addEventListener("click", function(){
    table.download("pdf", "data.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"Example Report", //add title to report
    });
});

//trigger download of data.html file
document.getElementById("download-html").addEventListener("click", function(){
    table.download("html", "data.html", {style:true});
});