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
import { gapi } from "gapi-script";
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
import SteamSignUpPage from "./components/authentication/steamSignUp";
const clientId = "244798002147-mm449tgevgljdthcaoirnlmesa8dkapb.apps.googleusercontent.com";

function App() {
  const socketRef = useRef<any>();
  const locationPath: string = useLocation().pathname;

  useEffect(() => {
    //Master connect to socket so each client only connects to server once
    connectToSocketMaster();
    //Google api init
    const startGoogleAPI = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", startGoogleAPI);
    //If I ever need access token, get it by using line below
    // let accessToken = gapi.auth.getToken().access_token;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectToSocketMaster = async () => {
    socketRef.current = io.connect(
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.gangs.gg"
    );
    socketRef.current.on("handshakeResponse", (serverSocketId) => {
      console.log("Server socket ID:", serverSocketId, "vs", socketRef.current.id);
      // Do further processing with the server socket ID
    });
  };

  const shouldShowNavs = () => {
    console.log("what? ", locationPath.substring(0, 13));
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
          {shouldShowNavs() ? <HeaderComponent socketRef={socketRef}></HeaderComponent> : <></>}
          <div className="app-container">
            {shouldShowNavs() ? <VerticalNav></VerticalNav> : <></>}
            <div className="app-content-scrollbox">
              <Routes>
                {/* Main Paths */}
                <Route path="/" element={<HomePage socketRef={socketRef} />} />
                {/* LFG  */}
                <Route path="/lfg-rust" element={<DiscoverPage />} />
                <Route path="/lfg-rocket-league" element={<DiscoverPage />} />
                {/* LFM  */}
                <Route path="/lfm-rust" element={<DiscoverPage />} />
                <Route path="/lfm-rocket-league" element={<DiscoverPage />} />
                {/* Blog */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/how-to-find-great-rust-teammates" element={<BlogArticle1 />} />
                <Route path="/blog/rocket-league-minecraft-support" element={<BlogArticle2 />} />
                <Route path="/blog/signup-promo" element={<BlogArticle3 />} />
                {/* Gangs Paths */}
                <Route path="/create-gang" element={<GangsPage />} />
                <Route path="/join-gang" element={<JoinGangPage />} />
                <Route path="/manage-gang/:gangId" element={<GangsPage />} />
                <Route path="/gang/:gangId" element={<GangPage socketRef={socketRef} />} />
                {/* Profile Paths */}
                <Route path="/general-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/add-friend" element={<AddFriend />} />
                <Route path="/account-settings" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/rust-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/rocket-league-profile" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/messaging" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/incoming-requests" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/outgoing-requests" element={<ProfilePage socketRef={socketRef} />} />
                <Route path="/blocked" element={<ProfilePage socketRef={socketRef} />} />
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
