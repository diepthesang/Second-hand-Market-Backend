const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { checkExistEmail, createAccount, getUserByEmail, getUserByUserName, updateAccount, findOrCreateNewEmail } = require("../services/auth.services");
const { sentOTP } = require('../services/mail.services');
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
                    status: 400,
                    message: 'Ban can fai dien day du thong tin',
                }

            }

            if (!validateEmail(email)) {
                throw {
                    status: 400,
                    message: 'Định dạng email không đúng',
                }
            }

            if (newPassword.length <= 6) {
                throw {
                    status: 400,
                    message: 'Mat khau phai chua nhieu hon 6 ki tu',
                }
            }

            if (confirmPassword !== password) {
                throw {
                    status: 400,
                    message: 'Mat khau xac thuc khong chinh xac',
                }
            }

            let checkExistEmail = await getUserByEmail(email);
            if (checkExistEmail === null) {
                OTP = await sentOTP(email);
                throw {
                    status: 200,
                    message: 'Ma xac thuc da duoc gui den mail cua ban'
                }

            } else {
                throw {
                    status: 404,
                    message: 'Dia chi email da duoc su dung'
                }
            }

        } catch (error) {
            console.log(error);
            return next(error)
        }
    },
    // VERIFY CODE FOR EMAIL
    sentOTP: async (req, res, next) => {
        try {
            const { otp } = req.body

            if (otp == OTP) {
                let result = await findOrCreateNewEmail(newEmail, newPassword, newFirstName, newLastName)
                if (result) {
                    throw {
                        status: 200,
                        message: 'Dang ki tai khoan thanh cong'
                    }
                } else {
                    throw {
                        status: 404,
                        message: 'Khong the dang ki tai khoan'
                    }
                }
            } else {
                throw {
                    status: 404,
                    message: 'Ma xac thuc khong dung'
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
                    message: 'Ban can dien day du thong tin'
                }
            };


            if (!validateEmail(email)) {
                throw {
                    status: 400,
                    message: 'Email khong duoc xac thuc'
                }
            }

            if (password.replace(/\s/g, '').length <= 6) {
                throw {
                    status: 400,
                    message: 'Mat khau phai chua nhieu hon 6 ki tu'
                }
            }

            let checkExistEmail = await getUserByEmail(email)

            if (!checkExistEmail) {
                throw {
                    status: 400,
                    message: 'Email khong ton tai'
                }
            } else {
                let hashPassword = checkExistEmail.password
                const match = await bcrypt.compare(password, hashPassword);
                if (match) {
                    let token = encodeToken(checkExistEmail.userId);
                    console.log(token);
                    res.setHeader('Authorization', 'Bearer ' + token)
                    throw {
                        status: 200,
                        message: 'Login thanh cong'
                    }
                    return next(error)
                } else {
                    throw {
                        status: 404,
                        message: 'Mat khau sai'
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
                err.message = 'Can dien day du thong tin'
                err.status = 422;
                return next(err)
            }
            console.log('>>>>>>>>>>>>>>>>>');

            let phoneNumber = Number(phone)
            if (!Number.isInteger(phoneNumber)) {
                err.message = 'so dien thoai phai la integer'
                err.status = 422;
                return next(err)
            }
            console.log('>>>>>>>>>>>>>>>>>');

            if (phone.length <= 8 || phone.length >= 12) {
                err.message = 'So dien thoai phai tu 9 den 11 so'
                err.code = 422;
                return next(err)
            }

            console.log('>>>>>>>>>3>>>>>>>>');

            if (password && password.replace(/\s/g, '').length <= 6) {
                err.message = 'mat khau phai chua nhieu hon 6 ki tu'
                err.status = 422;
                return next(err);
            }
            console.log('>>>>>>>>>4>>>>>>>>');

            if (confirmPassword !== password) {
                err.message = 'Mat khau xac thuc khong chinh xac'
                err.status = 422
                return next(err)
            }
            console.log('>>>>>>>5>>>>>>>>>>');

            if (email && !validateEmail(email)) {
                err.message = 'Định dạng email không đúng';
                err.status = 422
                return next(err)
            }
            console.log(email)
            let checkExistEmail = await getUserByEmail(email)
            console.log('>>>>>>>>>6>>>>>>>>');
            console.log(req.user.email);
            if (checkExistEmail && checkExistEmail.email !== req.user.email) {
                err.message = 'Email da ton tai';
                err.status = 422
                return next(err)
            }

            let result = await updateAccount(userId, avatarImg || 'hinhnek', phone, address, password, email, firstName, lastName);
            if (result === 'success') {
                console.log('>>>>>>>>7>>>>>>>>>');
                return res.status(200).json(
                    {
                        status: 200,
                        message: 'Cap nhat tai khoan thanh cong'
                    }
                )
            } else {
                err.message = result;
                err.status = 500;
                return next(err)
            }

        } catch (error) {
            err.message = error;
            err.status = 500;
            return next(err)
        }
    }
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};


let encodeToken = (userId) => {
    return JWT.sign(
        {
            iss: 'diepthesang',
            sub: userId,
        },
        process.env.JWT_SECRETKEY,
        {
            expiresIn: 60 * 60 * 12
        }
    )

}
