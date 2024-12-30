import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Nav from './Components/Nav/Nav'
import './App.css'
import Shop from './Views/Shop/Shop'
import { Home } from './Views/Home/Home'
import About from './Views/About/About'

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
