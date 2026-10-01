import { useMemo, useState } from "react";
import { VideoEmbed } from "../components/VideoEmbed.tsx";
import { VIDEOS } from "../videos.ts";

export function WatchPage() {
  const topics = ["All", ...Array.from(new Set(VIDEOS.flatMap((video) => video.topics)))];
  const [filter, setFilter] = useState("All");
  const list = useMemo(() => (filter === "All" ? VIDEOS : VIDEOS.filter((video) => video.topics.includes(filter))), [filter]);

  return (
    <div className="home wide">
      <p className="eyebrow">Video desk · {VIDEOS.length} lessons</p>
      <h1>Watch a teacher, then come back and tap the neck.</h1>
      <p className="lede">
        These are public YouTube lessons, loaded inside Sargam when you ask. Nothing is copied. The path still works if you never press play. Pick the topic you are stuck on.
      </p>
      <div className="chips">
        {topics.map((topic) => (
          <button key={topic} type="button" className={`chip ${filter === topic ? "on" : ""}`} onClick={() => setFilter(topic)}>
            {topic === "All" ? "All" : topic.charAt(0).toUpperCase() + topic.slice(1)}
          </button>
        ))}
      </div>
      {list.map((video) => (
        <VideoEmbed key={video.id} video={video} />
      ))}
    </div>
  );
}
