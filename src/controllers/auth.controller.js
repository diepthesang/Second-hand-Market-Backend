const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { checkExistEmail, createAccount, getUserByEmail, getUserByUserName, updateAccount } = require("../services/auth.services");

module.exports = {
    createAccount: async (req, res, next) => {
        let err = new Error()
        try {
            const { userName, email, password, confirmPassword, firstName, lastName, address, phone } = req.body
            if (!userName || !email || !password || !confirmPassword || !firstName || !lastName || !lastName || !address || !phone) {
                err.message = 'Cần điền đầy đủ thông tin để tạo tài khoản'
                err.status = 422;
                return next(err)
            }

            if (userName.length <= 2) {
                err.message = 'username phai lon hon 3 ki tu'
                err.status = 422
                return next(err)
            }



            if (!validateEmail(email)) {
                err.message = 'Định dạng email không đúng';
                err.status = 422
                return next(err)
            }

            if (await getUserByUserName(userName)) {
                err.message = 'Username da ton tai';
                err.status = 422;
                return next(err)
            }

            if (await getUserByEmail(email)) {
                err.message = 'Email da ton tai';
                err.status = 422
                return next(err)
            }

            if (password.replace(/\s/g, '').length <= 6) {
                err.message = 'mat khau phai chua nhieu hon 6 ki tu'
                err.status = 422;
                return next(err);
            }

            if (confirmPassword !== password) {
                err.message = 'Mat khau xac thuc khong chinh xac'
                err.status = 422
                return next(err)
            }
            let phoneNumber = Number(phone)
            if (!Number.isInteger(phoneNumber)) {
                err.message = 'so dien thoai phai la integer'
                err.status = 422;
                return next(err)
            }

            if (phone.length <= 8 || phone.length >= 12) {
                err.message = 'So dien thoai phai tu 9 den 11 so'
                err.code = 422;
                return next(err)
            }

            let result = await createAccount(userName, email, password, confirmPassword, firstName, lastName, address, phone);
            if (result === 'success') {
                return res.status(200).json(
                    {
                        code: 200,
                        message: 'tao tai khoan thanh cong'
                    }

                )
            } else {
                err.message = result;
                err.status = 500
                return next(err)
            }

        } catch (error) {
            err.message = error;
            err.status = 404;
            return next(err)
        }
    },

    loginAccount: async (req, res, next) => {
        let err = new Error()
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                err.message = 'Bạn cần điền đẩy đủ thông tin'
                err.status = 422;
                return next(err)
            };


            if (!validateEmail(email)) {
                err.message = 'Email không được xác thực'
                err.status = 422;
                return next(err)
            }

            if (password.replace(/\s/g, '').length <= 6) {
                err.message = 'Mật khẩu phải chứa nhiều hơn 6 kí tự'
                err.status = 422;
                return next(err)
            }

            let checkExistEmail = await getUserByEmail(email)

            if (!checkExistEmail) {
                err.message = 'Email khong ton tai';
                err.status = 422
                return next(err)
            } else {
                let hashPassword = checkExistEmail.password
                bcrypt.compare(password, hashPassword, function (err, result) {
                    if (result) {
                        let token = encodeToken(checkExistEmail.userId);
                        console.log(token);
                        res.setHeader('Authorization', 'Bearer ' + token)
                        return res.status(200).json(
                            {
                                status: 200,
                                message: 'login thanh cong'
                            }
                        )
                    } else {
                        let error = new Error('Mat khau sai')
                        error.status = 422
                        return next(error)
                    }
                })

            }

        } catch (error) {
            err.message = error;
            err.status = 500;
            return next(err)
        }

    },

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
