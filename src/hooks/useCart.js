import { useEffect, useMemo, useState } from "react";
import { db } from "../data/db";

export const useCart = () => {

    const initialCartValue = () => {
        const localStorageCart = localStorage.getItem('cart');
        return localStorageCart ? JSON.parse(localStorageCart) : [];
    }

    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialCartValue);

    const MAX_ITEMS = 5;
    const MIN_ITEMS = 1;

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    function addToCart(item) {

        const itemExists = cart.findIndex(guitar => guitar.id === item.id);
        
        if(itemExists >= 0){ //item exists
        if(cart[itemExists].quantity >= MAX_ITEMS) return;
        // increment item quantity
        const updatedCart = [...cart];
        updatedCart[itemExists].quantity++;
        setCart(updatedCart);
        }else{
        item.quantity = 1;
        setCart([...cart, item]);
        }
    }

    function removeFromCart(id){
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    }

    function increaseQuantity(id){
        const updatedCart = cart.map(item => {
        if(item.id === id && item.quantity < MAX_ITEMS){
            return {
                ...item,
                quantity: item.quantity + 1
            }
        }
        return item;
        })

        setCart(updatedCart);
    }

    function decreaseQuantity(id){
        const updatedCart = cart.map(item => {
        if(item.id === id && item.quantity > MIN_ITEMS){
            return {
            ...item,
            quantity: item.quantity - 1
            }
        }
        return item;
        });

        setCart(updatedCart);
    }

    function clearCart() {
        setCart([]);
    }

    // state derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal,
  }
}