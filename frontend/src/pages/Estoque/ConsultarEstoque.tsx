import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Produto } from "@/type/Produto";
import type { Usuario } from "@/type/Usuario";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { PackageCheck, PackageMinus, EraserIcon, ChevronDownIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface ConsultarEstoqueProps {
  onFiltrar: (filtros: {
    tipo: string;
    produtoId: string;
    usuarioId: string;
    dataInicio: Date | undefined;
    dataFim: Date | undefined;
  }) => void;
}

export function ConsultarEstoque({ onFiltrar }: ConsultarEstoqueProps) {
    const [open, setOpen] = useState(false);
    const [openDataInicio, setOpenDataInicio] = useState(false);
    const [openDataFim, setOpenDataFim] = useState(false);


    const { data: produto } = useQuery({
        queryKey: ['getProdutos'],
        queryFn: async () => {
        const response = await axios.get('http://localhost:3000/produtos');
        return response.data as Produto[];
        },
    });

    const { data: usuario } = useQuery({
        queryKey: ['getUsuarios'],
        queryFn: async () => {
        const response = await axios.get('http://localhost:3000/users');
        return response.data as Usuario[];
        },
    });

    function zerarFiltros(){
        setTipo("");
        setProdutoId("");
        setUsuarioId("");
        setDataInicio(undefined);
        setDataFim(undefined);

        onFiltrar({
            tipo: "",
            produtoId:"",
            usuarioId: "",
            dataInicio: undefined,
            dataFim: undefined
        })
    }

    const [tipo, setTipo] = useState("");
    const [produtoId, setProdutoId] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [dataInicio, setDataInicio] = useState<Date | undefined>();
    const [dataFim, setDataFim] = useState<Date | undefined>();

    return (
        <Dialog
        open={open}
        onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">Filtrar Movimentações</Button>
            </DialogTrigger>

            <DialogContent className='flex flex-col'>
                <DialogHeader>  
                    <DialogTitle>Selecione os Filtros:</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col justify-items-center gap-2">
                    <Label>
                        Tipo:
                    </Label>
                    <div className="flex justify-between gap-2">
                        <Select
                            value={tipo}
                            onValueChange={(value) => setTipo(value)}
                        >
                            <SelectTrigger className="w-f">
                                <SelectValue placeholder="Tipo..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipo</SelectLabel>
                                    <SelectItem value="ENTRADA"><span className='flex'><PackageCheck className='pr-1' color='green'/>Entrada</span></SelectItem>
                                    <SelectItem value="SAIDA"><span className='flex'><PackageMinus className='pr-1' color='red'/>Saída</span></SelectItem>
                                </SelectGroup>
                            </SelectContent>    
                        </Select>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setTipo("")}><EraserIcon/>
                        </Button>
                    </div>

                    <Label>
                        Produto:
                    </Label>
                    <div className="flex justify-between gap-2">
                        <Select
                            value={produtoId}
                            onValueChange={(value) => setProdutoId(value)}
                        >
                            <SelectTrigger className="w-f">
                                <SelectValue placeholder="Produto..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Produto</SelectLabel>
                                    {produto?.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.descricao}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setProdutoId("")}><EraserIcon/>
                            </Button>
                    </div>
                    <Label>
                        Usuário:
                    </Label>
                    <div className="flex justify-between gap-2">
                        <Select
                            value={usuarioId}
                            onValueChange={(value) => setUsuarioId(value)}
                        >
                            <SelectTrigger className="w-f">
                                <SelectValue placeholder="Usuário..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Usuário</SelectLabel>
                                    {usuario?.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                            <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setUsuarioId("")}><EraserIcon/>
                            </Button>
                    </div>
                    <Label>
                        Período:
                    </Label>
                    <div className="flex justify-between gap-2">
                        <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
                            <PopoverTrigger>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48"
                            >
                                {dataInicio ? dataInicio.toLocaleDateString() : "Data Inicial"}
                                <ChevronDownIcon />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="overflow-hidden p-0 w-auto" align="start">
                            <Calendar
                                className="w-48"
                                mode="single"
                                selected={dataInicio}
                                onSelect={(date) => {
                                setDataInicio(date)
                                setOpenDataInicio(false)
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                        <Popover open={openDataFim} onOpenChange={setOpenDataFim}>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48"
                            >
                                {dataFim ? dataFim.toLocaleDateString() : "Data Final"}
                                <ChevronDownIcon />
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="overflow-hidden p-0 w-auto" align="start">
                                <Calendar
                                    className="w-48"
                                    mode="single"
                                    selected={dataFim}
                                    onSelect={(date) => {
                                    setDataFim(date)
                                    setOpenDataFim(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => {setDataFim(undefined); setDataInicio(undefined);}}><EraserIcon/>
                        </Button>
                    </div>
                </div>
                
                <div className='flex justify-end gap-2 pt-4'>
                    <DialogClose asChild>
                        <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            setOpen(false);
                        }}
                        >
                            Cancelar
                        </Button>
                    </DialogClose>
                    
                    <Button
                        onClick={() => {
                            zerarFiltros();
                            setOpen(false);
                        }}
                        variant="destructive"
                    >
                        Remover
                    </Button>

                    <Button 
                        type='submit' 
                        onClick={() => {
                            onFiltrar({
                                tipo,
                                produtoId,
                                usuarioId,
                                dataInicio,
                                dataFim,
                            });
                            setOpen(false);
                        }}
                    >
                        Filtrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}