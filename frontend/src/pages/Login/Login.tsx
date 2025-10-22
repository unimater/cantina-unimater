import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUtils } from '@/lib/auth';
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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('http://localhost:3000/sessions', {
        username: email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast('Login realizado com sucesso.', {
        description: 'Redirecionando para a área de usuários...',
      });

      const userData = {
        id: 1,
        email: email,
        nome: 'Usuário Teste',
        usuario: email,
        situacao: true,
        senha: '',
      };

      authUtils.setUser(userData);

      navigate('/usuarios');
    },
    onError: (data: { response: { data: { message: string } } }) => {
      toast.error(data.response.data.message || 'Erro ao fazer login. Verifique suas credenciais.');
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error('Por favor, preencha email e senha.');
      setIsLoading(false);
      return;
    }

    mutation.mutate();
    setIsLoading(false);
  };

  return (
    <div className='flex min-h-svh flex-col items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-center'>Login</CardTitle>
          <CardDescription className='text-center'>
            Insira seu email e senha abaixo para entrar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='email@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Senha</Label>
                  <a
                    href='/esq-senha'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex-col gap-2'>
          <Button
            type='submit'
            onClick={handleLogin}
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Entrando...' : 'Login'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;