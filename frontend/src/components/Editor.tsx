"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Save, FileOutput } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";

interface LatexEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function LatexEditor({ content, onChange }: LatexEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    // Moved to outside root div
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  }

  function autoSave() {
    if (isFocused) {
      onChange(content);
    }
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

  function handleSave() {
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
          onClick={handleSave}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="default" size="sm" className="gap-2">
          <FileOutput className="h-4 w-4" />
          Generate PDF
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full font-mono text-sm resize-none border-0 focus-visible:ring-0 bg-(--editor-bg) text-(--editor-text) whitespace-pre-wrap break-normal"
          placeholder="Enter your LaTeX code here..."
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
