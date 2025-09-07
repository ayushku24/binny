import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppSelector } from "../../store";
import { RootStackParamList } from "../../types";
import { styles } from "./styles";

type UserDetailRouteProp = RouteProp<RootStackParamList, "UserDetail">;

export default function UserDetailScreen() {
  const route = useRoute<UserDetailRouteProp>();
  const { userId } = route.params;
  const { users } = useAppSelector((state) => state.users);

  const user = useMemo(
    () => users.find((u) => u.id === userId),
    [users, userId],
  );

  const handleCall = () => {
    if (user?.phone) {
      const phoneNumber = user.phone.replace(/[^\d+]/g, "");
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (user?.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const handleWebsite = () => {
    if (user?.website) {
      const url = user.website.startsWith("http")
        ? user.website
        : `https://${user.website}`;
      Linking.openURL(url);
    }
  };

  const handleMapLocation = () => {
    if (user?.address) {
      const { lat, lng } = user.address.geo;
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  const showDeepLinkInfo = () => {
    Alert.alert(
      "Deep Link Demo",
      `This screen can be opened via deep link:\nmyapp://user/${userId}`,
      [{ text: "OK" }],
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#FF3B30" />
          <Text style={styles.errorTitle}>User Not Found</Text>
          <Text style={styles.errorSubtitle}>
            User with ID {userId} could not be found. Make sure users are loaded
            first.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>

          <TouchableOpacity
            style={styles.deepLinkButton}
            onPress={showDeepLinkInfo}
          >
            <Ionicons name="link" size={16} color="#007AFF" />
            <Text style={styles.deepLinkButtonText}>Deep Link Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
              <Ionicons name="mail" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call" size={24} color="#34C759" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWebsite}
            >
              <Ionicons name="globe" size={24} color="#FF9500" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleMapLocation}
            >
              <Ionicons name="location" size={24} color="#FF3B30" />
              <Text style={styles.actionButtonText}>Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Website</Text>
                <Text style={styles.infoValue}>{user.website}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Street</Text>
                <Text style={styles.infoValue}>
                  {user.address.street}, {user.address.suite}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>
                  {user.address.city}, {user.address.zipcode}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="navigate-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Coordinates</Text>
                <Text style={styles.infoValue}>
                  {user.address.geo.lat}, {user.address.geo.lng}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Company Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Company Name</Text>
                <Text style={styles.infoValue}>{user.company.name}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="bulb-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Catch Phrase</Text>
                <Text style={styles.infoValue}>{user.company.catchPhrase}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="trending-up-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Business</Text>
                <Text style={styles.infoValue}>{user.company.bs}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
