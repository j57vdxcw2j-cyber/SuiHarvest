import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useState } from "react";

// Dữ liệu giả cho túi đồ (Giữ nguyên vì chưa có Smart Contract)
const INVENTORY = [
  { id: 1, name: "Ngô", count: 12, icon: "🌽", type: "crop" },
  { id: 2, name: "Lúa Mì", count: 50, icon: "🌾", type: "crop" },
  { id: 3, name: "Cà Rốt", count: 8, icon: "🥕", type: "crop" },
  { id: 4, name: "Trứng Gà", count: 5, icon: "🥚", type: "product" },
  { id: 5, name: "Bình Tưới", count: 1, icon: "🚿", type: "tool" },
  { id: 6, name: "Cuốc Gỗ", count: 1, icon: "⛏️", type: "tool" },
  { id: 7, name: "Hạt Bí", count: 20, icon: "🎃", type: "seed" },
];

const SLOTS = Array(20).fill(null).map((_, i) => INVENTORY[i] || null);

export function Profile() {
  const account = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("inventory");

  // --- 1. LẤY SỐ DƯ SUI THẬT ---
  const { data: balanceData, isPending, error } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address as string },
    { 
      enabled: !!account, // Chỉ chạy khi đã kết nối ví
      refetchInterval: 5000 // Tự động cập nhật mỗi 5 giây
    }
  );

  // --- 2. XỬ LÝ SỐ LIỆU (MIST -> SUI) ---
  // Mặc định là 0 nếu chưa có dữ liệu
  const rawBalance = balanceData?.totalBalance || "0";
  // Chia cho 1 tỷ (10^9) và lấy 2 số thập phân
  const suiBalance = (Number(rawBalance) / 1_000_000_000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      
      {/* 1. THẺ THÔNG TIN NGƯỜI CHƠI */}
      <div className="bg-[#FFFBEB] border-4 border-[#8B4513] rounded-3xl p-6 shadow-xl mb-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        
        {/* Background trang trí */}
        <div className="absolute top-0 right-0 text-9xl opacity-10 rotate-12 pointer-events-none">👨‍🌾</div>

        {/* Avatar */}
        <div className="w-24 h-24 bg-sky-200 rounded-full border-4 border-white shadow-md flex items-center justify-center text-5xl relative">
            🧑‍🌾
            <div className="absolute bottom-0 right-0 bg-[#76C043] text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
              LV.1
            </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-farm text-[#5c2e0b] font-bold mb-1">
              Nông Dân Tập Sự
            </h2>
            <p className="text-slate-500 font-mono text-sm bg-white/50 inline-block px-3 py-1 rounded-lg border border-[#DEB887]">
              {account ? account.address : "🔴 Chưa kết nối ví"}
            </p>
            
            {/* Thanh EXP Giả lập */}
            <div className="mt-3 w-full max-w-md bg-[#DEB887] h-4 rounded-full overflow-hidden border border-[#8B4513] relative group">
               <div className="bg-[#FDE047] h-full w-[15%] shadow-[0_0_10px_#FDE047]"></div>
               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#5c2e0b]">
                 EXP: 15/100
               </span>
            </div>
        </div>

        {/* Stats - ĐÂY LÀ PHẦN HIỂN THỊ SỐ DƯ THẬT */}
        <div className="flex gap-4">
            <div className="text-center bg-[#DEB887]/30 p-3 rounded-xl border border-[#DEB887] min-w-[100px]">
               <div className="text-2xl">🏆</div>
               <div className="font-bold text-[#5c2e0b] text-sm">RANK #99</div>
            </div>

            <div className="text-center bg-[#DEB887]/30 p-3 rounded-xl border border-[#DEB887] min-w-[140px]">
               <div className="text-2xl animate-bounce">💰</div>
               <div className="font-bold text-[#5c2e0b] text-lg">
                 {/* Hiển thị Loading hoặc Số dư */}
                 {account ? (
                    isPending ? "Loading..." : `${suiBalance} SUI`
                 ) : (
                    "0 SUI"
                 )}
               </div>
            </div>
        </div>
      </div>

      {/* 2. KHUNG NHÀ KHO (Giữ nguyên) */}
      <div className="flex gap-2 mb-[-4px] pl-4 relative z-10">
         <button 
           onClick={() => setActiveTab("inventory")}
           className={`px-6 py-3 rounded-t-xl font-bold border-x-4 border-t-4 border-[#5c2e0b] transition-all ${activeTab === "inventory" ? "bg-[#8B4513] text-white translate-y-1" : "bg-[#A0522D] text-white/70 hover:bg-[#8B4513] mt-2"}`}
         >
           🎒 Túi Đồ
         </button>
         <button 
           onClick={() => setActiveTab("nfts")}
           className={`px-6 py-3 rounded-t-xl font-bold border-x-4 border-t-4 border-[#5c2e0b] transition-all ${activeTab === "nfts" ? "bg-[#8B4513] text-white translate-y-1" : "bg-[#A0522D] text-white/70 hover:bg-[#8B4513] mt-2"}`}
         >
           🖼️ Bộ Sưu Tập NFT
         </button>
      </div>

      <div className="bg-[#8B4513] border-[6px] border-[#5c2e0b] rounded-3xl p-6 shadow-[0_10px_0_rgba(0,0,0,0.4)] min-h-[400px]">
         <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {SLOTS.map((item, index) => (
              <div key={index} className="aspect-square bg-[#5c2e0b] rounded-xl border-b-2 border-white/10 shadow-inner relative group cursor-pointer hover:bg-[#703a0f] transition">
                 {item && (
                   <>
                     <div className="absolute inset-0 flex items-center justify-center text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                       {item.icon}
                     </div>
                     <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] font-bold px-1.5 rounded border border-white/20">
                       x{item.count}
                     </div>
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-20 border border-white/20">
                       {item.name}
                     </div>
                   </>
                 )}
              </div>
            ))}
         </div>

         <div className="mt-6 flex justify-between items-center text-[#DEB887] text-sm font-mono border-t border-[#DEB887]/20 pt-4">
            <p>Sức chứa: {INVENTORY.length}/20</p>
            <div className="flex gap-2">
               <button className="hover:text-white transition">Sắp xếp 🌪️</button>
            </div>
         </div>
      </div>
    </div>
  );
}