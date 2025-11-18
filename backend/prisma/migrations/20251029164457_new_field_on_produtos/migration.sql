-- AlterTable
ALTER TABLE "public"."Produto" ADD COLUMN     "estoqueMinimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "quantidadeEstoque" DECIMAL(65,30) NOT NULL DEFAULT 0;
