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


function App() {
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin u={user} setUser={setUser} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
