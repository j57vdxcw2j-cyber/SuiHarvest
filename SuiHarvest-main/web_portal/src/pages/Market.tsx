import { useState } from "react";

// Dữ liệu giả (Mock Data) - Sau này sẽ lấy từ Blockchain
const ITEMS = [
  { id: 1, name: "Hạt Giống Lúa", price: "10 SUI", type: "seed", icon: "🌾", desc: "Thời gian lớn: 2 giờ" },
  { id: 2, name: "Hạt Giống Ngô", price: "15 SUI", type: "seed", icon: "🌽", desc: "Thời gian lớn: 4 giờ" },
  { id: 3, name: "Hạt Cà Rốt", price: "20 SUI", type: "seed", icon: "🥕", desc: "Thời gian lớn: 5 giờ" },
  { id: 4, name: "Khoai Tây", price: "12 SUI", type: "seed", icon: "🥔", desc: "Thời gian lớn: 3 giờ" },
  { id: 5, name: "Bình Tưới", price: "50 SUI", type: "tool", icon: "🚿", desc: "Giúp cây lớn nhanh x2" },
  { id: 6, name: "Cuốc Đất", price: "40 SUI", type: "tool", icon: "⛏️", desc: "Mở rộng ô đất trồng" },
  { id: 7, name: "Phân Bón", price: "5 SUI", type: "tool", icon: "💩", desc: "Hồi phục đất cằn cỗi" },
  { id: 8, name: "Gà Con", price: "100 SUI", type: "animal", icon: "🐣", desc: "Đẻ trứng mỗi 6 giờ" },
];

export function Market() {
  const [filter, setFilter] = useState("all");

  // Lọc sản phẩm theo tab
  const filteredItems = filter === "all" 
    ? ITEMS 
    : ITEMS.filter(item => item.type === filter);

  // Style cho nút Tab
  const getTabClass = (type: string) => 
    `px-6 py-2 rounded-t-xl font-bold text-lg transition-all border-x-2 border-t-2 border-[#5c2e0b] ${
      filter === type 
      ? "bg-[#FFFBEB] text-[#5c2e0b] translate-y-0.5" // Active: Nổi lên, nối liền với bảng
      : "bg-[#A0522D] text-white hover:bg-[#8B4513] mt-2" // Inactive: Chìm xuống
    }`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* 1. TIÊU ĐỀ CHỢ */}
      <div className="text-center mb-10">
        <h1 className="text-6xl font-farm text-wood-dark text-outline drop-shadow-md mb-2">
          Chợ Phiên <span className="text-sun">SuiHarvest</span>
        </h1>
        <p className="text-slate-600 font-bold text-xl bg-white/40 inline-block px-6 py-1 rounded-full backdrop-blur-sm">
          🛒 Mua hạt giống & vật phẩm bằng SUI Token
        </p>
      </div>

      {/* 2. BỘ LỌC (TABS) */}
      <div className="flex justify-center gap-2 mb-[-2px] relative z-10">
        <button onClick={() => setFilter("all")} className={getTabClass("all")}>Tất Cả</button>
        <button onClick={() => setFilter("seed")} className={getTabClass("seed")}>🌱 Hạt Giống</button>
        <button onClick={() => setFilter("tool")} className={getTabClass("tool")}>🛠️ Công Cụ</button>
        <button onClick={() => setFilter("animal")} className={getTabClass("animal")}>🐔 Vật Nuôi</button>
      </div>

      {/* 3. KỆ HÀNG (GRID) */}
      <div className="bg-[#FFFBEB] border-4 border-[#5c2e0b] rounded-3xl p-8 shadow-[0_10px_0_rgba(92,46,11,0.3)] min-h-[500px]">
        
        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative bg-white border-2 border-[#DEB887] rounded-2xl p-4 flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              
              {/* Thẻ giá treo ở góc */}
              <div className="absolute -top-3 -right-3 bg-sun text-wood-dark font-bold px-3 py-1 rounded-lg border-2 border-wood shadow-sm rotate-12 z-10">
                {item.price}
              </div>

              {/* Icon sản phẩm */}
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform border-4 border-white shadow-inner">
                {item.icon}
              </div>

              {/* Tên & Mô tả */}
              <h3 className="text-2xl font-farm text-wood-dark font-bold">{item.name}</h3>
              <p className="text-slate-500 text-sm font-bold text-center mb-4">{item.desc}</p>

              {/* Nút Mua */}
              <button className="mt-auto w-full btn-wood bg-leaf border-leaf-dark py-2 text-lg shadow-[0_4px_0_#468926] active:translate-y-[4px] active:shadow-none">
                MUA NGAY
              </button>

            </div>
          ))}
        </div>

        {/* Nếu không có hàng */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="text-6xl mb-4">🕸️</div>
            <p className="text-2xl font-bold">Chưa có món hàng nào loại này!</p>
          </div>
        )}

      </div>

    </div>
  );
}