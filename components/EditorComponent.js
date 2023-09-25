"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import tools from "@/config/tools";

import add from "@/firebase/firestore/add";
import constants from "@/config/constants";
import useDebounce from "@/hooks/useDebounce";

const EditorComponent = ({ note }) => {
  const editorInstance = useRef(null);

  const saveData = async (data) => {
    await add(constants.collection, data, note.id);
  };

  const handleEditorChange = async () => {
    const data = await editorInstance.current.save();
    debouncedSaveData(data);
  };

  const debouncedSaveData = useDebounce(saveData, 4000);

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

  return <div className="lg:px-10 p-5 h-full" id="editorjs" />;
};

export default EditorComponent;
