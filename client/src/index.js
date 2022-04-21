import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Competitions from './routes/Competitions';
import Competition from './pages/Competition';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<App />} />
          <Route path="competitions" element={<Competitions />}>
            <Route index element={<Home />} />
            <Route path=":id" element={<Competition />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
