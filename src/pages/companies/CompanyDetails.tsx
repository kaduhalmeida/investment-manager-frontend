import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../services/companyService";
import { Link } from "react-router-dom";

const CompanyDetails: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const [company, setCompany] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const data = await getCompanyById(companyId!);
                if (data.risk) {
                    data.risk = JSON.parse(data.risk);
                }
                setCompany(data);
            } catch (error) {
                console.error("Erro ao carregar detalhes da empresa:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [companyId]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-lg font-semibold">Carregando...</div>;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-3/4 lg:w-3/5">
                {company && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{company.name}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Descrição:</h2>
                                <p className="text-gray-600">{company.description}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Setor:</h2>
                                <p className="text-gray-600">{company.sector}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Estágio:</h2>
                                <p className="text-gray-600">{company.stage}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Risco:</h2>
                                <p className="text-gray-600">{company.risk?.label || "N/A"}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Valor de Mercado:</h2>
                                <p className="text-gray-600">{formatCurrency(company.valuation)}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Dívida:</h2>
                                <p className="text-gray-600">{company.debt ? "Sim" : "Não"}</p>
                            </div>
                            {company.debt && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-700">Valor da Dívida:</h2>
                                    <p className="text-gray-600">{company.debtValue ? formatCurrency(company.debtValue) : "Não disponível"}</p>
                                </div>
                            )}
                            <div className="col-span-1 md:col-span-2">
                                <h2 className="text-lg font-semibold text-gray-700">Website:</h2>
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {company.website}
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
                            <Link to="/dashboard/companies">
                                <button className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg shadow-md">
                                    Lista de Empresas
                                </button>
                            </Link>
                            <Link to="/dashboard/wallets">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-md">
                                    Minhas Carteiras
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CompanyDetails;
