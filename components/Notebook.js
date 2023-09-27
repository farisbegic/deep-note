"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/EditorComponent"), {
  ssr: false,
});

function Notebook({ notes, user }) {
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (notes?.length > 0 && note === null) {
      setNote(notes[0]);
    }
  }, [notes]);

  return (
    <Sidebar notes={notes} selected={note} setNote={setNote} user={user}>
      {notes?.length > 0 && <CustomEditor note={note} />}
    </Sidebar>
  );
}

export default Notebook;
