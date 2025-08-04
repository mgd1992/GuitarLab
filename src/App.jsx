import { useState, useEffect } from 'react'

import Header from './components/Header'
import Guitar from './components/Guitar'
import { db } from './data/db'


function App() {

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

  return (
    <>

      <Header
        cart={cart}
        removeGuitar={removeGuitar}
        setCart={setCart}
        increaseQuantity={increaseQuantity}
        decrementar={decrementar}
      />

      < main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">

          {data.map((d) => (
            <Guitar key={d.id} guitar={d} setCart={setCart} addToCart={addToCart} />
          ))}

        </div>
      </main >


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App
