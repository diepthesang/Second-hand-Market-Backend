const { checkExistEmail } = require("../services/auth.services");

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

            if (!validateEmail(email)) {
                err.message = 'Định dạng email không đúng';
                err.status = 422
                return next(err)
            }

            if (!checkExistEmail(email)) {
                err.message = 'Email da ton tai';
                err.status = 422
                return next(err)
            }

            if (confirmPassword !== password) {
                err.message = 'Mat khau xac thuc khong chinh xac'
                err.status = 422
                return next(err)
            }





        } catch (error) {
            err.message = error;
            err.status = 404;
            next(err)
        }

        // next(new Error('khoong co gi het'))
    }
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};