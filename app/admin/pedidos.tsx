// app/admin/pedidos.tsx
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const API_URL = "http://192.168.205.192:3000";

interface PedidoItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Pedido {
  id: number;
  usuario_id: number;
  estado: "PENDIENTE" | "CONFIRMADO" | "PREPARANDO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  total: number;
  creado_en: string;
  actualizado_en?: string;
  items?: PedidoItem[];
}

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/pedidos`);
      const data: Pedido[] = await res.json();

      const parsed = data.map((p) => ({
        ...p,
        total: Number(p.total),
        items: (p.items || []).map((i) => ({
          ...i,
          precio: Number(i.precio),
          cantidad: Number(i.cantidad),
        })),
      }));

      setPedidos(parsed);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cambiarEstado = async (pedidoId: number, nuevoEstado: Pedido["estado"]) => {
    try {
      const res = await fetch(`${API_URL}/admin/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        Alert.alert("Éxito", `Pedido actualizado a ${nuevoEstado}`);
        cargarPedidos();
      } else {
        const data = await res.json();
        Alert.alert("Error", data.error || "No se pudo actualizar el pedido");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  const eliminarPedido = async (pedidoId: number) => {
    Alert.alert("Confirmar", "¿Deseas eliminar este pedido?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/admin/pedidos/${pedidoId}`, { method: "DELETE" });
            if (res.ok) {
              Alert.alert("Eliminado", "Pedido eliminado correctamente");
              cargarPedidos();
            } else {
              const data = await res.json();
              Alert.alert("Error", data.error || "No se pudo eliminar el pedido");
            }
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo conectar al servidor");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Pedidos Admin</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.header}>Pedido #{item.id} - {item.estado}</Text>
            <Text>Usuario ID: {item.usuario_id}</Text>
            <Text>Fecha: {new Date(item.creado_en).toLocaleString()}</Text>
            <Text>Total: Bs {item.total.toFixed(2)}</Text>
            <View style={styles.itemsContainer}>
              {(item.items || []).map((prod, idx) => (
                <Text key={`${prod.id}-${idx}`}>
                  {prod.nombre} x {prod.cantidad} (Bs {prod.precio.toFixed(2)})
                </Text>
              ))}
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#28a745" }]}
                onPress={() => cambiarEstado(item.id, "CONFIRMADO")}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#dc3545" }]}
                onPress={() => eliminarPedido(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshing={loading}
        onRefresh={cargarPedidos}
        ListEmptyComponent={<Text>No hay pedidos aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "white", padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  header: { fontWeight: "bold", marginBottom: 5 },
  itemsContainer: { marginTop: 5, paddingLeft: 10 },
  buttons: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  button: { padding: 10, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
