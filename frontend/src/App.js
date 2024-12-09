import './App.css';
import {Routes, Route} from "react-router-dom"
import SignUpPage from './pages/auth/signup/SignUpPage';

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        {/* <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} /> */}
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
