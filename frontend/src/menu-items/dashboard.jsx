// menu-items > dashboard.jsx
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const icons = {
  DashboardOutlined,
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  BarChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'ventas',
      title: 'Ventas',
      type: 'item',
      url: '/ventas',
      icon: icons.ShoppingCartOutlined,
      breadcrumbs: false
    },
    {
      id: 'historial',
      title: 'Historial',
      type: 'item',
      url: '/historial',
      icon: icons.HistoryOutlined,
      breadcrumbs: false
    },
    {
      id: 'reporte',
      title: 'Reporte',
      type: 'item',
      url: '/reporte',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'cortes',
      title: 'Cortes',
      type: 'item',
      url: '/cortes',
      icon: icons.AppstoreAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;