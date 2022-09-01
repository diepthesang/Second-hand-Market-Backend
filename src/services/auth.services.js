const db = require('../db/models/index')
const { v4: uuidv4 } = require('uuid');
module.exports = {
    createAccount: async (userName, email, password, firstName, lastName, address, phone) => {
        db.User.create(
            {
                uuid: uuidv4(),
                userName,
                email,
                password,
                firstName,
                lastName,
                phone,
            }
        )
    },

    checkExistEmail: async (email) => {
        return await db.User.findOne(
            {
                where: {
                    email: email
                }
            }
        )
    }

}