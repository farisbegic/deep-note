"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import Warning from "@editorjs/warning";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";

import add from "@/firebase/firestore/add";
import constants from "@/config/constants";
import { debounce } from "lodash";

const EditorComponent = ({ note }) => {
  const editorInstance = useRef(null);

  const saveData = async (api) => {
    const data = await api.saver.save();
    await add(constants.collection, { data }, note.id);
  };

  const debouncedSaveData = debounce(saveData, 10000);

  const initializeEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onChange: debouncedSaveData,
      onReady: () => {
        editorInstance.current = editor;
      },
      data: note?.data,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ["marker", "link"],
          config: {
            placeholder: "Header",
          },
          shortcut: "CMD+SHIFT+H",
        },
        image: SimpleImage,
        list: {
          class: List,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+L",
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
          shortcut: "CMD+SHIFT+O",
        },
        warning: Warning,
        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
        code: {
          class: CodeTool,
          shortcut: "CMD+SHIFT+C",
        },
        delimiter: Delimiter,
        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+C",
        },
        linkTool: LinkTool,
        embed: Embed,
        table: {
          class: Table,
          inlineToolbar: true,
          shortcut: "CMD+ALT+T",
        },
      },
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
      editorInstance.current.render(note.data);
    }
  }, [note]);

  return <div className="lg:px-10 p-5 h-full" id="editorjs" />;
};

export default EditorComponent;
