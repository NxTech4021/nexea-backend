import nodemailer from 'nodemailer'
import dotenv from 'dotenv';


dotenv.config();


// user and pass for nodemailer 
  //const user = "afiq@nexea.co";

// Uses google's app specific password
  //const pass = "bpnolahgcqzqxlmj";

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const transport = nodemailer.createTransport ({
    host: "smtp.gmail.com",
    auth: {
        user: user,
        pass: pass
    }
})

export const sendResetEmail = (email : any, name : any, resetPasswordToken: any) => {
    transport
      .sendMail({
        from: user,
        to: email,
        subject: "[NEXEA EVENT APP] Password Reset Request",
        html: `
        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:100%;">
          <tbody>
            <tr>
              <td style="display:block;margin:0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:55%;">
                  <tbody>
                    <tr>
                      <td>
                    <h1>Reset Password Request</h1>
                        
                    <h2 style="font-weight:400;">Hello ${name}, </h2>
                    <p> You're receiving this email because you requested a password reset for your account.
  
                    <p> To reset your password, click here: <a href=http://localhost/reset-password/${resetPasswordToken} style="box-sizing:border-box;text-decoration:none;background-color:#0d6efd;border:solid 1px #007bff;border-radius:4px;color:#ffffff;font-size:16px;font-weight:bold;margin:0;padding:9px 25px;display:inline-block;letter-spacing:1px"> Link to be updated  </a> </p>
          
                    <p> If you didn't request this, please ignore this message or contact us at [Customer Support Email Address] immediately. </p>
                        
                        
                    <p> Nexea, Techteam </p>
                        
                       </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      `,
      })
      .catch((err) => {
        return err;
      });
  };


//   <a href=http://localhost/reset-password/${resetPasswordToken}