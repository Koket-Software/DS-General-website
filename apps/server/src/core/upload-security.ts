import { extname } from "node:path";

const BLOCKED_UPLOAD_EXTENSIONS = new Set([
  ".svg",
  ".svgz",
  ".html",
  ".htm",
  ".xhtml",
  ".xml",
]);

const ATTACHMENT_UPLOAD_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

export interface UploadSecurityPolicy {
  blocked: boolean;
  headers: Record<string, string>;
}

function normalizeUploadPath(requestPath: string) {
  const [pathname = ""] = requestPath.split("?");
  return decodeURIComponent(pathname).toLowerCase();
}

export function getUploadSecurityPolicy(
  requestPath: string,
): UploadSecurityPolicy {
  const normalizedPath = normalizeUploadPath(requestPath);
  const extension = extname(normalizedPath);

  if (BLOCKED_UPLOAD_EXTENSIONS.has(extension)) {
    return {
      blocked: true,
      headers: {
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      },
    };
  }

  const headers: Record<string, string> = {
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  };

  if (ATTACHMENT_UPLOAD_EXTENSIONS.has(extension)) {
    headers["Content-Disposition"] = "attachment";
  }

  return {
    blocked: false,
    headers,
  };
}
