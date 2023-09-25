"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("@/components/EditorComponent"), {
  ssr: false,
});

function Application({ notes }) {
  const [note, setNote] = useState(notes[0]);
  return (
    <Sidebar notes={notes} selected={note} setNote={setNote}>
      <CustomEditor note={note} />
    </Sidebar>
  );
}

export default Application;
