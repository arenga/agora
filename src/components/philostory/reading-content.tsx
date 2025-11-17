"use client";

import { useState, useCallback, useRef } from "react";
import { Highlighter, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface Highlight {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  note: string | null;
  color: string;
}

interface ReadingContentProps {
  content: string;
  highlights?: Highlight[];
  onAddHighlight?: (highlight: Omit<Highlight, "id">) => void;
}

const highlightColors = [
  { name: "노란색", value: "#fef08a" },
  { name: "초록색", value: "#bbf7d0" },
  { name: "파란색", value: "#bfdbfe" },
  { name: "분홍색", value: "#fecdd3" },
  { name: "보라색", value: "#ddd6fe" },
];

export function ReadingContent({
  content,
  highlights = [],
  onAddHighlight,
}: ReadingContentProps) {
  const { user } = useAuthStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(highlightColors[0].value);
  const [note, setNote] = useState("");

  const handleMouseUp = useCallback(() => {
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.isCollapsed) {
      setShowToolbar(false);
      return;
    }

    const selectedText = windowSelection.toString().trim();
    if (!selectedText || selectedText.length < 3) {
      setShowToolbar(false);
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Get offsets relative to content
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(contentElement);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = preSelectionRange.toString().length;
    const endOffset = startOffset + selectedText.length;

    setSelection({
      text: selectedText,
      startOffset,
      endOffset,
    });

    setToolbarPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowToolbar(true);
  }, []);

  const handleHighlight = useCallback(() => {
    if (!user) {
      toast.error("로그인이 필요합니다");
      return;
    }
    setShowNoteDialog(true);
    setShowToolbar(false);
  }, [user]);

  const handleSaveHighlight = useCallback(() => {
    if (!selection) return;

    onAddHighlight?.({
      text: selection.text,
      startOffset: selection.startOffset,
      endOffset: selection.endOffset,
      note: note.trim() || null,
      color: selectedColor,
    });

    setShowNoteDialog(false);
    setNote("");
    setSelection(null);
    window.getSelection()?.removeAllRanges();
    toast.success("하이라이트가 저장되었습니다");
  }, [selection, note, selectedColor, onAddHighlight]);

  // Apply highlights to content
  const renderContent = useCallback(() => {
    if (highlights.length === 0) {
      return content.split("\n").map((paragraph, index) => (
        <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ));
    }

    // Sort highlights by start offset
    const sortedHighlights = [...highlights].sort(
      (a, b) => a.startOffset - b.startOffset
    );

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    sortedHighlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.startOffset > lastIndex) {
        const beforeText = content.slice(lastIndex, highlight.startOffset);
        parts.push(
          <span key={`text-${idx}`}>
            {beforeText.split("\n").map((p, i) => (
              <span key={i}>
                {p}
                {i < beforeText.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      }

      // Add highlighted text
      parts.push(
        <mark
          key={`highlight-${highlight.id}`}
          style={{ backgroundColor: highlight.color }}
          className="px-0.5 rounded cursor-pointer relative group"
          title={highlight.note || undefined}
        >
          {highlight.text}
          {highlight.note && (
            <MessageSquareQuote className="inline-block h-3 w-3 ml-1 text-muted-foreground" />
          )}
        </mark>
      );

      lastIndex = highlight.endOffset;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      parts.push(
        <span key="text-end">
          {remainingText.split("\n").map((p, i) => (
            <span key={i}>
              {p}
              {i < remainingText.split("\n").length - 1 && <br />}
            </span>
          ))}
        </span>
      );
    }

    return parts;
  }, [content, highlights]);

  return (
    <>
      <div
        ref={contentRef}
        className="prose prose-lg max-w-none text-foreground leading-relaxed"
        onMouseUp={handleMouseUp}
      >
        {renderContent()}
      </div>

      {/* Selection Toolbar */}
      {showToolbar && (
        <div
          className="fixed z-50 bg-card border rounded-lg shadow-lg p-2 flex gap-2"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={handleHighlight}
            className="gap-1"
          >
            <Highlighter className="h-4 w-4" />
            하이라이트
          </Button>
        </div>
      )}

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>하이라이트 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">선택한 텍스트:</p>
              <p className="bg-muted p-3 rounded text-sm italic">
                &ldquo;{selection?.text}&rdquo;
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">색상 선택:</p>
              <div className="flex gap-2">
                {highlightColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-transform",
                      selectedColor === color.value
                        ? "scale-110 border-foreground"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                메모 (선택사항):
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="이 구절에 대한 생각을 적어보세요..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowNoteDialog(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleSaveHighlight}
                className="bg-accent hover:bg-accent/90"
              >
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
