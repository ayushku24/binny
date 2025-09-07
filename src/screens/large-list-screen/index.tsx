import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ListRenderItemInfo, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { ListItem } from '../../types';
import { styles } from './styles';

// Generate mock data for 5,000 items
const generateMockData = (count: number): ListItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `item_${index}`,
    title: `Item ${index + 1}`,
    subtitle: `This is the subtitle for item ${index + 1}`,
    value: Math.floor(Math.random() * 1000),
  }));
};

const ITEM_HEIGHT = 80; // Fixed item height for getItemLayout optimization
const INITIAL_BATCH_SIZE = 20;
const PAGE_SIZE = 50;

// Memoized list item component for better performance
const ListItemComponent = React.memo<{ item: ListItem; index: number }>(({ item, index }) => (
  <View style={styles.listItem}>
    <View style={styles.itemContent}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemValue}>${item.value}</Text>
      </View>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      <Text style={styles.itemIndex}>Index: {index}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
  </View>
));

export default function LargeListScreen() {
  const [data, setData] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems] = useState(5000);
  
  const flatListRef = useRef<FlatList<ListItem>>(null);

  // Initialize data
  const initializeData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockData(INITIAL_BATCH_SIZE);
      setData(mockData);
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  }, []);

  // Load initial data on component mount
  React.useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Optimized getItemLayout for better performance
  const getItemLayout = useCallback(
    (data: ArrayLike<ListItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Optimized keyExtractor
  const keyExtractor = useCallback((item: ListItem) => item.id, []);

  // Render item with performance optimizations
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<ListItem>) => (
      <ListItemComponent item={item} index={index} />
    ),
    []
  );

  // Load more items (pagination)
  const loadMoreItems = useCallback(() => {
    if (loadingMore || data.length >= totalItems) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const startIndex = currentPage * PAGE_SIZE;
      const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
      const newItems = generateMockData(endIndex - startIndex).map((item, index) => ({
        ...item,
        id: `item_${startIndex + index}`,
        title: `Item ${startIndex + index + 1}`,
        subtitle: `This is the subtitle for item ${startIndex + index + 1}`,
      }));
      
      setData(prevData => [...prevData, ...newItems]);
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, data.length, totalItems, currentPage]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const refreshedData = generateMockData(INITIAL_BATCH_SIZE);
      setData(refreshedData);
      setCurrentPage(1);
      setRefreshing(false);
    }, 1000);
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // Show item details
  const onItemPress = useCallback((item: ListItem, index: number) => {
    Alert.alert(
      'Item Details',
      `Title: ${item.title}\nValue: $${item.value}\nIndex: ${index}\nID: ${item.id}`
    );
  }, []);

  // Footer component for loading more
  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.loadingText}>Loading more items...</Text>
      </View>
    );
  }, [loadingMore]);

  // Empty component
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={60} color="#C7C7CC" />
      <Text style={styles.emptyText}>No items to display</Text>
      <TouchableOpacity style={styles.retryButton} onPress={initializeData}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ), [initializeData]);

  // Header component
  const ListHeader = useMemo(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Performance Optimized List</Text>
      <Text style={styles.headerSubtitle}>
        {data.length.toLocaleString()} of {totalItems.toLocaleString()} items loaded
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Window Size</Text>
          <Text style={styles.statValue}>10</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Item Height</Text>
          <Text style={styles.statValue}>{ITEM_HEIGHT}px</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Page Size</Text>
          <Text style={styles.statValue}>{PAGE_SIZE}</Text>
        </View>
      </View>
    </View>
  ), [data.length, totalItems]);

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading 5,000 items...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        // Performance optimizations
        windowSize={10} // Reduce memory usage
        maxToRenderPerBatch={10} // Render fewer items per batch
        initialNumToRender={INITIAL_BATCH_SIZE} // Initial items to render
        removeClippedSubviews={true} // Remove off-screen views
        updateCellsBatchingPeriod={50} // Batch updates
        // Optimization flags
        disableVirtualization={false}
        scrollEventThrottle={16}
        style={styles.flatList}
        contentContainerStyle={data.length === 0 ? styles.emptyContentContainer : undefined}
      />
      
      {/* Floating action button to scroll to top */}
      <TouchableOpacity style={styles.fab} onPress={scrollToTop}>
        <Ionicons name="arrow-up" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
