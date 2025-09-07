// User types from jsonplaceholder API
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Product types for cart system
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

// Cart item type
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

// Large list item type
export interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  value: number;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  UserDetail: { userId: number };
};

export type TabParamList = {
  Home: undefined;
  LargeList: undefined;
  Products: undefined;
  Cart: undefined;
  Users: undefined;
  Profile: undefined;
};

// Redux state types
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export interface AppState {
  cart: CartState;
  users: UsersState;
  auth: AuthState;
}
