/* dependency */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from 'routes/home';
import Competitions from 'routes/competitions';
import Competition from 'routes/competition';
import CompetitionError from 'routes/competition-error';
import CompetitionView from 'components/competition-view';
import Entry from 'routes/entry';
import Admin from 'routes/admin';
import CompetitionManagement from 'routes/competition-management';
import FileManagement from 'routes/file-management';
import ParticipantManagement from 'routes/participant-management';
import Participants from 'routes/participants';

/* router */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: 'competitions',
        element: <CompetitionManagement />,
      },
      {
        path: 'files',
        element: <FileManagement />,
      },
      {
        path: 'participants',
        element: <ParticipantManagement />,
      },
      {
        path: 'counter',
        element: null,
      },
    ],
  },
  {
    path: '/competitions',
    children: [
      {
        path: '',
        element: <Competitions />,
      },
      {
        path: ':competitionId',
        element: <Competition />,
        children: [
          {
            path: '',
            element: <CompetitionView hideTitle />,
          },
          {
            path: 'entry',
            element: <Entry />,
          },
          {
            path: 'participants',
            element: <Participants />,
          },
        ],
      },
    ],
  },
  {
    path: '/privacy',
    element: null,
  },
  {
    path: '/competition-error',
    element: <CompetitionError />,
    children: [],
  },
  {
    path: '*',
    element: null,
    children: [],
  },
]);

/* routing */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
);
