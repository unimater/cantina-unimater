/*
  Warnings:

  - Added the required column `created_by` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Despesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `formasPagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Categoria" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Despesa" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Produto" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."formasPagamento" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Produto" ADD CONSTRAINT "Produto_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Categoria" ADD CONSTRAINT "Categoria_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Despesa" ADD CONSTRAINT "Despesa_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."formasPagamento" ADD CONSTRAINT "formasPagamento_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
