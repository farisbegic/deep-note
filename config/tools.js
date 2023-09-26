import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Checklist from "@editorjs/checklist";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";
import AskAITool from "@/tools/AskAITool";

const tools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Header",
    },
    shortcut: "CMD+SHIFT+H",
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L",
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  code: {
    class: CodeTool,
    shortcut: "CMD+SHIFT+C",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C",
  },
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: "CMD+ALT+T",
  },
  askAI: AskAITool,
};

export default tools;
