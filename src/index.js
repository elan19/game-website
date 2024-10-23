import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import { AuthProvider, AuthContext } from './util/AuthContext';
import { UserProvider } from './util/UserContext'; // Import UserProvider

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
import EditProfile from './Views/Profile/edit-profile';
import Library from './Views/Library/library';
import SocialView from './Views/Gemenskap/social';
import UserProfileView from './Views/Profile/userProfile';
import InventoryView from './Views/Profile/inventory';
import GameView from './Views/Library/game';
import MarketView from './Views/Market/market';
import NotificationView from './Views/Profile/notification';
import UserFriendsView from './Views/Profile/userFriends';
import CameraView from './Views/Gemenskap/camera';
import DiscussionView from './Views/Gemenskap/discussion';
import CreateDiscussionView from './Views/Gemenskap/create-discussion';
import DiscussionDetailiew from './Views/Gemenskap/discussion-detail';
import EditDiscussionView from './Views/Gemenskap/edit-discussion';
import ChatView from './Views/Chat/chat';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider> {/* Wrap with UserProvider */}
        <Router>
          <AuthContext.Consumer>
            {({ isLoggedIn }) => (
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<ProductsView />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/game-session/:gameId" element={<GameView />} />
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
                  <Route path="/gemenskap/camera" element={<CameraView />} />
                  <Route path="/profile" element={<ProfileView />} />
                  <Route path="/profile/:username" element={<UserProfileView />} />
                  <Route path="/profile/:username/inventory" element={<InventoryView />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="/profile/notification" element={<NotificationView />} />
                  <Route path="/profile/:username/friends" element={<UserFriendsView />} />
                  <Route path="/gemenskap/social" element={<SocialView />} />
                  <Route path="/gemenskap/market" element={<MarketView />} />
                  <Route path="/gemenskap/discussion" element={<DiscussionView />} />
                  <Route path="/gemenskap/discussions" element={<DiscussionView />} />
                  <Route path="/gemenskap/discussion/create-discussion" element={<CreateDiscussionView />} />
                  <Route path="/gemenskap/discussions/:discussionId" element={<DiscussionDetailiew />} />
                  <Route path="/gemenskap/discussions/:discussionId/edit" element={<EditDiscussionView />} />
                  <Route path="/chat/:username/:friendName" element={<ChatView />} />
                </Routes>
                <Footer />
              </>
            )}
          </AuthContext.Consumer>
        </Router>
      </UserProvider> {/* Close UserProvider */}
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
