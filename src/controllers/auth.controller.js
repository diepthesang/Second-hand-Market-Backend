const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const ms = require('ms');
const httpMessage = require('../Helps/httpMessage');
const { checkExistEmail, createAccount, getUserByEmail, getUserByUserName, updateAccount, findOrCreateNewEmail } = require("../services/auth.service");
const { sentOTP } = require('../services/mail.service');
const { validateEmail } = require('./helps.controller');
var OTP = '';
var newEmail = '';
var newPassword = '';
var newConfirmPassword = '';
var newFirstName = '';
var newLastName = '';


module.exports = {
    // REGISTER ACCOUNT
    createAccount: async (req, res, next) => {
        try {
            const { email, password, confirmPassword, firstName, lastName } = req.body
            newEmail = email;
            newPassword = password.replace(/\s/g, '');
            newConfirmPassword = confirmPassword.replace(/\s/g, '');
            newFirstName = firstName.trim();
            newLastName = lastName.trim();

            if (!email || !newPassword || !newConfirmPassword || !newFirstName || !newLastName) {
                throw {
                    status: 404,
                    message: httpMessage.ERR_FIELD
                }

            }

            if (!validateEmail(email)) {
                throw {
                    status: 400,
                    message: httpMessage.ERR_FORMAT_EMAIL,
                }
            }

            if (newPassword.length <= 6) {
                throw {
                    status: 400,
                    message: httpMessage.ERR_FORMAT_PASSWORD,
                }
            }

            if (confirmPassword !== password) {
                throw {
                    status: 400,
                    message: httpMessage.ERR_CONFIRM_PASSWORD,
                }
            }

            let checkExistEmail = await getUserByEmail(email);
            if (checkExistEmail === null) {
                OTP = await sentOTP(email);
                if (OTP === undefined) {
                    throw {
                        status: 404,
                        message: httpMessage.ERR_SEND_OTP
                    }
                }
                console.log('OTP:::', OTP)
                return res.status(200).json({
                    status: 200,
                    message: 'Gui OTP thanh cong'
                })

            } else {
                throw {
                    status: 404,
                    message: httpMessage.ERR_EXIST_EMAIL
                }
            }

        } catch (error) {
            console.log('***err_createAccount:::', error);
            return next(error)
        }
    },

    // VERIFY CODE FOR EMAIL
    sentOTP: async (req, res, next) => {
        try {
            const { otp } = req.body

            console.log('OTP:::', OTP);

            if (otp == OTP) {
                let result = await findOrCreateNewEmail(newEmail, newPassword, newFirstName, newLastName)
                if (result) {
                    return res.status(200).json(
                        {
                            status: 200,
                            message: 'OTP chinh xac'
                        }
                    )
                } else {
                    throw {
                        status: 404,
                        message: httpMessage.ERR_REGISTER_ACCOUNT,
                    }
                }
            } else {
                throw {
                    status: 404,
                    message: httpMessage.ERR_CONFIRM_OTP
                }
            }


        } catch (error) {
            return next(error)
        }
    },

    // LOGIN ACCOUNT
    loginAccount: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw {
                    status: 400,
                    codeMessage: 'ERR_FIELD',
                    message: httpMessage.ERR_FIELD
                }
            };


            if (!validateEmail(email)) {
                throw {
                    status: 400,
                    codeMessage: 'INVALID_EMAIL',
                    message: httpMessage.ERR_FORMAT_EMAIL
                }
            }

            if (password.replace(/\s/g, '').length <= 6) {
                throw {
                    status: 400,
                    codeMessage: 'ERR_FORMAT_PASSWORD',
                    message: httpMessage.ERR_FORMAT_PASSWORD
                }
            }

            let checkExistEmail = await getUserByEmail(email)
            console.log('checkExistEmail::::', !checkExistEmail);

            if (!checkExistEmail) {
                throw {
                    status: 400,
                    codeMessage: 'ERR_EXIST_EMAIL',
                    message: httpMessage.ERR_EXIST_EMAIL
                }

            } else {
                let hashPassword = checkExistEmail.password
                const match = await bcrypt.compare(password, hashPassword);
                if (match) {
                    let token = encodeToken(checkExistEmail.userId);
                    console.log("token:::", token);
                    // res.cookie('access_token', token, {
                    //     maxAge: ms('365 days'),
                    //     httpOnly: true,
                    //     secure: false,

                    // },);



                    res.setHeader('Authorization', 'Bearer ' + token)

                    return res.status(200).json(
                        {
                            status: 200,
                            codeMessage: 'SUCCESS',
                            message: 'Login thanh cong'
                        }
                    )
                } else {
                    throw {
                        status: 404,
                        codeMessage: 'ERR_PASSWORD',
                        message: httpMessage.ERR_PASSWORD,
                    }
                }
            }

        } catch (error) {
            return next(error)
        }

    },

    // UPDATE ACCOUNT
    updateAccount: async (req, res, next) => {
        let err = new Error()
        try {
            let userId = req.user.userId;
            console.log(userId);
            const { phone, address, password, confirmPassword, email, firstName, lastName, avatarImg } = req.body
            console.log({ phone, address, password, confirmPassword, email, firstName, lastName, avatarImg });
            if (!phone || !address || !email || !firstName || !lastName) {
                throw {
                    status: 400,
                    message: httpMessage.ERR_FIELD
                }
            }

            let phoneNumber = Number(phone)
            if (!Number.isInteger(phoneNumber)) {

                throw {
                    status: 422,
                    message: httpMessage.ERR_FORMAT_PHONE,
                }
            }

            if (phone.length <= 8 || phone.length >= 12) {
                throw {
                    status: 422,
                    message: httpMessage.ERR_9_TO_11_NUMBERPHONE,
                }
            }

            if (password && password.replace(/\s/g, '').length <= 6) {
                throw {
                    status: 422,
                    message: httpMessage.ERR_FORMAT_PASSWORD
                }
            }

            if (confirmPassword !== password) {
                throw {
                    status: 422,
                    message: httpMessage.ERR_CONFIRM_PASSWORD
                }
            }

            if (email && !validateEmail(email)) {
                throw {
                    status: 400,
                    message: httpMessage.ERR_FORMAT_EMAIL,
                }
            }
            let checkExistEmail = await getUserByEmail(email)
            if (checkExistEmail && checkExistEmail.email !== req.user.email) {
                // throw {
                //     status: 400,
                //     message: httpMessage.ERR_EXIST_EMAIL,
                // }

                return res.status(400).json({
                    status: 400,
                    message: ' thu nghiem '
                })
            }

            let result = await updateAccount(userId, avatarImg || 'hinhnek', phone, address, password, email, firstName, lastName);
            if (result === 'success') {
                console.log('>>>>>>>>7>>>>>>>>>');
                return res.status(200).json(
                    {
                        status: 200,
                        message: httpMessage.SUCCESS_UPDATE_ACCOUNT,
                    }
                )
            } else {
                throw {
                    status: 200,
                    message: result
                }

            }
        } catch (error) {
            return next(err)
        }
    },

    loginAccountGoogle: async (req, res, next) => {
        try {
            let token = encodeToken(req.user.userId);
            console.log('>>token<<')
            console.log(token);
            res.setHeader('Authorization', 'Bearer ' + token)
            return res.status(200).json({
                status: 200,
                message: 'Login thanh cong'
            })


        }
        catch (error) {
            next(error)
        }
    }
}



let encodeToken = (userId) => {
    return JWT.sign(
        {
            iss: 'diepthesang',
            sub: userId,
        },
        process.env.JWT_SECRETKEY,
        {
            expiresIn: ms('365 days')
        }
    )

}
