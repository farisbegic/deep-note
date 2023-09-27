"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { experimental_useOptimistic as useOptimistic } from "react";
import constants from "@/config/constants";

const CustomEditor = dynamic(() => import("@/components/EditorComponent"), {
  ssr: false,
});

function Notebook({ notes, user }) {
  const [note, setNote] = useState(null);
  const [optimisticNotes, setOptimisticNotes] = useOptimistic(
    notes,
    (state, newNote) => {
      switch (newNote.type) {
        case constants.operations.add:
          return [...state, newNote.data];
        case constants.operations.delete:
          return state.filter((note) => note.id !== newNote.data);
        case constants.operations.edit:
          return state.map((note) => {
            if (note.id === newNote.data.id) {
              return { ...note, name: newNote.data.name };
            }
            return note;
          });
      }
    }
  );

  useEffect(() => {
    if (optimisticNotes.length > 0) {
      setNote(
        optimisticNotes.find((note) => note.id === optimisticNotes[0].id)
      );
    }

    if (optimisticNotes.length === 0) {
      setNote(null);
    }
  }, [notes]);

  return (
    <Sidebar
      notes={optimisticNotes}
      setNotes={setOptimisticNotes}
      selected={note}
      setNote={setNote}
      user={user}
    >
      {note && <CustomEditor note={note} />}
    </Sidebar>
  );
}

export default Notebook;
