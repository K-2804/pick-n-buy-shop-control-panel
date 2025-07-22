
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAigm4R9KA3xeQEYawCdg9rvK0i-8GqeSQ",
  authDomain: "picknbuyorders.firebaseapp.com",
  projectId: "picknbuyorders",
  storageBucket: "picknbuyorders.firebasestorage.app",
  messagingSenderId: "405248122143",
  appId: "1:405248122143:web:e3d1e42f6188e660e0242a",
  measurementId: "G-1QVRWE2JNT"
};

const app = initializeApp(firebaseConfig);

// 👇 Rename this so it doesn't conflict with your mock object
const realFirestore = getFirestore(app);

export {
  realFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  updateDoc,
  doc
};

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'packed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  isHotDeal: boolean;
  quantity: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopProfile {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  pinCode: string;
  shopType: 'Grocery' | 'Vegetables' | 'Medical' | 'All Items';
  description?: string;
  address?: string;
  logoUrl?: string;
  bannerUrl?: string;
  pickupAvailable: boolean;
}

export interface User {
  id: string;
  email: string;
  shopId: string;
}

// Mock data for demonstration
export const mockOrders: Order[] = [
  {
    id: "order-1",
    customerId: "cust-1",
    customerName: "John Doe",
    customerPhone: "555-1234",
    orderItems: [
      { productId: "prod-1", productName: "Rice", quantity: 2, price: 25, totalPrice: 50 },
      { productId: "prod-2", productName: "Flour", quantity: 1, price: 18, totalPrice: 18 }
    ],
    totalAmount: 68,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: "order-2",
    customerId: "cust-2",
    customerName: "Jane Smith",
    customerPhone: "555-5678",
    orderItems: [
      { productId: "prod-3", productName: "Milk", quantity: 2, price: 3.5, totalPrice: 7 },
      { productId: "prod-4", productName: "Bread", quantity: 1, price: 2.5, totalPrice: 2.5 },
      { productId: "prod-5", productName: "Eggs", quantity: 12, price: 0.25, totalPrice: 3 }
    ],
    totalAmount: 12.5,
    status: "packed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: "order-3",
    customerId: "cust-3",
    customerName: "Bob Johnson",
    customerPhone: "555-9012",
    orderItems: [
      { productId: "prod-6", productName: "Apples", quantity: 6, price: 0.5, totalPrice: 3 },
      { productId: "prod-7", productName: "Oranges", quantity: 4, price: 0.75, totalPrice: 3 }
    ],
    totalAmount: 6,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23) // 23 hours ago
  }
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Basmati Rice",
    price: 25,
    category: "Grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop",
    inStock: true,
    isHotDeal: false,
    quantity: 50,
    unit: "kg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    id: "prod-2",
    name: "Whole Wheat Flour",
    price: 18,
    category: "Baking",
    imageUrl: "https://media.istockphoto.com/id/172876049/photo/whole-wheat-flour.jpg?s=612x612&w=0&k=20&c=bK48VqkF49oReBRhDoGfMORGapX2iWosEeImG_SXA8Q=",
    inStock: true,
    isHotDeal: false,
    quantity: 30,
    unit: "kg",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: "prod-3",
    name: "Full Fat Milk",
    price: 3.5,
    discountedPrice: 2.99,
    category: "Dairy",
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=2070&auto=format&fit=crop",
    inStock: true,
    isHotDeal: true,
    quantity: 20,
    unit: "L",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: "prod-4",
    name: "Fresh Bread",
    price: 2.5,
    category: "Bakery",
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=2070&auto=format&fit=crop",
    inStock: true,
    isHotDeal: false,
    quantity: 15,
    unit: "loaf",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: "prod-5",
    name: "Farm Fresh Eggs",
    price: 3,
    category: "Dairy",
    imageUrl: "https://zamaorganics.com/cdn/shop/files/Untitleddesign_79.png?v=1703490868&width=1080",
    inStock: true,
    isHotDeal: false,
    quantity: 100,
    unit: "dozen",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: "prod-6",
    name: "Fresh Apples",
    price: 0.5,
    discountedPrice: 0.4,
    category: "Fruits",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop",
    inStock: true,
    isHotDeal: true,
    quantity: 200,
    unit: "piece",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  }
];

export const mockShopProfile: ShopProfile = {
  id: "shop-1",
  name: "City Grocers",
  ownerName: "Alex Morgan",
  email: "alex@citygrocers.com",
  phone: "555-1234",
  pinCode: "110001",
  shopType: "Grocery",
  description: "Your one-stop shop for all grocery needs. We offer fresh, high-quality products at competitive prices.",
  address: "123 Main St, Delhi",
  logoUrl: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=1974&auto=format&fit=crop",
  bannerUrl: "https://images.unsplash.com/photo-1604719312566-8912e9c8a103?q=80&w=2069&auto=format&fit=crop",
  pickupAvailable: true
};

// Mock Firebase auth functions
export const auth = {
  currentUser: null as User | null,
  
  // Sign in
  signInWithEmailAndPassword: async (email: string, password: string) => {
    if (email === "demo@picknpay.com" && password === "password") {
      auth.currentUser = {
        id: "user-1",
        email: email,
        shopId: "shop-1"
      };
      return { user: auth.currentUser };
    } else {
      throw new Error("Invalid email or password");
    }
  },
  
  // Sign up
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    // In a real app, you would create a user in Firebase
    auth.currentUser = {
      id: "user-new",
      email: email,
      shopId: "shop-new"
    };
    return { user: auth.currentUser };
  },
  
  // Sign out
  signOut: async () => {
    auth.currentUser = null;
  }
};

// Mock Firestore
export const firestore = {
  // Get orders
  getOrders: async () => {
    return mockOrders;
  },
  
  // Get products
  getProducts: async () => {
    return mockProducts;
  },
  
  // Get shop profile
  getShopProfile: async (shopId: string) => {
    return mockShopProfile;
  },
  
  // Update order status
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    console.log(`Updating order ${orderId} status to ${status}`);
    // In a real app, you would update the order in Firebase
    return true;
  },
  
  // Add product
  addProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log(`Adding product: ${product.name}`);
    // In a real app, you would add the product to Firebase
    return { id: `prod-new-${Date.now()}` };
  },
  
  // Update product
  updateProduct: async (productId: string, product: Partial<Product>) => {
    console.log(`Updating product ${productId}`);
    // In a real app, you would update the product in Firebase
    return true;
  },
  
  // Delete product
  deleteProduct: async (productId: string) => {
    console.log(`Deleting product ${productId}`);
    // In a real app, you would delete the product from Firebase
    return true;
  },
  
  // Update shop profile
  updateShopProfile: async (shopId: string, profile: Partial<ShopProfile>) => {
    console.log(`Updating shop profile ${shopId}`);
    // In a real app, you would update the shop profile in Firebase
    return true;
  }
};

// Mock storage
export const storage = {
  // Upload file
  uploadFile: async (file: File, path: string) => {
    console.log(`Uploading file to ${path}`);
    // In a real app, you would upload the file to Firebase Storage
    return { downloadURL: URL.createObjectURL(file) };
  }
};

// Mock auth state observer
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  callback(auth.currentUser);
  // Return unsubscribe function
  return () => {};
};
