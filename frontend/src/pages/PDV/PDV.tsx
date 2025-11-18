// PDV.tsx
import React, { useMemo, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';

const PaymentMethods = ['Dinheiro', 'Cartão', 'PIX'] as const;
type PaymentMethod = (typeof PaymentMethods)[number];

const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number(),
        name: z.string(),
        price: z.number().min(0),
        qty: z.number().int().min(1),
      })
    )
    .min(1, 'Adicione ao menos um produto'),
  paymentMethod: z.enum(PaymentMethods),
  total: z.number().min(0),
});
type CheckoutInput = z.infer<typeof CheckoutSchema>;

type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
};

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: 'Pastel de Queijo', price: 6.5, stock: 10 },
  { id: 2, name: 'Coxinha', price: 5.0, stock: 8 },
  { id: 3, name: 'Suco Laranja', price: 4.0, stock: 15 },
  { id: 4, name: 'Café Expresso', price: 3.5, stock: 20 },
  { id: 5, name: 'Refrigerante Lata', price: 4.5, stock: 12 },
  { id: 6, name: 'Água Mineral', price: 2.5, stock: 30 },
  { id: 7, name: 'Bolo de Chocolate', price: 7.0, stock: 5 },
  { id: 8, name: 'Sanduíche Natural', price: 8.5, stock: 9 },
  { id: 9, name: 'Salada de Frutas', price: 6.0, stock: 14 },
  { id: 10, name: 'Pão de Queijo', price: 4.0, stock: 25 },
];

const currency = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const PDV: React.FC = () => {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Dinheiro');
  const [notif, setNotif] = useState<string | null>(null);

  const filtered = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [products, query]
  );

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const prod = products.find(p => p.id === Number(id))!;
      return {
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        qty,
        subtotal: prod.price * qty,
      };
    });
  }, [cart, products]);

  const totals = useMemo(() => {
    const totalQty = cartItems.reduce((s, it) => s + it.qty, 0);
    const totalPrice = cartItems.reduce((s, it) => s + it.subtotal, 0);
    return { totalQty, totalPrice };
  }, [cartItems]);

  const add = (product: Product) => {
    const current = cart[product.id] ?? 0;
    const newQty = current + 1;
    if (product.stock !== undefined && newQty > product.stock) {
      notify('Estoque insuficiente');
      return;
    }
    setCart(prev => ({ ...prev, [product.id]: newQty }));
    notify('Produto adicionado');
  };

  const remove = (product: Product) => {
    const current = cart[product.id] ?? 0;
    if (current <= 1) {
      const { [product.id]: _, ...rest } = cart;
      setCart(rest);
    } else {
      setCart(prev => ({ ...prev, [product.id]: current - 1 }));
    }
  };

  const clearCart = () => setCart({});

  const notify = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 2000);
  };

  const handleCheckout = () => {
    const payload: CheckoutInput = {
      items: cartItems.map(it => ({
        productId: it.productId,
        name: it.name,
        price: it.price,
        qty: it.qty,
      })),
      paymentMethod,
      total: totals.totalPrice,
    };

    const parsed = CheckoutSchema.safeParse(payload);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      notify(first.message || 'Erro na validação');
      return;
    }

    // Simula envio para backend
    const confirmed = window.confirm(
      `Finalizar venda: ${currency(payload.total)} - ${payload.paymentMethod}?`
    );
    if (!confirmed) return;

    notify('Venda finalizada');
    clearCart();
  };

  return (
    <Card className='bg grid grid-cols-1 gap-4 rounded border p-4 lg:grid-cols-3'>
      <section className='lg:col-span-2'>
        <Card>
          <CardHeader>
            <div className='flex flex-col gap-4 lg:col-span-3'>
              <div className='mb-2 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h1 className='text-2xl font-semibold'>Produtos</h1>
                </div>

                <div className='flex items-center gap-3'>
                  <Input
                    placeholder='Buscar produto...'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className='w-72'
                  />
                  <Button
                    onClick={() => {
                      setQuery('');
                    }}
                  >
                    Limpar
                  </Button>
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
                        <div className='font-medium'>{p.name}</div>
                        <div className='text-sm text-gray-600'>{currency(p.price)}</div>
                        {p.stock !== undefined && (
                          <div className='text-xs text-gray-400'>Estoque: {p.stock}</div>
                        )}
                      </div>

                      <div className='mt-3 flex items-center justify-between'>
                        <div className='flex items-center gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => remove(p)}
                            aria-label={`Remover ${p.name}`}
                          >
                            <Minus />
                          </Button>
                          <div className='w-3 text-center'>{qty}</div>
                          <Button
                            size='sm'
                            onClick={() => add(p)}
                            aria-label={`Adicionar ${p.name}`}
                          >
                            <Plus />
                          </Button>
                        </div>

                        <div className='text-sm'>{currency(p.price * qty)}</div>
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
                <div>Itens</div>
                <div className='font-medium'>{totals.totalQty}</div>
              </div>

              <div className='flex justify-between'>
                <div>Valor</div>
                <div className='font-medium'>{currency(totals.totalPrice)}</div>
              </div>

              <div>
                <div className='mb-2 text-sm'>Forma de pagamento</div>
                <Select
                  onValueChange={v => setPaymentMethod(v as PaymentMethod)}
                  defaultValue={paymentMethod}
                >
                  <SelectTrigger className='w-full'>
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
              <div className='text-sm font-medium'>Total</div>
              <div className='text-lg font-semibold'>{currency(totals.totalPrice)}</div>
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
