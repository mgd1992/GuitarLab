import { useState, useEffect } from 'react'
import { useMemo } from "react";
import { db } from '../data/db'



const useCart = () => {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {

    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity += 1
      setCart(updatedCart)
    } else {
      const newItem = { ...item, quantity: 1 }
      setCart(cart => [...cart, newItem])
    }


  }

  const removeGuitar = (guitarId) => {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== guitarId))
  }

  const increaseQuantity = (id) => {
    const newCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(newCart)
  }

  const decrementar = (id) => {
    const restarItemCart = cart.map(item => {
      if (item.id === id && item.quantity >= MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item
    }).filter(item => item.quantity > 0)
    setCart(restarItemCart)
  }

  const clearCart = () => {
    setCart([])
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart])

  const cartTotal = useMemo(() =>
    cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

  return {
    data,
    cart,
    addToCart,
    decrementar,
    removeGuitar,
    increaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  }
}

export default useCart
