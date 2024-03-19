import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from 'routes/home';
import Competitions from 'routes/competitions';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: null,
    children: [],
  },
  {
    path: '/competitions',
    element: <Competitions />,
    children: [
      {
        path: '',
        element: null,
      },
      {
        path: ':id',
        element: null,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
);
