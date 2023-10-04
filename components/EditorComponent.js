"use client";

import React from "react";
import { Editor } from "novel";

import constants from "@/config/constants";
import addDocument from "@/firebase/firestore/addDocument";

const EditorComponent = ({ note }) => {
  const saveData = async (data) => {
    await addDocument(constants.collections.notes, data, note.id);
  };

  const handleEditorChange = async (value) => {
    await saveData(value.getJSON());
  };

  return (
    <Editor
      key={note.id}
      disableLocalStorage={true}
      debounceDuration={1000}
      onDebouncedUpdate={handleEditorChange}
      className="h-full w-[-webkit-fill-available] lg:absolute lg:top-[70px] lg:left-[287px]"
      defaultValue={note}
    />
  );
};

export default EditorComponent;
