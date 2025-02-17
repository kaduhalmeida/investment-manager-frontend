import React, { useEffect, useState } from "react";
import { getCompany } from "../../services/companyService";
import { Link } from "react-router-dom";
import VerticalMenu from "../../components/VerticalMenu";
import InvestModal from "../../components/InvestModal";

const Companies: React.FC = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [openInvestModal, setOpenInvestModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getCompany();
                const companiesWithRisk = data.map((company: any) => ({
                    ...company,
                    risk: company.risk ? JSON.parse(company.risk) : null,
                }));
                setCompanies(companiesWithRisk);
            } catch (error) {
                console.error("Erro ao carregar empresas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) {
            return "R$ 0,00";
        }
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handleOpenInvestModal = (company: any) => {
        setSelectedCompany(company);
        setOpenInvestModal(true);
    };

    const handleCloseInvestModal = () => {
        setOpenInvestModal(false);
        setSelectedCompany(null);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <VerticalMenu />
            
            <div className="p-6 w-full lg:w-4/5">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Empresas</h1>

                {loading ? (
                    <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
                        Carregando...
                    </div>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        {/* Tabela Responsiva */}
                        <div className="overflow-x-auto">
                            <table className="hidden md:table w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700">
                                        <th className="border border-gray-300 p-3 text-left">Nome</th>
                                        <th className="border border-gray-300 p-3 text-left">Setor</th>
                                        <th className="border border-gray-300 p-3 text-left">Estágio</th>
                                        <th className="border border-gray-300 p-3 text-left">Risco</th>
                                        <th className="border border-gray-300 p-3 text-left">Valor</th>
                                        <th className="border border-gray-300 p-3 text-left">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {companies.map((company) => (
                                        <tr key={company.id} className="border-b">
                                            <td className="border border-gray-300 p-3">{company.name}</td>
                                            <td className="border border-gray-300 p-3">{company.sector}</td>
                                            <td className="border border-gray-300 p-3">{company.stage}</td>
                                            <td className="border border-gray-300 p-3">{company.risk?.label || "N/A"}</td>
                                            <td className="border border-gray-300 p-3">{formatCurrency(company.valuation)}</td>
                                            <td className="border border-gray-300 p-3 flex gap-2">
                                                <Link to={`/dashboard/company/${company.id}`}>
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg">
                                                        Detalhes
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenInvestModal(company)}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-lg"
                                                >
                                                    Investir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Card View para Mobile */}
                        <div className="md:hidden">
                            {companies.map((company) => (
                                <div key={company.id} className="bg-gray-50 shadow-sm rounded-lg p-4 mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
                                    <p className="text-gray-600">Setor: {company.sector}</p>
                                    <p className="text-gray-600">Estágio: {company.stage}</p>
                                    <p className="text-gray-600">Risco: {company.risk?.label || "N/A"}</p>
                                    <p className="text-gray-600">Valor: {formatCurrency(company.valuation)}</p>
                                    <div className="flex gap-2 mt-3">
                                        <Link to={`/dashboard/company/${company.id}`}>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-lg">
                                                Detalhes
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleOpenInvestModal(company)}
                                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-lg"
                                        >
                                            Investir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedCompany && (
                    <InvestModal
                        open={openInvestModal}
                        onClose={handleCloseInvestModal}
                        walletId="1"
                        onInvestmentCreated={() => {}}
                        selectedCompany={selectedCompany}
                    />
                )}
            </div>
        </div>
    );
};

export default Companies;
