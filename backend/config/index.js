const mailConfig = {
    noreply : {
        user: process.env.MAIL_NOREPLY_USER,
        password: process.env.MAIL_NOREPLY_PWD
    },

    info : {
        user: process.env.MAIL_INFO_USER,
        password: process.env.MAIL_INFO_PWD
    },
    port: process.env.NODE_ENV === "production" ? parseInt(process.env.MAIL_PORT, 10) : 465,
    host: process.env.MAIL_HOST

}

const appOrigin = process.env.NODE_ENV === "production" ? "https://api.azchemresources.com" : "http://localhost:3000"

const adminEmail = "admin@azchemresources.com" 
  
module.exports = {mailConfig, adminEmail, appOrigin};