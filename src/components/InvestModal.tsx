import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Select, InputLabel, FormControl, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { InvestmentService } from '../services/investmentService';
import { updateWallet } from '../services/walletService';

const InvestModal = ({ open, onClose, walletId, onInvestmentCreated, selectedCompany }: {
  open: boolean,
  onClose: () => void,
  walletId: string,
  onInvestmentCreated: () => void,
  selectedCompany: any
}) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedWalletId, setSelectedWalletId] = useState(walletId);
  const [wallets, setWallets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  const [investmentType, setInvestmentType] = useState<string>('acao');
  const [quantity, setQuantity] = useState<number>(0);
  const [profitability, ] = useState<number>(selectedCompany.profitability || 0);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/wallet`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setWallets(response.data);
      } catch (error) {
        console.error('Erro ao carregar carteiras', error);
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const wallet = wallets.find((w) => w.id === selectedWalletId);
    setSelectedWallet(wallet || null);
  }, [selectedWalletId, wallets]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value || '0');
    setQuantity(newQuantity);
    const totalAmount = newQuantity * selectedCompany.unitPrice;
    setAmount(formatCurrency(totalAmount));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value);
    const formattedValue = formatCurrency(numericValue);
    setAmount(formattedValue);
  };

  const handleInvestment = async () => {
    const numericAmount = Number(amount.replace(/\D/g, ''));
    
    if (numericAmount < selectedCompany.unitPrice) {
      setError(`O valor mínimo para investir é ${formatCurrency(selectedCompany.unitPrice)}`);
      return;
    }
  
    if (investmentType === 'quitacao' && numericAmount < selectedCompany.debtValue) {
      setError(`O valor do investimento deve ser maior ou igual à dívida de ${formatCurrency(selectedCompany.debtValue)}`);
      return;
    }
  
    if (numericAmount <= 0) {
      setError('Valor inválido');
      return;
    }
  
    if (numericAmount > selectedWallet?.balance) {
      setError('Saldo insuficiente na carteira');
      return;
    }
  
    const investmentData = {
      name: selectedCompany.name,
      amount: numericAmount,
      unitPrice: selectedCompany.unitPrice,
      walletId: selectedWalletId,
      purchaseDate: new Date(),
      risk: selectedCompany.risk?.label || 'N/A',
      profitability: profitability,
      companyId: selectedCompany.id,
      type: investmentType,
    };
  
    try {
      
      await InvestmentService.createInvestment(selectedWallet.id, investmentData);
  
      
      const newBalance = selectedWallet.balance - numericAmount;
  
     
      await updateWallet(selectedWallet.id, {
        name: selectedWallet.name, 
        balance: newBalance,
      });
  
      
      setSelectedWallet({ ...selectedWallet, balance: newBalance });
  
      onInvestmentCreated();
      onClose();
    } catch (error) {
      setError('Erro ao realizar investimento');
      console.error(error);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle align="center">Investir</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Informações da Empresa */}
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>Informações da Empresa</Typography>
            <Typography variant="body1"><strong>Nome:</strong> {selectedCompany.name}</Typography>
            <Typography variant="body1"><strong>Valor da Ação:</strong> {formatCurrency(selectedCompany.unitPrice)}</Typography>
            <Typography variant="body1"><strong>Risco:</strong> {selectedCompany.risk?.label || 'N/A'}</Typography>
            {selectedCompany.debt && (
              <Typography variant="body1"><strong>Dívida:</strong> {formatCurrency(selectedCompany.debtValue)}</Typography>
            )}
          </Grid>

          {/* Seletor de Carteira */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" align="center" gutterBottom>Seleção de Carteira</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Carteira</InputLabel>
              <Select
                value={selectedWalletId}
                onChange={(e) => setSelectedWalletId(e.target.value)}
                label="Carteira"
              >
                {wallets.map((wallet) => (
                  <MenuItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Informações da Carteira */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" align="center" gutterBottom>Informações da Carteira</Typography>
            <FormControl fullWidth margin="normal">
              {selectedWallet && (
                <>
                  <Typography variant="body1">
                    <strong>Nome da Carteira:</strong> {selectedWallet.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Saldo:</strong> {formatCurrency(selectedWallet.balance)}
                  </Typography>
                </>
              )}
            </FormControl>
          </Grid>


          {/* Tipo de Investimento */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Investimento</InputLabel>
              <Select
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
                label="Tipo de Investimento"
              >
                <MenuItem value="acao">Ação</MenuItem>
                {selectedCompany.debt && <MenuItem value="quitacao">Quitação de Dívida</MenuItem>}
              </Select>
            </FormControl>
          </Grid>

          {/* Quantidade de Ações (só exibe quando 'Ação' é selecionado) */}
          {investmentType === 'acao' && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Quantidade de Ações"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{
                    min: 1,
                  }}
                  error={isNaN(quantity) || quantity < 1}
                  helperText={isNaN(quantity) || quantity < 1 ? "Quantidade inválida" : ""}
                />
              </FormControl>
            </Grid>
          )}

          {/* Valor do Investimento */}
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Valor do Investimento"
                value={amount}
                onChange={handleAmountChange}
                inputProps={{
                  maxLength: 15,
                }}
                error={!!error}
                helperText={error}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleInvestment} color="primary" disabled={!selectedWallet}>
          Investir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestModal;
