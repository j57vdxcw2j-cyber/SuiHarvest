import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname === path 
      ? "bg-paper text-wood-dark shadow-inner scale-110 -translate-y-1" 
      : "text-white hover:bg-white/20";

  return (
    <nav className="sticky top-4 z-50 px-4 mb-4">
      <div className="container mx-auto h-20 bg-wood rounded-2xl border-b-[6px] border-[#5c2e0b] shadow-2xl px-4 relative flex items-center">
        
        {/* Đinh tán trang trí */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#422005] rounded-full"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#422005] rounded-full"></div>

        {/* CỘT 1: LOGO (Chiếm 1/3 bên trái) */}
        <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="text-4xl filter drop-shadow-md group-hover:rotate-12 transition duration-300">
                    🏡
                </div>
                <span className="font-farm font-bold text-2xl text-white text-outline tracking-wider hidden lg:block">
                  SuiHarvest
                </span>
            </Link>
        </div>

        {/* CỘT 2: MENU GIỮA (Chiếm 1/3 ở giữa -> Căn giữa tuyệt đối) */}
        <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-2 bg-[#5c2e0b]/40 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                {[
                  { path: "/", label: "🏠" }, // Dùng icon cho gọn
                  { path: "/market", label: "Chợ" },
                  { path: "/wiki", label: "Wiki" },
                  { path: "/profile", label: "Kho" }
                ].map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 ${isActive(link.path)}`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
        </div>

        {/* CỘT 3: CONNECT WALLET (Chiếm 1/3 bên phải -> Căn phải) */}
        <div className="flex-1 flex justify-end">
            <div className="[&_button]:!bg-leaf [&_button]:!text-white [&_button]:!font-bold [&_button]:!rounded-xl [&_button]:!border-b-4 [&_button]:!border-leaf-dark [&_button]:hover:!brightness-110 [&_button]:active:!border-b-0 [&_button]:active:!translate-y-1 shadow-lg">
                <ConnectButton />
            </div>
        </div>

      </div>
    </nav>
  );
}