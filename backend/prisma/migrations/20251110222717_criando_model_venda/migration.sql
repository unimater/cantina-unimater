-- CreateTable
CREATE TABLE "public"."Venda" (
    "id" TEXT NOT NULL,
    "valor_total_venda" DECIMAL(65,30) NOT NULL,
    "valor_total_desconto" DECIMAL(65,30) NOT NULL,
    "valor_liquido" DECIMAL(65,30) NOT NULL,
    "formaPagamentoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendaProduto" (
    "id" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "vendaId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "VendaProduto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Venda" ADD CONSTRAINT "Venda_formaPagamentoId_fkey" FOREIGN KEY ("formaPagamentoId") REFERENCES "public"."formasPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Venda" ADD CONSTRAINT "Venda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendaProduto" ADD CONSTRAINT "VendaProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendaProduto" ADD CONSTRAINT "VendaProduto_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "public"."Venda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
