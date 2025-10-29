"use client";
import LatexEditor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import PdfViewer from "@/components/PdfViewer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [resumeContent, setResumeContent] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const localData =
          typeof window !== "undefined"
            ? localStorage.getItem("resumeContent")
            : "";
        if (localData && localData !== "") {
          setResumeContent(localData);
          // console.log("Loaded local data");
          return;
        }
        // if no local data, fetch from server
        const response = await fetch("http://localhost:8000/resume");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResumeContent(data["resume"]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeContent", resumeContent);
  }, [resumeContent]);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-1 flex-row gap-4 bg-(--bg-primary) p-5 overflow-hidden h-full">
        <LatexEditor
          content={resumeContent}
          onChange={(content) => {
            setResumeContent(content);
          }}
        />
        <PdfViewer latexContent={resumeContent} />
      </div>
    </div>
  );
}
