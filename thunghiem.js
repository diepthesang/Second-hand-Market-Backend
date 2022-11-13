// const { get } = require('http');
const { validateEmail } = require('./src/controllers/helps.controller');
const db = require('./src/db/models');
const { getHighestBidder } = require('./src/services/common.service');
// const listimageproduct = require('./src/db/models/listimageproduct');
// const { getImagesProduct, getPostByCateId, getFirstImageForProduct } = require('./src/services/common.service');


// // const getPostById = async () => {
// //     return await db.Post.findOne(
// //         {
// //             where: {
// //                 id: 161
// //             },
// //             raw: true,
// //             nest: true,
// //             include: [
// //                 {
// //                     model: db.ListImageProduct,
// //                     as: 'listImage'
// //                 },
// //                 {
// //                     model: db.User,
// //                     // as: 'userInfo'
// //                 },
// //                 // db.User
// //                 // {
// //                 //     model: db.ListImageProduct,
// //                 //     // attributes: {
// //                 //     //     exclude: ['id', 'userId']
// //                 //     // },

// //                 // }
// //             ],
// //         })
// // }


// // getPostById().then(data => {
// //     console.log(data)
// // })


// // const getData = async () => {
// //     try {
// //         // const id = req.params.id
// //         const data = await getPostByCateId(2)
// //         for (let item in data) {
// //             // console.log(object);
// //             data[item].image = await getFirstImageForProduct(data[item].id);
// //             // console.log(product)

// //         }
// //         return data
// //     } catch (error) {
// //         // next(error)
// //     }
// // }

// const getData = async () => {
//     try {
//         const data = await db.Post.findOne(
//             {
//                 where: {
//                     id: 165
//                 },
//                 raw: true,
//                 nest: true,
//                 include: [
//                     {
//                         model: db.User
//                     },
//                     {
//                         model: db.Warranty
//                     },
//                     {
//                         model: db.StatusCurrentProduct
//                     },
//                     {
//                         model: db.MadeIn
//                     },
//                     {
//                         model: db.StatusActivePost
//                     },

//                 ],

//             }
//         )


//         const listImages = await db.ListImageProduct.findAll({
//             where: {
//                 proId: 165
//             }
//         })

//         const _data = {
//             ...data,
//             image: listImages
//         }

//         return _data;

//     } catch (error) {
//         return error
//     }
// }


// getData().then(data => { console.log(data); })


// const getPostIsShowingByUserId = async () => {
//     try {
//         const data = await db.Post.findAll(
//             {
//                 where: {
//                     userId: "ba2896d3-f1da-4c7c-a2bd-35b62fa956d5",
//                     activeId: 1,
//                 },
//                 raw: true,
//                 nest: true,
//                 include: {
//                     model: db.Like,
//                     where: {
//                         userId: "3613c165-842d-46d9-92e9-10defcac0921",
//                     },
//                     required: false,
//                 }
//             }
//         );
//         return data;
//     } catch (error) {
//         return error;
//     }
// }


// getPostIsShowingByUserId().then(data => console.log(data)).catch(err => console.log(err))

// const rs = validateEmail('diepthesang@gm');

// console.log('rs:::', rs);



// const obj = {
//   name: 'sang',
//   age: 12,
//   address: 'binh dinh',
// }

// const listImage = ['hinh1', 'hinh2', 'hinh3'];

// for (const item in listImage) {
//   obj.append('image', listImage[item]);
// }

// console.log(obj)


getHighestBidder(279, 3).then(data => { console.log(data); })
