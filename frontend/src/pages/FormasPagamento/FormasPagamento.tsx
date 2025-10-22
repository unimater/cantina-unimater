import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import CriarFormaPagamento from './CriarFormaPagamento'
import EditarFormaPagamento from './EditarFormaPagamento'

interface FormaPagamento {
  id: number
  nome: string
  situacao: boolean
}

export default function FormasPagamento() {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([])
  const [buscaId, setBuscaId] = useState('')
  const [resultadoBusca, setResultadoBusca] = useState<FormaPagamento | null>(null)
  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null)
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    setFormasPagamento([
      { id: 1, nome: 'Dinheiro', situacao: true },
      { id: 2, nome: 'Cartão de Crédito', situacao: true },
      { id: 3, nome: 'Pix', situacao: false },
    ])
  }, [])

  const listarFormasPagamento = () => formasPagamento

  const buscarFormaPagamentoPorId = (id: number) => {
    const forma = formasPagamento.find(f => f.id === id)
    if (!forma) {
      toast.error('Forma de pagamento não encontrada')
      setResultadoBusca(null)
      return
    }
    setResultadoBusca(forma)
  }

  const criarFormaPagamento = (nova: Omit<FormaPagamento, 'id'>) => {
    const novoId = formasPagamento.length > 0 ? Math.max(...formasPagamento.map(f => f.id)) + 1 : 1
    setFormasPagamento(prev => [...prev, { ...nova, id: novoId }])
    toast.success('Forma de pagamento criada com sucesso')
  }

  const atualizarFormaPagamento = (id: number, dados: Partial<FormaPagamento>) => {
    setFormasPagamento(prev => prev.map(f => (f.id === id ? { ...f, ...dados } : f)))
    toast.success('Forma de pagamento atualizada')
  }

  const deletarFormaPagamento = (id: number) => {
    setFormasPagamento(prev => prev.filter(f => f.id !== id))
    toast.success('Forma de pagamento excluída')
  }

  useEffect(() => {
    if (!buscaId) setResultadoBusca(null)
  }, [buscaId])

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold'>Formas de Pagamento</h2>
        <CriarFormaPagamento onCriado={criarFormaPagamento} existentes={formasPagamento} />
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Input
          placeholder='Buscar por ID'
          value={buscaId}
          onChange={e => setBuscaId(e.target.value)}
          className='max-w-[200px]'
        />
        <Button
          onClick={() => {
            if (buscaId && !isNaN(Number(buscaId))) buscarFormaPagamentoPorId(Number(buscaId))
            else toast.error('Digite um ID válido')
          }}
        >
          Buscar
        </Button>
      </div>

      {resultadoBusca && (
        <div className='rounded-lg border p-4 bg-white shadow-sm mb-6'>
          <h3 className='font-semibold mb-2'>Resultado da Busca</h3>
          <p><strong>ID:</strong> {resultadoBusca.id}</p>
          <p><strong>Nome:</strong> {resultadoBusca.nome}</p>
          <p>
            <strong>Situação:</strong>{' '}
            {resultadoBusca.situacao ? (
              <span className='text-green-600 font-medium'>Ativo</span>
            ) : (
              <span className='text-red-600 font-medium'>Inativo</span>
            )}
          </p>
        </div>
      )}

      <div className='rounded-lg border bg-white shadow-sm overflow-hidden'>
        <table className='w-full border-collapse text-sm'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='text-left p-3'>ID</th>
              <th className='text-left p-3'>Nome</th>
              <th className='text-left p-3'>Situação</th>
              <th className='text-right p-3'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listarFormasPagamento().map(forma => (
              <tr key={forma.id} className='border-t'>
                <td className='p-3'>{forma.id}</td>
                <td className='p-3'>{forma.nome}</td>
                <td className='p-3'>
                  <div className='flex items-center gap-2'>
                    <Switch
                      checked={forma.situacao}
                      onCheckedChange={v => atualizarFormaPagamento(forma.id, { situacao: v })}
                    />
                    {forma.situacao ? (
                      <span className='text-green-600 font-medium'>Ativo</span>
                    ) : (
                      <span className='text-red-600 font-medium'>Inativo</span>
                    )}
                  </div>
                </td>
                <td className='p-3 text-right'>
                  <Button
                    variant='outline'
                    className='mr-2'
                    onClick={() => {
                      setFormaSelecionada(forma)
                      setModalAberto(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button variant='destructive' onClick={() => deletarFormaPagamento(forma.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && formaSelecionada && (
        <EditarFormaPagamento
          forma={formaSelecionada}
          onAtualizado={atualizarFormaPagamento}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  )
}
