const { get } = require('http');
const db = require('./src/db/models');
const { getImagesProduct, getPostByCateId, getFirstImageForProduct } = require('./src/services/common.service');


// const getPostById = async () => {
//     return await db.Post.findOne(
//         {
//             where: {
//                 id: 161
//             },
//             raw: true,
//             nest: true,
//             include: [
//                 {
//                     model: db.ListImageProduct,
//                     as: 'listImage'
//                 },
//                 {
//                     model: db.User,
//                     // as: 'userInfo'
//                 },
//                 // db.User
//                 // {
//                 //     model: db.ListImageProduct,
//                 //     // attributes: {
//                 //     //     exclude: ['id', 'userId']
//                 //     // },

//                 // }
//             ],
//         })
// }


// getPostById().then(data => {
//     console.log(data)
// })


const getData = async () => {
    try {
        // const id = req.params.id
        const data = await getPostByCateId(2)
        for (let item in data) {
            // console.log(object);
            data[item].image = await getFirstImageForProduct(data[item].id);
            // console.log(product)

        }
        return data
    } catch (error) {
        // next(error)
    }
}


getData().then(data => { console.log(data); })