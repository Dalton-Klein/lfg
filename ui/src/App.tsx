import './App.scss';
import { Route, BrowserRouter as HashRouter, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';
import HomePage from './components/pages/homePage';
import LoginPage from './components/pages/authenticationPage';
import FourOFourPage from './components/pages/FourOFourPage';

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<HashRouter>
					<div className="App">
						<Routes>
							<Route path="/" element={<HomePage />} />
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
