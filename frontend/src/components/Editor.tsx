"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Save, FileOutput, Download } from "lucide-react";
import { toast } from "sonner";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { postTextContent } from "@/backend/server_posts/post";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";

interface LatexEditorProps {
  content: string | undefined;
  onChange: (content: string | undefined) => void;
  onRefresh: Dispatch<SetStateAction<string>>;
}

export default function LatexEditor({
  content,
  onChange,
  onRefresh,
}: LatexEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef<string | undefined>(content);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  async function handleSave(resume: string) {
    const data = await postTextContent(resume);
    onRefresh(resume);
  }

  function handleFocus() {
    console.log("handle focus");
    // add auto-save interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const currentContent = contentRef.current;
      if (currentContent !== undefined) {
        await handleSave(currentContent);
        toast.success("Content saved");
      }
    }, 10000);
  }

  async function handleBlur() {
    // clear auto-save interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const currentContent = contentRef.current;
    // save content
    if (!isSaving && currentContent !== undefined) {
      console.log("handle blur");
      setIsSaving(true);
      try {
        await handleSave(currentContent);
      } catch (error) {
        console.error("Error saving resume:", error);
      } finally {
        setIsSaving(false);
      }
    }
  }

  function handleMount(editor: editor.IStandaloneCodeEditor, monaco: any) {
    editor.onDidFocusEditorText(() => {
      console.log("focus");
      handleFocus();
    });

    editor.onDidBlurEditorText(async () => {
      console.log("blur");
      await handleBlur();
    });
  }

  function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".tex";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          onChange(text);
          toast.success(`${file.name} loaded successfully`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  function handleLatexDownload() {
    if (content === undefined) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.tex";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Your LaTeX file has been downloaded");
  }

  return (
    <div className="flex-1 flex flex-col bg-(--editor-bg) rounded-2xl h-full overflow-hidden">
      <div className="p-3 border-b border-border flex gap-2 shrink-0">
        <Button
          onClick={handleUpload}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload .tex
        </Button>
        <Button
          onClick={handleLatexDownload}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download .tex
        </Button>
        <Button
          onClick={async () => {
            if (content !== undefined) {
              await handleSave(content);
            }
          }}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>

      {/* <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full font-mono text-sm resize-none border-0 focus-visible:ring-0 bg-(--editor-bg) text-(--editor-text) whitespace-pre-wrap break-normal"
          placeholder="Enter your LaTeX code here..."
          onFocus={handleFocus}
          onBlur={handleBlur}
        /> */}
      <Editor
        height="90vh"
        defaultLanguage="latex"
        value={content ?? ""}
        onChange={(e) => onChange(e)}
        onMount={handleMount}
        options={{
          lineNumbers: "on",
          fontFamily: "monospace",
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: "on",
          wrappingIndent: "same",
          scrollbar: {
            vertical: "visible", // 'auto' | 'hidden' | 'visible'
            horizontal: "visible",
            useShadows: false, // disable scroll shadows
            verticalScrollbarSize: 8, // width of scrollbar in px
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false, // allows parent scroll if needed
          },
        }}
        className="bg-(--editor-bg) text-(--editor-text) whitespace-pre-wrap break-normal"
      />
    </div>
  );
}
