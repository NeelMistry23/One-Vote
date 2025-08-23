import { createContext, useState } from "react";

export const PollContext = createContext();

export function PollProvider({ children }) {
  const [pollId, setPollId] = useState(null); 
  return (
    <PollContext.Provider value={{ pollId, setPollId }}>
      {children}
    </PollContext.Provider>
  );
}
