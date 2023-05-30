import React, { useState } from 'react';
import type {Node} from 'react';
import {StyleSheet, TextInput, Button, View, Text} from 'react-native';

import { onPaymentRequestWithCielo, onSearchCieloResult } from './services/CieloService';

const App: () => Node = () => {
  const [totalValue, onChangeTotalValue] = useState('');
  const [disabledButton, onDisabledButton] = useState(false);
  const [returnText, onReturnText] = useState('');
  const title = 'Captura do retorno dos pagamentos.';
  const button = 'Confirmar o pagamento';

  const sendDataToCielo = () => {
    const tableNumber = 01;
    const formOfPayment = 'DEBITO_AVISTA';
    onDisabledButton(true);
    onPaymentRequestWithCielo(tableNumber, parseInt(totalValue.replace(/[^\d]+/g,''), 10), formOfPayment)
        .then(() => getCieloResult()) 
        .catch(err => {
          onReturnText(`Erro após enviar dados para Cielo API: ${err}`);
          onDisabledButton(false);
        })
  }

  const getCieloResult = () => {
    onSearchCieloResult()
        .then(data => { 
          onDisabledButton(false);
          data.reason 
            ? onReturnText(data.reason) 
            : onReturnText(`Resultado feito por Cielo: ${JSON.stringify(data)}`);
        })
        .catch(err => { 
          onDisabledButton(false);
          onReturnText(`Erro após buscar resultado: ${err}`);
        });
  }
  
  return (
    <View style={styles.view}>
      <Text style={styles.title}>
        {title}
      </Text>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeTotalValue}
        value={totalValue}
        placeholder="Digita apenas número"
        keyboardType="numeric" />
      <Button onPress={sendDataToCielo} title={button} disabled={disabledButton} />
      <Text style={styles.text}>
        {returnText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
  },
  text: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default App;
