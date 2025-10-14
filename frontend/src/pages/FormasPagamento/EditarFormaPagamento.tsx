import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface FormaPagamento {
    id: number
    nome: string
    situacao: boolean
}

interface EditarFormaPagamentoProps {
    forma: FormaPagamento | null
    onAtualizado: (id: number, dados: Partial<FormaPagamento>) => void
    onFechar: () => void
}

export default function EditarFormaPagamento({ forma, onAtualizado, onFechar }: EditarFormaPagamentoProps) {
    const [nome, setNome] = useState('')
    const [situacao, setSituacao] = useState(true)

    useEffect(() => {
        if (forma) {
            setNome(forma.nome)
            setSituacao(forma.situacao)
        }
    }, [forma])

    if (!forma) return null

    const handleAtualizar = () => {
        if (!nome.trim()) {
            toast.error('O nome não pode ser vazio')
            return
        }
        onAtualizado(forma.id, { nome, situacao })
        onFechar()
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg w-[400px]'>
                <h2 className='text-xl font-bold mb-4'>Editar Forma de Pagamento</h2>
                <div className='flex flex-col gap-4'>
                    <Input value={nome} onChange={e => setNome(e.target.value)} placeholder='Nome' />
                    <div className='flex items-center gap-2'>
                        <Switch checked={situacao} onCheckedChange={setSituacao} />
                        <span>{situacao ? 'Ativo' : 'Inativo'}</span>
                    </div>
                </div>
                <div className='flex justify-end gap-2 mt-6'>
                    <Button variant='outline' onClick={onFechar}>Cancelar</Button>
                    <Button onClick={handleAtualizar}>Salvar</Button>
                </div>
            </div>
        </div>
    )
}
