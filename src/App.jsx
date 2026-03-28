import { useState } from "react";

const PRODUCT_DATA = [
  { id: 1, name: "Nut/Bolt", price: 2.0, desc: "Connects the pipes together.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 2, name: "Pipe", price: 5.0, desc: "Connects the hose attachment to the hydroponics system.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 3, name: "Hose Attachment", price: 5.5, desc: "Attaches to the hose and connects to the pipe.", img: "https://images.unsplash.com/photo-1590235338618-971c26f0016e?w=500" },
  { id: 4, name: "Curved Pipe", price: 5.25, desc: "Curved pipe for flexible water flow.", img: "https://images.unsplash.com/photo-1530124560612-3bd9a121ffb8?w=500" },
  { id: 5, name: "T-Junction", price: 3.75, desc: "Allows for branching of the water flow.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 6, name: "End Cap", price: 4.0, desc: "Additional product for variety.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tempQty, setTempQty] = useState(1); // Quantity before adding to cart

  // --- LOGIC FUNCTIONS ---

  const addToCart = (product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setTempQty(1); // Reset local counter
    setIsCartOpen(true); // Slide open the cart
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- REUSABLE UI COMPONENTS ---

  const Header = () => (
    <header style={{ borderBottom: "1px solid #eee", marginBottom: "40px", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: "0", letterSpacing: "-1px" }}>HYDRO SUPPLIES</h1>
      <button onClick={() => setIsCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", position: "relative" }}>
        🛒 Bag ({cartCount})
      </button>
    </header>
  );

  const CartDrawer = () => (
    <div style={{ position: "fixed", top: 0, right: isCartOpen ? 0 : "-400px", width: "350px", height: "100%", background: "white", boxShadow: "-5px 0 15px rgba(0,0,0,0.1)", zIndex: 1000, padding: "30px", transition: "0.3s" }}>
      <button onClick={() => setIsCartOpen(false)} style={{ cursor: "pointer", marginBottom: "20px" }}>✕ Close</button>
      <h2>Your Bag</h2>
      {cart.map(item => (
        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <div>
            <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>${item.price} x {item.quantity}</p>
            <button onClick={() => updateCartQty(item.id, -1)}>-</button>
            <button onClick={() => updateCartQty(item.id, 1)}>+</button>
          </div>
          <button onClick={() => removeFromCart(item.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Remove</button>
        </div>
      ))}
      <div style={{ marginTop: "20px", borderTop: "2px solid black", paddingTop: "10px" }}>
        <h3>Total: ${cartTotal.toFixed(2)}</h3>
        <button style={{ width: "100%", padding: "10px", background: "black", color: "white", borderRadius: "20px" }}>Checkout</button>
      </div>
    </div>
  );

  // --- 1. THE DETAIL PAGE ---
  if (selectedProduct) {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <Header />
        <CartDrawer />
        
        <button 
          onClick={() => { setSelectedProduct(null); setTempQty(1); }} 
          style={{ cursor: "pointer", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          ← Back to Shop
        </button>
        
        <div style={{ display: "flex", gap: "40px" }}>
          <img src={selectedProduct.img} alt={selectedProduct.name} style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }} />
          
          <div>
            <h1 style={{ fontSize: "2.5rem", margin: "0" }}>{selectedProduct.name}</h1>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${selectedProduct.price}</p>
            <p style={{ color: "#666", lineHeight: "1.6" }}>{selectedProduct.desc}</p>

            {/* QUANTITY STEPPER */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", margin: "20px 0" }}>
              <b>Quantity:</b>
              <button onClick={() => setTempQty(Math.max(1, tempQty - 1))}>-</button>
              <span>{tempQty}</span>
              <button onClick={() => setTempQty(tempQty + 1)}>+</button>
            </div>

            <button 
              onClick={() => addToCart(selectedProduct, tempQty)}
              style={{ width: "100%", padding: "15px", background: "black", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer" }}
            >
              Add to Bag — ${(selectedProduct.price * tempQty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. THE MAIN STOREFRONT (The Grid) ---
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <Header />
      <CartDrawer />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "30px" }}>
        {PRODUCT_DATA.map((product) => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            style={{ cursor: "pointer" }}
          >
            <div style={{ background: "#f6f6f6", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
              <img src={product.img} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            </div>
            <h3 style={{ marginBottom: "5px" }}>{product.name}</h3>
            <p style={{ color: "#666", margin: "0" }}>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
