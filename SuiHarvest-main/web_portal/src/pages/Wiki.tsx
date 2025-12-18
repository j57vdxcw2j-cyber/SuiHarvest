import { useState } from "react";

// Định nghĩa kiểu dữ liệu cho các mục Wiki
type WikiSection = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

export const Wiki = () => {
  const [activeTab, setActiveTab] = useState("intro");

  // Dữ liệu nội dung Wiki (Lấy từ GDD của bạn)
  const sections: WikiSection[] = [
    {
      id: "intro",
      title: "Tổng quan",
      icon: "📜",
      content: (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#5c2e0b] mb-4">🌾 SuiHarvest là gì?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            SuiHarvest là một tựa game <strong>Strategy Farming / Roguelike Simulation</strong> xây dựng trên nền tảng Unity 2D. 
            Trò chơi tập trung vào cơ chế "High Risk, High Reward" (Rủi ro cao, Phần thưởng lớn).
          </p>
          <div className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-800">Vòng lặp trò chơi (Core Loop):</h3>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-700">
              <li><strong>Khởi đầu:</strong> Trả phí nhập môn (0.75 SUI).</li>
              <li><strong>Làm việc:</strong> Tiêu hao Stamina để khai thác tài nguyên.</li>
              <li><strong>Trả hàng:</strong> Hoàn thành hợp đồng để nhận thưởng.</li>
              <li><strong>Kết thúc:</strong> Kho đồ sẽ bị xóa sạch sau mỗi ngày (phiên chơi).</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "contracts",
      title: "Hợp đồng & Kinh tế",
      icon: "💰",
      content: (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#5c2e0b] mb-4">📜 Hệ thống Hợp đồng</h2>
          <p className="text-gray-700">
            Mỗi ngày, người chơi sẽ nhận được một hợp đồng ngẫu nhiên. Độ khó càng cao, phần thưởng càng lớn.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-100 p-4 rounded-lg border border-green-300">
              <div className="text-2xl mb-2">🌱</div>
              <h4 className="font-bold text-green-800">Basic (Cơ bản)</h4>
              <p className="text-sm text-gray-600">Rủi ro thấp, thích hợp cho người mới.</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
              <div className="text-2xl mb-2">🚜</div>
              <h4 className="font-bold text-blue-800">Advanced (Nâng cao)</h4>
              <p className="text-sm text-gray-600">Cân bằng giữa rủi ro và lợi nhuận.</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg border border-red-300">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-bold text-red-800">Expert (Chuyên gia)</h4>
              <p className="text-sm text-gray-600">Rủi ro cực cao, phần thưởng khổng lồ.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#5c2e0b] mt-6">Tiền tệ & Bảo hiểm</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 bg-white/50 p-4 rounded-lg">
            <li><strong>SUI:</strong> Tiền tệ chính để trả phí và nhận thưởng.</li>
            <li><strong>Fame Points (FP):</strong> Điểm uy tín, đóng vai trò như "bảo hiểm" giúp giảm thiểu rủi ro khi thất bại.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "stamina",
      title: "Thể lực (Stamina)",
      icon: "⚡",
      content: (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#5c2e0b] mb-4">⚡ Cơ chế Thể lực</h2>
          <p className="text-gray-700">
            Bạn có giới hạn <strong>50 Stamina</strong> mỗi ngày. Hãy tính toán cẩn thận từng hành động!
          </p>

          <table className="w-full text-left mt-4 border-collapse">
            <thead>
              <tr className="bg-[#5c2e0b] text-white">
                <th className="p-3 rounded-tl-lg">Hành động</th>
                <th className="p-3">Tiêu hao</th>
                <th className="p-3 rounded-tr-lg">Mô tả</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-bold">💧 Tưới cây</td>
                <td className="p-3 text-red-600 font-bold">-2 Stamina</td>
                <td className="p-3">Giúp cây trồng phát triển.</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-bold">🪓 Chặt gỗ</td>
                <td className="p-3 text-red-600 font-bold">-6 Stamina</td>
                <td className="p-3">Thu thập gỗ từ rừng.</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-bold">⛏️ Đập đá</td>
                <td className="p-3 text-red-600 font-bold">-8 Stamina</td>
                <td className="p-3">Khai thác đá trên núi (Tốn sức nhất).</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "map",
      title: "Bản đồ & Khu vực",
      icon: "🗺️",
      content: (
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#5c2e0b] mb-4">🗺️ Thế giới SuiHarvest</h2>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border-2 border-dashed border-[#5c2e0b]/30">
              <div className="text-4xl">🏡</div>
              <div>
                <h4 className="font-bold text-[#5c2e0b]">Nhà & Nông trại</h4>
                <p className="text-sm text-gray-600">Khu vực an toàn. Nơi bạn trồng trọt và quản lý kho.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border-2 border-dashed border-[#5c2e0b]/30">
              <div className="text-4xl">🌲</div>
              <div>
                <h4 className="font-bold text-[#5c2e0b]">Rừng rậm (Forest)</h4>
                <p className="text-sm text-gray-600">Khu vực trung lập. Nơi khai thác gỗ và tìm kiếm vật phẩm phụ.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border-2 border-dashed border-[#5c2e0b]/30">
              <div className="text-4xl">⛰️</div>
              <div>
                <h4 className="font-bold text-[#5c2e0b]">Núi đá (Mountain)</h4>
                <p className="text-sm text-gray-600">Khu vực rủi ro cao. Nơi khai thác đá quý nhưng tiêu tốn nhiều thể lực.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border-2 border-dashed border-[#5c2e0b]/30">
              <div className="text-4xl">📋</div>
              <div>
                <h4 className="font-bold text-[#5c2e0b]">Trạm Giao Nhiệm Vụ</h4>
                <p className="text-sm text-gray-600">Nơi nhận hợp đồng và trả hàng mỗi ngày.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeContent = sections.find((s) => s.id === activeTab);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-full flex flex-col items-center">
      
      {/* Tiêu đề trang */}
      <h1 className="text-4xl md:text-5xl font-farm text-[#5c2e0b] text-outline text-white mb-8 drop-shadow-lg">
        📖 Bí Kíp Nhà Nông
      </h1>

      <div className="w-full flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR - Danh mục (Giao diện bảng gỗ) */}
        <div className="w-full md:w-1/4 flex flex-col gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`
                flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-left border-b-4
                ${activeTab === section.id 
                  ? "bg-[#76C043] text-white border-[#468926] translate-x-2 shadow-lg" 
                  : "bg-wood-pattern text-[#FFFBEB] border-[#5c2e0b] hover:brightness-110 hover:translate-x-1 shadow-md"}
              `}
            >
              <span className="text-2xl filter drop-shadow-md">{section.icon}</span>
              <span className="font-farm tracking-wide drop-shadow-sm">{section.title}</span>
            </button>
          ))}
        </div>

        {/* MAIN CONTENT - Nội dung (Giao diện tờ giấy) */}
        <div className="w-full md:w-3/4 relative group">
          {/* Hiệu ứng ghim giấy */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
             <div className="w-4 h-4 rounded-full bg-red-500 shadow-md border border-red-700"></div>
          </div>

          <div className="bg-[#FFFBEB] rounded-sm shadow-[5px_5px_15px_rgba(0,0,0,0.2)] min-h-[500px] p-8 md:p-10 relative overflow-hidden">
             {/* Đường kẻ giấy viết */}
             <div className="absolute inset-0 pointer-events-none opacity-10" 
                  style={{backgroundImage: "linear-gradient(#000 1px, transparent 1px)", backgroundSize: "100% 2rem", marginTop: "2.5rem"}}>
             </div>

             {/* Nội dung chính */}
             <div className="relative z-10 animate-[fadeIn_0.5s_ease-out]">
               {activeContent?.content}
             </div>

             {/* Dấu mộc (Trang trí) */}
             <div className="absolute bottom-6 right-6 opacity-20 rotate-[-15deg] border-4 border-red-600 text-red-600 font-bold p-2 rounded text-xl uppercase pointer-events-none">
               SuiHarvest CONFIDENTIAL
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};