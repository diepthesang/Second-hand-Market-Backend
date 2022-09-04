const db = require("./src/db/models");
const { v4: uuidv4 } = require('uuid');


// async function findandcreate() {
//     const [user, created] = await db.User.findOrCreate(
//         {
//             where: {
//                 email: '13@gmail.com'
//             },

//             defaults: {
//                 userId: uuidv4(),
//                 userName: 'diepthesang',
//                 address: 'antuongtay-hoaian-binhdinh'
//             }
//         }
//     );

//     return created;
// }

// // findandcreate().then(rs => console.log(rs))


// // async function upserMethod() {
// //     const [objectt, created] = await db.User.upsert(
// //         {
// //             userId: uuidv4(),
// //             userName: 'san3',
// //             email: 'san3'
// //         }
// //     )
// //     console.log(objectt);
// //     console.log(created)
// // }


// // upserMethod()



// var name = '   diep the sang     f  '

// // var newName = name.replace(/\s/g, '')
// var newName = name.trim().length
// console.log(newName);

let getUserByEmail = async (email) => {
    // console.log('email service ::', email)
    try {
        let user = await db.User.findOne(
            {
                where: {
                    email: email
                }
            }
        )
        console.log('user::: ', user)
        return user;
    } catch (error) {
        throw error
    }
}

getUserByEmail('sangdtde140025@gmail.com').then(data => console.log(data))
