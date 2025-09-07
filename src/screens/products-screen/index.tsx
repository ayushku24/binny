import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/cartSlice';
import { Product, TabParamList } from '../../types';
import { mockProducts } from '../../utils/mockProducts';
import { styles } from './styles';

type NavigationProp = BottomTabNavigationProp<TabParamList>;

const CATEGORIES = ['All', 'Electronics', 'Wearables', 'Accessories', 'Audio'];

const ProductImage = React.memo(({ uri, style }: { uri: string; style: any }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={[style, { position: 'relative' }]}> 
      {!imageError && (
        <Image
          source={{ uri }}
          style={[style, { position: 'absolute' }]}
          onLoad={() => setImageLoading(false)}
          onError={() => { setImageError(true); setImageLoading(false); }}
          resizeMode="cover"
        />
      )}
      {(imageError || imageLoading) && (
        <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }]}> 
          <Ionicons name="image-outline" size={40} color="#C7C7CC" />
          <Text style={{ fontSize: 12, color: '#C7C7CC', marginTop: 4 }}>
            {imageLoading ? 'Loading...' : 'No Image'}
          </Text>
        </View>
      )}
    </View>
  );
});

export default function ProductsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { totalItems } = useAppSelector(state => state.cart);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;
    if (selectedCategory !== 'All') filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = useCallback((product: Product) => {
    dispatch(addToCart(product));
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart`,
      [
        { text: 'Continue Shopping', style: 'default' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  }, [dispatch, navigation]);

  const renderCategoryFilter = useCallback(() => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[styles.categoryButtonText, selectedCategory === item && styles.categoryButtonTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  ), [selectedCategory]);

  const renderProduct = useCallback(({ item: product }: { item: Product }) => (
    <View style={styles.productCard}>
      <ProductImage uri={product.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.productDescription} numberOfLines={3}>{product.description}</Text>
        <View style={styles.productFooter}>
          <View>
            <Text style={styles.productPrice}>
              ₹{product.price.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.productCategory}>{product.category}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(product)}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addToCartButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [handleAddToCart]);

  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Products</Text>
          <Text style={styles.headerSubtitle}>{filteredProducts.length} products available</Text>
        </View>
        <View style={styles.cartBadgeContainer}>
          <Ionicons name="cart" size={24} color="#007AFF" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      {renderCategoryFilter()}
    </View>
  ), [filteredProducts.length, totalItems, searchQuery, renderCategoryFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={60} color="#C7C7CC" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filter criteria</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}


