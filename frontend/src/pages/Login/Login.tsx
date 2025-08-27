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

export function Login() {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-center'>Login</CardTitle>
        <CardDescription className='text-center'>
          Insira seu email e senha abaixo para entrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='email@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Senha</Label>
                <a
                  href='#'
                  className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <Input
                id='password'
                type='password'
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <Button
          type='submit'
          className='w-full'
        >
          Login
        </Button>
        <Button
          variant='outline'
          className='w-full'
        >
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
