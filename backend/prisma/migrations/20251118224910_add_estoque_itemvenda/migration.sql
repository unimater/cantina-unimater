/*
  Warnings:

  - You are about to drop the column `created_by` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `formaPagamentoId` on the `Venda` table. All the data in the column will be lost.
  - Added the required column `forma_pagamento_id` to the `Venda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorTotal` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Venda" DROP CONSTRAINT "Venda_formaPagamentoId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "public"."Venda" DROP COLUMN "formaPagamentoId",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forma_pagamento_id" TEXT NOT NULL,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "valorTotal" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "public"."ItemVenda" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "valorUnitario" DECIMAL(65,30) NOT NULL,
    "valorTotal" DECIMAL(65,30) NOT NULL,
    "venda_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ItemVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estoque" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_min" INTEGER NOT NULL DEFAULT 5,
    "produto_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_produto_id_key" ON "public"."Estoque"("produto_id");

-- AddForeignKey
ALTER TABLE "public"."Venda" ADD CONSTRAINT "Venda_forma_pagamento_id_fkey" FOREIGN KEY ("forma_pagamento_id") REFERENCES "public"."formasPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemVenda" ADD CONSTRAINT "ItemVenda_venda_id_fkey" FOREIGN KEY ("venda_id") REFERENCES "public"."Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ItemVenda" ADD CONSTRAINT "ItemVenda_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Estoque" ADD CONSTRAINT "Estoque_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
