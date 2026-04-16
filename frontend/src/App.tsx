import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { FilterProvider } from './store/FilterContext';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<Navigate to="/products" replace />} />
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
};

export default App;
