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
        element: null,
      },
      {
        path: 'files',
        element: null,
      },
      {
        path: 'participants',
        element: null,
      },
      {
        path: 'privacy',
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
            element: null,
          },
        ],
      },
    ],
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
