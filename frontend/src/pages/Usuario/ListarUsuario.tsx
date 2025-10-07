import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import CriarUsuario from './CriarUsuario';
import EditarUsuario from './EditarUsuario';
import type { Usuario } from '@/type/Usuario';
import { toast } from 'sonner';

const ListarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: 'Ana Silva',
      situacao: true,
      email: 'ana@faculdade.edu',
      telefone: '(11) 91234-5678',
      usuario: 'ana.silva',
      senha: 'hashed',
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const handleCriar = (novoUsuario: Usuario) => {
    setUsuarios(prev => [...prev, novoUsuario]);
  };

  const handleAtualizar = (usuarioAtualizado: Usuario) => {
    setUsuarios(prev => prev.map(u => (u.id === usuarioAtualizado.id ? usuarioAtualizado : u)));
  };

  const handleExcluir = (id: number) => {
    if (
      confirm(
        'Ao excluir o item não será possível reverter. Deseja realmente prosseguir com a ação?'
      )
    ) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
      toast.success('Excluído', { description: 'O usuário foi removido com sucesso.' });
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Usuários</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Filtrar por nome...'
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={150}
                className='pl-10'
              />
            </div>
            <CriarUsuario
              onUsuarioCriado={handleCriar}
              usuariosExistentes={usuarios}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map(usuario => (
                <TableRow key={usuario.id}>
                  <TableCell className='font-mono text-sm'>{usuario.id}</TableCell>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        usuario.situacao ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {usuario.situacao ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <EditarUsuario
                      usuario={usuario}
                      onUsuarioAtualizado={handleAtualizar}
                      usuariosExistentes={usuarios}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleExcluir(usuario.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-muted-foreground py-6 text-center'
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarUsuarios;
