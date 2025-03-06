import { useState, useEffect, useReducer } from "react";

function App() {
  const products = [
    { name: "Mela", price: 0.5 },
    { name: "Pane", price: 1.2 },
    { name: "Latte", price: 1.0 },
    { name: "Pasta", price: 0.7 },
  ];
  const itialValProductList = [];

  function cartReducer(productList, action) {
    const { product, quantity, i, removeButton } = action.payload;
    const minItems = 0;
    const maxItems = 99;
    switch (action.type) {
      case "ADD_ITEM":
        return [...productList, { ...product, quantity: 1 }];
      case "REMOVE_ITEM":
        /* console.log("i", i, "removeButton", removeButton); */
        if (removeButton === "fullremove")
          return productList.filter((prod, index) => index !== i);

        return productList
          .map((prod, index) =>
            i === index ? { ...prod, quantity: prod.quantity - 1 } : prod
          )
          .filter((prod) => prod.quantity > 0);

      case "UPDATE_QUANTITY":
        /* console.log("producUpdated", product, "quantity", quantity); */
        const productIndex = productList.findIndex(
          (prodList) => prodList.name === product.name
        );

        const productsListUpdated = productList.map((prodList, i) => {
          if (productIndex === i) {
            let newQuantity;
            if (quantity !== null) {
              newQuantity = parseInt(quantity, 10);
              if (isNaN(newQuantity)) newQuantity = prodList.quantity;
            } else newQuantity = Math.min(maxItems, prodList.quantity + 1);
            newQuantity = Math.max(minItems, Math.min(maxItems, newQuantity));
            return { ...prodList, quantity: newQuantity };
          }
          return prodList;
        });
        return (productList = [...productsListUpdated]);

      default:
        return productList;
    }
  }

  const [productsInCart, dispatch] = useReducer(
    cartReducer,
    itialValProductList
  );
  /* console.log("productsInCart", productsInCart); */

  const [totalPrice, setTotalPrice] = useState(0);

  const formatPrice = (price) => {
    return price.toFixed(2).toString().replace(".", ",");
  };

  const countTotalPrice = (products) => {
    let finalPrice = 0;
    products.forEach((p) => {
      finalPrice += p.price * (!isNaN(p.quantity) ? p.quantity : 0);
    });
    /* console.log("finalPrice", finalPrice); */
    setTotalPrice(finalPrice);
  };
  useEffect(() => countTotalPrice(productsInCart), [productsInCart]);

  return (
    <main>
      <h1>Lista della spesa</h1>
      <section className="prod-list-section">
        <div className="products-list">
          {products.map((product, i) => (
            <div key={i} className="product-card">
              <div className="product-card-content">
                <h2 className="product-name">{product.name}</h2>
                <span className="product-price">{`${formatPrice(
                  product.price
                )}€`}</span>
              </div>
              <div className="product-card-btn">
                <button
                  onClick={() => {
                    const actionType = !productsInCart.some(
                      (prodInCart) => product.name === prodInCart.name
                    )
                      ? "ADD_ITEM"
                      : "UPDATE_QUANTITY";
                    dispatch({
                      type: actionType,
                      payload: { product, quantity: null },
                    });
                  }}
                >
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cart">
        <h2>Carrello</h2>
        {productsInCart.length > 0 && (
          <div className="receipt">
            <ul>
              {productsInCart.map((product, i) => (
                <li key={i}>
                  <div className="product-added">
                    <div className="product-info">
                      <div>
                        {product.name} ({formatPrice(product.price)}€)
                      </div>

                      <div>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: {
                                product,
                                quantity: parseInt(e.target.value),
                              },
                            })
                          }
                          min={1}
                          max={99}
                        />
                      </div>
                    </div>
                    <div className="remove-prod-btn">
                      <div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: { i, removeButton: "singleremove" },
                            })
                          }
                        >
                          Rimuovi singolo prodotto
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: { i, removeButton: "fullremove" },
                            })
                          }
                        >
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
              <span>Totale: {formatPrice(totalPrice)}€</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
