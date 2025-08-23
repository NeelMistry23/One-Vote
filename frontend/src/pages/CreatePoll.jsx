import { useState, useContext } from "react";
import API from "../api.js";
import { QRCodeCanvas } from "qrcode.react";
import { PollContext } from "../PollContext.jsx";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [optionInputs, setOptionInputs] = useState([""]);
  const [expiryHours, setExpiryHours] = useState(24);
  const [shareUrl, setShareUrl] = useState("");

  const { setPollId } = useContext(PollContext);

  const handleCreate = async () => {
    if (!question.trim() || optionInputs.every(o => !o.trim())) {
      alert("Please enter a question and at least one option.");
      return;
    }

    const expiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
    const options = optionInputs.filter(o => o.trim().length > 0);

    try {
      const res = await API.post("/create", { question, options, expiry });
      const fullUrl = `${window.location.origin}/vote/${res.data.id}`;

      setShareUrl(fullUrl);
      setPollId(res.data.id); // ✅ store new poll id globally
    } catch (err) {
      console.error("Error creating poll:", err);
      alert("Something went wrong. Please try again.");
    }
  };

 return (
  <div className="bg-white rounded-2xl shadow p-6">
    <h1 className="text-2xl font-semibold mb-4">Create a Poll</h1>

    <div className="flex flex-col md:flex-row gap-8">
      {/* Left: Poll form */}
      <div className="flex-1">
        {/* Question */}
        <label className="block text-sm mb-1">Question</label>
        <input
          className="w-full border rounded-xl px-3 py-2 mb-4"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />

        {/* Options */}
        <label className="block text-sm mb-1">Options</label>
        <div className="grid gap-2 mb-2">
          {optionInputs.map((opt, i) => (
            <input
              key={i}
              className="w-full border rounded-xl px-3 py-2"
              value={opt}
              onChange={e => {
                const copy = [...optionInputs];
                copy[i] = e.target.value;
                setOptionInputs(copy);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOptionInputs([...optionInputs, ""])}
          className="bg-slate-900 text-white rounded-xl px-4 py-2 text-sm mb-4"
        >
          + Add Option
        </button>

        {/* Expiry */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm">Expiry (hours)</span>
          <input
            type="number"
            min="1"
            className="border rounded-xl px-3 py-2 w-24"
            value={expiryHours}
            onChange={e => setExpiryHours(Number(e.target.value))}
          />
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="bg-slate-900 text-white rounded-xl px-4 py-2"
        >
          Generate Link
        </button>
      </div>

      {/* Right: Share poll */}
      {shareUrl && (
        <div className="flex-1 text-center md:border-l md:pl-8">
          <p className="text-sm mb-2">Share this poll</p>
          <a
            href={shareUrl}
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {shareUrl}
          </a>
          <div className="mt-4 flex justify-center">
            <QRCodeCanvas value={shareUrl} size={128} />
          </div>
        </div>
      )}
    </div>
  </div>
);
}



