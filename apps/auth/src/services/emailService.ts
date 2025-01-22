export class EmailService {
  async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    console.log(`Sending email to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
  }

  async sendActivationEmail(
    email: string,
    activationToken: string
  ): Promise<void> {
    const subject = 'Activate your account';
    const message = `Click the following link to activate your account: http://localhost:3000/activate/${activationToken}`;
    await this.sendEmail(email, subject, message);
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<void> {
    const subject = 'Reset your password';
    const message = `Click the following link to reset your password: http://localhost:3000/reset/${resetToken}`;
    await this.sendEmail(email, subject, message);
  }
}
