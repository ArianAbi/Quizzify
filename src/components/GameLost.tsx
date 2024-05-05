import { motion } from "framer-motion";

export default function GameLost({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.25 } }}
      className="absolute flex items-center justify-center w-full h-full left-0 top-0 backdrop-blur-md bg-black bg-opacity-20 z-[99999]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 0.35 } }}
        className="bg-black bg-opacity-60 flex flex-col gap-2 px-10 py-6 rounded-lg text-center"
      >
        <h2 className="font-bold text-lg md:text-2xl">You Have Lost :(</h2>

        <span className="my-4 text-base md:text-lg">
          your score was :{" "}
          <span className="font-semibold underline underline-offset-4">
            {score}
          </span>
        </span>

        <button
          className="text-lg md:text-2xl font-semibold p-4 rounded-md transition-all duration-150 bg-cyan-600 hover:bg-cyan-500 hover:scale-110"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>

        <a
          href="/"
          className="underline underline-offset-8 italic text-sky-400 text-base md:text-lg"
        >
          go to the menu
        </a>
      </motion.div>
    </motion.div>
  );
}
