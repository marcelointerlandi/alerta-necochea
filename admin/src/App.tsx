// admin/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Noticias from './pages/Noticias';
import EditarNoticia from './pages/EditarNoticia';
import Publicidad from './pages/Publicidad';
import { ReactElement } from 'react';

function PrivateRoute({ children }: { children: ReactElement }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="noticias" element={<Noticias />} />
          <Route path="noticias/nueva" element={<EditarNoticia />} />
          <Route path="noticias/editar/:id" element={<EditarNoticia />} />
          <Route path="publicidad" element={<Publicidad />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}