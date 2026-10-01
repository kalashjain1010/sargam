import { useState } from "react";
import { videosFor } from "../videos.ts";
import type { VideoClip } from "../videos.ts";

export function VideoEmbed({ video }: { video: VideoClip }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="video-card">
      <figcaption>
        <strong>{video.title}</strong>
        <em>{video.by}</em>
        <p>{video.why}</p>
      </figcaption>
      {on ? (
        <div className="video-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
            title={`${video.title} · ${video.by}`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <button type="button" className="video-poster" onClick={() => setOn(true)}>
          <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" />
          <span className="video-play">Load video</span>
          <small>Opens {video.by} inside this page. YouTube cookies load only after you tap.</small>
        </button>
      )}
    </figure>
  );
}

export function LessonVideos({ topics }: { topics: string[] }) {
  const list = videosFor(topics);
  if (list.length === 0) return null;
  return (
    <section className="video-block">
      <h2>Watch, then play</h2>
      <p className="muted">Optional. The day still works if you skip it. These are public lessons, not copies of songs.</p>
      {list.map((video) => (
        <VideoEmbed key={video.id} video={video} />
      ))}
    </section>
  );
}
