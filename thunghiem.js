// const data = [
//   {
//     "id": 80,
//     "createdAt": "2022-12-12T08:24:58.000Z",
//     "Orders": [
//       {
//         "id": 102,
//         "status": "CONFIRM",
//         "postId": 503,
//         "price": 9999,
//         "Post": {
//           "title": "aaaaa",
//           "PostImages": [
//             {
//               "imagePath": "/upload/1670831569099-841081366-Can-ngay-iPhone-14-mo-ban-tai-Viet-Nam-hang-loat-dien-thoai-2-1664948901-846-width740height641.jpg"
//             },
//             {
//               "imagePath": "/upload/1670831569099-872851683-0a-xoa-tray-iphone-14-1.jpg.webp"
//             }
//           ]
//         }
//       },
//       {
//         "id": 103,
//         "status": "CONFIRM",
//         "postId": 502,
//         "price": 10000,
//         "Post": {
//           "title": "test bid",
//           "PostImages": [
//             {
//               "imagePath": "/upload/1670831280472-910888709-chi-tien-trieu-do-vo-iphone-cu-len-iphone-14-8bf9d7d06ca44bc097b5c7f85b84e1eb.jpeg"
//             },
//             {
//               "imagePath": "/upload/1670831280471-678680488-Can-ngay-iPhone-14-mo-ban-tai-Viet-Nam-hang-loat-dien-thoai-2-1664948901-846-width740height641.jpg"
//             },
//             {
//               "imagePath": "/upload/1670831280470-80852058-0a-xoa-tray-iphone-14-1.jpg.webp"
//             }
//           ]
//         }
//       }
//     ]
//   },
//   {
//     "id": 78,
//     "createdAt": "2022-12-12T07:54:38.000Z",
//     "Orders": [
//       {
//         "id": 98,
//         "status": "CONFIRM",
//         "postId": 503,
//         "price": 9999,
//         "Post": {
//           "title": "aaaaa",
//           "PostImages": [
//             {
//               "imagePath": "/upload/1670831569099-841081366-Can-ngay-iPhone-14-mo-ban-tai-Viet-Nam-hang-loat-dien-thoai-2-1664948901-846-width740height641.jpg"
//             },
//             {
//               "imagePath": "/upload/1670831569099-872851683-0a-xoa-tray-iphone-14-1.jpg.webp"
//             }
//           ]
//         }
//       },
//       {
//         "id": 99,
//         "status": "CONFIRM",
//         "postId": 502,
//         "price": 10000,
//         "Post": {
//           "title": "test bid",
//           "PostImages": [
//             {
//               "imagePath": "/upload/1670831280472-910888709-chi-tien-trieu-do-vo-iphone-cu-len-iphone-14-8bf9d7d06ca44bc097b5c7f85b84e1eb.jpeg"
//             },
//             {
//               "imagePath": "/upload/1670831280471-678680488-Can-ngay-iPhone-14-mo-ban-tai-Viet-Nam-hang-loat-dien-thoai-2-1664948901-846-width740height641.jpg"
//             },
//             {
//               "imagePath": "/upload/1670831280470-80852058-0a-xoa-tray-iphone-14-1.jpg.webp"
//             }
//           ]
//         }
//       }
//     ]
//   }
// ];

const { updateStatusOrderByBuyder } = require("./src/services/user.service");

// const { listenerCount } = require("process");
// const { getPostBuy, updateStatusOrderByBuyder } = require("./src/services/user.service");

// const arrList = [];

// const list = data.map(item => {
//   return {
//     item: item.Orders.map(idex => idex.Post)
//   }

// })

// console.log(data);




updateStatusOrderByBuyder(502, '6a6d8327-3332-4b96-835c-2bed3faa44cf').then(data => console.log(data)).catch(err => console.log(err))