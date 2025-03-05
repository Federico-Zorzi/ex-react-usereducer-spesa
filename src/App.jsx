import { useState, useEffect } from "react";

function App() {
  const products = [
    { name: "Mela", price: 0.5 },
    { name: "Pane", price: 1.2 },
    { name: "Latte", price: 1.0 },
    { name: "Pasta", price: 0.7 },
  ];

  const [addedProducts, setAddedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  console.log("addedProducts", addedProducts);

  const updateProductQuantity = (product) => {
    const productIndex = addedProducts.findIndex(
      (p) => p.name === product.name
    );
    /* console.log("productIndex", productIndex); */
    const addQuantity = [...addedProducts];
    addQuantity[productIndex].quantity += 1;
    setAddedProducts(addQuantity);
  };

  const addToCart = (product) => {
    /* console.log("Aggiungi al carrello:", product); */

    if (!addedProducts.some((p) => p.name === product.name)) {
      setAddedProducts((currVal) => [...currVal, { ...product, quantity: 1 }]);
    } else {
      updateProductQuantity(product);
    }
  };

  const removeFromCart = (i, button = "") => {
    /* console.log("rimuovi prodotto n: ", i, addedProducts[i]); */
    let removeQuantity = [...addedProducts];
    removeQuantity[i].quantity -= 1;
    if (removeQuantity[i].quantity === 0 || button === "fullremove") {
      removeQuantity = addedProducts.filter(
        (p) => p.name !== removeQuantity[i].name
      );
    }
    setAddedProducts(removeQuantity);
  };

  const countTotalPrice = (products) => {
    let finalPrice = 0;
    products.forEach((p) => {
      finalPrice += p.price * p.quantity;
    });
    console.log("finalPrice", finalPrice);
    setTotalPrice(finalPrice.toFixed(2));
  };

  useEffect(() => countTotalPrice(addedProducts), [addedProducts]);

  return (
    <main>
      <h1>Lista della spesa</h1>
      <section className="prod-list-section">
        <div className="products-list">
          {products.map((p, i) => (
            <div key={i} className="product-card">
              <div className="product-card-content">
                <h2 className="product-name">{p.name}</h2>
                <span className="product-price">{`${p.price
                  .toFixed(2)
                  .toString()
                  .replace(".", ",")}€`}</span>
              </div>
              <div className="product-card-btn">
                <button onClick={() => addToCart(p)}>
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cart">
        <h2>Carrello</h2>
        {addedProducts.length > 0 && (
          <div className="receipt">
            <ul>
              {addedProducts.map((p, i) => (
                <li key={i}>
                  <div className="product-added">
                    <div>
                      <span>
                        {p.name} (
                        {p.price.toFixed(2).toString().replace(".", ",")}€) x
                        {p.quantity}
                      </span>
                    </div>
                    <div className="remove-prod-btn">
                      <div>
                        <button onClick={() => removeFromCart(i)}>
                          Rimuovi singolo prodotto
                        </button>
                      </div>
                      <div>
                        <button onClick={() => removeFromCart(i, "fullremove")}>
                          Rimuovi prodotto dal carrello
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <hr />

            <div className="total-price">
              <span>Totale: {totalPrice.toString().replace(".", ",")}€</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
