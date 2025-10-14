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

export function EsqSenha() {
  // armazenar os dados do formulário
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // controlar a interface
  const [isLoading, setIsLoading] = useState(false);
  const [etapa, setEtapa] = useState<'email' | 'codigo' | 'novaSenha'>('email'); // Controla em qual etapa do fluxo estamos
  
  const navigate = useNavigate();

  // Função para enviar o código de verificação por email
  const handleEnviarCodigo = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    setIsLoading(true); // Ativa o estado de carregamento

    try {
      // Simulação do envio do código - em produção, aqui iria a chamada da API
      console.log('Código enviado para:', email);
      
      // Simula o tempo de envio do email
      setTimeout(() => {
        setEtapa('codigo'); // Avança para a próxima etapa (digitar código)
        setIsLoading(false); // Desativa o carregamento
        alert(`Código enviado para ${email} (simulação)`); // Feedback para o usuário
      }, 1000);

    } catch (error) {
      console.error('Erro ao enviar código:', error);
      alert('Erro ao enviar código. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Função para verificar se o código digitado está correto
  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulação da verificação do código
      // Em produção, você validaria com a API se o código está correto
      console.log('Código verificado:', codigo);
      
      setTimeout(() => {
        setEtapa('novaSenha'); // Avança para a etapa de criar nova senha
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Erro ao verificar código:', error);
      alert('Código inválido. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Função para redefinir a senha do usuário
  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validação: verifica se as duas senhas digitadas são iguais
      if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        setIsLoading(false);
        return; // Para a execução se as senhas não coincidirem
      }

      // Validação: verifica se a senha tem pelo menos 6 caracteres
      if (novaSenha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres');
        setIsLoading(false);
        return;
      }

      // Simulação da redefinição de senha
      console.log('Senha redefinida para:', novaSenha);
      
      // Aqui você integraria com sua API real para redefinir a senha
      // await api.redefinirSenha(email, codigo, novaSenha);
      
      setTimeout(() => {
        alert('Senha redefinida com sucesso!');
        navigate('/login'); // Redireciona para a página de login
      }, 1000);

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      alert('Erro ao redefinir senha. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Função para voltar para a etapa anterior
  const voltarEtapa = () => {
    if (etapa === 'codigo') {
      setEtapa('email'); // Volta para digitar email
    } else if (etapa === 'novaSenha') {
      setEtapa('codigo'); // Volta para digitar código
    }
  };

  return (
    // Container principal com gradiente de fundo
    <div className='flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-4'>
          {/* Ícone decorativo */}
          <div className='flex items-center justify-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <svg 
                className='h-6 w-6 text-blue-600' 
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
          
          {/* Título e descrição que muda conforme a etapa */}
          <CardTitle className='text-center text-2xl'>Redefinir Senha</CardTitle>
          <CardDescription className='text-center'>
            {etapa === 'email' && 'Digite seu email para receber o código de verificação'}
            {etapa === 'codigo' && 'Digite o código que enviamos para seu email'}
            {etapa === 'novaSenha' && 'Crie sua nova senha'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Formulário dinâmico que muda conforme a etapa */}
          <form onSubmit={
            etapa === 'email' ? handleEnviarCodigo :
            etapa === 'codigo' ? handleVerificarCodigo :
            handleRedefinirSenha
          }>
            <div className='flex flex-col gap-6'>
              
              {/* ETAPA 1: Input para digitar o email */}
              {etapa === 'email' && (
                <div className='grid gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='seu.email@exemplo.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)} // Atualiza o estado do email
                    required
                    className='transition-all focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              )}

              {/* ETAPA 2: Input para digitar o código de verificação */}
              {etapa === 'codigo' && (
                <div className='grid gap-2'>
                  <Label htmlFor='codigo'>Código de Verificação</Label>
                  <Input
                    id='codigo'
                    type='text'
                    placeholder='Digite o código de 6 dígitos'
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)} // Atualiza o estado do código
                    required
                    maxLength={6} // Limita para 6 caracteres
                    className='text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-blue-500'
                  />
                  {/* Mostra o email para onde o código foi "enviado" */}
                  <p className='text-sm text-muted-foreground text-center'>
                    Enviado para: {email}
                  </p>
                </div>
              )}

              {/* ETAPA 3: Inputs para criar e confirmar a nova senha */}
              {etapa === 'novaSenha' && (
                <div className='space-y-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='novaSenha'>Nova Senha</Label>
                    <Input
                      id='novaSenha'
                      type='password'
                      placeholder='Digite sua nova senha'
                      value={novaSenha}
                      onChange={e => setNovaSenha(e.target.value)} // Atualiza o estado da nova senha
                      required
                      minLength={6} // Exige no mínimo 6 caracteres
                      className='focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='confirmarSenha'>Confirmar Senha</Label>
                    <Input
                      id='confirmarSenha'
                      type='password'
                      placeholder='Confirme sua nova senha'
                      value={confirmarSenha}
                      onChange={e => setConfirmarSenha(e.target.value)} // Atualiza o estado da confirmação
                      required
                      minLength={6}
                      className='focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex-col gap-3'>
          {/* Container dos botões principais */}
          <div className='flex w-full gap-2'>
            
            {/* Botão Voltar - só aparece nas etapas 2 e 3 */}
            {etapa !== 'email' && (
              <Button
                type='button'
                variant='outline' // Estilo secundário
                onClick={voltarEtapa} // Volta para etapa anterior
                disabled={isLoading} // Desabilita durante carregamento
                className='flex-1' // Ocupa espaço igual ao botão principal
              >
                Voltar
              </Button>
            )}
            
            {/* Botão Principal - muda de texto conforme a etapa */}
            <Button
              type='submit'
              onClick={
                etapa === 'email' ? handleEnviarCodigo :
                etapa === 'codigo' ? handleVerificarCodigo :
                handleRedefinirSenha
              }
              disabled={isLoading}
              className={etapa !== 'email' ? 'flex-1' : 'w-full'} // Largura condicional
            >
              {isLoading ? (
                // Mostra spinner durante carregamento
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  {etapa === 'email' ? 'Enviando...' : 
                   etapa === 'codigo' ? 'Verificando...' : 
                   'Redefinindo...'}
                </div>
              ) : (
                // Texto normal do botão
                etapa === 'email' ? 'Enviar Código' : 
                etapa === 'codigo' ? 'Verificar Código' : 
                'Redefinir Senha'
              )}
            </Button>
          </div>

          {/* Link para voltar para a página de login */}
          <Button
            variant='link' // Estilo de link
            onClick={() => navigate('/login')} // Redireciona para login
            className='text-sm text-muted-foreground'
          >
            ← Voltar para o login
          </Button>

          {/* Indicador visual de progresso (as bolinhas) */}
          <div className='flex justify-center gap-2 mt-2'>
            {['email', 'codigo', 'novaSenha'].map((step, index) => (
              <div
                key={step}
                className={`h-2 w-2 rounded-full transition-all ${
                  // Lógica para colorir as bolinhas:
                  // - Azul para etapa atual
                  // - Verde para etapas concluídas  
                  // - Cinza para etapas futuras
                  index === ['email', 'codigo', 'novaSenha'].indexOf(etapa)
                    ? 'bg-blue-600' // Etapa atual
                    : index < ['email', 'codigo', 'novaSenha'].indexOf(etapa)
                    ? 'bg-green-500' // Etapas concluídas
                    : 'bg-gray-300' // Etapas futuras
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