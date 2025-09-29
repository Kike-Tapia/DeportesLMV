import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

// --- Productos con imagen ---
const productos = [
  { id: "1", nombre: "Balón de Fútbol", precio: 300, imagen: "https://m.media-amazon.com/images/I/719sW7b+seL._AC_SX679_.jpg" },
  { id: "2", nombre: "Balón de Basketball", precio: 350, imagen: "https://www.wilsonstore.mx/cdn/shop/files/d2485ee5f6.webp?v=1756418557&width=800" },
  { id: "3", nombre: "Balón de Volleyball", precio: 280, imagen: "https://m.media-amazon.com/images/I/618t7YGFBEL._AC_SX679_.jpg" },
  { id: "4", nombre: "Balón de Baseball", precio: 200, imagen: "https://m.media-amazon.com/images/I/61-AEGaf8eL._AC_SX679_.jpg" },
];

// --- Login Screen ---
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      navigation.replace("MainTabs", { user: username });
    } else {
      alert("Ingresa usuario y contraseña");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://i.pinimg.com/originals/14/dc/ec/14dcecb996719d7d569ff6589086572f.jpg" }} // imagen de fondo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>🏀 Deportes App</Text>
        <TextInput
          placeholder="Usuario"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Ingresar" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
}

// --- Productos Screen ---
function ProductosScreen({ route }) {
  const { addToCart } = route.params;

  return (
    <ImageBackground
      source={{ uri: "https://www.freepik.es/foto-gratis/pelotas-diferentes-deportes_932028.htm#fromView=keyword&page=1&position=1&uuid=594cc9c0-98a7-4bde-889d-4e2afa07d1e5&query=Fondo+de+pantalla+deportes" }} // fondo para productos
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Productos Deportivos</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.image} resizeMode="contain" />
              <Text style={styles.product}>{item.nombre}</Text>
              <Text style={styles.price}>${item.precio}</Text>
              <TouchableOpacity style={styles.buttonAdd} onPress={() => addToCart(item)}>
                <Text style={styles.buttonText}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

// --- Carrito Screen ---
function CarritoScreen({ route }) {
  const { cart } = route.params;
  const total = cart.reduce((sum, item) => sum + item.precio, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Carrito</Text>
      {cart.length === 0 ? (
        <Text>No hay productos en el carrito</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.product}>
              {item.nombre} - ${item.precio}
            </Text>
          )}
        />
      )}
      {cart.length > 0 && <Text style={styles.total}>Total: ${total}</Text>}
    </View>
  );
}

// --- Perfil Screen ---
function PerfilScreen({ route }) {
  const { user } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.product}>Usuario: {user}</Text>
      <Text style={styles.product}>Email: {user}@deportes.com</Text>
      <Text style={styles.product}>Miembro desde: 2025</Text>
    </View>
  );
}

// --- Tabs ---
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { user } = route.params;
  const [cart, setCart] = useState([]);

  const addToCart = (producto) => {
    setCart([...cart, producto]);
    alert(`${producto.nombre} agregado al carrito 🛒`);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Productos') iconName = 'basketball-outline';
          else if (route.name === 'Carrito') iconName = 'cart-outline';
          else if (route.name === 'Perfil') iconName = 'person-circle-outline';
          return <Ionicons name={iconName} size={size + 8} color={color} />; // íconos más grandes
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          height: 80,        // más alta para íconos grandes
          paddingBottom: 15,
          paddingTop: 5,
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
      })}
    >
      <Tab.Screen name="Productos" component={ProductosScreen} initialParams={{ addToCart }} />
      <Tab.Screen name="Carrito" component={CarritoScreen} initialParams={{ cart }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ user }} />
    </Tab.Navigator>
  );
}

// --- App ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "rgba(245,245,245,0.85)" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  input: { backgroundColor: "rgba(255,255,255,0.9)", borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, width: "80%", borderRadius: 8 },
  card: { backgroundColor: "#fff", width: 250, borderRadius: 10, alignItems: "center", padding: 15, marginVertical: 10, elevation: 3 },
  image: { width: 150, height: 100, marginBottom: 10 },
  product: { fontSize: 18, marginBottom: 5 },
  price: { fontSize: 16, color: "green", marginBottom: 10 },
  buttonAdd: { backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  total: { marginTop: 15, fontSize: 18, fontWeight: "bold" },
});
