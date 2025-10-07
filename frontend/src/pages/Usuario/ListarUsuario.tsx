import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import CriarUsuario from "./CriarUsuario";
import EditarUsuario from "./EditarUsuario";
import { Usuario } from "@/type/Usuario";

const ListarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nome: "Ana Silva",
      situacao: true,
      email: "ana@faculdade.edu",
      telefone: "(11) 91234-5678",
      usuario: "ana.silva",
      senha: "hashed",
    },
  ]);

  const [filtro, setFiltro] = useState("");

  const handleCriar = (novoUsuario: Usuario) => {
    setUsuarios((prev) => [...prev, novoUsuario]);
  };

  const handleAtualizar = (usuarioAtualizado: Usuario) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioAtualizado.id ? usuarioAtualizado : u))
    );
  };

  const handleExcluir = (id: number) => {
    if (confirm("Ao excluir o item não será possível reverter. Deseja realmente prosseguir com a ação?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      toast.success("Excluído", { description: "O usuário foi removido com sucesso." });
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Usuários</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filtrar por nome..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                maxLength={150}
                className="pl-10"
              />
            </div>
            <CriarUsuario
              onUsuarioCriado={handleCriar}
              usuariosExistentes={usuarios}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-mono text-sm">{usuario.id}</TableCell>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        usuario.situacao ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {usuario.situacao ? "Ativo" : "Inativo"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditarUsuario
                      usuario={usuario}
                      onUsuarioAtualizado={handleAtualizar}
                      usuariosExistentes={usuarios}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleExcluir(usuario.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarUsuarios;