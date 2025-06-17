// Comprehensive Delivery Management Service for PharmaLink
// Handles route optimization, tracking, partner integration, and proof of delivery

export interface DeliveryAddress {
  id: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  landmark?: string;
  instructions?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  type: 'internal' | 'third_party';
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  vehicleInfo: {
    type: 'motorcycle' | 'car' | 'bicycle' | 'van';
    plateNumber: string;
    model?: string;
  };
  rating: number;
  totalDeliveries: number;
  isActive: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface DeliveryRoute {
  id: string;
  partnerId: string;
  deliveries: string[]; // Array of delivery IDs
  optimizedOrder: string[]; // Optimized delivery order
  totalDistance: number; // in kilometers
  estimatedDuration: number; // in minutes
  startLocation: DeliveryAddress;
  waypoints: DeliveryAddress[];
  endLocation: DeliveryAddress;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  pharmacyId: string;
  partnerId?: string;
  routeId?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Addresses
  pickupAddress: DeliveryAddress;
  deliveryAddress: DeliveryAddress;
  
  // Timing
  scheduledPickup: Date;
  scheduledDelivery: Date;
  actualPickup?: Date;
  actualDelivery?: Date;
  
  // Package info
  packageInfo: {
    weight: number; // in kg
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    value: number; // in XAF
    isFragile: boolean;
    requiresColdChain: boolean;
    specialInstructions?: string;
  };
  
  // Tracking
  trackingNumber: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
    address?: string;
  };
  
  // Proof of delivery
  proofOfDelivery?: {
    recipientName: string;
    recipientSignature?: string; // Base64 image
    deliveryPhoto: string; // Base64 image
    deliveryTime: Date;
    notes?: string;
    gpsLocation: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Costs
  deliveryFee: number;
  insuranceFee?: number;
  totalCost: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
}

export interface TrackingUpdate {
  id: string;
  deliveryId: string;
  status: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: Date;
  message: string;
  partnerId?: string;
  photoUrl?: string;
}

class DeliveryService {
  private static instance: DeliveryService;
  private deliveries: Map<string, Delivery> = new Map();
  private partners: Map<string, DeliveryPartner> = new Map();
  private routes: Map<string, DeliveryRoute> = new Map();
  private trackingUpdates: Map<string, TrackingUpdate[]> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  public static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  private initializeMockData(): void {
    // Initialize mock delivery partners
    const mockPartners: DeliveryPartner[] = [
      {
        id: 'partner_001',
        name: 'Jean-Claude Mbarga',
        type: 'internal',
        contactInfo: {
          phone: '+237 6XX XXX 001',
          email: 'jean.mbarga@pharmalink.cm',
          whatsapp: '+237 6XX XXX 001'
        },
        vehicleInfo: {
          type: 'motorcycle',
          plateNumber: 'YA-2024-MC',
          model: 'Honda CB 125'
        },
        rating: 4.8,
        totalDeliveries: 1250,
        isActive: true,
        currentLocation: {
          latitude: 3.8480,
          longitude: 11.5021,
          timestamp: new Date()
        },
        workingHours: {
          start: '08:00',
          end: '18:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
      },
      {
        id: 'partner_002',
        name: 'Marie Nguema',
        type: 'internal',
        contactInfo: {
          phone: '+237 6XX XXX 002',
          email: 'marie.nguema@pharmalink.cm',
          whatsapp: '+237 6XX XXX 002'
        },
        vehicleInfo: {
          type: 'car',
          plateNumber: 'YA-2024-CAR',
          model: 'Toyota Corolla'
        },
        rating: 4.9,
        totalDeliveries: 980,
        isActive: true,
        workingHours: {
          start: '09:00',
          end: '17:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      {
        id: 'partner_003',
        name: 'Express Delivery Cameroon',
        type: 'third_party',
        contactInfo: {
          phone: '+237 6XX XXX 100',
          email: 'contact@expressdelivery.cm'
        },
        vehicleInfo: {
          type: 'van',
          plateNumber: 'YA-2024-VAN',
          model: 'Ford Transit'
        },
        rating: 4.6,
        totalDeliveries: 5000,
        isActive: true,
        workingHours: {
          start: '06:00',
          end: '20:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
      }
    ];

    mockPartners.forEach(partner => {
      this.partners.set(partner.id, partner);
    });
  }

  // Create a new delivery
  public async createDelivery(deliveryData: Omit<Delivery, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Promise<Delivery> {
    const delivery: Delivery = {
      ...deliveryData,
      id: `delivery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      trackingNumber: this.generateTrackingNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.deliveries.set(delivery.id, delivery);
    
    // Initialize tracking updates
    this.trackingUpdates.set(delivery.id, [{
      id: `track_${Date.now()}`,
      deliveryId: delivery.id,
      status: 'pending',
      location: delivery.pickupAddress.coordinates,
      timestamp: new Date(),
      message: 'Delivery created and pending assignment'
    }]);

    console.log(`📦 New delivery created: ${delivery.id}`);
    return delivery;
  }

  // Assign delivery to partner
  public async assignDelivery(deliveryId: string, partnerId: string): Promise<boolean> {
    const delivery = this.deliveries.get(deliveryId);
    const partner = this.partners.get(partnerId);

    if (!delivery || !partner) {
      throw new Error('Delivery or partner not found');
    }

    if (!partner.isActive) {
      throw new Error('Partner is not active');
    }

    delivery.partnerId = partnerId;
    delivery.status = 'assigned';
    delivery.updatedAt = new Date();

    this.deliveries.set(deliveryId, delivery);

    // Add tracking update
    this.addTrackingUpdate(deliveryId, {
      status: 'assigned',
      location: delivery.pickupAddress.coordinates,
      message: `Assigned to ${partner.name}`,
      partnerId
    });

    console.log(`👤 Delivery ${deliveryId} assigned to ${partner.name}`);
    return true;
  }

  // Optimize delivery route
  public async optimizeRoute(deliveryIds: string[]): Promise<DeliveryRoute> {
    const deliveries = deliveryIds.map(id => this.deliveries.get(id)).filter(Boolean) as Delivery[];
    
    if (deliveries.length === 0) {
      throw new Error('No valid deliveries found');
    }

    // Simple route optimization (in production, use Google Maps API or similar)
    const optimizedOrder = this.calculateOptimalRoute(deliveries);
    
    const route: DeliveryRoute = {
      id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      partnerId: deliveries[0].partnerId || '',
      deliveries: deliveryIds,
      optimizedOrder,
      totalDistance: this.calculateTotalDistance(optimizedOrder, deliveries),
      estimatedDuration: this.calculateEstimatedDuration(optimizedOrder, deliveries),
      startLocation: deliveries[0].pickupAddress,
      waypoints: optimizedOrder.slice(1, -1).map(id => 
        deliveries.find(d => d.id === id)?.deliveryAddress!
      ),
      endLocation: deliveries[optimizedOrder.length - 1].deliveryAddress,
      status: 'planned',
      createdAt: new Date()
    };

    this.routes.set(route.id, route);

    // Update deliveries with route ID
    deliveries.forEach(delivery => {
      delivery.routeId = route.id;
      this.deliveries.set(delivery.id, delivery);
    });

    console.log(`🗺️ Route optimized: ${route.id} with ${deliveries.length} deliveries`);
    return route;
  }

  // Update delivery status
  public async updateDeliveryStatus(
    deliveryId: string, 
    status: Delivery['status'], 
    location?: { latitude: number; longitude: number },
    notes?: string
  ): Promise<void> {
    const delivery = this.deliveries.get(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.status = status;
    delivery.updatedAt = new Date();

    // Update timing based on status
    switch (status) {
      case 'picked_up':
        delivery.actualPickup = new Date();
        break;
      case 'delivered':
        delivery.actualDelivery = new Date();
        break;
    }

    if (location) {
      delivery.currentLocation = {
        ...location,
        timestamp: new Date()
      };
    }

    this.deliveries.set(deliveryId, delivery);

    // Add tracking update
    this.addTrackingUpdate(deliveryId, {
      status,
      location: location || delivery.currentLocation?.latitude ? 
        { latitude: delivery.currentLocation.latitude, longitude: delivery.currentLocation.longitude } :
        delivery.pickupAddress.coordinates,
      message: notes || `Status updated to ${status}`,
      partnerId: delivery.partnerId
    });

    console.log(`📍 Delivery ${deliveryId} status updated to ${status}`);
  }

  // Add proof of delivery
  public async addProofOfDelivery(
    deliveryId: string,
    proof: Delivery['proofOfDelivery']
  ): Promise<void> {
    const delivery = this.deliveries.get(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.proofOfDelivery = proof;
    delivery.status = 'delivered';
    delivery.actualDelivery = proof?.deliveryTime || new Date();
    delivery.updatedAt = new Date();

    this.deliveries.set(deliveryId, delivery);

    // Add tracking update
    this.addTrackingUpdate(deliveryId, {
      status: 'delivered',
      location: proof?.gpsLocation || delivery.deliveryAddress.coordinates,
      message: `Delivered to ${proof?.recipientName}`,
      partnerId: delivery.partnerId
    });

    console.log(`✅ Proof of delivery added for ${deliveryId}`);
  }

  // Get delivery tracking
  public getDeliveryTracking(deliveryId: string): TrackingUpdate[] {
    return this.trackingUpdates.get(deliveryId) || [];
  }

  // Get delivery by ID
  public getDelivery(deliveryId: string): Delivery | undefined {
    return this.deliveries.get(deliveryId);
  }

  // Get deliveries by customer
  public getCustomerDeliveries(customerId: string): Delivery[] {
    return Array.from(this.deliveries.values()).filter(d => d.customerId === customerId);
  }

  // Get partner deliveries
  public getPartnerDeliveries(partnerId: string): Delivery[] {
    return Array.from(this.deliveries.values()).filter(d => d.partnerId === partnerId);
  }

  // Get available partners
  public getAvailablePartners(): DeliveryPartner[] {
    return Array.from(this.partners.values()).filter(p => p.isActive);
  }

  // Private helper methods
  private generateTrackingNumber(): string {
    const prefix = 'PL';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private addTrackingUpdate(deliveryId: string, update: Omit<TrackingUpdate, 'id' | 'deliveryId' | 'timestamp'>): void {
    const trackingUpdate: TrackingUpdate = {
      id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      deliveryId,
      timestamp: new Date(),
      ...update
    };

    const updates = this.trackingUpdates.get(deliveryId) || [];
    updates.push(trackingUpdate);
    this.trackingUpdates.set(deliveryId, updates);
  }

  private calculateOptimalRoute(deliveries: Delivery[]): string[] {
    // Simple nearest neighbor algorithm (in production, use advanced routing algorithms)
    if (deliveries.length <= 1) return deliveries.map(d => d.id);

    const unvisited = [...deliveries];
    const route: string[] = [];
    let current = unvisited.shift()!;
    route.push(current.id);

    while (unvisited.length > 0) {
      let nearest = unvisited[0];
      let minDistance = this.calculateDistance(
        current.deliveryAddress.coordinates,
        nearest.deliveryAddress.coordinates
      );

      for (let i = 1; i < unvisited.length; i++) {
        const distance = this.calculateDistance(
          current.deliveryAddress.coordinates,
          unvisited[i].deliveryAddress.coordinates
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearest = unvisited[i];
        }
      }

      route.push(nearest.id);
      current = nearest;
      unvisited.splice(unvisited.indexOf(nearest), 1);
    }

    return route;
  }

  private calculateDistance(coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number }): number {
    // Haversine formula for calculating distance between two coordinates
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateTotalDistance(routeOrder: string[], deliveries: Delivery[]): number {
    let totalDistance = 0;
    for (let i = 0; i < routeOrder.length - 1; i++) {
      const current = deliveries.find(d => d.id === routeOrder[i])!;
      const next = deliveries.find(d => d.id === routeOrder[i + 1])!;
      totalDistance += this.calculateDistance(
        current.deliveryAddress.coordinates,
        next.deliveryAddress.coordinates
      );
    }
    return totalDistance;
  }

  private calculateEstimatedDuration(routeOrder: string[], deliveries: Delivery[]): number {
    const totalDistance = this.calculateTotalDistance(routeOrder, deliveries);
    const averageSpeed = 25; // km/h average speed in Yaoundé
    const stopTime = 10; // minutes per stop
    return (totalDistance / averageSpeed * 60) + (deliveries.length * stopTime);
  }
}

export default DeliveryService;
