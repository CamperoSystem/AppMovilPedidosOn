// app/admin/productos.tsx
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const API_URL = "http://192.168.205.192:3000";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: number;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/productos`);
      const data: Producto[] = await res.json();
      // Convertimos precio y stock a number por seguridad
      const parsed = data.map((p) => ({
        ...p,
        precio: Number(p.precio),
        stock: Number(p.stock),
      }));
      setProductos(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarProducto = async () => {
    if (!nombre || !precio || !stock) {
      Alert.alert("Error", "Nombre, precio y stock son obligatorios");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: Number(precio),
          stock: Number(stock),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", "Producto agregado");
        setNombre(""); setDescripcion(""); setPrecio(""); setStock("");
        cargarProductos();
      } else {
        Alert.alert("Error", data.error || "No se pudo agregar producto");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  const eliminarProducto = async (id: number) => {
    Alert.alert("Confirmar", "¿Desea eliminar este producto?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
            if (res.ok) {
              Alert.alert("Éxito", "Producto eliminado");
              cargarProductos();
            }
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo eliminar producto");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Productos</Text>

      {/* Formulario agregar */}
      <View style={styles.form}>
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          placeholder="Descripción"
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TextInput
          placeholder="Precio"
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Stock"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={agregarProducto}>
          <Text style={styles.buttonText}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text>Precio: Bs {item.precio.toFixed(2)}</Text>
            <Text>Stock: {item.stock}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => eliminarProducto(item.id)}
            >
              <Text style={{ color: "white" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No hay productos</Text>}
        refreshing={loading}
        onRefresh={cargarProductos}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  nombre: { fontSize: 16, fontWeight: "bold" },
  deleteButton: {
    marginTop: 5,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
});
