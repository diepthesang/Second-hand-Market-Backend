
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')
const otpGenerator = require('otp-generator')

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

module.exports = {
    sentOTP: async (email) => {
        try {

            console.log('>>>>>1>>>>>>>');
            const myAccessTokenObject = await myOAuth2Client.getAccessToken()
            // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
            const myAccessToken = myAccessTokenObject?.token

            console.log('>>>>1,5<<<')


            // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.ADMIN_EMAIL_ADDRESS,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                    accessToken: myAccessToken
                }
            })
            console.log('mail gui di ::', process.env.ADMIN_EMAIL_ADDRESS)
            console.log('mail gui di ::', process.env.GOOGLE_REFRESH_TOKEN)

            console.log('>>>>>2>>>>>>>');


            // TAO MA OTP
            let otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });

            console.log('otp:::', otp)

            // mailOption là những thông tin gửi từ phía client lên thông qua API
            const mailOptions = {
                to: email, // Gửi đến ai?
                subject: "Team Dev SECOND-HAND-MARKET", // Tiêu đề email
                html: `<h3>Mã xác thực của bạn là: <u style="color:blue">${otp}</u></h3>` // Nội dung email
            }


            // Gọi hành động gửi email
            await transport.sendMail(mailOptions)
            return otp
        } catch (error) {
            throw error
        }
    }
}