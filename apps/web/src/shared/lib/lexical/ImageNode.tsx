import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

import { BlockResizer } from "@/components/common/rich-text/BlockResizer";
import { cn } from "@/lib/utils";

export type ImageDimension = number | string;

export type ImagePayload = {
  src: string;
  altText?: string;
  width?: ImageDimension;
  height?: ImageDimension;
};

export type SerializedImageNode = Spread<
  {
    src: string;
    altText?: string;
    width?: ImageDimension;
    height?: ImageDimension;
    type: "passport-image";
    version: 1;
  },
  SerializedLexicalNode
>;

function parseImageDimension(
  value: null | string | undefined,
): ImageDimension | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return Number(normalized);
  }

  return normalized;
}

function applyDimensionToImageElement(
  element: HTMLImageElement,
  property: "height" | "width",
  value: ImageDimension | undefined,
) {
  if (value === undefined) {
    return;
  }

  if (typeof value === "number") {
    element.setAttribute(property, String(value));
    return;
  }

  element.style[property] = value;
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) {
    return null;
  }

  const src = domNode.getAttribute("src");
  if (!src) {
    return null;
  }

  const altText = domNode.getAttribute("alt") || undefined;
  const width =
    parseImageDimension(domNode.style.width) ??
    parseImageDimension(domNode.getAttribute("width"));
  const height =
    parseImageDimension(domNode.style.height) ??
    parseImageDimension(domNode.getAttribute("height"));

  return {
    node: $createImageNode({ src, altText, width, height }),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ImageComponent({
  altText,
  height,
  nodeKey,
  src,
  width,
}: {
  altText?: string;
  height?: ImageDimension;
  nodeKey: NodeKey;
  src: string;
  width?: ImageDimension;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleDelete = useCallback(
    (event: KeyboardEvent) => {
      if (!isSelected || !$isNodeSelection($getSelection())) {
        return false;
      }

      event.preventDefault();
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        node?.remove();
      });
      return true;
    },
    [editor, isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          if (event.target !== imageRef.current) {
            return false;
          }

          if (event.shiftKey) {
            setSelected(!isSelected);
            return true;
          }

          clearSelection();
          setSelected(true);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        handleDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [clearSelection, editor, handleDelete, isSelected, setSelected]);

  const handleResizeEnd = useCallback(
    (nextWidth: number, nextHeight: number) => {
      setTimeout(() => {
        setIsResizing(false);
      }, 120);

      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!(node instanceof ImageNode)) {
          return;
        }

        const rootWidth = editor
          .getRootElement()
          ?.getBoundingClientRect().width;
        if (rootWidth && rootWidth > 0) {
          const widthPercentage = clamp((nextWidth / rootWidth) * 100, 5, 100);
          node.setWidthAndHeight(`${widthPercentage.toFixed(2)}%`, "auto");
          return;
        }

        node.setWidthAndHeight(nextWidth, nextHeight);
      });
    },
    [editor, nodeKey],
  );

  return (
    <div
      ref={containerRef}
      className="group relative my-2 inline-block max-w-full"
      style={{
        height:
          typeof height === "string" && height !== "auto" ? height : undefined,
        width: width ?? "fit-content",
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        className={cn(
          "lexical-image block max-w-full rounded-md",
          width !== undefined ? "w-full" : "",
          isSelected && editor.isEditable()
            ? "outline-2 outline-primary outline-offset-2"
            : "",
          isResizing ? "opacity-80" : "transition-all duration-150",
        )}
        draggable="false"
        style={{
          height: "auto",
          width: width === undefined ? "auto" : "100%",
        }}
      />
      {isSelected && editor.isEditable() ? (
        <BlockResizer
          targetRef={containerRef}
          onResizeStart={() => {
            setIsResizing(true);
          }}
          onResizeEnd={handleResizeEnd}
          maxWidth={editor.getRootElement()?.getBoundingClientRect().width}
        />
      ) : null}
    </div>
  );
}

export class ImageNode extends DecoratorNode<ReactElement> {
  __src: string;
  __altText?: string;
  __width?: ImageDimension;
  __height?: ImageDimension;

  static getType(): string {
    return "passport-image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height } = serializedNode;
    return new ImageNode(src, altText, width, height);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText?: string,
    width?: ImageDimension,
    height?: ImageDimension,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "passport-image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement("img");
    img.setAttribute("src", this.__src);
    if (this.__altText) {
      img.setAttribute("alt", this.__altText);
    }

    applyDimensionToImageElement(img, "width", this.__width);
    applyDimensionToImageElement(img, "height", this.__height);

    return { element: img };
  }

  setWidthAndHeight(width?: ImageDimension, height?: ImageDimension): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const { src, altText, width, height } = payload;
  return new ImageNode(src, altText, width, height);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
