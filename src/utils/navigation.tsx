import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CartScreen from "../screens/cart-screen";
import HomeScreen from "../screens/home-screen";
import LargeListScreen from "../screens/large-list-screen";
import ProductsScreen from "../screens/products-screen";
import ProfileScreen from "../screens/profile-screen";
import UserDetailScreen from "../screens/user-detail-screen";
import UsersScreen from "../screens/users-screen";
import { RootStackParamList, TabParamList } from "../types";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Deep linking configuration
const linking = {
  prefixes: ["myapp://"],
  config: {
    screens: {
      MainTabs: {
        path: "/",
        screens: {
          Users: "users",
          Home: "home",
          LargeList: "list",
          Products: "products",
          Cart: "cart",
          Profile: "profile",
        },
      },
      UserDetail: {
        path: "/user/:userId",
        parse: {
          userId: (userId: string) => parseInt(userId, 10),
        },
      },
    },
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "LargeList":
              iconName = focused ? "list" : "list-outline";
              break;
            case "Products":
              iconName = focused ? "storefront" : "storefront-outline";
              break;
            case "Cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Users":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "help-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="LargeList" component={LargeListScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={{ title: "User Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
