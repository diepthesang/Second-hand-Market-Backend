// // // 

const { removePostByPostId, removePostsByUserId } = require("./src/services/admin.service");

// const { v4: uuidv4 } = require('uuid');
// const { sequelize } = require("./src/db/models");
// const db = require("./src/db/models");
// const { searchUserByLastname } = require("./src/services/user.service");

// // const { getPostsByCateChildId } = require("./src/services/common.service");
// // const { removePost } = require("./src/services/user.service");

const fs = require('fs');
// // const db = require("./src/db/models");
// // const { getUserInfo } = require("./src/services/admin.service");
// // const { Op } = require("sequelize");
// // const { sequelize } = require("./src/db/models");


// // // console.log(Date.now());

// // // getPostsByCateChildId(2).then(data => console.log(data[0].PostImages)).catch()

// // // socket => use


// // // removePost(245, 'ba2896d3-f1da-4c7c-a2bd-35b62fa956d5').then(data => console.log(data)).catch();


// // // console.log(__dirBaseRoot);

// // // fs.unlink(`${__dirBaseRoot}/upload/1667615539477-332723284-z3853080586852_7181e5fb3fe603c68ec483f27eda986d.jpg`, (err => {
// // //   if (err) console.log(err);
// // //   else {
// // //     console.log("\nDeleted file: example_file.txt");

// // //     // Get the files in current directory
// // //     // after deletion
// // //     // getFilesInDirectory();
// // //   }
// // // }));


// // // const setData = async () => {
// // //   try {
// // //     const data = await db.UserStatus.bulkCreate(
// // //       [
// // //         {
// // //           status: 'Active'
// // //         },
// // //         {
// // //           status: 'Ban'
// // //         }
// // //       ]
// // //     )

// // //     return data;
// // //   } catch (error) {

// // //   }
// // // }

// // // setData().then(data => console.log(data))


// // // getUserInfo().then(data => console.log(data))


// const createUser = async () => {
//   await db.User.bulkCreate(
//     [
//       {
//         userId: uuidv4(),
//         firstName: 'Diep',
//         lastName: 'The Hoang Linh',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Nguyen',
//         lastName: 'Thi Chung',
//         email: 'sff'
//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Diep',
//         lastName: 'The Hoang Linh',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Nguyen',
//         lastName: 'Thi Chung',
//         email: 'sff'
//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Diep',
//         lastName: 'The Hoang Linh',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Nguyen',
//         lastName: 'Thi Chung',
//         email: 'sff'
//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//       {
//         userId: uuidv4(),
//         firstName: 'Hoang',
//         lastName: 'Tam Dan',
//         email: 'sff'

//       },
//     ]
//   )
// }

// createUser().then(data => console.log(data))


// // function formatCash(str) {
// //   return str.split('').reverse().reduce((prev, next, index) => {
// //     return ((index % 3) ? next : (next + '.')) + prev
// //   })
// // }


// // // console.log(formatCash(String(1000000000)))


// // // const removeAndJoin = async (id) => {
// // //   try {
// // //     const data = await db.Post.findAll(
// // //       {
// // //         where: {
// // //           id: id
// // //         },
// // //         raw: true,
// // //         nest: true,
// // //         include: [
// // //           {
// // //             model: db.Cart,
// // //           }
// // //         ]
// // //       }
// // //     );
// // //     return data
// // //   } catch (error) {
// // //     console.log(error);
// // //   }
// // // };

// // // removeAndJoin(423).then(data => console.log(data)).catch(err => console.log(err))


// // // const setCate = async () => {
// // //   await db.Category.bulkCreate(
// // //     [
// // //       {
// // //         cateName: 'Phương tiện vẫn chuyển ô tô, xe máy'
// // //       },
// // //       {
// // //         cateName: 'Trang thiết bị y tế'
// // //       },
// // //       {
// // //         cateName: 'Mẹ và bé'
// // //       },
// // //       {
// // //         cateName: 'Đồ dùng văn phòng'
// // //       },
// // //     ]
// // //   )
// // // };

// // // setCate().then(data => console.log(data));

// // const updateRutTien = async (month, userId) => {
// //   const data = await db.Post.count(
// //     {
// //       where: {
// //         userId,
// //         createdAt: sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month)
// //       },
// //     }
// //   );
// //   return data;
// // }
// // updateRutTien(11, 'ba2896d3-f1da-4c7c-a2bd-35b62fa956d5').then(data => console.log(data));



// // const getListQtyPostByMonth = async () => {
// //   try {
// //     listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// //     // const _listPost = listMonth.map((item) => {
// //     //   let qtyPost = updateRutTien(item, 'ba2896d3-f1da-4c7c-a2bd-35b62fa956d5');
// //     //   return (
// //     //     {
// //     //       name: `Thang ${item}`,
// //     //       qty: qtyPost
// //     //     }
// //     //   )
// //     // });

// //     const _listPost = await Promise.all(listMonth.map(async (item) => {
// //       let qtyPost = await updateRutTien(item, 'ba2896d3-f1da-4c7c-a2bd-35b62fa956d5');
// //       return (
// //         {
// //           name: `Thang ${item}`,
// //           qty: qtyPost
// //         }
// //       )
// //     }))

// //     return _listPost;
// //   } catch (error) {

// //   }
// // };

// // getListQtyPostByMonth().then(data => console.log(data));





// // searchUserByLastname('a').then(data => console.log(data));



removePostsByUserId('ba2896d3-f1da-4c7c-a2bd-35b62fa956d5').then(data => console.log(data)).catch(err => console.log(err))