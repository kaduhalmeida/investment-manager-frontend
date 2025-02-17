import { useEffect, useState } from "react";
import { getWallets } from "../../services/walletService";
import { formatCurrency } from "../../utils/formatCurrency";
import { Link } from "react-router-dom";

interface Investment {
    id: string;
    name: string;
    amount: number;
    risk: string;
    companyId: string;
    walletId: string;
    walletName: string;
}

interface Wallet {
    id: string;
    name: string;
    balance: number;
    investments: Investment[];
}

const Portfolio = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const data: Wallet[] = await getWallets();
                setWallets(data);
            } catch (err) {
                console.error("Erro ao carregar as carteiras");
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
                Carregando...
            </div>
        );
    }

    const allInvestments: Investment[] = wallets.flatMap((wallet) => {
        return wallet.investments.map((investment) => ({
            ...investment,
            walletName: wallet.name,
        }));
    });

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 p-4">
            <div className="w-full md:w-4/5 lg:w-3/5 mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Meu Portfólio de Investimentos
                </h1>

                {/* Tabela Responsiva */}
                <div className="overflow-x-auto">
                    <table className="hidden md:table w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700">
                                <th className="border border-gray-300 p-3 text-left">Empresa</th>
                                <th className="border border-gray-300 p-3 text-left">Valor Investido</th>
                                <th className="border border-gray-300 p-3 text-left">Risco</th>
                                <th className="border border-gray-300 p-3 text-left">Carteira</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allInvestments.map((investment) => (
                                <tr key={investment.id} className="border-b">
                                    <td className="border border-gray-300 p-3">{investment.name}</td>
                                    <td className="border border-gray-300 p-3">{formatCurrency(investment.amount)}</td>
                                    <td className="border border-gray-300 p-3">{investment.risk}</td>
                                    <td className="border border-gray-300 p-3">{investment.walletName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card View para Mobile */}
                <div className="md:hidden">
                    {allInvestments.map((investment) => (
                        <div key={investment.id} className="bg-gray-50 shadow-sm rounded-lg p-4 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">{investment.name}</h2>
                            <p className="text-gray-600">Valor: {formatCurrency(investment.amount)}</p>
                            <p className="text-gray-600">Risco: {investment.risk}</p>
                            <p className="text-gray-600">Carteira: {investment.walletName}</p>
                        </div>
                    ))}
                </div>

                {/* Botão de Retorno */}
                <div className="flex justify-center mt-6">
                    <Link to="/dashboard/wallets">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-md">
                            Voltar para Minhas Carteiras
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
