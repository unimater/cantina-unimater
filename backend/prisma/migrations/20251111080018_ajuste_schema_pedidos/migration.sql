/*
  Warnings:

  - You are about to drop the `formasPagamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `descricao` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Pedido" DROP CONSTRAINT "Pedido_forma_pagamento_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pedido" DROP CONSTRAINT "Pedido_usuario_id_fkey";

-- AlterTable
ALTER TABLE "public"."Pedido" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "situacao" BOOLEAN,
ALTER COLUMN "usuario_id" DROP NOT NULL,
ALTER COLUMN "forma_pagamento_id" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."formasPagamento";

-- CreateTable
CREATE TABLE "public"."FormasPagamento" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "FormasPagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido" ADD CONSTRAINT "Pedido_forma_pagamento_id_fkey" FOREIGN KEY ("forma_pagamento_id") REFERENCES "public"."FormasPagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
