import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import { AuthProvider, AuthContext } from './util/AuthContext';


import ProductsView from './Views/Products/products';
import Footer from './Views/Footer/footer';
import Navbar from './Views/Navbar/navbar';
import About from './Views/About/about';
import GameInfoView from './Views/Game-info/game-info';
import PublisherInfoView from './Views/Publisher-Info/publisher-info';
import DeveloperInfoView from './Views/Developer-Info/developer-info';
import LoginView from './Views/Login/login';
import GemenskapView from './Views/Gemenskap/gemenskap';
import RegisterView from './Views/Register/register';
import ProfileView from './Views/Profile/profile';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ isLoggedIn }) => (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<ProductsView />} />
                <Route path="/about" element={<About />} />
                <Route path="/game-info/:gameId" element={<GameInfoView />} />
                {!isLoggedIn && (
                  <>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                  </>
                )}
                <Route path="/publisher/:id" element={<PublisherInfoView />} />
                <Route path="/developer/:id" element={<DeveloperInfoView />} />
                <Route path="/gemenskap" element={<GemenskapView />} />
                <Route path="/profile" element={<ProfileView />} />
              </Routes>
              <Footer />
            </>
          )}
        </AuthContext.Consumer>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
