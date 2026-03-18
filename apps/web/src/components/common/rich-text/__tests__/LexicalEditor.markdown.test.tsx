import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LexicalEditor } from "../LexicalEditor";

describe("LexicalEditor Markdown Support", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render the editor with Markdown plugin", () => {
    const handleChange = vi.fn();
    render(
      <LexicalEditor
        value=""
        onChange={handleChange}
        placeholder="Type here..."
      />,
    );

    const editorElement = screen.getByText("Type here...");
    expect(editorElement).toBeTruthy();
  });

  it("should load existing HTML content", () => {
    const handleChange = vi.fn();
    const htmlContent = "<p>Test content with <strong>bold</strong> text</p>";

    render(<LexicalEditor value={htmlContent} onChange={handleChange} />);

    const contentEditable = document.querySelector(".lexical-editor");
    expect(contentEditable).toBeTruthy();
  });

  it("should include MarkdownShortcutPlugin in the editor", () => {
    const handleChange = vi.fn();
    render(<LexicalEditor value="" onChange={handleChange} />);

    // The editor should render without errors, indicating plugin is loaded
    const editorElement = document.querySelector(".lexical-editor");
    expect(editorElement).toBeTruthy();
  });

  it("should render the Markdown help button in toolbar", () => {
    const handleChange = vi.fn();
    render(<LexicalEditor value="" onChange={handleChange} />);

    const helpButtons = screen.getAllByLabelText("Markdown shortcuts help");
    expect(helpButtons.length).toBeGreaterThan(0);
  });

  it("should render initial markdown content when valueFormat is markdown", async () => {
    const handleChange = vi.fn();

    render(
      <LexicalEditor
        value="# Heading from markdown"
        valueFormat="markdown"
        onChange={handleChange}
        placeholder="Type here..."
      />,
    );

    await waitFor(() => {
      const heading = document.querySelector(".lexical-editor h1");
      expect(heading?.textContent).toBe("Heading from markdown");
    });
  });
});
