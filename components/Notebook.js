"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { experimental_useOptimistic as useOptimistic } from "react";

const CustomEditor = dynamic(() => import("@/components/EditorComponent"), {
  ssr: false,
});

function Notebook({ notes, user }) {
  const [optimisticNotes, setOptimisticNote] = useOptimistic(
    notes,
    (state, newNote) => {
      if (typeof newNote === "string") {
        return state.filter((note) => note.id !== newNote);
      }

      return [...state, newNote];
    }
  );
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (optimisticNotes?.length > 0 && note === null) {
      setNote(optimisticNotes[0]);
    }
  }, [optimisticNotes]);

  return (
    <Sidebar
      notes={optimisticNotes}
      setNotes={setOptimisticNote}
      selected={note}
      setNote={setNote}
      user={user}
    >
      {notes?.length > 0 && <CustomEditor note={note} />}
    </Sidebar>
  );
}

export default Notebook;
