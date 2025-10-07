import ListarUsuarios from '@/pages/Usuario/ListarUsuario';
import { LogoutButton } from '@/components/LogoutButton';

export default function UsuariosPage() {
  return (
    <div className='container mx-auto px-4 py-10'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Gerenciamento de Usuários</h1>
        <LogoutButton />
      </div>
      <ListarUsuarios />
    </div>
  );
}
