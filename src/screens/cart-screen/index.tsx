import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../store/cartSlice";
import { CartItem, TabParamList } from "../../types";
import { styles } from "./styles";

type NavigationProp = BottomTabNavigationProp<TabParamList>;

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { items, totalItems, totalAmount } = useAppSelector(
    (state) => state.cart,
  );

  const handleRemoveItem = useCallback(
    (productId: string, productTitle: string) => {
      Alert.alert(
        "Remove Item",
        `Are you sure you want to remove "${productTitle}" from your cart?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => dispatch(removeFromCart(productId)),
          },
        ],
      );
    },
    [dispatch],
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        const item = items.find((i) => i.product.id === productId);
        if (item) handleRemoveItem(productId, item.product.title);
      } else {
        dispatch(updateQuantity({ id: productId, quantity }));
      }
    },
    [dispatch, items, handleRemoveItem],
  );

  const handleClearCart = useCallback(() => {
    if (items.length === 0) return;
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => dispatch(clearCart()),
        },
      ],
    );
  }, [dispatch, items.length]);

  const handleCheckout = useCallback(() => {
    if (items.length === 0) return;
    Alert.alert(
      "Checkout",
      `Total: ₹${totalAmount.toFixed(2)}\nItems: ${totalItems}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => {
            Alert.alert("Success", "Checkout completed! (Demo only)");
            dispatch(clearCart());
          },
        },
      ],
    );
  }, [items.length, totalAmount, totalItems, dispatch]);

  const handleShopNow = useCallback(() => {
    navigation.navigate("Products");
  }, [navigation]);

  const renderCartItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.productImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.product.title}
          </Text>
          <Text style={styles.productPrice}>
            ₹{item.product.price.toFixed(2)}
          </Text>
          <Text style={styles.productCategory}>{item.product.category}</Text>
        </View>
        <View style={styles.quantityControls}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, styles.quantityButtonLeft]}
              onPress={() =>
                handleUpdateQuantity(item.product.id, item.quantity - 1)
              }
            >
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
            <TouchableOpacity
              style={[styles.quantityButton, styles.quantityButtonRight]}
              onPress={() =>
                handleUpdateQuantity(item.product.id, item.quantity + 1)
              }
            >
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.itemTotal}>
            ₹{(item.product.price * item.quantity).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() =>
              handleRemoveItem(item.product.id, item.product.title)
            }
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleUpdateQuantity, handleRemoveItem],
  );

  const CartHeader = useCallback(
    () => (
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          {items.length > 0 && (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearAllButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          {totalItems} {totalItems === 1 ? "item" : "items"} • ₹
          {totalAmount.toFixed(2)}
        </Text>
      </View>
    ),
    [items.length, totalItems, totalAmount, handleClearCart],
  );

  const CartFooter = useCallback(() => {
    if (items.length === 0) return null;
    return (
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal ({totalItems} items)</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.freeShipping}>FREE</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout • ₹{totalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [items.length, totalItems, totalAmount, handleCheckout]);

  const EmptyCart = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some products from the Products tab to get started
        </Text>
        <TouchableOpacity style={styles.shopNowButton} onPress={handleShopNow}>
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleShopNow],
  );

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product.id}
          ListHeaderComponent={CartHeader}
          ListFooterComponent={CartFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
