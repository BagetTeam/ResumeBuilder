"use client";
import { getPDFDisplay } from "@/backend/server_posts/post";
import LatexEditor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import PdfViewer from "@/components/PdfViewer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type HomeProps = {
  initialPdfResumeContent: string;
};

export default function Home({ initialPdfResumeContent }: HomeProps) {
  const [resumeContent, setResumeContent] = useState(initialPdfResumeContent);
  const [pdfResumeContent, setPdfResumeContent] = useState(
    initialPdfResumeContent
  );
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    loadPDF();
  }, [pdfResumeContent]);

  useEffect(() => {
    localStorage.setItem("resumeContent", resumeContent);
  }, [resumeContent]);

  async function loadPDF() {
    if (pdfLoading) return;
    try {
      setPdfLoading(true);
      const data = await getPDFDisplay(pdfResumeContent);
      if (data?.pdf) {
        // Convert base64 to data URL
        const dataUrl = `data:application/pdf;base64,${data.pdf}`;
        setPdfUrl(dataUrl);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load PDF");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex flex-1 flex-row gap-4 bg-(--bg-primary) p-5 overflow-hidden h-full">
        <LatexEditor
          content={resumeContent}
          onChange={(content) => {
            setResumeContent(content);
          }}
          onRefresh={setPdfResumeContent}
        />
        <PdfViewer
          pdfUrl={pdfUrl}
          isLoading={pdfLoading}
          setIsLoading={setPdfLoading}
        />
      </div>
    </div>
  );
}
