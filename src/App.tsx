import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import './App.css';
import Shop from './Views/Shop/Shop';
import { Home } from './Views/Home/Home';
import About from './Views/About/About';
import Admin from './Views/Admin/Admin';
import Cart from './Views/Cart/Cart';
import { ProductManagementProvider } from './Context/ProductMgmtContext';
import { PhotosProvider } from './Context/PhotosContext';
import PurchaseSuccess from './Views/PurchaseSuccess/PurchaseSuccess';
import { UserProvider } from './Context/UserContext';
import EmailSignupForm from './Components/Forms/EmailSignupForm';
import NewEmailForm from './Components/Forms/NewEmailForm';

function App() {
  const handleWheel = () => {
    if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  };

  document.addEventListener("wheel", handleWheel);

  return ( // Providers and Context
    <UserProvider>
      <ProductManagementProvider>
        <PhotosProvider>
          <Router>
            <AppContent />
          </Router>
        </PhotosProvider>
      </ProductManagementProvider>
    </UserProvider>
  );
}

const AppContent = () => {

  return ( // Actual App
    <div className='font-classy w-screen h-screen overflow-auto'>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/success" element={<PurchaseSuccess />} />
        <Route path="/cart/cancel" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/emailsignup" element={<EmailSignupForm />} />
        <Route path="/newemail" element={<NewEmailForm />} />
      </Routes>
    </div>
  );
};

export default App;