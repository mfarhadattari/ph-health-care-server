import sendMail from "../../utils/sendMail";

export const sendResetEmail = async (payload: {
  email: string;
  resetLink: string;
}) => {
  await sendMail({
    receiver: payload.email,
    subject: "Password Reset",
    bodyHtml: `
        <div>
          <div class="header" style="text-align: center; padding: 20px;">
            <h1>Reset Your Password</h1>
          </div>
    
          <div class="content" style="padding: 20px;">
              <p>You're receiving this email because you requested a password reset for your account.</p>
              <p>To reset your password, click the button below:</p>
              <a href=${payload.resetLink} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>   
    
              <p>This link will expire in 5 minute.</p>
          </div>
    
          <div class="footer" style="text-align: center; padding: 20px;">
              <p>© PH Health Care</p>
              <p>Contact us at support@phhealthcare.com</p>
          </div>
        </div>
        `,
  });
};
