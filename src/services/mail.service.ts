import type { Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

import type { MailSender } from '@/interfaces/app.interface';
import {
  useEmailVerificationTemplate,
  useForgotPasswordTemplate,
} from '@/utils/templates';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

// todo: add send-grid email service before production
class MailService {
  public static mailInfo: Mail.Options;
  private transportConfig: SMTPTransport.Options;
  private transporter: Transporter;
  private readonly senderEmail = process.env.SENDER_EMAIL as string;

  constructor() {
    this.transportConfig = this.createNodemailerConfig();
    this.transporter = this.createTranporter();
  }

  private createNodemailerConfig = (): SMTPTransport.Options => {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_TLS === 'yes' ? true : false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };
  };

  private createTranporter = () => {
    return nodemailer.createTransport(this.transportConfig);
  };

  private sendMail = async (mailInfo: Mail.Options) => {
    const senderName = process.env.SENDER_NAME as string;
    const senderEmail = process.env.SENDER_EMAIL as string;
    await this.transporter.sendMail({
      from: `${senderName} ${senderEmail}`,
      to: mailInfo.to,
      cc: mailInfo.cc,
      bcc: mailInfo.bcc,
      subject: mailInfo.subject,
      text: mailInfo.text,
      html: mailInfo.html,
    });
  };

  public verifyConnection = () => {
    return this.transporter.verify();
  };

  public sendVerificationMail: MailSender = async ({
    email,
    name,
    otp,
    serviceEmail,
    resend,
  }) => {
    const content = useEmailVerificationTemplate({
      otp,
      name,
      resend,
      serviceEmail: serviceEmail ?? this.senderEmail,
    });
    return this.sendMail({
      to: email,
      subject: `Verification mail from Libu - The Modern Library`,
      html: content,
    });
  };
  /**
   *
   */
  public sendForgotPasswordMail: MailSender = async ({
    email,
    otp,
    serviceEmail,
    resend,
  }) => {
    const content = useForgotPasswordTemplate({
      otp,
      resend,
      serviceEmail: serviceEmail ?? this.senderEmail,
    });
    return this.sendMail({
      to: email,
      subject: `Verification mail from Libu - The Modern Library`,
      html: content,
    });
  };
}

export default MailService;
