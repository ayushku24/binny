import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearError, fetchUsers, loadUsersFromCache } from '../../store/usersSlice';
import { RootStackParamList, User } from '../../types';
import { styles } from './styles';


type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function UsersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { users, loading, error, lastFetch } = useAppSelector(state => state.users);
  
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => { setIsOnline(state.isConnected); });
    return () => unsubscribe();
  }, []);

  useEffect(() => { dispatch(loadUsersFromCache()); }, [dispatch]);
  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await dispatch(fetchUsers()).unwrap(); } finally { setRefreshing(false); }
  }, [dispatch]);

  const handleUserPress = useCallback((user: User) => { navigation.navigate('UserDetail', { userId: user.id }); }, [navigation]);

  const showNetworkStatus = useCallback(() => {
    const statusText = isOnline ? 'Online' : 'Offline';
    const cacheInfo = lastFetch ? `\nLast updated: ${new Date(lastFetch).toLocaleString()}` : '\nNo cache data available';
    Alert.alert('Network Status', `Status: ${statusText}${cacheInfo}`, [{ text: 'OK' }]);
  }, [isOnline, lastFetch]);

  const clearErrorMessage = useCallback(() => { dispatch(clearError()); }, [dispatch]);

  const renderUser = useCallback(({ item: user }: { item: User }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(user)}>
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userCompany}>{user.company.name}</Text>
        <View style={styles.userMeta}>
          <Ionicons name="call" size={12} color="#666" />
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>
      </View>
      <View style={styles.userActions}>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  ), [handleUserPress]);

  const ListHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Users</Text>
        <TouchableOpacity onPress={showNetworkStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#34C759' : '#FF3B30' }]}>
            <Ionicons name={isOnline ? 'wifi' : 'wifi-outline'} size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerSubtitle}>{users.length} users • {isOnline ? 'Online' : 'Offline'}</Text>
      {lastFetch && (<Text style={styles.lastFetch}>Last updated: {new Date(lastFetch).toLocaleString()}</Text>)}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearErrorMessage}><Ionicons name="close" size={16} color="#FF3B30" /></TouchableOpacity>
        </View>
      )}
      <View style={styles.offlineBanner}>
        <Ionicons name="information-circle" size={16} color="#007AFF" />
        <Text style={styles.offlineBannerText}>Data is automatically cached for offline viewing</Text>
      </View>
    </View>
  ), [users.length, isOnline, lastFetch, error, showNetworkStatus, clearErrorMessage]);

  const EmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name={isOnline ? 'cloud-download-outline' : 'cloud-offline-outline'} size={60} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>{isOnline ? 'Loading users...' : 'No cached users'}</Text>
      <Text style={styles.emptySubtitle}>{isOnline ? 'Fetching data from the server' : 'Connect to internet to fetch user data'}</Text>
      {!loading && (<TouchableOpacity style={styles.retryButton} onPress={handleRefresh}><Text style={styles.retryButtonText}>{isOnline ? 'Retry' : 'Try when online'}</Text></TouchableOpacity>)}
    </View>
  ), [isOnline, loading, handleRefresh]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!loading ? EmptyState : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#007AFF']} tintColor="#007AFF" />}
        contentContainerStyle={[styles.listContent, users.length === 0 && styles.emptyContentContainer]}
        showsVerticalScrollIndicator={false}
      />
      {loading && users.length === 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
            <Text style={styles.loadingText}>{isOnline ? 'Fetching users...' : 'Loading cached data...'}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}



