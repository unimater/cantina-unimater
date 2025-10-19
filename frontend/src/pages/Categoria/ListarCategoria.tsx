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
import CriarCategoria from './CriarCategoria';
import EditarCategoria from './EditarCategoria';
import { toast } from 'sonner';
import type { Categoria } from '@/type/Categoria';
import api from '@/api/api';

const ListarCategoria: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState('');

  // Buscar categorias do backend
  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error: any) {
      toast.error('Erro ao carregar categorias', {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Criar categoria
  const handleCriar = (categoria: Categoria) => {
    setCategorias(prev => [...prev, categoria]);
  };

  // Atualizar categoria
  const handleAtualizar = (categoriaAtualizada: Categoria) => {
    setCategorias(prev =>
      prev.map(c => (c.id === categoriaAtualizada.id ? categoriaAtualizada : c))
    );
  };

  // Excluir categoria
  const handleExcluir = async (id: string) => {
    try {
      await api.delete(`/categorias/${id}`);
      setCategorias(prev => prev.filter(c => c.id !== id));
      toast.success('Categoria excluída com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir categoria', {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  const categoriasFiltradas = categorias.filter(c =>
    c.descricao?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Categorias</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Filtrar por descrição...'
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={150}
                className='pl-10'
              />
            </div>
            <CriarCategoria
              onCategoriaCriada={handleCriar}
              categoriasExistentes={categorias}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map(categoria => (
                <TableRow key={`categoria-${categoria.id}`}>
                  <TableCell className='font-mono text-sm'>{categoria.id}</TableCell>
                  <TableCell>{categoria.descricao}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        categoria.tipo === 'PRODUTO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {categoria.tipo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        categoria.situacao ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {categoria.situacao ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <EditarCategoria
                      key={`editar-categoria-${categoria.id}`}
                      categoria={categoria}
                      onCategoriaAtualizada={handleAtualizar}
                      categoriasExistentes={categorias}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleExcluir(categoria.id)}
                      className='cursor-pointer'
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-muted-foreground py-6 text-center'
                >
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarCategoria;
