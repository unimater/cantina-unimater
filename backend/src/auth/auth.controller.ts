import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import z from 'zod';
import { compare, hash } from 'bcrypt';
import { ZodValidationPipe } from 'src/pipes/zodValidationPipe';
import { EmailService } from 'src/services/email.service';

const authenticateBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

const verifyResetTokenSchema = z.object({
  email: z.string().email(),
  codigo: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  codigo: z.string(),
  novaSenha: z.string().min(6),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>;
type VerifyResetTokenSchema = z.infer<typeof verifyResetTokenSchema>;
type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

@Controller('/sessions')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { username, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'As credenciais do usuário não foram encontradas.',
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'As credenciais do usuário não foram encontradas.',
      );
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
      id: user.id,
      nome: user.name
    };
  }

  @Post('/forgot-password')
  @UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
  async forgotPassword(@Body() body: ForgotPasswordBodySchema) {
    const { email } = body;

    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      return { message: 'Se o e-mail existir, você receberá o código.' };
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: codigo, resetTokenExpiry: tokenExpiry },
    });

    await this.emailService.sendPasswordResetEmail(email, codigo);

    return { message: 'Código de redefinição enviado com sucesso.' };
  }

  @Post('/verify-reset-token')
  @UsePipes(new ZodValidationPipe(verifyResetTokenSchema))
  async verifyResetToken(@Body() body: VerifyResetTokenSchema) {
    const { email, codigo } = body;

    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { resetToken: true, resetTokenExpiry: true },
    });

    if (!user || user.resetToken !== codigo) {
      throw new BadRequestException('Código inválido.');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Código expirado.');
    }

    return { message: 'Código válido.' };
  }

  @Post('/reset-password')
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(@Body() body: ResetPasswordSchema) {
    const { email, codigo, novaSenha } = body;

    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true, resetToken: true, resetTokenExpiry: true },
    });

    if (!user || user.resetToken !== codigo) {
      throw new BadRequestException('Código inválido.');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Código expirado.');
    }

    const hashedPassword = await hash(novaSenha, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }
}
