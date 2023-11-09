import React from 'react'

export const Navbar = () => {
  return (
     <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/wishlist">Wishlist</a></li>
        <li><a href="/account">Account</a></li>
        <li><a href="/notification">Notification</a></li>
        <li><a href="/cart">Cart</a></li>
        <li><a href="/contactus">Contact Us</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      </ul>
    </nav>
  );
};