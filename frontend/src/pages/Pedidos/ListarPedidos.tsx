import { useEffect, useState } from "react";
import api from "../../api/api";

type PedidoItem = {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number | string;
  subtotal: number | string;
  produto?: {
    id: string;
    descricao: string;
    valor: number | string;
    imagem?: string | null;
  };
};

type Pedido = {
  id: string;
  descricao?: string;
  total: number | string;
  status: "FINALIZADO" | "CANCELADO" | string;
  dataPedido: string;
  motivoCancelamento?: string | null;
  dataCancelamento?: string | null;
  formaPagamento?: {
    id: string;
    descricao: string;
  };
  itens?: PedidoItem[];
};

type ApiListResponse =
  | {
      data: Pedido[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  | Pedido[];

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value: number | string) => {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
};

const ListarPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMotivo, setCancelMotivo] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const carregarPedidos = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (statusFilter) params.status = statusFilter;
      if (dataInicial) params.dataInicial = dataInicial;
      if (dataFinal) params.dataFinal = dataFinal;

      const response = await api.get<ApiListResponse>("/pedidos", { params });
      const body = response.data;

      if (Array.isArray(body)) {
        setPedidos(body);
        setTotalPages(1);
      } else {
        setPedidos(body.data || []);
        setTotalPages(body.totalPages || 1);
      }
    } catch {
      setError("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const abrirDetalhes = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Pedido>(`/pedidos/${id}`);
      setSelectedPedido(response.data);
      setShowDetailsModal(true);
    } catch {
      setError("Erro ao carregar detalhes do pedido.");
    } finally {
      setLoading(false);
    }
  };

  const fecharDetalhes = () => {
    setShowDetailsModal(false);
    setSelectedPedido(null);
  };

  const abrirCancelar = () => {
    setCancelMotivo("");
    setCancelError(null);
    setShowCancelModal(true);
  };

  const fecharCancelar = () => {
    setShowCancelModal(false);
    setCancelMotivo("");
    setCancelError(null);
  };

  const confirmarCancelamento = async () => {
    if (!selectedPedido) return;

    if (!cancelMotivo.trim()) {
      setCancelError("Motivo do cancelamento é obrigatório.");
      return;
    }

    setCancelLoading(true);
    setCancelError(null);

    try {
      await api.patch(`/pedidos/${selectedPedido.id}/cancel`, {
        motivo: cancelMotivo.trim(),
      });

      fecharCancelar();
      fecharDetalhes();
      await carregarPedidos();
    } catch {
      setCancelError("Erro ao cancelar o pedido.");
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, dataInicial, dataFinal]);

  const podeCancelar = (pedido: Pedido) => {
    if (pedido.status === "CANCELADO") return false;

    const hoje = new Date();
    const d = new Date(pedido.dataPedido);

    return (
      d.getDate() === hoje.getDate() &&
      d.getMonth() === hoje.getMonth() &&
      d.getFullYear() === hoje.getFullYear()
    );
  };

  const resetarFiltros = () => {
    setStatusFilter("");
    setDataInicial("");
    setDataFinal("");
    setPage(1);
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="mb-4 text-2xl font-semibold">Gestão de Pedidos</h1>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Filtros</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Data inicial</label>
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => {
                setPage(1);
                setDataInicial(e.target.value);
              }}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Data final</label>
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => {
                setPage(1);
                setDataFinal(e.target.value);
              }}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={resetarFiltros}
              className="h-10 rounded-md border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-medium">Pedidos</h2>
          {loading && (
            <span className="text-xs text-gray-500">Carregando...</span>
          )}
        </div>

        {error && (
          <div className="border-b border-gray-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700">
                  Data do pedido
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-700">
                  Forma de pagamento
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium text-gray-700">
                  Total
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-right font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {pedidos.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}

              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-700">
                    {pedido.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700">
                    {formatDateTime(pedido.dataPedido)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        pedido.status === "FINALIZADO"
                          ? "bg-green-100 text-green-700"
                          : pedido.status === "CANCELADO"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pedido.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-700">
                    {pedido.formaPagamento?.descricao || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right text-sm text-gray-700">
                    {formatMoney(pedido.total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => abrirDetalhes(pedido.id)}
                        className="rounded-md border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Detalhes
                      </button>

                      {podeCancelar(pedido) && (
                        <button
                          type="button"
                          onClick={async () => {
                            await abrirDetalhes(pedido.id);
                            abrirCancelar();
                          }}
                          className="rounded-md border border-red-500 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm">
          <span className="text-gray-600">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedPedido && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-lg font-semibold">Detalhes do Pedido</h2>
              <button
                type="button"
                onClick={fecharDetalhes}
                className="text-xl leading-none text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-4 py-3">
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-gray-500">ID do pedido</p>
                  <p className="break-all font-medium text-gray-800">
                    {selectedPedido.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Data do pedido</p>
                  <p className="font-medium text-gray-800">
                    {formatDateTime(selectedPedido.dataPedido)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      selectedPedido.status === "FINALIZADO"
                        ? "bg-green-100 text-green-700"
                        : selectedPedido.status === "CANCELADO"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedPedido.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Forma de pagamento</p>
                  <p className="font-medium text-gray-800">
                    {selectedPedido.formaPagamento?.descricao || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Valor total</p>
                  <p className="font-medium text-gray-800">
                    {formatMoney(selectedPedido.total)}
                  </p>
                </div>

                {selectedPedido.status === "CANCELADO" && (
                  <>
                    <div>
                      <p className="text-gray-500">Motivo do cancelamento</p>
                      <p className="font-medium text-gray-800">
                        {selectedPedido.motivoCancelamento || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data do cancelamento</p>
                      <p className="font-medium text-gray-800">
                        {formatDateTime(selectedPedido.dataCancelamento)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold">Itens do pedido</h3>

                {selectedPedido.itens && selectedPedido.itens.length > 0 ? (
                  <div className="overflow-x-auto rounded-md border border-gray-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Produto
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            Qtde
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            Preço un.
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPedido.itens.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-100"
                          >
                            <td className="px-3 py-2 text-gray-800">
                              {item.produto?.descricao || item.produtoId}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800">
                              {item.quantidade}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800">
                              {formatMoney(item.precoUnitario)}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-800">
                              {formatMoney(item.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Nenhum item encontrado para este pedido.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <button
                type="button"
                onClick={fecharDetalhes}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>

              {podeCancelar(selectedPedido) && (
                <button
                  type="button"
                  onClick={abrirCancelar}
                  className="rounded-md border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Cancelar pedido
                </button>
              )}
            </div>
          </div>

          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h2 className="text-lg font-semibold text-red-600">
                    Atenção
                  </h2>
                </div>

                <div className="space-y-3 px-4 py-3 text-sm">
                  <p className="text-gray-800">
                    Ao cancelar o pedido, não será possível reverter. Deseja
                    realmente continuar?
                  </p>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-700">
                      Motivo do cancelamento
                    </label>
                    <textarea
                      value={cancelMotivo}
                      onChange={(e) => {
                        setCancelMotivo(e.target.value);
                        if (cancelError) setCancelError(null);
                      }}
                      className="min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    {cancelError && (
                      <span className="text-xs text-red-600">
                        {cancelError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3">
                  <button
                    type="button"
                    onClick={fecharCancelar}
                    disabled={cancelLoading}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={confirmarCancelamento}
                    disabled={cancelLoading}
                    className="rounded-md border border-red-500 bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelLoading ? "Cancelando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListarPedidos;
