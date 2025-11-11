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
import { useEffect, useState } from 'react';
import CriarUsuario from './CriarUsuario';
import EditarUsuario from './EditarUsuario';
import type { Usuario } from '@/type/Usuario';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

const ListarUsuarios: React.FC = () => {
  const [filtro, setFiltro] = useState('');
  const queryClient = useQueryClient();

  const { data: usuarios = [], error } = useQuery({
    queryKey: ['getUsuarios'],
    queryFn: async () => {
      const response = await api.get('http://localhost:3000/users');
      return response.data as Usuario[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`http://localhost:3000/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUsuarios'] });
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error('Erro ao excluir categoria', {
        description: error.response?.data?.message || 'Não foi possível atualizar a categoria.',
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar usuários', {
        description: error.message,
      });
    }
  }, [error]);

  const handleCriar = () => {
    queryClient.invalidateQueries({ queryKey: ['getUsuarios'] });
  };

  const handleAtualizar = () => {
    queryClient.invalidateQueries({ queryKey: ['getUsuarios'] });
  };

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteMutation.mutate(id);
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.name.toLowerCase().includes(filtro.toLowerCase())
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
                  <TableCell>{usuario.name}</TableCell>
                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        usuario.active ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {usuario.active ? 'Ativo' : 'Inativo'}
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
                      onClick={() => handleExcluir(usuario.id!)}
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
