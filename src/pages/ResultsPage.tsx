import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import gsap from "gsap";
import axios from "axios";
import ProfessorCard from "../components/ProfessorCard";

const gradePoints: Record<string, number> = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

export default function ResultsPage() {
  const location = useLocation();
  const initialQuery = (location.state as { query?: string })?.query || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseAverage, setCourseAverage] = useState<
    { course: string; average: number | null }[]
  >([]);
  const [professorSlug, setProfessorSlug] = useState<string>("");

  const searchIconRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchProfessor = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSearchResult(null);

    try {
      const response = await axios.get(
        `https://planetterp.com/api/v1/professor?name=${encodeURIComponent(
          query
        )}&reviews=true`
      );

      const data = response.data;

      if (data.slug) setProfessorSlug(data.slug);

      const numReviews = Array.isArray(data.reviews) ? data.reviews.length : 0;

      const uniqueCourses: string[] = Array.from(
        new Set(data.courses.map((c: string) => c.split("-")[0]))
      );

      setSearchResult({ ...data, courses: uniqueCourses, numReviews });

      if (uniqueCourses.length > 0) {
        setSelectedCourse(uniqueCourses[0]);
      }

      // Store the searched professor name in localStorage
      const storedNames: string[] = JSON.parse(
        localStorage.getItem("recentProfessors") || "[]"
      );

      if (!storedNames.includes(data.name)) {
        storedNames.unshift(data.name); // add to start
        if (storedNames.length > 10) storedNames.pop(); // keep last 10
        localStorage.setItem("recentProfessors", JSON.stringify(storedNames));
      }
    } catch (error) {
      setSearchResult({ error: "Failed to fetch results" });
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async (professor: string) => {
    try {
      const response = await axios.get(
        `https://planetterp.com/api/v1/grades?professor=${encodeURIComponent(
          professor
        )}`
      );

      const data: any[] = response.data;

      const courseMap: Record<
        string,
        { totalPoints: number; totalCount: number }
      > = {};

      data.forEach((entry) => {
        const courseName = entry.course;
        if (!courseMap[courseName]) {
          courseMap[courseName] = { totalPoints: 0, totalCount: 0 };
        }

        Object.entries(entry).forEach(([grade, value]) => {
          if (gradePoints[grade] && typeof value === "number") {
            courseMap[courseName].totalPoints += gradePoints[grade] * value;
            courseMap[courseName].totalCount += value;
          }
        });
      });

      const averages = Object.entries(courseMap).map(
        ([course, { totalPoints, totalCount }]) => ({
          course,
          average: totalCount > 0 ? totalPoints / totalCount : null,
        })
      );

      setCourseAverage(averages);
      console.log("Course Averages:", averages);
    } catch (error) {
      console.error(error);
      setCourseAverage([]);
    }
  };

  const handleSearch = () => {
    fetchProfessor(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (initialQuery) {
      fetchProfessor(initialQuery);
    }
  }, []);

  useEffect(() => {
    if (searchResult) {
      fetchGrades(searchResult.name);
    }
  }, [searchResult]);

  useEffect(() => {
    console.log("Course Average updated:", courseAverage);
  }, [courseAverage]);

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-12"
      >
        <button
          onClick={() => navigate("/")}
          className="text-[#6E6E6E] hover:text-gray-800 transition-colors text-lg font-medium flex-shrink-0"
        >
          ← Return
        </button>

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
                  ease: "elastic.out(1,0.5)",
                });
              }
            }}
            onMouseLeave={() => {
              if (searchIconRef.current) {
                gsap.to(searchIconRef.current, {
                  rotate: 0,
                  duration: 0.5,
                  ease: "elastic.out(1,0.5)",
                });
              }
            }}
          >
            <Search ref={searchIconRef} className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-2 flex flex-col gap-6">
        {loading && <p>Loading results...</p>}

        {searchResult && !searchResult.error && (
          <ProfessorCard
            name={searchResult.name}
            rating={searchResult.average_rating}
            courses={searchResult.courses}
            selectedCourse={selectedCourse}
            onCourseChange={(c) => setSelectedCourse(c)}
            courseAverage={
              courseAverage.find((c) => c.course === selectedCourse)?.average ??
              undefined
            }
            slug={searchResult.slug}
            reviews={searchResult.numReviews}
          />
        )}

        {searchResult?.error && (
          <p className="text-black font-bold text-center">
            No Professor with that Name
          </p>
        )}
      </div>
    </div>
  );
}
