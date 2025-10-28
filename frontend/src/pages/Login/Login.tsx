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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post('http://localhost:3000/sessions', { username, password });
    },
    onSuccess: () => {
      toast('Login realizado com sucesso.', {
        description: 'Redirecionando para a página de usuários...',
      });

      authUtils.setUser({
        id: 1,
        nome: 'Usuário Teste',
        usuario: username,
        situacao: true,
        senha: '',
      });

      navigate('/usuarios');
    },
    onError: (data: { response: { data: { message: string } } }) => {
      toast.error(data.response.data.message || 'Erro ao fazer login. Verifique suas credenciais.');
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (username && password) {
        mutation.mutate();
      } else {
        alert('Por favor, preencha username e senha');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-svh flex-col items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-center'>Login</CardTitle>
          <CardDescription className='text-center'>
            Insira seu nome de usuário e senha abaixo para entrar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username'>Nome de Usuário</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='Digite seu nome de usuário'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
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
                  placeholder='************'
                  onChange={e => setPassword(e.target.value)}
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
