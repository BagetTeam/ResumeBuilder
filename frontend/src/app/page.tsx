"use client";
import LatexEditor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import PdfViewer from "@/components/PdfViewer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [test, setTest] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/resume");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTest(data["resume"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="h-screen">
      <Navbar />
      {/* {test["Hello"]} */}
      <div className="flex flex-1 flex-row gap-4 bg-(--bg-primary) p-5 overflow-hidden h-full">
        <LatexEditor
          content={test}
          onChange={(content) => {
            setTest(content);
            // toast.success(`Content updated to ${content}`);
          }}
        />
        <PdfViewer latexContent={test} />
      </div>
    </div>
  );
}
