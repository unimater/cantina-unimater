-- CreateEnum
CREATE TYPE "public"."TipoCategoria" AS ENUM ('PRODUTO', 'DESPESA');

-- CreateTable
CREATE TABLE "public"."Produto" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "situacao" BOOLEAN NOT NULL,
    "imagem" TEXT,
    "categoria_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "public"."TipoCategoria" NOT NULL,
    "situacao" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Produto" ADD CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
