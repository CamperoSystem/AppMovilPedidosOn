import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const router = useRouter();

const API_URL = 'http://192.168.205.192:3000'; // Cambia según tu IP

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

interface PedidoItem extends Producto {
  cantidad: number;
}
const cerrarSesion = async () => {
  await AsyncStorage.removeItem('usuarioId'); // o cualquier key que uses para login
  router.replace('/loginUsuario'); // regresa a la pantalla de login
};


export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<PedidoItem[]>([]);

  const cargarProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data: Producto[] = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = (producto: Producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const disminuirCantidad = (productoId: number) => {
    setCarrito(
      carrito
        .map((item) =>
          item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const realizarPedido = async () => {
    if (carrito.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de hacer un pedido.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: 1, // simula usuario logueado
          items: carrito.map((item) => ({ producto_id: item.id, cantidad: item.cantidad })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Pedido realizado', `Tu pedido #${data.pedidoId} fue guardado.`);
        setCarrito([]);
        cargarProductos();
      } else {
        Alert.alert('Error', data.error || 'No se pudo realizar el pedido.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Catálogo de Productos</Text>
      <TouchableOpacity style={styles.cerrarSesion} onPress={cerrarSesion}>
  <Text style={styles.cerrarTexto}>Salir</Text>
</TouchableOpacity>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
  

  
</View>

      <FlatList
        data={productos}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={styles.precio}>Bs {Number(item.precio).toFixed(2)}</Text>
            <Text>Stock: {item.stock}</Text>

            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.boton, { flex: 1, marginRight: 5 }]}
                onPress={() => disminuirCantidad(item.id)}
              >
                <Text style={styles.botonTexto}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, { flex: 1, marginRight: 5 }]}
                onPress={() => agregarAlCarrito(item)}
              >
                <Text style={styles.botonTexto}>+</Text>
              </TouchableOpacity>

              <Text style={{ width: 30, textAlign: 'center' }}>
                {carrito.find((i) => i.id === item.id)?.cantidad || 0}
              </Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.carrito} onPress={realizarPedido}>
        <Text style={styles.botonTexto}>🛒 Realizar Pedido ({carrito.length})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 10, elevation: 2 },
  nombre: { fontSize: 18, fontWeight: 'bold' },
  precio: { fontSize: 16, color: 'green', marginVertical: 5 },
  boton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginTop: 5 },
  botonTexto: { color: 'white', textAlign: 'center' },
  carrito: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, marginVertical: 10 },
  cerrarSesion: {
  position: 'absolute',
  top: 15,
  right: 15,
  backgroundColor: 'red',
  padding: 8,
  borderRadius: 20,
  zIndex: 10,
},
cerrarTexto: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
},

});
