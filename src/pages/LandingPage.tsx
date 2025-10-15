import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/results?professor=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative h-72 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200)",
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-8 w-full">
            <h1 className="text-5xl font-bold text-white mb-4">
              Find My Professor
            </h1>
            <p className="text-white text-lg max-w-md leading-relaxed">
              Want to know more about the professors here at UMD? This is the
              perfect place to learn a bit about the courses they teach and
              their grade distributions.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto px-6 py-16 relative">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Enter a Professor to start
        </h2>

        {/* Search Bar (Functional) */}
        <div className="flex gap-0 mb-16">
          <div className="flex flex-1 border border-gray-300 rounded">
            <input
              type="text"
              placeholder="Enter professor name..."
              className="flex-1 px-6 py-3 rounded-l focus:outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="bg-[#39302B] text-white px-6 py-3 rounded-r hover:bg-[#2f2824] transition-colors"
              onClick={handleSearch}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recently Searched (Static Example) */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recently Searched
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/results?professor=Dr.%20Smith")}
              className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded bg-gray-50 text-sm sm:text-base hover:bg-gray-100 transition"
            >
              <span className="text-gray-700">Dr. Smith</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => navigate("/results?professor=Dr.%20Johnson")}
              className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded bg-gray-50 text-sm sm:text-base hover:bg-gray-100 transition"
            >
              <span className="text-gray-700">Dr. Johnson</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => navigate("/results?professor=Dr.%20Lee")}
              className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded bg-gray-50 text-sm sm:text-base hover:bg-gray-100 transition"
            >
              <span className="text-gray-700">Dr. Lee</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        All data is gathered from the{" "}
        <a
          href="https://planetterp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-600"
        >
          PlanetTerp
        </a>{" "}
        API
      </div>
    </div>
  );
}
