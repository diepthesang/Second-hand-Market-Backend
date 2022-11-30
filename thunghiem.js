// 

const { getPostsByCateChildId } = require("./src/services/common.service");
const { removePost } = require("./src/services/user.service");

const fs = require('fs');
const db = require("./src/db/models");
const { getUserInfo } = require("./src/services/admin.service");



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


// const setData = async () => {
//   try {
//     const data = await db.UserStatus.bulkCreate(
//       [
//         {
//           status: 'Active'
//         },
//         {
//           status: 'Ban'
//         }
//       ]
//     )

//     return data;
//   } catch (error) {

//   }
// }

// setData().then(data => console.log(data))


// getUserInfo().then(data => console.log(data))


const createUser = async () => {
  await db.User.bulkCreate(
    [
      {
        userId: 'rwrewrw',
        firstName: 'Diep',
        lastName: 'The Hoang Linh',
        email: 'sff'

      },
      {
        userId: 'rwrew232rw',
        firstName: 'Nguyen',
        lastName: 'Thi Chung',
        email: 'sff'
      },
      {
        userId: 'rw2rewrw',
        firstName: 'Hoang',
        lastName: 'Tam Dan',
        email: 'sff'

      },
    ]
  )
}

createUser().then(data => console.log(data))