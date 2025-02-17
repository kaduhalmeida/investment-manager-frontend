import React, { useEffect, useState } from "react";
import { getWallets } from "../../services/walletService";
import { getCompany } from "../../services/companyService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [, setWallets] = useState<any[]>([]);
  const [marketData, setMarketData] = useState({
    avgRisk: 0,
    avgValuation: 0,
    avgInvestment: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const walletsData = await getWallets();
      setWallets(walletsData);

      const companies = await getCompany();

      if (companies.length > 0) {
        const totalRisk = companies.reduce((acc: number, company: { risk?: string }) => acc + (company.risk ? parseInt(company.risk) : 0), 0);
        const totalValuation = companies.reduce((acc: number, company: { valuation?: number }) => acc + (company.valuation || 0), 0);
        const totalInvestments = walletsData.reduce(
          (acc: number, wallet: { investments: any[] }) => acc + wallet.investments.reduce((sum: number, investment: any) => sum + investment.amount, 0),
          0
        );

        setMarketData({
          avgRisk: totalRisk / companies.length,
          avgValuation: totalValuation / companies.length,
          avgInvestment: totalInvestments / walletsData.length,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral do Mercado</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Gráfico de Média de Risco */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Risco</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Risco Médio", value: marketData.avgRisk }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#E63946" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Média de Valorização */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Valorização</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Valorização Média", value: marketData.avgValuation }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1D3557" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Média de Investimentos */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">Média de Investimentos</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Investimentos Médios", value: marketData.avgInvestment }]}>
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

export default Dashboard;
