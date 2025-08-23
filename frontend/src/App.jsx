import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll.jsx";
import VotePoll from "./pages/VotePoll.jsx";
import Results from "./pages/Results.jsx";
import { PollProvider, PollContext } from "./PollContext.jsx";
import { useContext } from "react";

function Navigation() {
  const { pollId } = useContext(PollContext);

  return (
    <nav className="flex gap-2 mb-6">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-3 py-1 rounded-full ${
            isActive ? "bg-slate-900 text-white" : "bg-slate-200"
          }`
        }
      >
        Create
      </NavLink>

      {pollId && (
        <>
          <NavLink
            to={`/vote/${pollId}`}
            className={({ isActive }) =>
              `px-3 py-1 rounded-full ${
                isActive ? "bg-slate-900 text-white" : "bg-slate-200"
              }`
            }
          >
            Vote
          </NavLink>

          <NavLink
            to={`/results/${pollId}`}
            className={({ isActive }) =>
              `px-3 py-1 rounded-full ${
                isActive ? "bg-slate-900 text-white" : "bg-slate-200"
              }`
            }
          >
            Results
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <PollProvider>
      <BrowserRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Navigation />

          <Routes>
            <Route path="/" element={<CreatePoll />} />
            <Route path="/vote/:id" element={<VotePoll />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PollProvider>
  );
}
