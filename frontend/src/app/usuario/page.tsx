import ListarUsuarios from "@/pages/Usuario/ListarUsuario";

export default function UsuariosPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>
      <ListarUsuarios />
    </div>
  );
}