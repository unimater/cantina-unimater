export interface Usuario {
  id?: string;
  cpf?: string;
  name: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  token?: string;
}
