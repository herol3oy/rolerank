import SearchBox from "./components/SearchBox";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Role<span className="text-yellow-400">Rank</span>
          </h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-base">
            Search an actor and see all their movies ranked by IMDB rating.
          </p>
        </div>
        <SearchBox />
      </div>
    </main>
  );
}
