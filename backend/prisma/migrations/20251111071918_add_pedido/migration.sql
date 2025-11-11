-- CreateEnum
CREATE TYPE "public"."StatusPedido" AS ENUM ('FINALIZADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "public"."Pedido" (
    "id" TEXT NOT NULL,
    "dataPedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."StatusPedido" NOT NULL DEFAULT 'FINALIZADO',
    "total" DECIMAL(65,30) NOT NULL,
    "motivoCancelamento" TEXT,
    "dataCancelamento" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "forma_pagamento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PedidoItem" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitario" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "produtoId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_forma_pagamento_id_fkey" FOREIGN KEY ("forma_pagamento_id") REFERENCES "public"."formasPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
