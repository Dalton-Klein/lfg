import './App.scss';
import { Route, BrowserRouter as HashRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';
import BlogPage from './components/pages/blog/blogPage';
import BlogArticle1 from './components/pages/blog/blogArticle-1';
import BlogArticle2 from './components/pages/blog/blogArticle-2';
import HomePage from './components/pages/home-page/homePage';
import DashboardPage from './components/pages/dashboardPage';
import DiscoverPage from './components/pages/discoverPage';
import LoginPage from './components/pages/authenticationPage';
import FourOFourPage from './components/pages/FourOFourPage';
import ProfilePage from './components/pages/profilePage';
import FAQPage from './components/pages/faqPage';
import TermsOfServicePage from './components/pages/tosPage';
import PrivacyPolicyPage from './components/pages/privacyPolicyPage';
import { gapi } from 'gapi-script';
import React, { useEffect } from 'react';
import LFMPage from './components/pages/lfmPage';
import GangsPage from './components/pages/gangsPage';
import GangPage from './components/pages/gangPage';
const clientId = '244798002147-mm449tgevgljdthcaoirnlmesa8dkapb.apps.googleusercontent.com';

function App() {
  useEffect(() => {
    const startGoogleAPI = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: '',
      });
    };
    gapi.load('client:auth2', startGoogleAPI);
    //If I ever need access token, get it by using line below
    // let accessToken = gapi.auth.getToken().access_token;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // html goes here (components that you see)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <div className='App'>
            <Routes>
              {/* Main Paths */}
              <Route path='/' element={<HomePage />} />
              <Route path='/dashboard' element={<DashboardPage />} />
              {/* LFG  */}
              <Route path='/lfg-rust' element={<DiscoverPage />} />
              <Route path='/lfg-rocket-league' element={<DiscoverPage />} />
              {/* LFM */}
              <Route path='/lfm-rocket-league' element={<LFMPage />} />
              {/* Blog */}
              <Route path='/blog' element={<BlogPage />} />
              <Route path='/blog/how-to-find-great-rust-teammates' element={<BlogArticle1 />} />
              <Route path='/blog/rocket-league-minecraft-support' element={<BlogArticle2 />} />
              {/* Gangs Paths */}
              <Route path='/manage-gang' element={<GangsPage />} />
              <Route path='/gang/:gangId' element={<GangPage />} />
              {/* Profile Paths */}
              <Route path='/general-profile' element={<ProfilePage />} />
              <Route path='/account-settings' element={<ProfilePage />} />
              <Route path='/rust-profile' element={<ProfilePage />} />
              <Route path='/rocket-league-profile' element={<ProfilePage />} />
              <Route path='/messaging' element={<ProfilePage />} />
              <Route path='/incoming-requests' element={<ProfilePage />} />
              <Route path='/outgoing-requests' element={<ProfilePage />} />
              <Route path='/blocked' element={<ProfilePage />} />
              {/* Less Used Pages */}
              <Route path='/help' element={<FAQPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
              <Route path='/terms-of-service' element={<TermsOfServicePage />} />
              <Route path='/*' element={<FourOFourPage />} />
            </Routes>
          </div>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
