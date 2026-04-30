// src/routes/MainRoutes.jsx
import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

// Dashboard
//const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// Component overview
const Color      = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow     = Loadable(lazy(() => import('pages/component-overview/shadows')));

// Carnicería
const Ventas       = Loadable(lazy(() => import('pages/carniceria/Ventas')));
const Historial    = Loadable(lazy(() => import('pages/carniceria/Historial')));
const Reporte      = Loadable(lazy(() => import('pages/carniceria/Reporte')));
const Cortes       = Loadable(lazy(() => import('pages/carniceria/Cortes')));
const AgregarCorte = Loadable(lazy(() => import('pages/carniceria/AgregarCorte')));
const ConfigCorte  = Loadable(lazy(() => import('pages/carniceria/ConfigCorte')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        //{ index: true,               element: <DashboardDefault /> },
        //{ path: 'dashboard',         element: <DashboardDefault /> },

        // Carnicería
        { path: 'ventas',            element: <Ventas /> },
        { path: 'historial',         element: <Historial /> },
        { path: 'reporte',           element: <Reporte /> },
        { path: 'cortes',            element: <Cortes /> },
        { path: 'agregarCorte',      element: <AgregarCorte /> },
        { path: 'configCorte/:id',   element: <ConfigCorte /> },

        // Component overview
        { path: 'typography',        element: <Typography /> },
        { path: 'color',             element: <Color /> },
        { path: 'shadow',            element: <Shadow /> },
      ]
    }
  ]
};

export default MainRoutes;