import { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createWallet } from '../../services/walletService';

const WalletSchema = Yup.object().shape({
  name: Yup.string().required('Nome da carteira é obrigatório'),
  balance: Yup.number()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        const cleaned = originalValue.replace(/\D/g, ''); 
        return cleaned ? parseFloat(cleaned) : NaN;
      }
      return value;
    })
    .typeError('Saldo inicial deve ser um número')
    .required('Saldo inicial é obrigatório')
    .min(0, 'O saldo não pode ser negativo'),
});

const CreateWalletModal = ({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (values: { name: string; balance: string }) => {
    try {

      const balance = parseFloat(values.balance.replace(/\D/g, ''));


      if (isNaN(balance)) {
        setErrorMessage('Saldo inválido');
        return;
      }

      const walletData = {
        name: values.name,
        balance: balance,
        spentAmount: 0,
        fundsAdded: 0,
      };

      await createWallet(walletData);
      onCreate();

      onClose();
    } catch (error) {
      setErrorMessage('Erro ao criar a carteira');
    }
  };

  const formatBalance = (value: string) => {
    value = value.replace(/\D/g, '');

    let formattedValue = '';
    for (let i = value.length - 1; i >= 0; i--) {
      formattedValue = value[i] + formattedValue;
      if ((value.length - i) % 3 === 0 && i !== 0) {
        formattedValue = '.' + formattedValue;
      }
    }

    return formattedValue;
  };

  const handleBalanceChange = (e: any, setFieldValue: any) => {

    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = formatBalance(rawValue);
    setFieldValue('balance', formattedValue);
  };;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Criar Nova Carteira
        </Typography>
        <Formik
          initialValues={{ name: '', balance: '' }}
          validationSchema={WalletSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="w-full">
              <div className="mb-4">
                <Field
                  as={TextField}
                  name="name"
                  label="Nome"
                  fullWidth
                  variant="outlined"
                  helperText={<ErrorMessage name="name" />}
                />
              </div>
              <div className="mb-4">
                <Field
                  as={TextField}
                  name="balance"
                  label="Saldo Inicial"
                  fullWidth
                  variant="outlined"
                  value={values.balance}
                  onChange={(e: any) => handleBalanceChange(e, setFieldValue)}
                  helperText={<ErrorMessage name="balance" />}
                />
              </div>
              {errorMessage && <Typography color="error">{errorMessage}</Typography>}
              <Button color="primary" variant="contained" fullWidth type="submit">
                Criar Carteira
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CreateWalletModal;
