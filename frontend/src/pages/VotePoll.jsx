import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api.js";

export default function VotePoll() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await API.get(`/${id}`);
        if (res.data && res.data.poll) {
          setData(res.data);
        } else {
          setData(null);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

 const handleVote = async (optionId) => {
  try {
    await API.post(`/${id}/vote`, { optionId });
    navigate(`/results/${id}`, { replace: true });  
  } catch (err) {
    alert("Error submitting vote. Please try again.");
  }
};


  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-500">No poll yet created.</p>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">{data.poll.question}</h2>
      <div className="grid gap-3">
        {data.options && data.options.length > 0 ? (
          data.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className="w-full text-left border rounded-xl px-4 py-3 hover:bg-slate-50"
            >
              {opt.option_text}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No options available for this poll.</p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => navigate(`/results/${id}`)}
          className="bg-slate-900 text-white rounded-xl px-4 py-2"
        >
          View Results
        </button>
      </div>
    </div>
  );
}


