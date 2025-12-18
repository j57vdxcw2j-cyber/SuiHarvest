import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- 1. TRANG TRÍ BỐI CẢNH (Decorations) --- */}
      
      {/* BÊN TRÁI: Ruộng Ngô & Lúa (Có hiệu ứng đung đưa) */}
      <div className="absolute bottom-0 left-0 z-0 pointer-events-none select-none">
         {/* Lớp xa */}
         <div className="absolute bottom-10 -left-10 text-[8rem] opacity-80 animate-[bounce_3s_infinite]">🌾</div>
         <div className="absolute bottom-20 left-20 text-[6rem] opacity-60 animate-[bounce_4s_infinite]">🌽</div>
         {/* Lớp gần (To hơn) */}
         <div className="text-[10rem] transform -translate-x-10 translate-y-10 filter drop-shadow-2xl animate-[ping_3s_infinite_reverse]">🌽</div>
      </div>

      {/* BÊN PHẢI: Cọc gỗ & Hàng rào */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none text-right">
         {/* Hàng rào xa */}
         <div className="absolute bottom-20 right-20 text-[6rem] opacity-60">🪵</div>
         {/* Cọc gỗ gần */}
         <div className="text-[10rem] transform translate-x-10 translate-y-10 filter drop-shadow-2xl">🚧</div>
         <div className="absolute bottom-0 right-32 text-[5rem] transform translate-y-5">🪨</div>
      </div>

      {/* --- 2. BẢNG KÍNH TRUNG TÂM (Glass HUD) --- */}
      <div className="relative z-10 max-w-4xl w-full">
        {/* Hiệu ứng kính mờ (Backdrop Blur) */}
        <div className="bg-white/40 backdrop-blur-xl border-4 border-white/50 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center relative overflow-hidden group">
          
          {/* Hiệu ứng ánh sáng quét qua khi hover */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>

          <span className="inline-block py-2 px-4 rounded-full bg-leaf text-white font-bold text-sm mb-6 shadow-md border-2 border-leaf-dark animate-bounce">
            🌱 ĐANG CHẠY TRÊN SUI TESTNET
          </span>

          <h1 className="text-6xl md:text-8xl font-farm font-bold text-wood-dark mb-4 text-outline drop-shadow-xl">
            Sui<span className="text-sun">Harvest</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-800 font-bold mb-10 max-w-2xl mx-auto leading-relaxed bg-white/30 p-4 rounded-xl border border-white/50">
            Chào mừng đến với nông trại Web3! <br/>
            Nơi bạn trồng trọt, chăn nuôi và kiếm tiền thật.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button className="btn-wood text-2xl px-10 py-5 bg-gradient-to-b from-sun to-orange-400 border-orange-700 hover:scale-105 active:scale-95 shadow-xl">
              🎮 Vào Game Ngay
            </button>
            <Link to="/wiki" className="btn-wood text-2xl px-10 py-5 bg-white text-wood border-slate-300 hover:bg-slate-50">
              📖 Xem Hướng Dẫn
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}