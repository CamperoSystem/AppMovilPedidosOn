import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Usuario = {
  id: number;
  nombre: string;
  rol: string;
  foto_url: string;
};

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://192.168.1.12:3000/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(console.error);
  }, []);

  const renderItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/perfil/${item.id}`)}>
      <Image source={{ uri: item.foto_url }} style={styles.avatar} />
      <View>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.rol}>{item.rol}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  nombre: { fontSize: 18, fontWeight: 'bold' },
  rol: { fontSize: 14, color: '#666' },
});
