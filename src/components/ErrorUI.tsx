export default function ErrorUI() {
  return (
    <div className="relative text-center bg-red-600 saturate-[0.65] h-full w-full flex items-center justify-center foreground-pattern-scroll after:hidden before:z-0 before:bg-[size:30%] md:before:bg-[size:15%]">
      {/* github link */}
      <a
        className="absolute right-4 top-4 w-10 sm:w-12 shadow-lg drop-shadow-sm bg-black p-2 rounded-full transition-all duration-150 hover:scale-110 hover:shadow-xl hover:drop-shadow-lg"
        href="https://github.com/ArianAbi/Quizzify"
      >
        <img className="invert" src="/github.svg" alt="github-link" />
      </a>

      <div className="flex flex-col gap-2 items-center justify-center bg-black p-4 z-10 rounded-lg bg-opacity-50 backdrop-blur-md">
        <h2 className="text-lg md:text-2xl font-bold">There Was an Error :(</h2>
        <span className="text-base md:text-lg mt-2">
          this app uses{" "}
          <span className="underline underline-offset-4 font-semibold bg-emerald-600 px-2 py-1 rounded-sm">
            Spotify
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-4 font-semibold saturate-200 bg-red-500 px-2 py-1 rounded-sm">
            Youtube's
          </span>{" "}
          api.
        </span>
        <span className="text-base md:text-lg">
          if you are visiting from Iran make sure you have your{" "}
          <span className="underline underline-offset-4 font-semibold">
            VPN Turned ON
          </span>
        </span>

        <button
          className="mt-6 bg-sky-500 font-semibold text-lg px-4 py-2 rounded-lg transition-all z-20 duration-150 hover:scale-110 shadow-md hover:drop-shadow-lg hover:shadow-xl"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
