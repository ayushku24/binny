import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useNativeModuleDemo } from '../../hooks/useDeviceInfo';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, removeTokenFromStorage } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';
import { styles } from './styles';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { totalItems, totalAmount } = useAppSelector(state => state.cart);
  const { users } = useAppSelector(state => state.users);
  const { isAuthenticated, token } = useAppSelector(state => state.auth);
  const { nativeData, loading: nativeLoading, callNativeModule } = useNativeModuleDemo();
  
  const [deviceInfo, setDeviceInfo] = useState({
    osName: Platform.OS,
    osVersion: Platform.Version,
    deviceName: Device.deviceName || 'Unknown Device',
    modelName: Device.modelName || 'Unknown Model',
    brand: Device.brand || 'Unknown Brand',
  });

  useEffect(() => {
    // Get more device information
    const getDeviceInfo = async () => {
      setDeviceInfo({
        osName: Platform.OS,
        osVersion: String(Platform.Version),
        deviceName: Device.deviceName || 'Unknown Device',
        modelName: Device.modelName || 'Unknown Model',
        brand: Device.brand || 'Unknown Brand',
      });
    };

    getDeviceInfo();
  }, []);

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout and remove your secure token?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await dispatch(removeTokenFromStorage());
            dispatch(logout());
            Alert.alert('Success', 'Logged out successfully!');
          }
        }
      ]
    );
  };

  const showCodeReviewFix = () => {
    Alert.alert(
      'Code Review: Buggy FlatList',
      `Original buggy code:
<FlatList 
  data={data} 
  renderItem={(item) => <Text>{item.title}</Text>}
/>

Issues:
1. Missing keyExtractor prop
2. renderItem receives {item, index} object, not just item
3. No error handling for missing title
4. Missing performance optimizations

Fixed code:
<FlatList 
  data={data}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({item}) => (
    <Text>{item?.title || 'No title'}</Text>
  )}
  getItemLayout={getItemLayout}
  windowSize={10}
  removeClippedSubviews={true}
/>`,
      [{ text: 'Got it!' }]
    );
  };

  const showAppFeatures = () => {
    Alert.alert(
      'App Features Showcase',
      `✅ Optimized FlatList (5,000 items)
✅ Redux Cart System
✅ Offline Support with AsyncStorage
✅ Secure Token Storage
✅ Deep Linking (myapp://user/1)
✅ TypeScript throughout
✅ Performance optimizations
✅ Clean architecture
✅ Error handling
✅ Network status monitoring
✅ Native Module demonstration`,
      [{ text: 'Amazing!' }]
    );
  };

  const handleNativeModuleDemo = async () => {
    Alert.alert(
      'Native Module Demo',
      'This will demonstrate calling a native module to get device OS version. In a real app, this would call actual iOS/Android native code.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Native Module', onPress: callNativeModule }
      ]
    );
  };

  const showNativeModuleResult = () => {
    if (!nativeData) {
      Alert.alert('No Data', 'Call the native module first to see results');
      return;
    }

    Alert.alert(
      'Native Module Result',
      `OS: ${nativeData.osInfo?.osName} ${nativeData.osInfo?.osVersion}
Device: ${nativeData.osInfo?.deviceBrand} ${nativeData.osInfo?.deviceModel}
Memory: ${(nativeData.systemInfo?.totalMemory / 1000000).toFixed(0)}MB
Battery: ${(nativeData.systemInfo?.batteryLevel * 100).toFixed(0)}%
Architecture: ${nativeData.systemInfo?.cpuArchitecture}

Note: This is simulated data. In production, this would come from actual native iOS/Android APIs.`,
      [{ text: 'Got it!' }]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileRow = ({ 
    icon, 
    label, 
    value, 
    onPress, 
    showChevron = false,
    valueColor = '#2C3E50'
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    valueColor?: string;
  }) => (
    <TouchableOpacity 
      style={styles.profileRow} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={icon as any} size={20} color="#666" />
      <View style={styles.profileRowContent}>
        <Text style={styles.profileRowLabel}>{label}</Text>
        {value && (
          <Text style={[styles.profileRowValue, { color: valueColor }]}>{value}</Text>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text style={styles.name}>Demo User</Text>
          <Text style={styles.subtitle}>React Native Performance Demo</Text>
        </View>

        {/* App Statistics */}
        <ProfileSection title="📊 App Statistics">
          <ProfileRow 
            icon="cart" 
            label="Cart Items" 
            value={`${totalItems} items • $${totalAmount.toFixed(2)}`}
            valueColor="#007AFF"
          />
          <ProfileRow 
            icon="people" 
            label="Cached Users" 
            value={`${users.length} users`}
            valueColor="#34C759"
          />
          <ProfileRow 
            icon="shield-checkmark" 
            label="Authentication" 
            value={isAuthenticated ? "Authenticated" : "Not authenticated"}
            valueColor={isAuthenticated ? "#34C759" : "#FF3B30"}
          />
        </ProfileSection>

        {/* Device Information */}
        <ProfileSection title="📱 Device Information">
          <ProfileRow 
            icon="phone-portrait" 
            label="Device" 
            value={`${deviceInfo.brand} ${deviceInfo.modelName}`}
          />
          <ProfileRow 
            icon="hardware-chip" 
            label="Operating System" 
            value={`${deviceInfo.osName.toUpperCase()} ${deviceInfo.osVersion}`}
          />
          <ProfileRow 
            icon="information-circle" 
            label="Device Name" 
            value={deviceInfo.deviceName}
          />
          <ProfileRow 
            icon="code-slash" 
            label="Platform" 
            value={Platform.OS === 'ios' ? 'iOS' : 'Android'}
          />
        </ProfileSection>

        {/* App Information */}
        <ProfileSection title="ℹ️ App Information">
          <ProfileRow 
            icon="apps" 
            label="App Name" 
            value={Constants.expoConfig?.name || 'Binny'}
          />
          <ProfileRow 
            icon="git-branch" 
            label="Version" 
            value={Constants.expoConfig?.version || '1.0.0'}
          />
          <ProfileRow 
            icon="library" 
            label="Expo SDK" 
            value={Constants.expoConfig?.sdkVersion || 'Latest'}
          />
          <ProfileRow 
            icon="logo-react" 
            label="Framework" 
            value="React Native + Expo"
          />
        </ProfileSection>

        {/* Development Features */}
        <ProfileSection title="🛠️ Developer Features">
          <ProfileRow 
            icon="list-circle" 
            label="App Features" 
            onPress={showAppFeatures}
            showChevron
          />
          <ProfileRow 
            icon="bug" 
            label="Code Review Fix" 
            onPress={showCodeReviewFix}
            showChevron
          />
          <ProfileRow 
            icon="link" 
            label="Deep Link Test" 
            value="myapp://user/1"
            valueColor="#007AFF"
          />
          {token && (
            <ProfileRow 
              icon="key" 
              label="Secure Token" 
              value={`${token.substring(0, 15)}...`}
              valueColor="#FF9500"
            />
          )}
        </ProfileSection>

        {/* Native Module Demo */}
        <ProfileSection title="📱 Native Module Demo">
          <ProfileRow 
            icon="hardware-chip" 
            label="Call Native Module" 
            onPress={handleNativeModuleDemo}
            showChevron
          />
          {nativeLoading && (
            <ProfileRow 
              icon="refresh" 
              label="Loading..." 
              value="Calling native code..."
              valueColor="#FF9500"
            />
          )}
          {nativeData && (
            <>
              <ProfileRow 
                icon="checkmark-circle" 
                label="Native Call Success" 
                value={`${nativeData.osInfo?.osName} ${nativeData.osInfo?.osVersion}`}
                valueColor="#34C759"
              />
              <ProfileRow 
                icon="information-circle" 
                label="View Full Results" 
                onPress={showNativeModuleResult}
                showChevron
              />
            </>
          )}
          <ProfileRow 
            icon="document-text" 
            label="Implementation Details" 
            value="See /src/utils/deviceInfo.ts"
            valueColor="#666"
          />
        </ProfileSection>

        {/* Actions */}
        <ProfileSection title="⚙️ Actions">
          {totalItems > 0 && (
            <ProfileRow 
              icon="trash" 
              label="Clear Cart" 
              onPress={handleClearCart}
              showChevron
              valueColor="#FF3B30"
            />
          )}
          {isAuthenticated && (
            <ProfileRow 
              icon="log-out" 
              label="Logout" 
              onPress={handleLogout}
              showChevron
              valueColor="#FF3B30"
            />
          )}
        </ProfileSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native + Expo
          </Text>
          <Text style={styles.footerSubtext}>
            Performance • Offline Support • Clean Architecture
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}