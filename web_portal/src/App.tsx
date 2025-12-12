import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Trang chủ
function Home() {
  const account = useCurrentAccount();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">SuiHarvest Portal (Vite)</h1>
      <ConnectButton />
      {account && <p>Ví của bạn: {account.address}</p>}
      
      <div className="flex gap-4 mt-4">
        <Link to="/wiki" className="text-blue-500 underline">Đến Wiki</Link>
        <Link to="/market" className="text-blue-500 underline">Đến Chợ</Link>
      </div>
    </div>
  );
}

// Trang Wiki (Demo)
function Wiki() {
  return <div className="p-10"><h1>Đây là trang Wiki</h1><Link to="/">Về nhà</Link></div>;
}

// App chính quản lý Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wiki" element={<Wiki />} />
        {/* Thêm các Route khác ở đây */}
      </Routes>
    </Router>
  );
}

export default App;