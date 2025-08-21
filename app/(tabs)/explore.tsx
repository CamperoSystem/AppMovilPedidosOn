import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.205.192:3000';

interface PedidoItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Pedido {
  id: number;
  estado: string;
  fecha: string;
  items?: PedidoItem[];
}

export default function Historial() {
  const [historial, setHistorial] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/pedidos/1`); // usuario_id=1
      const data: Pedido[] = await res.json();
      setHistorial(data || []);
    } catch (err) {
      console.error('Error cargando historial:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Historial de Pedidos</Text>

      {/* Botón actualizar */}
      <TouchableOpacity style={styles.refreshButton} onPress={cargarHistorial}>
        <Text style={styles.refreshText}>{loading ? '⏳ Actualizando...' : '🔄 Actualizar'}</Text>
      </TouchableOpacity>

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historial}>
            <Text style={{ fontWeight: 'bold' }}>
              Pedido #{item.id} - {item.estado}
            </Text>
            <Text>{new Date(item.fecha).toLocaleString()}</Text>
            {/* Aseguramos que items siempre sea un array */}
            {(item.items || []).map((prod, index) => (
              <Text key={`${prod.id}-${index}`}>
                {prod.nombre} x {prod.cantidad} (Bs {Number(prod.precio).toFixed(2)})
              </Text>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text>No tienes pedidos todavía.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  historial: { padding: 10, backgroundColor: '#eee', marginBottom: 5, borderRadius: 8 },
  refreshButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshText: { color: 'white', fontWeight: 'bold' },
});
