const db = require('../db/models/index')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
    /**
     * 
     * @param {string} userName 
     * @param {string} email 
     * @param {string} password 
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} address 
     * @param {string} phone 
     * @returns 
     */
    createAccount: async (userName, email, password, firstName, lastName, address, phone) => {
        try {
            return bcrypt.hash(password, 8).then(function (hashPassword) {
                db.User.create(
                    {
                        userId: uuidv4(),
                        userName,
                        email,
                        password: hashPassword,
                        firstName,
                        lastName,
                        address,
                        phone,
                        avatarImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU',
                        role: process.env.ROLE_USER,
                    }
                )
            })

            return 'success'


        } catch (error) {
            return error
        }
    },

    /**
     * return a user finded by email
     * @param {string} email 
     * @returns {Promise<string>} user
     */
    getUserByEmail: async (email) => {
        try {
            let user = await db.User.findOne(
                {
                    where: {
                        email
                    }
                }
            )
            return user;
        } catch (error) {
            return error
        }
    },

    getUserByUserName: async (userName) => {
        try {
            return await db.User.findOne(
                {
                    where:
                    {
                        userName
                    }
                }
            )
        } catch (error) {
            return error
        }
    },

    getUserByUserId: async (userId) => {
        try {
            return await db.User.findOne(
                {
                    where: {
                        userId
                    }
                }
            )
        } catch (error) {
            return error
        }
    },

    updateAccount: async (userId, avatarImg, phone, address, password, email, firstName, lastName) => {
        try {

            await db.User.update(
                {
                    firstName,
                    lastName,
                    email,
                    avatarImg,
                    phone,
                    address,
                    password,
                },
                {
                    where: {
                        userId
                    }
                }
            )

            return 'success'

        } catch (error) {
            return error
        }
    },

    findOrCreateNewEmail: async (email, password, firstName, lastName) => {
        try {
            const _hashPassword = bcrypt.hashSync(password, 5);
            const [user, created] = await db.User.findOrCreate(
                {
                    where: {
                        email
                    },

                    defaults: {
                        userId: uuidv4(),
                        password: _hashPassword,
                        firstName,
                        lastName,
                    }
                }
            );

            return created;
        } catch (error) {
            return error;
        }

    }

}