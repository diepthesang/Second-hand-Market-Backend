const db = require('../db/models/index')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')

module.exports = {
    createAccount: async (userName, email, password, firstName, lastName, address, phone, avatarImg) => {
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
                        avatarImg
                    }
                )
            })



            return 'success'
        } catch (error) {
            return error
        }
    },

    getUserByEmail: async (email) => {
        return await db.User.findOne(
            {
                where: {
                    email
                }
            }
        )
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
    }



}