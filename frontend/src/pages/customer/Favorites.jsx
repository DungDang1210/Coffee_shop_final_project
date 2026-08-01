import Navbar from "../../components/common/Navbar";
import ProductCard from "../../components/product/ProductCard";

export default function Favorites({
  products,
  favorites,
  cart,
  setCart,
  user,
  setUser,
  setFavorites
}) {
  const addToCart = (product) => {
    console.log(product);
    const exist = cart.find(item => item._id === product._id);

    if (exist) {
      setCart(
        cart.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  return (
    <>
      <Navbar
        cartCount={cart.length}
        user={user}
        setUser={setUser}
      />

      <div className="max-w-7xl mx-auto px-10 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Your Favorite Drinks ❤️
        </h1>

        {favorites.length === 0 ? (
          <p className="text-gray-500">
            No favorite drinks yet.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {favorites.map(item => {

              const product = products.find(
                p => p._id === item._id
              );

              if(!product) return null;

                return (
                  <ProductCard
                      key={product._id}
                      product={product}
                      cart={cart}
                      setCart={setCart}
                      favorites={favorites}
                      setFavorites={setFavorites}
                  />
            );
            })}
          </div>
        )}
      </div>
    </>
  );
}