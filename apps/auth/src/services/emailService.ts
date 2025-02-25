import { getLogger } from '@warehouse/logging';

const logger = getLogger('emailService');

export class EmailService {
  async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    logger.debug(`Mock: Sending email: ${message}`, {
      to: email,
      subject
    });
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
