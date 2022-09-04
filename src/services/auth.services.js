const db = require('../db/models/index')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
    createAccount: async (userName, email, password, firstName, lastName, address, phone) => {
        try {
            bcrypt.hash(password, 8).then(function (hashPassword) {
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
                        role: process.env.ROLE_USER,
                    }
                )
            })



            return 'success'
        } catch (error) {
            return error
        }
    },

    getUserByEmail: async (email) => {
        console.log('email service ::', email)
        try {
            let user = await db.User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )
            return user;
        } catch (error) {
            throw error
        }
    },

    getUserByUserName: async (userName) => {
        return await db.User.findOne(
            {
                where:
                {
                    userName
                }
            }
        )
    },

    getUserByUserId: async (userId) => {
        return await db.User.findOne(
            {
                where: {
                    userId
                }
            }
        )
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
            const hashPassword = bcrypt.hashSync(password, 8);
            const [user, created] = await db.User.findOrCreate(
                {
                    where: {
                        email
                    },

                    defaults: {
                        userId: uuidv4(),
                        password: hashPassword,
                        firstName,
                        lastName,
                    }
                }
            );

            return created;
        } catch (error) {
            throw error;
        }

    }

}