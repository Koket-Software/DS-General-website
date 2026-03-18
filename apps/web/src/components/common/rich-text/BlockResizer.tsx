import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getCursor(direction: string) {
  if (direction === "nw" || direction === "se") return "nwse-resize";
  if (direction === "ne" || direction === "sw") return "nesw-resize";
  if (direction === "n" || direction === "s") return "ns-resize";
  return "ew-resize";
}

function Handle({
  direction,
  onResize,
}: {
  direction: string;
  onResize: (event: PointerEvent, direction: string) => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto absolute z-10 h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm transition-transform hover:scale-110",
        direction.includes("n") && "-top-2",
        direction.includes("s") && "-bottom-2",
        direction.includes("w") && "-left-2",
        direction.includes("e") && "-right-2",
        (direction === "n" || direction === "s") && "left-1/2 -translate-x-1/2",
        (direction === "e" || direction === "w") && "top-1/2 -translate-y-1/2",
      )}
      style={{ cursor: getCursor(direction), touchAction: "none" }}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onResize(event.nativeEvent, direction);
      }}
    />
  );
}

type BlockResizerProps = {
  maxWidth?: number;
  onResizeEnd: (width: number, height: number) => void;
  onResizeStart: () => void;
  targetRef: RefObject<HTMLElement | null>;
};

export function BlockResizer({
  maxWidth,
  onResizeEnd,
  onResizeStart,
  targetRef,
}: BlockResizerProps): React.JSX.Element {
  const [isResizing, setIsResizing] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handlePointerDown = useCallback(
    (event: PointerEvent, direction: string) => {
      const target = targetRef.current;
      if (!target) {
        return;
      }

      onResizeStart();
      setIsResizing(true);

      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = target.offsetWidth;
      const startHeight = target.offsetHeight;
      const aspectRatio = startHeight > 0 ? startWidth / startHeight : 1;

      let nextWidth = startWidth;
      let nextHeight = startHeight;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const activeTarget = targetRef.current;
        if (!activeTarget) {
          return;
        }

        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        let width = startWidth;
        let height = startHeight;

        if (direction.includes("e")) {
          width = startWidth + deltaX;
        } else if (direction.includes("w")) {
          width = startWidth - deltaX;
        }

        if (direction.includes("s")) {
          height = startHeight + deltaY;
        } else if (direction.includes("n")) {
          height = startHeight - deltaY;
        }

        if (direction.length === 2) {
          if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            height = width / aspectRatio;
          } else {
            width = height * aspectRatio;
          }
        }

        width = clamp(width, 48, maxWidth ?? 800);
        height = Math.max(width / aspectRatio, 48);

        nextWidth = width;
        nextHeight = height;

        activeTarget.style.width = `${width}px`;
        activeTarget.style.height = `${height}px`;
      };

      const handlePointerUp = () => {
        setIsResizing(false);
        onResizeEnd(nextWidth, nextHeight);
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
        cleanupRef.current = null;
      };

      cleanupRef.current = () => {
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [maxWidth, onResizeEnd, onResizeStart, targetRef],
  );

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <>
      {isResizing ? (
        <div className="fixed inset-0 z-50 cursor-nwse-resize select-none" />
      ) : null}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border-2 border-primary transition-opacity",
          isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Handle direction="nw" onResize={handlePointerDown} />
        <Handle direction="n" onResize={handlePointerDown} />
        <Handle direction="ne" onResize={handlePointerDown} />
        <Handle direction="e" onResize={handlePointerDown} />
        <Handle direction="se" onResize={handlePointerDown} />
        <Handle direction="s" onResize={handlePointerDown} />
        <Handle direction="sw" onResize={handlePointerDown} />
        <Handle direction="w" onResize={handlePointerDown} />
      </div>
    </>
  );
}
