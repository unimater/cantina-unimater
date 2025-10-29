// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { InternalServerErrorException } from '@nestjs/common';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,     
        pass: process.env.SMTP_PASS,     
      },
    });
  }

  async sendPasswordResetEmail(email: string, codigo: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Recuperação de senha - UniMater Cantina',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Recuperação de Senha</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir sua senha.</p>
            <p>Use o código abaixo para continuar o processo:</p>
            <h3 style="background: #004AAD; color: white; display: inline-block; padding: 8px 12px; border-radius: 6px;">
              ${codigo}
            </h3>
            <p>Esse código expira em <strong>1 hora</strong>.</p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
            <br/>
            <p>Atenciosamente,<br/>Equipe UniMater Cantina</p>
          </div>
        `,
      });

      console.log(`Email enviado para ${email} com sucesso!`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new InternalServerErrorException('Falha ao enviar o e-mail de recuperação.');
    }
  }
}