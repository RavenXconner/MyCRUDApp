import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from "react-native";
import { Provider as PaperProvider, Button } from "react-native-paper";

export default function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Create Product
  const addProduct = () => {
    if (productName && price) {
      setProducts([...products, { id: Date.now().toString(), name: productName, price: parseFloat(price) }]);
      setProductName("");
      setPrice("");
    }
  };

  // Update Product
  const updateProduct = () => {
    setProducts(
      products.map((item) =>
        item.id === editingProduct.id
          ? { ...item, name: productName, price: parseFloat(price) }
          : item
      )
    );
    setEditingProduct(null);
    setProductName("");
    setPrice("");
  };

  // Delete Product
  const deleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  // Add to Cart
  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  // Process Payment
  const processPayment = () => {
    if (cart.length > 0) {
      setPaymentSuccess(true);
      setCart([]);
      setTotal(0);
      alert("Payment successful! Thank you for your purchase.");
    } else {
      alert("Your cart is empty.");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Product Management</Text>

        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        {editingProduct ? (
          <Button mode="contained" onPress={updateProduct}>
            Update Product
          </Button>
        ) : (
          <Button mode="contained" onPress={addProduct}>
            Add Product
          </Button>
        )}

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Text>
                {item.name} - ${item.price.toFixed(2)}
              </Text>
              <View style={styles.actions}>
                <Button onPress={() => { setEditingProduct(item); setProductName(item.name); setPrice(item.price.toString()); }}>
                  Edit
                </Button>
                <Button onPress={() => deleteProduct(item.id)}>Delete</Button>
                <Button onPress={() => addToCart(item)}>Add to Cart</Button>
              </View>
            </View>
          )}
        />

        <Text style={styles.title}>Cart</Text>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text>{item.name} - ${item.price.toFixed(2)}</Text>
          )}
        />
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Button mode="contained" onPress={processPayment}>
          Process Payment
        </Button>
        {paymentSuccess && <Text style={styles.successMessage}>Payment was successful!</Text>}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  product: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  actions: { flexDirection: "row", gap: 10 },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  successMessage: { color: "green", marginTop: 10 },
});
