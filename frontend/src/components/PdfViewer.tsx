import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PdfViewerProps {
  latexContent: string;
}

export default function PdfViewer({ latexContent }: PdfViewerProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex-1 flex flex-col bg-background rounded-2xl min-h-full">
      <div className="p-3 border-b border-border flex gap-2 items-center">
        <Button
          onClick={() => setZoom(Math.max(50, zoom - 10))}
          variant="outline"
          size="sm"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          onClick={() => setZoom(Math.min(200, zoom + 10))}
          variant="outline"
          size="sm"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="ml-2">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        <div
          className="bg-editor-bg shadow-2xl rounded-sm"
          style={{
            width: `${(595 * zoom) / 100}px`,
            minHeight: `${(842 * zoom) / 100}px`,
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div className="p-12 text-editor-text">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">PDF Preview</h1>
              <p className="text-sm text-muted-foreground">
                Enable backend to compile LaTeX to PDF
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground italic">
                Your LaTeX document will be rendered here once compilation is
                enabled.
              </p>
              <div className="mt-8 p-4 border border-border rounded">
                <p className="font-mono text-xs whitespace-pre-wrap break-all">
                  {latexContent.substring(0, 300)}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
