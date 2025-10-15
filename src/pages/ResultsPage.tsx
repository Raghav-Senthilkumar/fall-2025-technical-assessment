import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      {/* Top Section */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-12">
        <button
          onClick={() => navigate("/")}
          className="text-[#6E6E6E] hover:text-gray-800 transition-colors text-lg font-medium flex-shrink-0"
        >
          ← Return
        </button>

        {/* Search Bar (Typing Enabled) */}
        <div className="flex flex-1 border border-gray-300 rounded">
          <input
            type="text"
            placeholder="Enter professor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-3 rounded-l focus:outline-none text-gray-700"
          />
          <button className="bg-[#39302B] text-white px-6 py-3 rounded-r hover:bg-black transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
