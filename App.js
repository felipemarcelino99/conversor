import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { PickerItem } from './src/Picker';
import { api } from './src/Services/api';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [moedas, setMoedas] = useState([]);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);
  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState("");

  useEffect(() => {
    async function loadMoedas () {
      const response = await api.get("all");
      let arrayMoedas = [];

      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          value: key,
          label: key,
        })
      })
      setMoedas(arrayMoedas);
      setMoedaSelecionada(arrayMoedas[0].key)
      setLoading(false)
    }
    loadMoedas();
  }, [])

  async function converter() {
    if(moedaBValor === 0 || moedaBValor === '' || moedaSelecionada === null) return;
    const response = await api.get(`/all/${moedaSelecionada}-BRL`)

    let resultado = response.data[moedaSelecionada].ask * parseFloat(moedaBValor);
    setValorConvertido(`${resultado.toLocaleString("pt-br", {style: 'currency', currency: 'BRL'})}`);
    setValorMoeda(moedaBValor)
    Keyboard.dismiss();
  }

  if(loading) {
    return(
      <View style={styles.loading}>
        <ActivityIndicator color="red" size="large"/>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda</Text>
          <PickerItem moedas={moedas} moedaSelecionada={moedaSelecionada} onChange={(moeda) => setMoedaSelecionada(moeda)}/>
        </View>
        <View style={styles.areaValor}>
          <Text style={styles.titulo}>Digite um valor para converter em R$</Text>
          <TextInput placeholder='EX: 1.50' style={styles.input}  keyboardType="numeric" value={moedaBValor} onChangeText={(valor) => setMoedaBValor(valor)} />
        </View>
        <TouchableOpacity style={styles.botao} onPress={converter}>
          <Text style={styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>

        {valorConvertido !== 0 && (
          <View style={styles.areaResultado}> 
            <Text style={styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
            <Text style={styles.valorConvertidoSM}>Corresponde a</Text>
            <Text style={styles.valorConvertido}>{valorConvertido}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#101215'
  },
  areaMoeda: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1
  },
  titulo: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingLeft: 5,
    paddingTop: 5
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  areaValor: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    paddingVertical: 8
  },
  input: {
    width: '100%',
    fontSize: 18,
    padding: 8,
    color: '#000'
  },
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    backgroundColor: '#fb4b57',
    width: '90%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  },
  areaResultado: {
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  valorConvertido: {
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  },
  valorConvertidoSM: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    marginVertical: 8
  }
});
