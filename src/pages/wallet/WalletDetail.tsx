import { useEffect, useState } from "react";
import {
    Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Box
} from "@mui/material";
import { deleteWallet, getWallets } from "../../services/walletService";
import { formatCurrency } from "../../utils/formatCurrency";
import CreateWalletModal from "./CreateWallet";
import { } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


interface Investment {
    id: string;
    name: string;
    amount: number;
    risk: string;
    profitability: number;
}

interface Wallet {
    id: string;
    name: string;
    balance: number;
    spentAmount: number;
    investments: Investment[];
}

const WalletDetail = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
    const [,] = useState<string>("");
    const [, setEditWalletData] = useState<any>({});
    const [openCreateModal, setOpenCreateModal] = useState(false);


    const [marketData, setMarketData] = useState({
        avgSpent: 0,
        avgRisk: 0,
        avgProfitability: 0,
    });

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const data: Wallet[] = await getWallets();
                setWallets(data);

                if (data.length > 0) {
                    const totalSpent = data.reduce((acc, wallet) => acc + (wallet.spentAmount || 0), 0);
                    const totalRisk = data.reduce(
                        (acc, wallet) => acc + wallet.investments.reduce((sum, investment) => sum + (parseInt(investment.risk) || 0), 0),
                        0
                    );
                    const totalProfitability = data.reduce(
                        (acc, wallet) => acc + wallet.investments.reduce((sum, investment) => sum + (investment.profitability || 0), 0),
                        0
                    );
                    const totalInvestments = data.reduce((acc, wallet) => acc + wallet.investments.length, 0);

                    setMarketData({
                        avgSpent: totalSpent / data.length,
                        avgRisk: totalInvestments > 0 ? totalRisk / totalInvestments : 0,
                        avgProfitability: totalInvestments > 0 ? totalProfitability / totalInvestments : 0,
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar as carteiras", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, []);

    useEffect(() => {
        if (selectedWalletId) {
            const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);
            if (selectedWallet) {
                setInvestments(selectedWallet.investments || []);
            }
        }
    }, [selectedWalletId, wallets]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">Carregando...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col p-4">
            {/* Seção de Carteiras */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Minhas Carteiras</h2>
                <p className="text-lg font-semibold text-gray-800 mb-4">Total de Fundos: {formatCurrency(wallets.reduce((total, wallet) => total + wallet.balance, 0))}</p>
                <Box flex={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setOpenCreateModal(true)}
                        className="mb-4 text-sm px-4 py-2"
                    >
                        Criar Nova Carteira
                    </Button>
                    <CreateWalletModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onCreate={() => { }} />
                </Box>
                <div className="flex overflow-x-auto space-x-4 py-2">
                    {wallets.map(wallet => (
                        <div key={wallet.id} className="min-w-[250px] bg-white rounded-lg shadow-md p-4 border cursor-pointer" onClick={() => setSelectedWalletId(wallet.id)}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{wallet.name}</h3>
                            <p className="text-gray-600 font-medium">Saldo: {formatCurrency(wallet.balance)}</p>
                            <div className="flex gap-2 mt-3">
                                <Button variant="outlined" color="secondary" onClick={() => setEditWalletData(wallet)} className="text-xs px-2 py-1">
                                    Editar
                                </Button>
                                <Button variant="outlined" color="error" onClick={() => deleteWallet(wallet.id)} className="text-xs px-2 py-1">
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Seção de Investimentos */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Investimentos</h2>
                <TableContainer component={Paper} className="overflow-x-auto">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Valor Investido</TableCell>
                                <TableCell>Risco</TableCell>
                                <TableCell>Rentabilidade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {investments.map((investment) => (
                                <TableRow key={investment.id}>
                                    <TableCell>{investment.name}</TableCell>
                                    <TableCell>{formatCurrency(investment.amount)}</TableCell>
                                    <TableCell>{investment.risk}</TableCell>
                                    <TableCell>{investment.profitability}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mt-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Gastos</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[{ name: "Gastos Médios", value: marketData.avgSpent }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#E63946" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Risco</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[{ name: "Risco Médio", value: marketData.avgRisk }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#1D3557" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Possíveis Ganhos</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[{ name: "Ganhos Médios", value: marketData.avgProfitability }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#457B9D" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default WalletDetail;
