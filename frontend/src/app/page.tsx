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
        const response = await fetch("http://localhost:8000/test");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTest(data["Hello"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="h-full">
      <Navbar />
      {/* {test["Hello"]} */}
      <div className="flex flex-1 flex-row gap-4 bg-blue-900 p-5 min-h-full">
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
