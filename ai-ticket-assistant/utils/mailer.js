import nodemailer from "nodemailer"
export const sendMail = async(to,subject,text)=>{
    try{
  //      const transporter = nodemailer.createTransport({
  // host: process.env.MAILTRAP_SMTP_HOST,
  // port: process.env.MAILTRAP_SMTP_PORT,
  // secure: false, 
  // auth: {
  //   user: process.env.MAILTRAP_SMTP_USER,
  //   pass: process.env.MAILTRAP_SMTP_PASS,
  // },

       const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure:false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

   const info = await transporter.sendMail({
    from: 'Inngest TMS <sarvaghyajoshi2003@gmail.com>',
    to,
    subject,
    text, 
  });

  console.log("Message sent:", info.messageId);
  return info;
    }
    catch(error){
       console.log("Mail Error",error.message)
       throw error
    }
};