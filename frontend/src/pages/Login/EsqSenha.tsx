import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { useVerifyResetToken } from '@/hooks/useVerifyResetToken';
import { useResetPassword } from '@/hooks/useResetPassword';

export function EsqSenha() {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [etapa, setEtapa] = useState<'email' | 'codigo' | 'novaSenha'>('email');

  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();
  const verifyTokenMutation = useVerifyResetToken();
  const resetPasswordMutation = useResetPassword();

  const isLoading =
    forgotPasswordMutation.status === 'pending' ||
    verifyTokenMutation.status === 'pending' ||
    resetPasswordMutation.status === 'pending';

  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setEtapa('codigo');
      alert('Código enviado para seu email.');
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar código. Tente novamente.');
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyTokenMutation.mutateAsync({ email, codigo });
      setEtapa('novaSenha');
      alert('Código verificado com sucesso.');
    } catch (error) {
      console.error(error);
      alert('Código inválido. Tente novamente.');
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ email, codigo, novaSenha });
      alert('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao redefinir senha. Tente novamente.');
    }
  };

  const voltarEtapa = () => {
    if (etapa === 'codigo') setEtapa('email');
    else if (etapa === 'novaSenha') setEtapa('codigo');
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <CardTitle className="text-center text-2xl">Redefinir Senha</CardTitle>
          <CardDescription className="text-center">
            {etapa === 'email' && 'Digite seu email para receber o código de verificação'}
            {etapa === 'codigo' && 'Digite o código que enviamos para seu email'}
            {etapa === 'novaSenha' && 'Crie sua nova senha'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={
              etapa === 'email'
                ? handleEnviarCodigo
                : etapa === 'codigo'
                ? handleVerificarCodigo
                : handleRedefinirSenha
            }
          >
            <div className="flex flex-col gap-6">
              {etapa === 'email' && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {etapa === 'codigo' && (
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código de Verificação</Label>
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="Digite o código de 6 dígitos"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    Enviado para: {email}
                  </p>
                </div>
              )}

              {etapa === 'novaSenha' && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      placeholder="Digite sua nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      required
                      minLength={6}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Confirme sua nova senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                      minLength={6}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <div className="flex w-full gap-2">
            {etapa !== 'email' && (
              <Button
                type="button"
                variant="outline"
                onClick={voltarEtapa}
                disabled={isLoading}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button
              type="submit"
              onClick={
                etapa === 'email'
                  ? handleEnviarCodigo
                  : etapa === 'codigo'
                  ? handleVerificarCodigo
                  : handleRedefinirSenha
              }
              disabled={isLoading}
              className={etapa !== 'email' ? 'flex-1' : 'w-full'}
            >
              {isLoading
                ? etapa === 'email'
                  ? 'Enviando...'
                  : etapa === 'codigo'
                  ? 'Verificando...'
                  : 'Redefinindo...'
                : etapa === 'email'
                ? 'Enviar Código'
                : etapa === 'codigo'
                ? 'Verificar Código'
                : 'Redefinir Senha'}
            </Button>
          </div>

          <Button
            variant="link"
            onClick={() => navigate('/login')}
            className="text-sm text-muted-foreground"
          >
            ← Voltar para o login
          </Button>

          <div className="flex justify-center gap-2 mt-2">
            {['email', 'codigo', 'novaSenha'].map((step, index) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === ['email', 'codigo', 'novaSenha'].indexOf(etapa)
                    ? 'bg-blue-600'
                    : index < ['email', 'codigo', 'novaSenha'].indexOf(etapa)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default EsqSenha;