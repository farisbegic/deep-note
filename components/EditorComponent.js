"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import tools from "@/config/tools";

import constants from "@/config/constants";
import useDebounce from "@/hooks/useDebounce";
import addDocument from "@/firebase/firestore/addDocument";

const EditorComponent = ({ note }) => {
  const editorInstance = useRef(null);
  const latestNoteId = useRef(note.id);

  const saveData = async (data) => {
    await addDocument(constants.collections.notes, data, latestNoteId.current);
  };

  const handleEditorChange = async () => {
    const data = await editorInstance.current.save();
    debouncedSaveData(data);
  };

  const debouncedSaveData = useDebounce(saveData, 2000);

  const initializeEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Write your post content here...",
      onChange: handleEditorChange,
      onReady: () => {
        editorInstance.current = editor;
      },
      data: note,
      tools: tools,
    });
  };

  useEffect(() => {
    if (editorInstance.current === null) {
      initializeEditor();
    }

    return () => {
      editorInstance?.current?.destroy();
      editorInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current === null) {
      return;
    }

    if (editorInstance.current.isReady) {
      editorInstance.current.render(note);
    }
  }, [note]);

  useEffect(() => {
    latestNoteId.current = note.id;
  }, [note.id]);

  return <div className="flex-grow-0 p-5 w-full h-full" id="editorjs" />;
};

export default EditorComponent;
