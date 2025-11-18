import nodemailer from 'nodemailer';
import 'dotenv/config';

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Verificando conexão SMTP...');
    await transporter.verify();
    console.log('SMTP verificado com sucesso!');

    const res = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Teste SMTP - UniMater Cantina',
      text: 'Teste de envio SMTP — se chegou, tudo ok.',
    });

    console.log('Email enviado, messageId:', res.messageId);
    if (nodemailer.getTestMessageUrl(res)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(res));
    }
  } catch (err) {
    console.error('Erro no teste SMTP:', err);
  }
})();
