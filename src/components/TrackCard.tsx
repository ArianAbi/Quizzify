import { tracksType } from "../../types/type";

export default function TrackCard({ track }: { track: tracksType }) {
  return (
    <div className="text-xl font-bold overflow-hidden h-full w-full relative flex flex-col gap-6 justify-center items-center group">
      <img
        className="absolute left-0 top-0 w-full h-full z-[-1] object-cover transition-all brightness-75 group-hover:brightness-50"
        src={track.album.images[1].url}
      />
      <h2>{track.name}</h2>
      <h2>by {track.artists[0].name}</h2>
      <span className="absolute bottom-8 left-2/4 -translate-x-2/4">
        {track.duration_ms} ms
      </span>
    </div>
  );
}
