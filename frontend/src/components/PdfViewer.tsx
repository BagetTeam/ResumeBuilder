"use client";

import { ZoomIn, ZoomOut, RefreshCw, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfUrl: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PdfViewer({
  pdfUrl,
  isLoading,
  setIsLoading,
}: PdfViewerProps) {
  const [zoom, setZoom] = useState(100);

  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pdfUrl) return;

    async function loadPdf() {
      setIsLoading(true);
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

      if (pdfContainerRef.current) {
        pdfContainerRef.current.innerHTML = "";
      }

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoom / 100 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          canvas,
          viewport,
        };
        await page.render(renderContext).promise;

        pdfContainerRef.current?.appendChild(canvas);
      }

      setIsLoading(false);
    }

    loadPdf();
  }, [pdfUrl, zoom]);

  return (
    <div className="flex-1 flex flex-col bg-background rounded-2xl h-full overflow-hidden">
      <div className="p-3 border-b border-border flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm text-(--editor-text) px-2 text-center">
            {zoom}%
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="default" size="sm" className="gap-2">
            <FileOutput className="h-4 w-4" />
            Generate PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-2 border border-border gap-3"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm text-(--editor-text) text-center">
              Refresh
            </span>
          </Button>
        </div>
      </div>

      <div className="text-editor-text mb-5 h-full overflow-auto">
        <div className="flex-1 overflow-hidden p-8 flex items-start justify-center">
          {isLoading ? (
            <Spinner />
          ) : pdfUrl && pdfUrl !== "" ? (
            <div
              ref={pdfContainerRef}
              className="bg-(--editor-bg) shadow-(--shadow-pdf) rounded-sm"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            />
          ) : (
            <>Invalid PDF</>
          )}
        </div>
      </div>
    </div>
  );
}
