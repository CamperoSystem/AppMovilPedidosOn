// dashboardAdmin.tsx
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DashboardAdmin() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Dashboard Admin</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin/usuarios")}
      >
        <Text style={styles.cardTitle}>👥 Usuarios</Text>
        <Text>Gestiona usuarios registrados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin/productos")}
      >
        <Text style={styles.cardTitle}>📦 Productos</Text>
        <Text>Agregar, editar o eliminar productos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin/pedidos")}
      >
        <Text style={styles.cardTitle}>📝 Pedidos</Text>
        <Text>Ver historial y actualizar estado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
