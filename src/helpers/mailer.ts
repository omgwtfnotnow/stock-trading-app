// import nodemailer from 'nodemailer'
const nodemailer = require('nodemailer')
import bcryptjs from 'bcryptjs'
import connectDB from "@/lib/db";
export const sendEmail = async({email , emailType , userId}:string | any)=>{
    try {
        const connection = await connectDB();
        const hashToken = await bcryptjs.hash(userId.toString(), 10)
        if(emailType==="VERIFY")
        {
            const queri = 'UPDATE users SET verifyToken = ? , verifyTokenExpiry=? WHERE id=?'
            const exe = await connection.query(queri,[userId, hashToken ,Date.now()+3600000,userId])
        }
        else if(emailType==="RESET"){
            const queri = 'UPDATE users SET forgotPasswordToken = ? , forgotPasswordTokenExpiry=? WHERE id=?'
            const exe = await connection.query(queri,[userId, hashToken ,Date.now()+3600000,userId])
        }
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c6a5c6c7392820",
              pass: "********c05b"
            }
          });
        const mailOptions = {
            from :'smclover376@gmail.com',
            to:email,
            subject:emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            text:'Verify',
            html:`<p>Click <a href="/verifyemailtoken = ${hashToken}"> Here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset yout password"} or copy and paste the link below in your browser. <br></p>`,
 
        }
        const mailResponse = await transporter.sendEmail(mailOptions)
        return mailResponse;
    } catch (error:any) {
        throw new Error(error.message)
    }
}