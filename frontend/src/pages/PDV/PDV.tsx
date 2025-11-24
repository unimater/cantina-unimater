import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
import type { ConcluirVendaPDV } from '@/type/PDV';
import api from '@/api/api';
import type { Produto } from '@/type/Produto';

const PaymentMethods = ['Dinheiro', 'Cartão', 'PIX'] as const;
type PaymentMethod = (typeof PaymentMethods)[number];

const currency = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

interface Product {
  id: string;
  descricao: string;
  valor: number;
  quantidadeEstoque: number;
  situacao: boolean;
  categoriaId: string;
}

const PDV: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
  const load = async () => {
    try {
      const { data } = await api.get("http://localhost:3000/produtos");

      const mapped: Product[] = data.map((p: any) => ({
        ...p,
        valor: Number(p.valor),
        quantidadeEstoque: Number(p.quantidadeEstoque),
      }));

      setProducts(mapped);
    } catch (e) {
      notify("Erro ao carregar produtos");
    }
  };

  load();
}, []);

  const notify = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2000);
  };

  const filtered = useMemo(
    () => products.filter(p => p.descricao.toLowerCase().includes(query.trim().toLowerCase())),
    [products, query]
  );

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const prod = products.find(p => p.id === id)!;
      return {
        productId: prod.id,
        name: prod.descricao,
        price: Number(prod.valor),
        qty,
        subtotal: Number(prod.valor) * qty,
      };
    });
  }, [cart, products]);

  const totals = useMemo(() => {
    const totalQty = cartItems.reduce((s, it) => s + it.qty, 0);
    const totalPrice = cartItems.reduce((s, it) => s + it.subtotal, 0);
    return { totalQty, totalPrice };
  }, [cartItems]);

  const add = (product: Product) => {
    const id = String(product.id);
    const current = cart[id] ?? 0;
    const next = current + 1;

    if ((product as any).stock !== undefined && next > (product as any).stock) {
      notify('Estoque insuficiente');
      return;
    }

    setCart(prev => ({ ...prev, [id]: next }));
    notify('Produto adicionado');
  };

  const remove = (product: Produto) => {
    const id = String(product.id);
    const current = cart[id] ?? 0;
    if (current <= 1) {
      const { [id]: _, ...rest } = cart;
      setCart(rest);
    } else {
      setCart(prev => ({ ...prev, [id]: current - 1 }));
    }
  };

  const clearCart = () => setCart({});

  // -----------------------------
  // ✅ Checkout refatorado
  // -----------------------------
  const handleCheckout = async () => {
    const payload: ConcluirVendaPDV = {
      produtos: cartItems.map(it => ({
        produtoId: String(it.productId),
        quantidade: it.qty,
        valorUnitario: it.price,
      })),
      valorTotalVenda: totals.totalPrice,
      valorTotalDesconto: 0,
      formaPagamentoId: paymentMethod,
      usuarioId: '1',
    };

    try {
      const confirmed = window.confirm(
        `Finalizar venda: ${currency(totals.totalPrice)} - ${paymentMethod}?`
      );
      if (!confirmed) return;

      await api.post('http://localhost:3000/vendas', payload);

      notify('Venda finalizada!');
      clearCart();
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Erro ao finalizar');
    }
  };

  return (
    <Card className='bg grid grid-cols-1 gap-4 rounded border p-4 lg:grid-cols-3'>
      <section className='lg:col-span-2'>
        <Card>
          <CardHeader>
            <div className='flex flex-col gap-4 lg:col-span-3'>
              <div className='mb-2 flex items-center justify-between'>
                <h1 className='text-2xl font-semibold'>Produtos</h1>

                <div className='flex items-center gap-3'>
                  <Input
                    placeholder='Buscar produto...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='w-72'
                  />
                  <Button onClick={() => setQuery('')}>Limpar</Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className='p-6 text-center text-gray-500'>Nenhum produto disponível</div>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                {filtered.map(p => {
                  const qty = cart[p.id] ?? 0;

                  return (
                    <div
                      key={p.id}
                      className='flex flex-col justify-between rounded border p-3'
                    >
                      <div>
                        <div className='font-medium'>{p.descricao}</div>
                        <div className='text-sm text-gray-600'>{currency(p.valor)}</div>
                      </div>

                      <div className='mt-3 flex items-center justify-between'>
                        <div className='flex items-center gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => remove(p)}
                          >
                            <Minus />
                          </Button>
                          <div className='w-3 text-center'>{qty}</div>
                          <Button
                            size='sm'
                            onClick={() => add(p)}
                          >
                            <Plus />
                          </Button>
                        </div>

                        <div className='text-sm'>{currency(p.valor * qty)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <aside className='lg:col-span-1'>
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span>Itens</span>
                <span className='font-medium'>{totals.totalQty}</span>
              </div>

              <div className='flex justify-between'>
                <span>Valor</span>
                <span className='font-medium'>{currency(totals.totalPrice)}</span>
              </div>

              <div>
                <div className='mb-2 text-sm'>Forma de pagamento</div>
                <Select
                  onValueChange={v => setPaymentMethod(v as PaymentMethod)}
                  defaultValue={paymentMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecionar' />
                  </SelectTrigger>
                  <SelectContent>
                    {PaymentMethods.map(m => (
                      <SelectItem
                        key={m}
                        value={m}
                      >
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className='mb-2 text-sm'>Itens no carrinho</div>

                <div className='max-h-48 space-y-2 overflow-auto'>
                  {cartItems.length === 0 ? (
                    <div className='text-sm text-gray-500'>Nenhum item</div>
                  ) : (
                    cartItems.map(it => (
                      <div
                        key={it.productId}
                        className='flex items-center justify-between'
                      >
                        <div>
                          <div className='text-sm'>
                            {it.name} <span className='text-xs text-gray-400'>x{it.qty}</span>
                          </div>
                          <div className='text-xs text-gray-500'>{currency(it.subtotal)}</div>
                        </div>
                        <div className='text-sm'>{currency(it.price)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Total</span>
              <span className='text-lg font-semibold'>{currency(totals.totalPrice)}</span>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={() => {
                  clearCart();
                  notify('Pedido limpo');
                }}
                variant='outline'
              >
                Limpar
              </Button>

              <Button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Finalizar
              </Button>
            </div>
          </CardFooter>
        </Card>
      </aside>

      {notif && (
        <div className='fixed top-6 right-6 rounded bg-black px-4 py-2 text-white shadow'>
          {notif}
        </div>
      )}
    </Card>
  );
};

export default PDV;
