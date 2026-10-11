"use client";
import Quill, { QuillOptions } from "quill";
import  {Delta, Op} from "quill/core"
import "react-quill-new/dist/quill.snow.css";
import { RefObject, useEffect, useLayoutEffect, useRef } from "react";

interface ContentEditorProps {
  defaultValue?: Delta | Op[]
  onChange: (contentJson: string) => void;
  placeholder?: string;
  innerRef?: RefObject<Quill | null>;
}

const TOOLBAR_OPTIONS = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote"],
  ["link"],
];

export default function ContentEditor({
  defaultValue = [],
  onChange,
  placeholder = "Start typing…",
  innerRef,
}: ContentEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const defaultValueRef = useRef(defaultValue);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder,
      modules: { toolbar: TOOLBAR_OPTIONS },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    if (innerRef) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);

    quill.on(Quill.events.TEXT_CHANGE, () => {
      onChangeRef.current(JSON.stringify(quill.getContents()));
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      container.innerHTML = "";
      quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, []); // mount once per component instance — remount handled by `key` upstream, same pattern as your other editors

  return <div ref={containerRef} className="ql-custom" />;
}