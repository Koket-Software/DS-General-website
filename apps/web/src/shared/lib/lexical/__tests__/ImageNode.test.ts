import { createEditor } from "lexical";
import { describe, expect, it } from "vitest";

import { $createImageNode, ImageNode } from "../ImageNode";

function readWithEditor<T>(callback: () => T): T {
  const editor = createEditor({
    namespace: "image-node-test",
    nodes: [ImageNode],
    onError(error) {
      throw error;
    },
  });

  let result!: T;
  editor.update(
    () => {
      result = callback();
    },
    { discrete: true },
  );
  return result;
}

describe("ImageNode", () => {
  it("preserves string dimensions in serialized JSON", () => {
    const serialized = readWithEditor(() =>
      $createImageNode({
        src: "https://example.com/image.jpg",
        altText: "Example image",
        width: "62.50%",
        height: "auto",
      }).exportJSON(),
    );

    expect(serialized).toMatchObject({
      type: "passport-image",
      version: 1,
      src: "https://example.com/image.jpg",
      altText: "Example image",
      width: "62.50%",
      height: "auto",
    });
  });

  it("exports percentage width and auto height as inline styles", () => {
    const exported = readWithEditor(
      () =>
        $createImageNode({
          src: "https://example.com/image.jpg",
          altText: "Example image",
          width: "75%",
          height: "auto",
        }).exportDOM().element as HTMLImageElement,
    );

    expect(exported.getAttribute("width")).toBeNull();
    expect(exported.style.width).toBe("75%");
    expect(exported.style.height).toBe("auto");
  });

  it("imports styled image dimensions from DOM", () => {
    const img = document.createElement("img");
    img.setAttribute("src", "https://example.com/image.jpg");
    img.setAttribute("alt", "Example image");
    img.style.width = "55%";
    img.style.height = "auto";

    const serialized = readWithEditor(() => {
      const conversion = ImageNode.importDOM()?.img?.(img);
      const convertedNode = conversion?.conversion(img)?.node as ImageNode;
      return convertedNode.exportJSON();
    });

    expect(serialized).toMatchObject({
      src: "https://example.com/image.jpg",
      altText: "Example image",
      width: "55%",
      height: "auto",
    });
  });
});
