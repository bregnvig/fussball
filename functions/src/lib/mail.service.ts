import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: functions.config().oauth.user,
    clientId: functions.config().oauth.client,
    clientSecret: functions.config().oauth.secret,
    refreshToken: functions.config().oauth.refresh,
    // accessToken: functions.config().ci.token
  }
});

export const sendMail = async (emailAddress: string, subject: string, body: string): Promise<string> => {
  const msg = {
    from: 'f1-2020@bregnvig.dk',
    to: emailAddress,
    subject: subject,
    html: body
  };
  if (functions.config().test) {
    return Promise.resolve('In test environment');
  }

  return new Promise<string>(
    (resolve: (msg: any) => void,
      reject: (err: Error) => void) => {
      transporter.sendMail(
        msg, (error, info) => {
          if (error) {
            console.log(`error: ${error}`);
            reject(error);
          } else {
            console.log(`Message Sent 
                          ${info.response}`);
            resolve(`Message Sent  
                          ${info.response}`);
          }
        });
    }
  );
}