
const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
})

module.exports = {
    sentCodeVerify: async (email) => {
        try {

            const myAccessTokenObject = await myOAuth2Client.getAccessToken()
            // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
            const myAccessToken = myAccessTokenObject?.token

            // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.ADMIN_EMAIL_ADDRESS,
                    clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                    accessToken: myAccessToken
                }
            })

            let verifyCode = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);


            // mailOption là những thông tin gửi từ phía client lên thông qua API
            const mailOptions = {
                to: email, // Gửi đến ai?
                subject: "Team Dev SECOND-HAND-MARKET", // Tiêu đề email
                html: `<h3>Mã xác thực của bạn là: <u style="color:blue">${verifyCode}</u></h3>` // Nội dung email
            }
            console.log(verifyCode)

            // Gọi hành động gửi email
            await transport.sendMail(mailOptions)
            return verifyCode
        } catch (error) {

        }
    }
}