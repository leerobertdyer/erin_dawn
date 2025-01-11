import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Nav from './Components/Nav/Nav'
import './App.css'
import Shop from './Views/Shop/Shop'
import { Home } from './Views/Home/Home'
import About from './Views/About/About'
import Admin from './Views/Admin/Admin'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from './firebase/firebaseConfig'
import Cart from './Views/Cart/Cart'

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cartIds, setCartIds] = useState<string[]>([]);

  useEffect(() => {
    function unsubscribe() {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    }
    return unsubscribe();
  }, []);

function handleAddToCart(id: string) { 
  setCartIds([...cartIds, id])
}

  return (
    <>
      <Router>
        <Nav u={user} cartIds={cartIds}/>
        <Routes>
          <Route path="/" element={<Home u={user}/>} />
          <Route path="/shop" element={<Shop u={user} handleAddToCart={handleAddToCart}/>} />
          <Route path="/cart" element={<Cart u={user} cartIds={cartIds}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin u={user} setUser={setUser} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
