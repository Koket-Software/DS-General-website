import { HeadContent } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const HEAD_SELECTOR = '[data-managed-head="true"]';

export function ManagedHeadPortal() {
  const [ready, setReady] = useState(typeof document === "undefined");

  useLayoutEffect(() => {
    document.querySelectorAll(HEAD_SELECTOR).forEach((node) => node.remove());
    setReady(true);
  }, []);

  if (typeof document === "undefined" || !ready) {
    return null;
  }

  return createPortal(<HeadContent />, document.head);
}

export function ManagedHeadServer() {
  return <HeadContent />;
}
