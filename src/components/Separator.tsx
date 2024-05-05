import Check_Icon from "@/assets/icons/Check_Icon";
import X_Icon from "@/assets/icons/X_Icon";

export default function Separator({
  isTransitiong,
  answerWas,
}: {
  isTransitiong: boolean;
  answerWas: "correct" | "wrong";
}) {
  if (answerWas === "correct") {
    return (
      <div className="flex items-center justify-center absolute left-2/4 -translate-x-2/4 w-full h-full pointer-events-none z-40">
        <span
          className={`text-lg md:text-2xl font-semibold p-5 aspect-square rounded-full text-black z-[5] transition-all duration-500 h-16 w-16 md:w-20 md:h-20 relative
        ${isTransitiong ? "bg-emerald-500 text-white scale-125" : "bg-white"}`}
        >
          <span
            className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 transition-all duration-3 text-black
        ${isTransitiong ? "scale-0" : "scale-100"}`}
          >
            OR
          </span>

          <Check_Icon
            className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white transition-all duration-500
        ${isTransitiong ? "scale-100 rotate-0" : "scale-0 -rotate-[180deg]"}`}
          />
        </span>

        {/* divider */}
        <div
          className={`absolute h-full transition-[width] duration-500 rotate-90 sm:rotate-0
        ${isTransitiong ? "bg-emerald-500 w-3 md:w-4" : "bg-white w-1 md:w-2"}`}
        ></div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center absolute left-2/4 -translate-x-2/4 w-full h-full pointer-events-none z-40">
        <span
          className={`text-lg md:text-2xl font-semibold p-5 aspect-square rounded-full text-black z-[5] transition-all duration-500 h-16 w-16 md:w-20 md:h-20 relative
    ${isTransitiong ? "bg-red-500 text-white scale-125" : "bg-white"}`}
        >
          <span
            className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 transition-all duration-3 text-black
    ${isTransitiong ? "scale-0" : "scale-100"}`}
          >
            OR
          </span>

          <X_Icon
            className={`absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white transition-all duration-500
    ${isTransitiong ? "scale-100 rotate-0" : "scale-0 -rotate-[180deg]"}`}
          />
        </span>

        {/* divider */}
        <div
          className={`absolute h-full transition-[width] duration-500 rotate-90 sm:rotate-0
    ${isTransitiong ? "bg-red-500 w-3 md:w-4" : "bg-white w-1 md:w-2"}`}
        ></div>
      </div>
    );
  }
}
