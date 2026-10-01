import { BrowserRouter, Route, Routes, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shell } from "./components/Shell.tsx";
import { ProgressProvider } from "./progress.tsx";
import { HomePage } from "./pages/Home.tsx";
import { PathPage } from "./pages/Path.tsx";
import { DayPage } from "./pages/DayPage.tsx";
import { SongListPage, SongPage } from "./pages/Songs.tsx";
import { RagaPage } from "./pages/Ragas.tsx";
import { GymPage } from "./pages/Gym.tsx";
import { PracticePage } from "./pages/Practice.tsx";
import { EarPage } from "./pages/Ear.tsx";
import { ChordsPage } from "./pages/Chords.tsx";
import { CoachPage } from "./pages/Coach.tsx";
import { WatchPage } from "./pages/Watch.tsx";
import { TrainPage } from "./pages/Train.tsx";

function ScrollUp() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

function Missing() {
  return (
    <div className="lesson">
      <h1>Nothing at this address.</h1>
      <Link to="/">Back to the start</Link>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <ScrollUp />
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/path" element={<PathPage />} />
            <Route path="/day/:id" element={<DayPage />} />
            <Route path="/songs" element={<SongListPage />} />
            <Route path="/songs/:id" element={<SongPage />} />
            <Route path="/ragas" element={<RagaPage />} />
            <Route path="/gym" element={<GymPage />} />
            <Route path="/ear" element={<EarPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/train" element={<TrainPage />} />
            <Route path="/chords" element={<ChordsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="*" element={<Missing />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </ProgressProvider>
  );
}
