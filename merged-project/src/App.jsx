import { useState } from "react";
import part0 from "./assets/Part0.png";
import part1 from "./assets/Part1.png";
import part2 from "./assets/Part2.png";
import part3 from "./assets/Part3.png";
import part4 from "./assets/Part4.png";
import part5 from "./assets/Part5.png";
import part6 from "./assets/Part6.png";
import part7 from "./assets/Part7.png";
import lukeImg from "./assets/luke.png";
import vishnuImg from "./assets/vishnu.png";
import travisImg from "./assets/travis.png";

const PRODUCT_DATA = [
  { id: 0, name: "Universal Connection Nut", price: 2.50, desc: "It is designed to connect different pipe sections together with a simple screw-on motion, making it easy to build complex turns or long straight runs. If you are looking to expand your system, this is the part that makes it all possible.", img: part0 },
  { id: 1, name: "Two Sided Pipe", price: 5.00, desc: "This versatile pipe is the main link for your system. It features threaded screw-ends on both sides, allowing to easily extend your water lines or connect different junctions.", img: part1 },
  { id: 2, name: "Small Plant Holder", price: 8.00, desc: "The perfect home for smaller greens. This compact grow chamber features the same dual-threaded screw system as the larger model, but in a space-saving size. It's ideal for growing herbs like basil or cilantro, allowing you to fit more plants into your vertical system without sacrificing water flow or stability.", img: part2 },
  { id: 3, name: "Hose Pipe Connector", price: 7.50, desc: "The ultimate bridge between power and flow. This adapter allows you to connect flexible hosing directly to your rigid screw-system pipes. It features a secure, leak-proof threading on one side and a high-grip nozzle on the other, making it easy to bring water from your pump straight to your plants.", img: part3 },
  { id: 4, name: "Wall Mount", price: 10.00, desc: "Take your garden vertical! This heavy-duty wall mount is designed to securely bolt your hydroponic system directly to any flat surface. It's the perfect solution for apartment balconies or small indoor spaces, keeping your pipes perfectly aligned and off the ground so you can grow your plants at eye level.", img: part4 },
  { id: 5, name: "Elbow Pipe", price: 6.00, desc: "The ultimate space-saver for your garden. This elbow joint allows your water lines to take a sharp 90-degree turn without any kinking or restricted flow. Its threaded screw-ends ensure a watertight seal, making it easy to build your system around corners or design a multi-level vertical setup.", img: part5 },
  { id: 6, name: "Large Plant Holder", price: 10.00, desc: "The heart of your garden. This large grow chamber is designed with plenty of room for root expansion, ensuring your plants grow big and healthy. It features threaded screw-connections on both sides, allowing you to easily daisy-chain multiple holders together. Water flows directly through the chamber, delivering nutrients straight to the roots while keeping the whole system watertight.", img: part6 },
  { id: 7, name: "Stand Mount", price: 10.00, desc: "The foundation of a steady build. This versatile stand mount provides a rock-solid base for your system to sit on. Whether you're setting up on a patio or a greenhouse floor, this mount snaps onto your pipes to prevent tipping or sliding, ensuring your plants stay upright and your water flow stays level.", img: part7 },
];

// Parts available in the workshop grid builder (excludes mounts + universal nut)
const BUILDABLE_IDS = [1, 2, 3, 5, 6];
// Parts shown as add-on recommendations at the bottom
const ADDON_IDS = [0, 4, 7];

const FOUNDERS = [
  {
    name: "LUKE BOWEN",
    title: "CFO, Creative Director",
    img: lukeImg,
    bio: "Luke has a belief that fresh, organic produce should not have to be a luxury. Having been a vegetarian for 12 years and working on his family farm for the last 8 years has given him a unique appreciation for agriculture and inspired him to try and make fresh produce more readily available for the average consumer.",
  },
  {
    name: "VISHNU CHITADI",
    title: "COO, Marketing Director",
    img: vishnuImg,
    bio: "Every summer Vishnu goes to India and visits the rural part of the country and sees all the environmental pollution. Plastic and trash almost everywhere and lakes being polluted. Vishnu joined to make a positive impact on the environment through the hydroponics system by printing using recyclable material and growing plants.",
  },
  {
    name: "TRAVIS FINE",
    title: "CEO, Production Head",
    img: travisImg,
    bio: "Growing up on a lake, Travis has seen how plastic pollution can affect a local environment. Being able to take this waste and convert it into something sustainable through hydroponics system is something that deeply motivates his drive. His goal overall is to make a positive impact on the planet.",
  },
];

const CELL_INCHES = 2;
const PIXELS_PER_INCH = 44;
const CELL_PX = Math.round(CELL_INCHES * PIXELS_PER_INCH);
const MIN_SIZE = 2;
const MAX_SIZE = 11;

// Each cell now stores: null | { product, rotation }
function makeEmptyGrid(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(null));
}

function normalizeGrid(grid) {
  let g = grid.map(r => [...r]);
  if (!g.some(r => r.some(c => c !== null))) return makeEmptyGrid(MIN_SIZE, MIN_SIZE);
  let trimming = true;
  while (trimming) {
    trimming = false;
    if (g.length > MIN_SIZE && g[0].every(c => c === null) && g[1].every(c => c === null)) { g = g.slice(1); trimming = true; }
    const lastR = g.length - 1;
    if (g.length > MIN_SIZE && g[lastR].every(c => c === null) && g[lastR - 1].every(c => c === null)) { g = g.slice(0, lastR); trimming = true; }
    if (g[0].length > MIN_SIZE && g.every(r => r[0] === null) && g.every(r => r[1] === null)) { g = g.map(r => r.slice(1)); trimming = true; }
    const lastC = g[0].length - 1;
    if (g[0].length > MIN_SIZE && g.every(r => r[lastC] === null) && g.every(r => r[lastC - 1] === null)) { g = g.map(r => r.slice(0, lastC)); trimming = true; }
  }
  if (g.length < MAX_SIZE && g[0].some(c => c !== null)) g = [Array(g[0].length).fill(null), ...g];
  if (g.length < MAX_SIZE && g[g.length - 1].some(c => c !== null)) g = [...g, Array(g[0].length).fill(null)];
  if (g[0].length < MAX_SIZE && g.some(r => r[0] !== null)) g = g.map(r => [null, ...r]);
  if (g[0].length < MAX_SIZE && g.some(r => r[r.length - 1] !== null)) g = g.map(r => [...r, null]);
  return g;
}

// Workshop green palette & font
const WS = {
  bg: "#f4f9f4",
  panelBg: "#ffffff",
  accent: "#2d6a4f",
  accentLight: "#52b788",
  accentPale: "#d8f3dc",
  border: "#b7dfc4",
  text: "#1b3a2d",
  muted: "#6a9975",
  font: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
};

export default function App() {
  const [page, setPage] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tempQty, setTempQty] = useState(1);
  const [grid, setGrid] = useState(makeEmptyGrid(MIN_SIZE, MIN_SIZE));
  const [dragging, setDragging] = useState(null);
  const [popupCell, setPopupCell] = useState(null); // { row, col }
  const [addonQtys, setAddonQtys] = useState({ 0: 0, 4: 0, 7: 0 });

  const addToCart = (product, quantity) => {
    if (quantity < 1) return;
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setTempQty(1);
    setIsCartOpen(true);
  };

  const updateCartQty = (id, delta) => setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Grid handlers — cells store { product, rotation }
  const handleDrop = (row, col) => {
    if (dragging === null) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = { product: dragging, rotation: 0 };
    setGrid(normalizeGrid(newGrid));
    setDragging(null);
    setPopupCell(null);
  };

  const clearCell = (row, col) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;
    setGrid(normalizeGrid(newGrid));
    setPopupCell(null);
  };

  const rotateCell = (row, col) => {
    const newGrid = grid.map(r => [...r]);
    const cell = newGrid[row][col];
    if (cell) newGrid[row][col] = { ...cell, rotation: (cell.rotation + 90) % 360 };
    setGrid(newGrid);
    setPopupCell(null);
  };

  const handleCellClick = (row, col, cell) => {
    if (!cell) { setPopupCell(null); return; }
    if (popupCell && popupCell.row === row && popupCell.col === col) {
      setPopupCell(null);
    } else {
      setPopupCell({ row, col });
    }
  };

  const addGridToCart = () => {
    const filled = grid.flat().filter(Boolean);
    if (filled.length === 0) { alert("Your grid is empty! Drag some parts on first."); return; }
    const counts = {};
    filled.forEach(cellObj => {
      const pid = cellObj.product.id;
      counts[pid] = (counts[pid] || 0) + 1;
    });
    const newCart = [...cart];
    Object.entries(counts).forEach(([id, qty]) => {
      const product = PRODUCT_DATA.find(p => p.id === parseInt(id));
      if (!product) return;
      const existing = newCart.find(item => item.id === product.id);
      if (existing) { existing.quantity += qty; } else { newCart.push({ ...product, quantity: qty }); }
    });
    setCart(newCart);
    setIsCartOpen(true);
  };

  const addAddonsToCart = () => {
    const newCart = [...cart];
    ADDON_IDS.forEach(id => {
      const qty = addonQtys[id];
      if (qty < 1) return;
      const product = PRODUCT_DATA.find(p => p.id === id);
      if (!product) return;
      const existing = newCart.find(item => item.id === product.id);
      if (existing) { existing.quantity += qty; } else { newCart.push({ ...product, quantity: qty }); }
    });
    setCart(newCart);
    setIsCartOpen(true);
  };

  const numRows = grid.length;
  const numCols = grid[0].length;
  const occupied = [];
  grid.forEach((row, r) => row.forEach((cell, c) => { if (cell) occupied.push([r, c]); }));
  let boundedRows = 0, boundedCols = 0;
  if (occupied.length > 0) {
    const rows = occupied.map(p => p[0]);
    const cols = occupied.map(p => p[1]);
    boundedRows = Math.max(...rows) - Math.min(...rows) + 1;
    boundedCols = Math.max(...cols) - Math.min(...cols) + 1;
  }
  const widthInches = boundedCols * CELL_INCHES;
  const heightInches = boundedRows * CELL_INCHES;
  const measurementHeightPx = boundedRows > 0 ? (CELL_PX * boundedRows) + (4 * (boundedRows - 1)) + 8 : (CELL_PX + 8);

  const Header = () => (
    <header style={{ borderBottom: "1px solid #eee", marginBottom: "40px", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: "0", letterSpacing: "-1px" }}>HYDRO SUPPLIES</h1>
      <nav style={{ display: "flex", gap: "20px" }}>
        {[["shop", "Shop"], ["workshop", "Workshop"], ["about", "About Us"]].map(([key, label]) => (
          <button key={key} onClick={() => { setPage(key); setSelectedProduct(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: page === key ? "bold" : "normal", textDecoration: page === key ? "underline" : "none" }}>
            {label}
          </button>
        ))}
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

  // --- ABOUT US PAGE (unchanged) ---
  if (page === "about") {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <Header />
        <CartDrawer />
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontSize: "3rem", letterSpacing: "-2px", margin: "0 0 8px" }}>THE BESTEST COMPANY</h1>
          <p style={{ color: "#888", fontSize: "1.1rem" }}>Est. 2026</p>
        </div>
        <div style={{ display: "flex", gap: "0", borderTop: "1px solid #eee" }}>
          <div style={{ flex: 1, padding: "40px 40px 40px 0", borderRight: "1px solid #eee" }}>
            <h2 style={{ marginTop: 0 }}>About Us</h2>
            <p style={{ color: "#555", lineHeight: "1.7" }}>
              We founded The Bestest Company in January 2026 on one simple word: <em>Why?</em> Why are
              hydroponics systems so expensive? A 4-tier system can cost up to $560 for what amounts to
              a couple of PVC pipes and a pump. We set out to make affordable, modular, 3D-printed
              hydroponics systems for the everyday consumer — recyclable, environmentally friendly, and
              suited to any space.
            </p>
          </div>
          <div style={{ flex: 1, padding: "40px 0 40px 40px" }}>
            <h2 style={{ marginTop: 0 }}>Our Mission</h2>
            <p style={{ color: "#555", lineHeight: "1.7" }}>
              Our goal is to provide customers affordable, eco-friendly, and sustainable urban farming
              systems that can be customized to fit their needs exactly — whether a larger system to
              replace the produce aisle or a small herb garden in an apartment.
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eee", padding: "40px 0" }}>
          <h2 style={{ marginTop: 0 }}>How It Works</h2>
          <ol style={{ color: "#555", lineHeight: "2.2", paddingLeft: "20px" }}>
            <li>Take a picture of the wall you want to install the hydroponics system on and upload it to the preview system.</li>
            <li>Place the modular pieces on the overlay of your wall to fit your needs.</li>
            <li>When you have your system designed, add the pieces to your cart.</li>
            <li>Check out and pay.</li>
            <li>As soon as we get your order, we begin printing your custom system and ship it to you.</li>
          </ol>
        </div>
        <div style={{ borderTop: "1px solid #eee", padding: "40px 0" }}>
          <h2 style={{ marginTop: 0, marginBottom: "32px" }}>Meet Our Founders</h2>
          {FOUNDERS.map((founder) => (
            <div key={founder.name} style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "36px" }}>
              <img src={founder.img} alt={founder.name}
                style={{ width: "130px", height: "137px", objectFit: "cover", borderRadius: "14px", flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: "1rem", letterSpacing: "0.5px" }}>{founder.name}</h3>
                <p style={{ margin: "0 0 10px", fontSize: "0.85rem", color: "#888", fontStyle: "italic" }}>{founder.title}</p>
                <p style={{ margin: 0, color: "#555", lineHeight: "1.65" }}>{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- WORKSHOP PAGE ---
  if (page === "workshop") {
    return (
      <div
        onClick={() => setPopupCell(null)}
        style={{
          minHeight: "100vh",
          background: WS.bg,
          padding: "40px",
          fontFamily: WS.font,
          color: WS.text,
        }}
      >
        <Header />
        <CartDrawer />

        {/* Page title */}
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "2rem", letterSpacing: "-0.5px", color: WS.accent }}>
            Workshop
          </h2>
          <p style={{ color: WS.muted, margin: 0, fontSize: "0.95rem", fontStyle: "italic" }}>
            Drag parts from the palette onto the grid to design your system. Click a placed part to rotate or remove it.
          </p>
        </div>

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* ── Parts palette ── */}
          <div style={{
            minWidth: "160px",
            background: WS.panelBg,
            border: `1.5px solid ${WS.border}`,
            borderRadius: "14px",
            padding: "18px 14px",
            boxShadow: "0 2px 12px rgba(45,106,79,0.07)",
          }}>
            <h3 style={{
              margin: "0 0 16px",
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: WS.muted,
              borderBottom: `1px solid ${WS.border}`,
              paddingBottom: "10px",
            }}>
              Parts
            </h3>
            {PRODUCT_DATA.filter(p => BUILDABLE_IDS.includes(p.id)).map(product => (
              <div
                key={product.id}
                draggable
                onDragStart={(e) => { e.stopPropagation(); setDragging(product); }}
                onDragEnd={() => setDragging(null)}
                title={`${product.name} — $${product.price.toFixed(2)}`}
                style={{
                  background: WS.accentPale,
                  border: `1.5px solid ${WS.border}`,
                  borderRadius: "10px",
                  padding: "8px",
                  marginBottom: "10px",
                  cursor: "grab",
                  userSelect: "none",
                  textAlign: "center",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 14px rgba(45,106,79,0.18)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  style={{ width: "100%", height: "72px", objectFit: "contain", display: "block", pointerEvents: "none" }}
                />
                <div style={{ fontSize: "0.72rem", fontWeight: "bold", color: WS.accent, marginTop: "5px", lineHeight: "1.3" }}>
                  {product.name}
                </div>
                <div style={{ fontSize: "0.68rem", color: WS.muted, marginTop: "2px" }}>
                  ${product.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* ── Grid builder ── */}
          <div onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div>
                {/* Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${numCols}, ${CELL_PX}px)`,
                  gridTemplateRows: `repeat(${numRows}, ${CELL_PX}px)`,
                  gap: "4px",
                  border: `2px solid ${WS.accentLight}`,
                  padding: "4px",
                  background: WS.accentPale,
                  borderRadius: "10px",
                  boxShadow: "0 2px 16px rgba(45,106,79,0.10)",
                }}>
                  {grid.map((row, rIdx) => row.map((cell, cIdx) => {
                    const isPopup = popupCell && popupCell.row === rIdx && popupCell.col === cIdx;
                    return (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.stopPropagation(); handleDrop(rIdx, cIdx); }}
                        onClick={(e) => { e.stopPropagation(); handleCellClick(rIdx, cIdx, cell); }}
                        title={cell ? `${cell.product.name} — click to edit` : "Drop a part here"}
                        style={{
                          width: `${CELL_PX}px`,
                          height: `${CELL_PX}px`,
                          background: cell ? "#fff" : "rgba(255,255,255,0.55)",
                          border: cell ? `1.5px solid ${WS.accentLight}` : `1.5px dashed ${WS.border}`,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: cell ? "pointer" : "default",
                          position: "relative",
                          overflow: "visible",
                          transition: "background 0.15s, border-color 0.15s",
                          boxShadow: cell ? "0 1px 6px rgba(45,106,79,0.10)" : "none",
                        }}
                      >
                        {cell && (
                          <img
                            src={cell.product.img}
                            alt={cell.product.name}
                            draggable={false}
                            style={{
                              width: "82%",
                              height: "82%",
                              objectFit: "contain",
                              transform: `rotate(${cell.rotation}deg)`,
                              transition: "transform 0.25s ease",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        {/* Popup menu */}
                        {isPopup && (
                          <div
                            onClick={e => e.stopPropagation()}
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -110%)",
                              background: "#fff",
                              border: `1.5px solid ${WS.border}`,
                              borderRadius: "10px",
                              boxShadow: "0 6px 20px rgba(45,106,79,0.18)",
                              zIndex: 50,
                              padding: "6px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              minWidth: "110px",
                            }}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); rotateCell(rIdx, cIdx); }}
                              style={{
                                background: WS.accentPale,
                                border: `1px solid ${WS.border}`,
                                borderRadius: "7px",
                                padding: "6px 10px",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                                fontFamily: WS.font,
                                color: WS.accent,
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              ↻ Rotate 90°
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); clearCell(rIdx, cIdx); }}
                              style={{
                                background: "#fff0f0",
                                border: "1px solid #ffc5c5",
                                borderRadius: "7px",
                                padding: "6px 10px",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                                fontFamily: WS.font,
                                color: "#c0392b",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }))}
                </div>

                {/* Width label */}
                <div style={{ textAlign: "center", marginTop: "10px", color: WS.muted, fontSize: "0.85rem", fontStyle: "italic" }}>
                  ↔ <strong style={{ color: WS.accent }}>{widthInches} in.</strong> wide
                </div>
              </div>

              {/* Height label */}
              <div style={{ marginLeft: "14px", height: `${measurementHeightPx}px`, display: "flex", alignItems: "center" }}>
                <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "0.85rem", color: WS.muted, whiteSpace: "nowrap", fontStyle: "italic" }}>
                  <strong style={{ color: WS.accent }}>{heightInches} in.</strong> tall ↕
                </div>
              </div>
            </div>

            {/* Add build to bag */}
            <button
              onClick={addGridToCart}
              style={{
                marginTop: "22px",
                padding: "13px 36px",
                background: WS.accent,
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: WS.font,
                letterSpacing: "0.3px",
                boxShadow: "0 4px 14px rgba(45,106,79,0.25)",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1b4d35"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = WS.accent; e.currentTarget.style.transform = "none"; }}
            >
              Add Build to Bag 🛒
            </button>
            <p style={{ fontSize: "0.75rem", color: WS.muted, marginTop: "8px", fontStyle: "italic" }}>
              Click any placed part to rotate or remove it. Grid max is 11×11.
            </p>
          </div>
        </div>

        {/* ── Add-on Recommendations ── */}
        <div style={{
          marginTop: "48px",
          background: WS.panelBg,
          border: `1.5px solid ${WS.border}`,
          borderRadius: "16px",
          padding: "28px 32px",
          boxShadow: "0 2px 14px rgba(45,106,79,0.07)",
          maxWidth: "720px",
        }}>
          {/* Leaf icon + heading */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontSize: "1.4rem" }}>🌿</span>
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: WS.accent, letterSpacing: "-0.3px" }}>
              We Recommend
            </h3>
          </div>
          <p style={{ color: WS.muted, fontSize: "0.9rem", margin: "0 0 22px", fontStyle: "italic", lineHeight: "1.6" }}>
            We recommend having a <strong style={{ color: WS.text }}>connector per pipe meeting</strong> and{" "}
            <strong style={{ color: WS.text }}>at least two wall mounts</strong> if hanging. Add them to your build below.
          </p>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {ADDON_IDS.map(id => {
              const product = PRODUCT_DATA.find(p => p.id === id);
              return (
                <div
                  key={id}
                  style={{
                    flex: "1 1 180px",
                    background: WS.accentPale,
                    border: `1.5px solid ${WS.border}`,
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{ width: "80px", height: "80px", objectFit: "contain" }}
                  />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: WS.accent }}>{product.name}</div>
                    <div style={{ fontSize: "0.78rem", color: WS.muted }}>${product.price.toFixed(2)} each</div>
                  </div>
                  {/* Qty selector */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => setAddonQtys(q => ({ ...q, [id]: Math.max(0, q[id] - 1) }))}
                      style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        border: `1.5px solid ${WS.accentLight}`, background: "#fff",
                        cursor: "pointer", fontWeight: "bold", color: WS.accent,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                      }}
                    >−</button>
                    <span style={{ fontWeight: "bold", fontSize: "1rem", color: WS.text, minWidth: "18px", textAlign: "center" }}>
                      {addonQtys[id]}
                    </span>
                    <button
                      onClick={() => setAddonQtys(q => ({ ...q, [id]: q[id] + 1 }))}
                      style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        border: `1.5px solid ${WS.accentLight}`, background: WS.accent,
                        cursor: "pointer", fontWeight: "bold", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                      }}
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add add-ons to bag */}
          <button
            onClick={addAddonsToCart}
            disabled={ADDON_IDS.every(id => addonQtys[id] === 0)}
            style={{
              marginTop: "22px",
              padding: "11px 30px",
              background: ADDON_IDS.every(id => addonQtys[id] === 0) ? "#ccc" : WS.accentLight,
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              fontWeight: "bold",
              cursor: ADDON_IDS.every(id => addonQtys[id] === 0) ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              fontFamily: WS.font,
              boxShadow: ADDON_IDS.every(id => addonQtys[id] === 0) ? "none" : "0 4px 12px rgba(82,183,136,0.3)",
              transition: "background 0.2s",
            }}
          >
            Add Selected Add-ons to Bag 🛒
          </button>
        </div>
      </div>
    );
  }

  // --- DETAIL PAGE (unchanged) ---
  if (selectedProduct) {
    return (
      <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <Header />
        <CartDrawer />
        <button onClick={() => { setSelectedProduct(null); setTempQty(1); }} style={{ cursor: "pointer", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}>
          ← Back to Shop
        </button>
        <div style={{ display: "flex", gap: "40px" }}>
          <img src={selectedProduct.img} alt={selectedProduct.name} style={{ width: "100%", maxWidth: "400px", height: `${CELL_PX * 4}px`, objectFit: "contain", borderRadius: "12px", padding: "20px", background: "#f6f6f6" }} />
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
            <button onClick={() => addToCart(selectedProduct, tempQty)} style={{ width: "100%", padding: "15px", background: "black", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer" }}>
              Add to Bag — ${(selectedProduct.price * tempQty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SHOP PAGE (unchanged) ---
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <Header />
      <CartDrawer />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "30px" }}>
        {PRODUCT_DATA.map((product) => (
          <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ cursor: "pointer" }}>
            <div style={{ background: "#ffffff", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
              <img src={product.img} alt={product.name} style={{ width: "100%", height: `${CELL_PX * 2.25}px`, objectFit: "contain", padding: "15px" }} />
            </div>
            <h3 style={{ marginBottom: "5px" }}>{product.name}</h3>
            <p style={{ color: "#666", margin: "0" }}>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
