import { useState } from "react";

const PRODUCT_DATA = [
  { id: 1, name: "Nut/Bolt", price: 2.0, desc: "Connects the pipes together.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 2, name: "Pipe", price: 5.0, desc: "Connects the hose attachment to the hydroponics system.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 3, name: "Hose Attachment", price: 5.5, desc: "Attaches to the hose and connects to the pipe.", img: "https://images.unsplash.com/photo-1590235338618-971c26f0016e?w=500" },
  { id: 4, name: "Curved Pipe", price: 5.25, desc: "Curved pipe for flexible water flow.", img: "https://images.unsplash.com/photo-1530124560612-3bd9a121ffb8?w=500" },
  { id: 5, name: "T-Junction", price: 3.75, desc: "Allows for branching of the water flow.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" },
  { id: 6, name: "End Cap", price: 4.0, desc: "Additional product for variety.", img: "https://images.unsplash.com/photo-1584218030296-6556e4313f8c?w=500" }
];

const CELL_INCHES = 4;
const CELL_PX = 88;
const MIN_SIZE = 4;
const MAX_SIZE = 11;

function makeEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

// Instead of remapping content to a new grid (which causes jumping),
// we just trim or add rows/cols on the outer edges only.
// Rule: always keep exactly 1 empty row/col of padding on each side.
function normalizeGrid(grid) {
  let g = grid.map(r => [...r]);

  // if totally empty, reset to default
  if (!g.some(r => r.some(c => c !== null))) {
    return makeEmptyGrid(MIN_SIZE, MIN_SIZE);
  }

  // TRIM: remove outer row/col only when both the outermost AND
  // next-to-outermost are empty (that way we never remove the last padding row)
  let trimming = true;
  while (trimming) {
    trimming = false;

    // top
    if (g.length > MIN_SIZE && g[0].every(c => c === null) && g[1].every(c => c === null)) {
      g = g.slice(1);
      trimming = true;
    }
    // bottom
    const lastR = g.length - 1;
    if (g.length > MIN_SIZE && g[lastR].every(c => c === null) && g[lastR - 1].every(c => c === null)) {
      g = g.slice(0, lastR);
      trimming = true;
    }
    // left
    if (g[0].length > MIN_SIZE && g.every(r => r[0] === null) && g.every(r => r[1] === null)) {
      g = g.map(r => r.slice(1));
      trimming = true;
    }
    // right
    const lastC = g[0].length - 1;
    if (g[0].length > MIN_SIZE && g.every(r => r[lastC] === null) && g.every(r => r[lastC - 1] === null)) {
      g = g.map(r => r.slice(0, lastC));
      trimming = true;
    }
  }

  // EXPAND: if content is touching an edge, add 1 empty row/col on that side
  // top
  if (g.length < MAX_SIZE && g[0].some(c => c !== null)) {
    g = [Array(g[0].length).fill(null), ...g];
  }
  // bottom
  if (g.length < MAX_SIZE && g[g.length - 1].some(c => c !== null)) {
    g = [...g, Array(g[0].length).fill(null)];
  }
  // left
  if (g[0].length < MAX_SIZE && g.some(r => r[0] !== null)) {
    g = g.map(r => [null, ...r]);
  }
  // right
  if (g[0].length < MAX_SIZE && g.some(r => r[r.length - 1] !== null)) {
    g = g.map(r => [...r, null]);
  }

  return g;
}

export default function App() {
  const [page, setPage] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tempQty, setTempQty] = useState(1);

  const [grid, setGrid] = useState(makeEmptyGrid(MIN_SIZE, MIN_SIZE));
  const [dragging, setDragging] = useState(null);

  // --- LOGIC ---

  const addToCart = (product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setTempQty(1);
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleDrop = (row, col) => {
    if (dragging === null) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = dragging;
    setGrid(normalizeGrid(newGrid));
    setDragging(null);
  };

  const clearCell = (row, col) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(normalizeGrid(newGrid));
  };

  const addGridToCart = () => {
    const filled = grid.flat().filter(Boolean);
    if (filled.length === 0) {
      alert("Your grid is empty! Drag some parts on first.");
      return;
    }
    const counts = {};
    filled.forEach(p => { counts[p.id] = (counts[p.id] || 0) + 1; });
    const newCart = [...cart];
    Object.entries(counts).forEach(([id, qty]) => {
      const product = PRODUCT_DATA.find(p => p.id === parseInt(id));
      if (!product) return;
      const existing = newCart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += qty;
      } else {
        newCart.push({ ...product, quantity: qty });
      }
    });
    setCart(newCart);
    setIsCartOpen(true);
  };

  const numRows = grid.length;
  const numCols = grid[0].length;
  const widthInches = numCols * CELL_INCHES;
  const heightInches = numRows * CELL_INCHES;

  // --- SHARED COMPONENTS ---

  const Header = () => (
    <header style={{ borderBottom: "1px solid #eee", marginBottom: "40px", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: "0", letterSpacing: "-1px" }}>HYDRO SUPPLIES</h1>
      <nav style={{ display: "flex", gap: "20px" }}>
        <button
          onClick={() => { setPage("shop"); setSelectedProduct(null); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: page === "shop" ? "bold" : "normal", textDecoration: page === "shop" ? "underline" : "none" }}
        >
          Shop
        </button>
        <button
          onClick={() => { setPage("workshop"); setSelectedProduct(null); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: page === "workshop" ? "bold" : "normal", textDecoration: page === "workshop" ? "underline" : "none" }}
        >
          Workshop
        </button>
      </nav>
      <button onClick={() => setIsCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>
        🛒 Bag ({cartCount})
      </button>
    </header>
  );

  const CartDrawer = () => (
    <div style={{ position: "fixed", top: 0, right: isCartOpen ? 0 : "-400px", width: "350px", height: "100%", background: "white", boxShadow: "-5px 0 15px rgba(0,0,0,0.1)", zIndex: 1000, padding: "30px", transition: "0.3s", overflowY: "auto" }}>
      <button onClick={() => setIsCartOpen(false)} style={{ cursor: "pointer", marginBottom: "20px" }}>✕ Close</button>
      <h2>Your Bag</h2>
      {cart.length === 0 && <p style={{ color: "#666" }}>Your bag is empty.</p>}
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
        <button style={{ width: "100%", padding: "10px", background: "black", color: "white", borderRadius: "20px", cursor: "pointer", border: "none" }}>Checkout</button>
      </div>
    </div>
  );

  // --- WORKSHOP PAGE ---
  if (page === "workshop") {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <Header />
        <CartDrawer />

        <h2 style={{ marginBottom: "5px" }}>Workshop</h2>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Drag parts from the list onto the grid to design your system. The grid grows and shrinks automatically to fit your build. Click a placed part to remove it.
        </p>

        <div style={{ display: "flex", gap: "50px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Parts sidebar */}
          <div style={{ minWidth: "150px" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "1px" }}>Parts</h3>
            {PRODUCT_DATA.map(product => (
              <div
                key={product.id}
                draggable
                onDragStart={() => setDragging(product)}
                onDragEnd={() => setDragging(null)}
                style={{
                  background: "#f6f6f6",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  marginBottom: "10px",
                  cursor: "grab",
                  userSelect: "none",
                  fontSize: "0.85rem",
                  fontWeight: "bold"
                }}
              >
                {product.name}
                <div style={{ color: "#888", fontWeight: "normal", fontSize: "0.8rem", marginTop: "2px" }}>${product.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Grid + measurements */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>

              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${numCols}, ${CELL_PX}px)`,
                    gridTemplateRows: `repeat(${numRows}, ${CELL_PX}px)`,
                    gap: "4px",
                    border: "2px solid #333",
                    padding: "4px",
                    background: "#e8e8e8",
                    borderRadius: "4px"
                  }}
                >
                  {grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(rIdx, cIdx)}
                        onClick={() => cell && clearCell(rIdx, cIdx)}
                        title={cell ? `${cell.name} — click to remove` : "Drop a part here"}
                        style={{
                          width: `${CELL_PX}px`,
                          height: `${CELL_PX}px`,
                          background: cell ? "#1a1a1a" : "#fafafa",
                          border: cell ? "1px solid #000" : "1px dashed #ccc",
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: cell ? "pointer" : "default",
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          color: cell ? "white" : "#ccc",
                          textAlign: "center",
                          padding: "4px",
                          userSelect: "none",
                          transition: "background 0.15s"
                        }}
                      >
                        {cell ? cell.name : ""}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ textAlign: "center", marginTop: "10px", color: "#555", fontSize: "0.85rem" }}>
                  ↔ <strong>{widthInches} in.</strong> wide
                </div>
              </div>

              <div style={{ marginLeft: "14px", height: `${(CELL_PX * numRows) + (4 * (numRows - 1)) + 8}px`, display: "flex", alignItems: "center" }}>
                <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "0.85rem", color: "#555", whiteSpace: "nowrap" }}>
                  <strong>{heightInches} in.</strong> tall ↕
                </div>
              </div>

            </div>

            <button
              onClick={addGridToCart}
              style={{
                marginTop: "20px",
                padding: "13px 32px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "25px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              Add Build to Bag 🛒
            </button>

            <p style={{ fontSize: "0.78rem", color: "#aaa", marginTop: "10px" }}>
              Click any placed part to remove it. Grid max is 11×11.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DETAIL PAGE ---
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

  // --- SHOP PAGE ---
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
