import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface ProfessorCardProps {
  name: string;
  rating: number;
  courses: string[];
  selectedCourse: string;
  onCourseChange: (course: string) => void;
  courseAverage: number | null | undefined;
  slug: string;
  reviews: number;
}

const getLetterGrade = (avg: number | null | undefined): string => {
  if (avg === null || avg === undefined) return "N/A";
  if (avg >= 4.0) return "A";
  if (avg >= 3.7) return "A-";
  if (avg >= 3.3) return "B+";
  if (avg >= 3.0) return "B";
  if (avg >= 2.7) return "B-";
  if (avg >= 2.3) return "C+";
  if (avg >= 2.0) return "C";
  if (avg >= 1.7) return "C-";
  if (avg >= 1.3) return "D+";
  if (avg >= 1.0) return "D";
  return "F";
};

const ProfessorCard: React.FC<ProfessorCardProps> = ({
  name,
  rating,
  courses,
  selectedCourse,
  onCourseChange,
  courseAverage,
  slug,
  reviews,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const averageRef = useRef<HTMLParagraphElement>(null);
  const starsRef = useRef<HTMLSpanElement[]>([]);
  const umdIconRef = useRef<HTMLImageElement>(null);
  const profImageRef = useRef<HTMLImageElement>(null);

  const [currentAverage, setCurrentAverage] = useState(courseAverage);

  useEffect(() => {
    setCurrentAverage(courseAverage);
  }, [courseAverage]);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.out" },
    });

    // Animate UMD icon and professor image first
    tl.from(umdIconRef.current, {
      y: -20,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
    })
      .from(profImageRef.current, { y: 20, opacity: 0, scale: 0.8 }, "-=0.5")
      .from(titleRef.current, { y: 20, opacity: 0 }, "-=0.4")
      .from(subtitleRef.current, { y: 20, opacity: 0 }, "-=0.3")
      .from(statsRef.current, { y: 20, opacity: 0 }, "-=0.3")
      .from(dropdownRef.current, { y: 20, opacity: 0 }, "-=0.3")
      .from(buttonWrapperRef.current, { scale: 0.9, opacity: 0 }, "-=0.3");

    if (starsRef.current.length) {
      gsap.fromTo(
        starsRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out", stagger: 0.1 }
      );
    }
  }, []);

  const handleCourseChange = (course: string) => {
    if (averageRef.current) {
      gsap.to(averageRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          onCourseChange(course);
          setCurrentAverage(courseAverage);
          gsap.fromTo(
            averageRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
          );
        },
      });
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const starsArray = [
      ...Array(fullStars).fill("full"),
      ...(halfStar ? ["half"] : []),
      ...Array(emptyStars).fill("empty"),
    ];

    return (
      <div className="flex justify-center mt-2 mb-3 text-yellow-500">
        {starsArray.map((type, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) starsRef.current[i] = el;
            }}
            className={`text-2xl md:text-3xl ${
              type === "empty" ? "text-gray-300" : ""
            }`}
          >
            {type === "half" ? "☆" : "★"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden w-full max-w-[550px] mx-auto p-4 md:p-6 tracking-[-0.05em] relative">
      {/* UMD circular icon with high z-index */}
      <img
        ref={umdIconRef}
        src="/UMD.png"
        alt="UMD"
        className="absolute w-10 h-10 rounded-full object-cover z-20"
        style={{ top: 10, left: 10 }}
      />

      <div className="relative flex justify-center md:justify-start md:w-[55%]">
        <img
          ref={profImageRef}
          src="https://images.unsplash.com/photo-1574281570877-bd815ebb50a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987"
          alt="Professor"
          className="w-[270px] h-60 md:h-[400px] object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 md:mt-0 md:ml-4">
        {renderStars(rating)}

        <h2
          ref={titleRef}
          className="text-[26px] text-[#000000] font-medium leading-[25px] text-center"
        >
          {name}
        </h2>

        <p
          ref={subtitleRef}
          className="text-[15px] text-[#8d8d8d] font-medium leading-[25px] text-center mt-1"
        >
          Professor
        </p>

        <div
          ref={statsRef}
          className="flex justify-center items-center mt-4 flex-wrap text-center"
        >
          <div className="flex items-center gap-3 md:gap-3.5">
            <div className="flex flex-col items-center">
              <p className="text-[#790000] font-black text-lg">
                {rating?.toFixed(2) || "N/A"}
              </p>
              <p className="text-[#404040] font-medium text-sm">Rating</p>
            </div>
            <div className="h-6 w-px bg-black"></div>
            <div className="flex flex-col items-center">
              <p className="text-black font-black text-lg">
                {reviews || "N/A"}
              </p>
              <p className="text-[#404040] font-medium text-sm">Reviews</p>
            </div>
            <div className="h-6 w-px bg-black"></div>
            <div className="flex flex-col items-center">
              <p className="text-[#DAA520] font-black text-lg">
                {Array.from(new Set(courses))?.length || "0"}
              </p>
              <p className="text-[#404040] font-medium text-sm">Courses</p>
            </div>
          </div>
        </div>

        <div ref={dropdownRef} className="mt-5 w-full max-w-[160px]">
          <p className="font-semibold text-black mb-1">Course Average:</p>
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="border rounded-lg px-3 py-1.5 w-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9C342F]"
          >
            {courses.map((course, i) => (
              <option key={i} value={course}>
                {course}
              </option>
            ))}
          </select>
          <p
            ref={averageRef}
            className="text-2xl md:text-3xl font-bold mt-2 text-black"
          >
            {getLetterGrade(currentAverage)}
          </p>
        </div>

        <div
          ref={buttonWrapperRef}
          className="mt-5 relative inline-block group"
        >
          <span
            aria-hidden
            className="pointer-events-none transition-transform transition-opacity duration-200 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
            style={{
              position: "absolute",
              top: -6,
              left: -6,
              right: -6,
              bottom: -6,
              borderRadius: 9999,
              border: "2px solid rgba(245,245,245,0.92)",
              boxShadow: "0px 0px 30px rgba(200,200,200,0.45)",
            }}
          />
          <button
            className="text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition"
            style={{
              backgroundColor: "#790000",
              boxShadow: "0px 0px 0px #ffffff, 0px 0px 220px #790000",
              overflow: "hidden",
            }}
            onClick={() => {
              if (slug) {
                window.open(
                  `https://planetterp.com/professor/${slug}`,
                  "_blank"
                );
              }
            }}
          >
            ✨ Visit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCard;
