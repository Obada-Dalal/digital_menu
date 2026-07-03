import { useEffect, useState } from "react";
import api from "./services/api";
import Ads from "./pages/Ads";
import "./App.css";
// import Header from "./components/Header";
import Categories from "./pages/Categories";
import MenuProducts from "./pages/MenuProducts";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import MessageBox from "./components/MessageBox";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products")
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // نتائج البحث
  const filteredProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  const totalResults = searchQuery ? filteredProducts.length : 0;

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // if (loading)
  // return (
  //   <div className="app-loading">
  //     <div className="loading-spinner"></div>
  //     <p>جاري تحميل القائمة...</p>
  //     <div className="loading-dots">
  //       <span></span>
  //       <span></span>
  //       <span></span>
  //     </div>
  //   </div>
  // );

  return (
    <>
      <NotificationProvider>
        <CartProvider>
          {/* <Header /> */}
          <Ads />
          <Search
            query={searchQuery}
            onChange={handleSearchChange}
            onClear={clearSearch}
            totalResults={totalResults}
            isLoading={loading}
          />
          {/* إخفاء التصنيفات عند البحث */}
          {!searchQuery && (
            <Categories
              categories={categories}
              onSelectCategory={setSelectedCategory}
              isLoading={loading}
            />
          )}
          <MenuProducts
            categories={categories}
            products={products}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            isLoading={loading}
          />
          <Cart />
        </CartProvider>
        <MessageBox />
      </NotificationProvider>
    </>
  );
}

export default App;
