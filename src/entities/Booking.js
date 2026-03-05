

class Booking {
  constructor(data) {
    this.id = data.id;
    this.property_id = data.property_id;
    this.guest_name = data.guest_name;
    this.guest_email = data.guest_email;
    this.check_in_date = data.check_in_date;
    this.check_out_date = data.check_out_date;
    this.num_guests = data.num_guests;
    this.total_price = data.total_price;
    this.status = data.status || 'confirmed';
    this.special_requests = data.special_requests;
    this.created_date = data.created_date;
  }

  static getAll() {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      try {
        return JSON.parse(savedBookings).map(b => new Booking(b));
      } catch (error) {
        console.error('Error parsing bookings from localStorage:', error);
        return [];
      }
    }
    return [];
  }


  static filter(filters = {}) {
    let bookings = this.getAll();


    if (filters.guest_email) {
      bookings = bookings.filter(b => b.guest_email === filters.guest_email);
    }

    if (filters.property_id) {
      bookings = bookings.filter(b => b.property_id === parseInt(filters.property_id));
    }

    if (filters.status) {
      bookings = bookings.filter(b => b.status === filters.status);
    }

    return bookings;
  }


  static create(bookingData) {

    const newId = Date.now();
    

    const newBooking = {
      id: newId,
      ...bookingData,
      status: bookingData.status || 'pending',
      created_date: new Date().toISOString().split('T')[0]
    };


    const existingBookings = this.getAll();
    

    const updatedBookings = [...existingBookings, newBooking];
    

    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    

    return new Booking(newBooking);
  }

  static update(id, bookingData) {
   
    const existingBookings = this.getAll();
    
    
    const updatedBookings = existingBookings.map(b => 
      b.id === id ? { ...b, ...bookingData } : b
    );
    
    
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
   
    const updatedBooking = updatedBookings.find(b => b.id === id);
    return new Booking(updatedBooking);
  }

 
  static delete(id) {
   
    const existingBookings = this.getAll();
    
   
    const updatedBookings = existingBookings.filter(b => b.id !== id);
   
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    return true;
  }

  static getById(id) {
    const bookings = this.getAll();
    const booking = bookings.find(b => b.id === id);
    return booking ? new Booking(booking) : null;
  }
}

export default Booking;