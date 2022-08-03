import "./App.scss";
import { Route, BrowserRouter as HashRouter, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import HomePage from "./components/pages/home-page/homePage";
import DiscoverPage from "./components/pages/discoverPage";
import LoginPage from "./components/pages/authenticationPage";
import FourOFourPage from "./components/pages/FourOFourPage";
import ProfilePage from "./components/pages/profilePage";

function App() {
  // all javascript goes here ( for logic to control components)

  // html goes here (components that you see)
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/connections" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<FourOFourPage />} />
            </Routes>
          </div>
        </HashRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
