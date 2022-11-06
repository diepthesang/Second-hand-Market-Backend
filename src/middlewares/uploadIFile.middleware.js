const multer = require('multer')
const httpMessage = require('../Helps/httpMessage');
const { createCategory } = require('../services/user.service')



const storage = multer.diskStorage(
    {
        // diem den khi tai file len server
        destination: (req, file, cb) => {
            // console.log('rq', req)
            cb(null, 'src/public/upload/')
        },
        filename: (req, file, cb) => {
            const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, fileName + '-' + file.originalname)
        }
    }
)


const upload = multer({ storage: storage, });

module.exports = {
    uploadMultiImage: upload.array('images', 6),
    uploadSingleImage: upload.single('image'),
}