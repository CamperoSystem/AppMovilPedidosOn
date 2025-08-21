// app/admin/usuarios.tsx
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "http://192.168.205.192:3000"; // Cambia según tu IP

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  // Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/usuarios`);
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Crear o actualizar usuario
  const guardarUsuario = async () => {
    if (!nombre || !email) {
      Alert.alert("Error", "Nombre y email son obligatorios");
      return;
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `${API_URL}/admin/usuarios/${editingUser.id}`
        : `${API_URL}/admin/usuarios`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", editingUser ? "Usuario actualizado" : "Usuario creado");
        setModalVisible(false);
        setEditingUser(null);
        setNombre("");
        setEmail("");
        cargarUsuarios();
      } else {
        Alert.alert("Error", data.error || "Hubo un problema");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // Eliminar usuario
  const eliminarUsuario = (id: number) => {
    Alert.alert(
      "Confirmar",
      "¿Deseas eliminar este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
                method: "DELETE",
              });
              if (res.ok) {
                Alert.alert("Éxito", "Usuario eliminado");
                cargarUsuarios();
              } else {
                Alert.alert("Error", "No se pudo eliminar");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "No se pudo conectar al servidor");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Abrir modal para editar
  const editar = (usuario: Usuario) => {
    setEditingUser(usuario);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Usuarios</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addText}>+ Nuevo Usuario</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>{item.email}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007bff" }]}
                onPress={() => editar(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={() => eliminarUsuario(item.id)}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal Crear / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </Text>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity style={styles.saveButton} onPress={guardarUsuario}>
                <Text style={styles.saveText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setEditingUser(null);
                  setNombre("");
                  setEmail("");
                }}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  addButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginBottom: 15, alignItems: "center" },
  addText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  name: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  button: { padding: 8, borderRadius: 6, marginLeft: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  saveButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, flex: 1, marginRight: 5, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold" },
  cancelButton: { backgroundColor: "red", padding: 12, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: "center" },
  cancelText: { color: "#fff", fontWeight: "bold" },
});
