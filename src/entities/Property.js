import { propertyAPI } from '../utils/api';



class Property {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.property_type = data.property_type;
    this.price_per_night = data.price_per_night;
    this.max_guests = data.max_guests;
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.amenities = data.amenities || [];
    this.images = data.images || [];
    this.house_rules = data.house_rules;
    this.is_available = data.is_available !== false;
    this.created_by = data.created_by;
    this.created_date = data.created_date;
  }

  static async getAll() {
    return this.getMockData();
  }

  static async getById(id) {
    const data = this.getMockData().find(p => p.id === parseInt(id));
    return data ? new Property(data) : null;
  }

  static async create(propertyData) {
    const mockId = Math.floor(Math.random() * 1000) + 100;
    return new Property({ id: mockId, ...propertyData, created_date: new Date().toISOString() });
  }

  static async update(id, propertyData) {
    const existing = this.getMockData().find(p => p.id === parseInt(id));
    return existing ? new Property({ ...existing, ...propertyData }) : null;
  }

  static async delete(id) {
    return true; 
  }

  static async filter(filters = {}, sortBy = "", limit = 50) {
    let data = this.getMockData();


    if (filters.is_available !== undefined) {
      data = data.filter(p => p.is_available === filters.is_available);
    }
    if (filters.id) {
      data = data.filter(p => p.id === parseInt(filters.id));
    }
    if (filters.created_by) {
      data = data.filter(p => p.created_by === filters.created_by);
    }

    
    if (filters.q) {
      const term = filters.q.toLowerCase();
      data = data.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (sortBy) {
      const desc = sortBy.startsWith('-');
      const field = desc ? sortBy.slice(1) : sortBy;
      data.sort((a, b) => {
        if (a[field] < b[field]) return desc ? 1 : -1;
        if (a[field] > b[field]) return desc ? -1 : 1;
        return 0;
      });
    }

    return data.slice(0, limit).map(p => new Property(p));
  }

  static getMockData() {
    return [
      {
        id: 1,
        title: "Luxury Beach Villa",
        description: "Stunning oceanfront villa with private pool and panoramic views.",
        location: "Cape Town, South Africa",
        property_type: "villa",
        price_per_night: 1200,
        max_guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ["wifi", "pool", "parking", "kitchen"],
        images: [
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
        ],
        house_rules: "No smoking. Check-in after 3 PM. No pets.",
        is_available: true,
        created_by: "host1@example.com",
        created_date: "2024-01-15"
      },
      {
        id: 2,
        title: "Modern City Apartment",
        description: "Sleek downtown apartment with rooftop access and city views.",
        location: "Johannesburg, South Africa",
        property_type: "apartment",
        price_per_night: 800,
        max_guests: 4,
        bedrooms: 2,
        bathrooms: 1,
        amenities: ["wifi", "kitchen", "tv", "workspace"],
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
        ],
        house_rules: "Quiet hours after 10 PM. No parties.",
        is_available: true,
        created_by: "host2@example.com",
        created_date: "2024-02-10"
      },
      {
        id: 3,
        title: "Cozy Mountain Cabin",
        description: "Rustic cabin surrounded by nature, perfect for a peaceful getaway.",
        location: "Drakensberg, South Africa",
        property_type: "cabin",
        price_per_night: 600,
        max_guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        amenities: ["wifi", "fireplace", "kitchen", "balcony"],
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
        ],
        house_rules: "Check-out by 11 AM. Please leave the cabin clean.",
        is_available: true,
        created_by: "host3@example.com",
        created_date: "2024-03-05"
      }
    ];
  }
}

export default Property;