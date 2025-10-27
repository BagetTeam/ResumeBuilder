import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PdfViewerProps {
  latexContent: string;
}

export default function PdfViewer({ latexContent }: PdfViewerProps) {
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

      <div className="text-editor-text mb-5 h-full overflow-auto">
        <div className="flex-1 overflow-hidden p-8 flex items-start justify-center">
          <div
            className="bg-(--editor-bg) shadow-(--shadow-pdf) rounded-sm"
            style={{
              width: `${(595 * zoom) / 100}px`,
              minHeight: `${(842 * zoom) / 100}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            <p className="font-mono text-xs whitespace-pre-wrap break-all h-full">
              {latexContent.substring(0, 300)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
