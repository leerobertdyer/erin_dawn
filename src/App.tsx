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
import { ProductManagementProvider } from './Context/ProductMgmtContext'
import { PhotosProvider } from './Context/PhotosContext'
import PurchaseSuccess from './Views/PurchaseSuccess/PurchaseSuccess'
import NewProductForm from './Components/Forms/NewProductForm'
import EditProductForm from './Components/Forms/EditProductForm'
import EditHeroForm from './Components/Forms/EditHeroForm'
import NewSeriesPhotoForm from './Components/Forms/NewSeriesPhotoForm'

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
    <ProductManagementProvider>
      <PhotosProvider>
        <Router>
          <Nav u={user} />
          <Routes>
            <Route path="/" element={<Home u={user}  />} />
            <Route path="/shop" element={<Shop u={user} />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/cart/success" element={<PurchaseSuccess/>} />
            <Route path="/cart/cancel" element={<Cart/>} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin u={user} setUser={setUser} />} />
            <Route path="/add-product" element={<NewProductForm />} />
            <Route path="/edit-product" element={<EditProductForm />} />
            <Route path="/add-series-photo" element={<NewSeriesPhotoForm />} />
            <Route path="/edit-hero" element={<EditHeroForm />} />
          </Routes>
        </Router>
      </PhotosProvider>
    </ProductManagementProvider>
  )
}

export default App
