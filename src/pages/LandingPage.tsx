import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // import useNavigate
import { Search, ChevronRight } from "lucide-react";
import gsap from "gsap";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<Array<HTMLButtonElement | undefined>>([]);
  const searchIconRef = useRef<SVGSVGElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate(); // hook for navigation
  const location = useLocation(); //

  const handleSearch = () => {
    if (!searchQuery.trim()) return; // ignore empty searches
    navigate("/results", { state: { query: searchQuery } }); // navigate to results page and pass searchQuery
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };
  useEffect(() => {
    const storedNames: string[] = JSON.parse(
      localStorage.getItem("recentProfessors") || "[]"
    );
    console.log("📦 LocalStorage recentProfessors:", storedNames);
    setRecentSearches(storedNames);
  }, [location]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(heroRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    }).from(
      searchRef.current,
      { y: -50, opacity: 0, duration: 1, ease: "power3.out" },
      "-=0.7"
    );

    recentRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5 + i * 0.15,
          ease: "elastic.out(1.5, 0.6)",
        }
      );
    });

    if (footerRef.current) {
      tl.from(
        footerRef.current,
        { y: 50, opacity: 0, duration: 1, ease: "power3.out" },
        "-=0.5"
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        ref={heroRef}
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
      <div ref={searchRef} className="max-w-2xl mx-auto px-6 py-16 relative">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Enter a Professor to start
        </h2>

        {/* Search Bar */}
        <div className="flex gap-0 mb-16">
          <div className="flex flex-1 border border-gray-300 rounded focus-within:ring-2 focus-within:ring-gray-400">
            <input
              type="text"
              placeholder="Enter professor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-6 py-3 rounded-l focus:outline-none text-gray-700"
            />
            <button
              onClick={handleSearch}
              className="bg-[#39302B] hover:bg-black text-white px-6 py-3 rounded-r transition-colors"
              onMouseEnter={() => {
                if (searchIconRef.current) {
                  gsap.to(searchIconRef.current, {
                    rotate: 15,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.5)",
                  });
                }
              }}
              onMouseLeave={() => {
                if (searchIconRef.current) {
                  gsap.to(searchIconRef.current, {
                    rotate: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                  });
                }
              }}
            >
              <Search ref={searchIconRef} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recently Searched */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recently Searched
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {recentSearches.length === 0 && (
              <p className="text-gray-500">No recent searches</p>
            )}
            {recentSearches.slice(0, 3).map((name, index) => (
              <button
                key={index}
                ref={(el) => {
                  recentRef.current[index] = el ?? undefined;
                }}
                className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm sm:text-base"
                onClick={() => navigate("/results", { state: { query: name } })}
              >
                <span className="text-gray-700">{name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="text-center py-8 text-gray-500 text-sm">
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
