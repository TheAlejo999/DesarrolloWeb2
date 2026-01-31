import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { Guitar } from './components/guitar'
import { db } from './data/db'

function App() {
  function initialCart(){
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data, setData] = useState(db)
  const [cart, setCart] = useState(initialCart())

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart));
  },[cart])

  function addToCart(guitar) {
    const itemIndex= cart.findIndex((item) => guitar.id === item.id);
    console.log(itemIndex);
    if (itemIndex == -1) {
      guitar.quantity = 1;
      setCart([...cart, guitar]);
    } else {
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity++;
      setCart(updatedCart);
    }
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => 
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
  }

  function removeFromCart(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  function emptyCart() {
    setCart([]);
  }

  function calculateTotal() {
    /*let total = 0;
    for (const guitar of cart) {
      total += guitar.price * guitar.quantity;
    }*/
   let total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return total;
  }

  return (
    <>
      <Header cart={cart} total={calculateTotal()} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} removeFromCart={removeFromCart} emptyCart={emptyCart}/>

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
        <div className="row mt-5">
          {data.map((guitar)=>(
            <Guitar guitar={guitar} key={guitar.id} addToCart={addToCart} />
          ))}


        </div>
      </main>

      <Footer/>
    </>
  )
}

export default App
