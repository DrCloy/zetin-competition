import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

// competition routers
import Competition from './routes/Competition';
import Competitions from './routes/Competitions';
import CompetitionView from './components/CompetitionView';
import Entry from './routes/Entry';
import Participants from './routes/Participants';

// admin routers
import Admin from './routes/Admin';
import CompetitionManagement from './routes/CompetitionManagement';
import FileManagement from './routes/FileManagement';
import ParticipantManagement from './routes/ParticipantManagement';
import Counter from './routes/Counter';

// privacy router
import Privacy from './routes/Privacy';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<App />} />
          <Route path="competitions" element={<Outlet />}>
            <Route index element={<Competitions />} />
            <Route path=":competitionId" element={<Competition />}>
              <Route index element={<CompetitionView hideTitle />} />
              <Route path="entry" element={<Entry />} />
              <Route path="participants" element={<Participants />} />
            </Route>
          </Route>
          <Route path="admin" element={<Admin />}>
            <Route path="competitions" element={<CompetitionManagement />} />
            <Route path="files" element={<FileManagement />} />
            <Route path="participants" element={<ParticipantManagement />} />
            <Route path="counter" element={<Counter />} />
          </Route>
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
