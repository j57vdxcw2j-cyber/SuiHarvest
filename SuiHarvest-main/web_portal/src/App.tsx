import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Market } from "./pages/Market";
import { Wiki } from "./pages/Wiki";
import { Profile } from "./pages/Profile";

function App() {
  // Giữ nguyên số lượng cây cỏ icon nhỏ
  const vegetation = Array(60).fill(null).map((_, i) => {
    const plants = ["🌾", "🌿", "🌱", "🌾", "🌽", "🌿", "🍄"];
    return plants[i % plants.length];
  });

  return (
    <Router>
      {/* Container chính: flex-col để đẩy footer xuống đáy */}
      <div className="min-h-screen font-farm relative overflow-x-hidden flex flex-col">
        
        {/* 1. BACKGROUND: Bầu trời & Mây (Giữ nguyên) */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-100 to-[#dcfce7]"></div>
          <div className="absolute top-10 left-10 text-white/40 text-8xl opacity-50 animate-[pulse_5s_infinite]">☁️</div>
          <div className="absolute top-40 right-20 text-white/40 text-9xl opacity-30 animate-[pulse_7s_infinite]">☁️</div>
        </div>

        {/* 2. NỘI DUNG CHÍNH */}
        {/* flex-grow: Tự động giãn ra để đẩy thanh gỗ xuống đáy */}
        <div className="relative z-10 flex flex-col flex-grow"> 
          <Navbar />

          <main className="flex-grow mb-10"> {/* Thêm mb-10 cho thoáng */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market" element={<Market />} />
              <Route path="/wiki" element={<Wiki />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>

        {/* 3. SÀN GỖ & CỎ (FOOTER) - NẰM IM Ở ĐÁY TRANG */}
        {/* Bỏ 'fixed', đổi thành 'relative z-20 mt-auto' để nó luôn nằm cuối cùng */}
        <div className="relative z-20 mt-auto w-full">
          
          {/* --- LỚP CỎ LÚA TRẢI DÀI --- */}
          <div className="absolute bottom-[90%] left-0 w-full flex justify-between items-end px-0 overflow-hidden pointer-events-none select-none">
             {vegetation.map((plant, index) => (
               <div 
                  key={index} 
                  className={`
                    text-3xl md:text-4xl lg:text-5xl 
                    transform transition-transform duration-500 ease-out
                    hover:-translate-y-6 hover:scale-125 hover:rotate-12 cursor-pointer pointer-events-auto
                    filter drop-shadow-md origin-bottom
                  `}
                  style={{
                    transform: `translateY(${Math.random() * 8}px) rotate(${Math.random() * 15 - 7}deg)` 
                  }}
               >
                 {plant}
               </div>
             ))}
          </div>

          {/* --- KHỐI GỖ CHÍNH --- */}
          <div className="h-24 bg-wood-pattern border-t-[6px] border-[#A0522D] flex items-center justify-center relative shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
            
            {/* Chữ khắc trên gỗ */}
            <div className="text-[#5c2e0b]/70 font-bold text-lg tracking-widest uppercase drop-shadow-sm border-2 border-[#5c2e0b]/20 px-6 py-1.5 rounded-lg bg-[#5c2e0b]/5">
              🌻 SuiHarvest © 2025
            </div>

            {/* Chi tiết đinh tán */}
            <div className="absolute top-4 left-6 w-3 h-3 bg-[#3f200b] rounded-full shadow-inner opacity-80 border border-[#5c2e0b]"></div>
            <div className="absolute top-4 right-6 w-3 h-3 bg-[#3f200b] rounded-full shadow-inner opacity-80 border border-[#5c2e0b]"></div>
          </div>
        </div>

      </div>
    </Router>
  );
}

export default App;