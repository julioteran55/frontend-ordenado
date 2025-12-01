// src/pages/Home.jsx
import React from "react";
import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import ProductList from "../components/ProductList";

function Home() {
  return (
    <main>
      <Banner />
      <CategoryList />
      <ProductList />
    </main>
  );
}

export default Home;
