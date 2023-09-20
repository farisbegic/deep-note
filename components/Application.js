"use client";

import React, { useState } from "react";
import EditorComponent from "@/components/EditorComponent";
import Sidebar from "@/components/Sidebar";

function Application({ notes }) {
  const [note, setNote] = useState(notes[0]);
  return (
    <Sidebar notes={notes} selected={note} setNote={setNote}>
      <EditorComponent note={note} />
    </Sidebar>
  );
}

export default Application;
