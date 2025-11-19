import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Iniciando limpeza dos dados mockados...\n');

  // Deletar na ordem correta devido às foreign keys
  await prisma.itemVenda.deleteMany();
  console.log('✅ ItemVenda deletados');

  await prisma.vendaProduto.deleteMany();
  console.log('✅ VendaProduto deletados');

  await prisma.venda.deleteMany();
  console.log('✅ Vendas deletadas');

  await prisma.movimentacaoEstoque.deleteMany();
  console.log('✅ Movimentações de estoque deletadas');

  await prisma.estoque.deleteMany();
  console.log('✅ Estoques deletados');

  await prisma.despesa.deleteMany();
  console.log('✅ Despesas deletadas');

  await prisma.produto.deleteMany();
  console.log('✅ Produtos deletados');

  await prisma.formasPagamento.deleteMany();
  console.log('✅ Formas de pagamento deletadas');

  await prisma.categoria.deleteMany();
  console.log('✅ Categorias deletadas');

  await prisma.user.deleteMany();
  console.log('✅ Usuários deletados');

  console.log('\n✨ Limpeza concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao limpar dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
