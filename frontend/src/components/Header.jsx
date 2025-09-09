import { Link } from "react-router-dom";
export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="h-10 w-10" />
          <div>
            <div className="text-lg font-semibold">NeuroNest</div>
            <div className="text-xs text-gray-500">Dementia Detection</div>
          </div>
        </div>

        <nav className="space-x-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
          <Link to="/camera" className="text-sm text-gray-600 hover:text-gray-900">Camera</Link>
          <Link to="/game" className="text-sm text-gray-600 hover:text-gray-900">Game</Link>
          <Link to="/report" className="text-sm text-gray-600 hover:text-gray-900">Report</Link>
        </nav>
      </div>
    </header>
  );
}
