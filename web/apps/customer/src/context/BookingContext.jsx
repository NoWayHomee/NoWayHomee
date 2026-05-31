import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const getBookingsKey = () => {
    return user ? `bookings_${user.id || user.email}` : 'bookings_guest';
  };

  useEffect(() => {
    const key = getBookingsKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch (e) {
        console.error('Không thể parse danh sách đặt phòng từ localStorage:', e);
        setBookings([]);
      }
    } else {
      setBookings([]);
    }
  }, [user]);

  const saveBookings = (newBookings) => {
    setBookings(newBookings);
    const key = getBookingsKey();
    localStorage.setItem(key, JSON.stringify(newBookings));
  };

  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      orderCode: `#NWH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'success',
      dateBooked: new Date().toLocaleDateString('vi-VN')
    };
    const newBookings = [newBooking, ...bookings];
    saveBookings(newBookings);
    return newBooking;
  };

  const updateBookingStatus = (id, status) => {
    const newBookings = bookings.map(b => b.id === id ? { ...b, status } : b);
    saveBookings(newBookings);
  };

  const markBookingAsReviewed = (id) => {
    const newBookings = bookings.map(b => b.id === id ? { ...b, isReviewed: true } : b);
    saveBookings(newBookings);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        markBookingAsReviewed,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
