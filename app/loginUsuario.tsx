import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.205.192:3000'; 

export default function LoginUsuario() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const irDashboardAdmin = () => {
    router.push('/dashboardAdmin'); // ruta del dashboard admin
  };

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await AsyncStorage.setItem('usuarioId', data.usuario.id.toString());
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', data.mensaje || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: '#fff' }]}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { color: '#fff' }]}
        secureTextEntry
        placeholderTextColor="#ccc"
      />
      
      <Button title={loading ? 'Cargando...' : 'Iniciar sesión'} onPress={login} disabled={loading} />
      <TouchableOpacity style={[styles.boton, { backgroundColor: '#ffc107' }]} onPress={irDashboardAdmin}>
        <Text style={styles.botonTexto}>Dashboard Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#1e1e1e',
  },
  boton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginVertical: 5,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
