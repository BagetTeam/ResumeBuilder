import { ZoomIn, ZoomOut, RefreshCw, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";

interface PdfViewerProps {
  pdfUrl: string;
  isLoading: boolean;
}

export default function PdfViewer({ pdfUrl, isLoading }: PdfViewerProps) {
  const [zoom, setZoom] = useState(100);

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
            <iframe
              src={pdfUrl}
              className="bg-(--editor-bg) shadow-(--shadow-pdf) rounded-sm"
              style={{
                width: `${(595 * zoom) / 100}px`,
                minHeight: `${(842 * zoom) / 100}px`,
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
              title="PDF Preview"
            />
          ) : (
            <>Invalid PDF</>
          )}
        </div>
      </div>
    </div>
  );
}
