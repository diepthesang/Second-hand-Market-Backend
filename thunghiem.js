// 

const { getPostsByCateChildId } = require("./src/services/common.service");
const { removePost } = require("./src/services/user.service");

const fs = require('fs');



// console.log(Date.now());

// getPostsByCateChildId(2).then(data => console.log(data[0].PostImages)).catch()

// socket => use


// removePost(245, 'ba2896d3-f1da-4c7c-a2bd-35b62fa956d5').then(data => console.log(data)).catch();


// console.log(__dirBaseRoot);

// fs.unlink(`${__dirBaseRoot}/upload/1667615539477-332723284-z3853080586852_7181e5fb3fe603c68ec483f27eda986d.jpg`, (err => {
//   if (err) console.log(err);
//   else {
//     console.log("\nDeleted file: example_file.txt");

//     // Get the files in current directory
//     // after deletion
//     // getFilesInDirectory();
//   }
// }));