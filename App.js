import React from 'react';
import type {Node} from 'react';
import {TextInput, Button, View, Text, SafeAreaView} from 'react-native';

const App: () => Node = () => {
  const title = 'Captura do retorno dos pagamentos.'
  const button = 'Confirmar o pagamento'
  
  return (
    <SafeAreaView>
      <View>
        <Text>
          {title}
        </Text>
        <TextInput />
        <Button onPress={() => {}} text={button} />
      </View>
    </SafeAreaView>
  );
};

export default App;
