import React, { useState } from 'react';
import type {Node} from 'react';
import {StyleSheet, TextInput, Button, View, Text} from 'react-native';

import { onPaymentRequestWithCielo, onSearchCieloResult } from './services/CieloService';

const App: () => Node = () => {
  const [totalValue, onChangeTotalValue] = useState('');
  const title = 'Captura do retorno dos pagamentos.'
  const button = 'Confirmar o pagamento'

  const sendDataToCielo = () => {
    const tableNumber = 01;
    const formOfPayment = 'DEBITO_AVISTA';
    onPaymentRequestWithCielo(tableNumber, parseInt(totalValue.replace(/[^\d]+/g,''), 10), formOfPayment)
        .then(() => getCieloResult()) 
        .catch(err => console.log(`Erro após enviar dados para Cielo API: ${err}`))
  }

  const getCieloResult = () => {
    onSearchCieloResult()
        .then(data => data.reason ? console.log(data.reason) : console.log(`Resultado feito por Cielo: ${JSON.stringify(data)}`))
        .catch(err => console.log(`Erro após buscar resultado: ${err}`))
  }
  
  return (
    <View style={styles.view}>
      <Text>
        {title}
      </Text>
      <TextInput 
        style={styles.input}
        onChangeText={onChangeTotalValue}
        value={totalValue}
        placeholder="Digita apenas número"
        keyboardType="numeric" />
      <Button onPress={sendDataToCielo} title={button} />
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
});

export default App;
