import "./App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import BlogPage from "./components/pages/blog/blogPage";
import BlogArticle1 from "./components/pages/blog/blogArticle-1";
import BlogArticle2 from "./components/pages/blog/blogArticle-2";
import HomePage from "./components/pages/home-page/homePage";
import DiscoverPage from "./components/pages/discoverPage";
import LoginPage from "./components/pages/authenticationPage";
import FourOFourPage from "./components/pages/FourOFourPage";
import ProfilePage from "./components/pages/profilePage";
import FAQPage from "./components/pages/faqPage";
import TermsOfServicePage from "./components/pages/tosPage";
import PrivacyPolicyPage from "./components/pages/privacyPolicyPage";
import React, { useEffect, useRef } from "react";
import GangsPage from "./components/pages/gangsPage";
import GangPage from "./components/pages/gangPage";
import JoinGangPage from "./components/pages/joinGangPage";
import ScrollToTop from "./components/nav/scrollToTop";
import * as io from "socket.io-client";
import HeaderComponent from "./components/nav/headerComponent";
import VerticalNav from "./components/nav/verticalNav";
import BlogArticle3 from "./components/pages/blog/blogArticle-3";
import AddFriend from "./components/pages/addFriend";
import RankPage from "./components/pages/rankPage";
import SteamSignUpPage from "./components/authentication/steamSignUp";
import BlogArticle4 from "./components/pages/blog/blogArticle-4";
// ***ELECTRON DISABLE
// import ElectronTitlebar from "./components/nav/electronTitleBar";

function App() {
  const socketRef = useRef<any>();
  const locationPath: string = useLocation().pathname;

  useEffect(() => {
    //Master connect to socket so each client only connects to server once
    connectToSocketMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectToSocketMaster = async () => {
    // ***PUSH FIX SOCKET
    socketRef.current = io.connect(
      "http://localhost:3000" //: "https://www.gangs.gg" or "http://localhost:3000"
    );
    socketRef.current.on("handshakeResponse", (serverSocketId) => {
      // Do further processing with the server socket ID
    });
  };

  const shouldShowNavs = () => {
    if (locationPath === "/login" || locationPath.substring(0, 13) === "/steam-signup") {
      return false;
    } else {
      return true;
    }
  };
  // html goes here (components that you see)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          {/* This scroll component scrolls user to top of each page when navigating */}
          <ScrollToTop />

          {/* ***ELECTRON Include custom bar if electron build */}
          {/* <ElectronTitlebar></ElectronTitlebar> */}
          {shouldShowNavs() ? <HeaderComponent socketRef={socketRef}></HeaderComponent> : <></>}
          <div className="app-container">
            {shouldShowNavs() ? <VerticalNav></VerticalNav> : <></>}
            <div className="app-content-scrollbox">
              <Routes>
                {/* Main Paths */}
                <Route path="/" element={<HomePage socketRef={socketRef} />} />
                {/* LFG  */}
                {/* ***NEW  GAME EDIT */}
                <Route path="/lfg-rust" element={<DiscoverPage />} />
                <Route path="/lfg-rocket-league" element={<DiscoverPage />} />
                <Route path="/lfg-battle-bit" element={<DiscoverPage />} />
                {/* LFM  */}
                <Route path="/lfm-rust" element={<DiscoverPage />} />
                <Route path="/lfm-rocket-league" element={<DiscoverPage />} />
                <Route path="/lfm-battle-bit" element={<DiscoverPage />} />
                {/* Blog */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/how-to-find-great-rust-teammates" element={<BlogArticle1 />} />
                <Route path="/blog/rocket-league-minecraft-support" element={<BlogArticle2 />} />
                <Route path="/blog/signup-promo" element={<BlogArticle3 />} />
                <Route path="/blog/battle-bit-support" element={<BlogArticle4 />} />
                {/* Gangs Paths */}
                <Route path="/create-gang" element={<GangsPage />} />
                <Route path="/join-gang" element={<JoinGangPage />} />
                <Route path="/manage-gang/:gangId" element={<GangsPage />} />
                <Route path="/gang/:gangId" element={<GangPage socketRef={socketRef} />} />
                {/* Profile Paths */}
                <Route path="/general-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/add-friend" element={<AddFriend />} />
                <Route path="/account-settings" element={<ProfilePage socketRef={socketRef} />} />
                {/* ***NEW  GAME EDIT */}
                <Route path="/rust-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/rocket-league-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/battle-bit-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/messaging" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/incoming-requests" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/outgoing-requests" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/blocked" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/my-rank" element={<RankPage />} />
                {/* Less Used Pages */}
                <Route path="/help" element={<FAQPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/steam-signup/:steamId" element={<SteamSignUpPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/*" element={<FourOFourPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
