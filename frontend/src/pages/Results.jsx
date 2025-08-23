import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import API from "../api.js";

export default function Results() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await API.get(`/${id}/results`);
      setPoll(res.data.poll);
      setOptions(res.data.options);
    } catch (err) {
      console.error("Error fetching results", err);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const total = useMemo(
    () => options.reduce((s, o) => s + Number(o.votes || 0), 0),
    [options]
  );

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* ✅ Show poll question & id */}
      {poll && (
        <>
          <h2 className="text-2xl font-semibold mb-1">{poll.question}</h2>
          <p className="text-sm text-slate-500 mb-4">Poll ID: {poll.id}</p>
        </>
      )}

      <h3 className="text-xl font-semibold mb-4">Live Results</h3>
      <div className="grid gap-4">
        {options.map((o) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0;
          return (
            <div key={o.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{o.option_text}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-2 bg-slate-900"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-xs text-slate-600 mt-1">{o.votes} votes</div>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-slate-600 mt-4">Total votes: {total}</div>
    </div>
  );
}
