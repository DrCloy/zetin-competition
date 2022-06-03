import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Admin from './routes/Admin';
import Competitions from './routes/Competitions';
import Competition from './routes/Competition';
import CompetitionView from './components/CompetitionView';
import Entry from './routes/Entry';
import Participants from './routes/Participants';
import CreateCompetition from './routes/CreateCompetition';
import Management from './routes/Management';
import File from './routes/File';

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
            <Route path="create-competition" element={<CreateCompetition />} />
            <Route path="management" element={<Management />} />
            <Route path="file" element={<File />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
