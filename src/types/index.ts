// Global type definitions for PharmaLink application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'pharmacy' | 'admin' | 'guest';
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  rating?: number;
  isOpenNow?: boolean;
  medicationCount?: number;
  location?: Location | null;
  distance?: string;
  hours?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  revenue?: number;
  orders?: number;
  inventory?: number;
  license?: string;
  documents?: Document[];
}

export interface Medication {
  id: string;
  name: string;
  category: string;
  manufacturer?: string;
  description?: string;
  price: number;
  stock?: number;
  minStock?: number;
  expiryDate?: string;
  sku?: string;
  image?: string;
  lastUpdated?: string;
  pharmacyId?: string;
  pharmacy?: Pharmacy;
  isAvailable?: boolean;
  dosage?: string;
  sideEffects?: string[];
  contraindications?: string[];
}

export interface CartItem {
  id: string;
  medicationId: string;
  medication: Medication;
  quantity: number;
  pharmacyId: string;
  pharmacy: Pharmacy;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  deliveryAddress?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  notes?: string;
}

export interface Prescription {
  id: string;
  name: string;
  doctor: string;
  hospital: string;
  date: Date;
  status: 'active' | 'expired' | 'pending';
  expiryDate: Date;
  refillsLeft: number;
  totalRefills: number;
  notes: string;
  imageUrl: string;
  userId?: string;
  medications?: Medication[];
}

export interface HealthArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  date: string;
  featured: boolean;
  content?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sessionId?: string;
}

export interface ChatSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: 'notchpay' | 'card' | 'mobile_money';
  transactionId?: string;
  date: Date;
  description?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  stock: number;
  price: number;
  minStock: number;
  expiryDate: string;
  sku: string;
  description: string;
  lastUpdated: string;
  image?: string;
}

export interface SearchFilters {
  availability: boolean;
  distance: number;
  rating: number;
  price: {
    min: number;
    max: number;
  };
  openNow: boolean;
  hasDelivery: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'medication' | 'pharmacy';
  price?: number;
  pharmacy?: Pharmacy;
  medication?: Medication;
  distance?: string;
  rating?: number;
  isOpenNow?: boolean;
  hasDelivery?: boolean;
  availability?: boolean;
}

export interface AlertMessage {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DatabaseStats {
  totalUsers: number;
  totalPharmacies: number;
  totalMedications: number;
  totalOrders: number;
  recentActivity: any[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

// Component Props Interfaces
export interface StatusBadgeProps {
  status: string;
}

export interface PrescriptionCardProps {
  prescription: Prescription;
  onDelete: (id: string) => void;
}

export interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

export interface DrugCardProps {
  drug: Medication;
}

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<any>;
  trend: 'up' | 'down' | 'neutral';
}

// Utility Types
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'price' | 'stock' | 'expiryDate' | 'lastUpdated';
export type UserRole = 'patient' | 'pharmacy' | 'admin' | 'guest';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PrescriptionStatus = 'active' | 'expired' | 'pending';
export type PharmacyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
