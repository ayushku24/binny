import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  generateDummyToken,
  loadTokenFromStorage,
  logout,
  removeTokenFromStorage,
  saveTokenToStorage,
} from "../../store/authSlice";
import { styles } from "./styles";

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const { totalItems } = useAppSelector((state) => state.cart);
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    // Load token from secure storage on app start
    dispatch(loadTokenFromStorage());
  }, [dispatch]);

  const handleGenerateToken = async () => {
    try {
      // Generate dummy token
      dispatch(generateDummyToken());

      // Get the generated token from state and save to secure storage
      const newToken = `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await dispatch(saveTokenToStorage(newToken)).unwrap();

      Alert.alert("Success", "Token generated and saved to secure storage!");
    } catch (error) {
      Alert.alert("Error", "Failed to save token to secure storage");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(removeTokenFromStorage()).unwrap();
      dispatch(logout());
      Alert.alert(
        "Success",
        "Logged out and token removed from secure storage!",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to remove token from secure storage");
    }
  };

  const showTokenInfo = () => {
    if (token) {
      Alert.alert("Current Token", `Token: ${token}`, [{ text: "OK" }]);
      console.log("Full token:", token);
    } else {
      Alert.alert("No Token", "No token found in secure storage");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Ionicons name="rocket" size={60} color="#007AFF" />
          <Text style={styles.title}>React Native Performance Demo</Text>
          <Text style={styles.subtitle}>
            Advanced concepts showcase with TypeScript
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cart" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#4ECDC4" />
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Cached Users</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name={isAuthenticated ? "shield-checkmark" : "shield"}
              size={24}
              color={isAuthenticated ? "#45B7D1" : "#gray"}
            />
            <Text style={styles.statNumber}>{isAuthenticated ? "✓" : "✗"}</Text>
            <Text style={styles.statLabel}>Authenticated</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Secure Token Storage</Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGenerateToken}
          >
            <Ionicons name="key" size={20} color="white" />
            <Text style={styles.buttonText}>Generate & Save Token</Text>
          </TouchableOpacity>

          {isAuthenticated && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={showTokenInfo}
              >
                <Ionicons name="information-circle" size={20} color="#007AFF" />
                <Text style={[styles.buttonText, { color: "#007AFF" }]}>
                  Show Token Info
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out" size={20} color="white" />
                <Text style={styles.buttonText}>Logout & Remove Token</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Features</Text>
          <Text style={styles.featureText}>
            • Optimized FlatList with 5,000 items{"\n"}• Redux cart with
            persistent state{"\n"}• Offline support with AsyncStorage{"\n"}•
            Secure token storage with Expo SecureStore{"\n"}• Deep linking
            (myapp://user/1){"\n"}• TypeScript throughout{"\n"}• Performance
            optimizations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Navigation</Text>
          <Text style={styles.featureText}>
            Navigate through the tabs to explore each feature:
            {"\n\n"}• Large List - Optimized FlatList performance{"\n"}•
            Products - Add items to cart{"\n"}• Cart - View and manage cart
            items{"\n"}• Users - Offline support demo{"\n"}• Profile -
            Additional features
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
