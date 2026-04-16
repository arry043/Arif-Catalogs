import React from 'react';
import Layout from '../components/Layout';
import ProductGrid from '../components/ProductGrid';

const ProductListPage: React.FC = () => {
  return (
    <Layout>
      <ProductGrid />
    </Layout>
  );
};

export default ProductListPage;
