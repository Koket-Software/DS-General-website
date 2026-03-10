import {
  createRequestHandler,
  type HandlerCallback,
} from "@tanstack/react-router/ssr/server";
import ReactDOMServer from "react-dom/server";

import { createAppQueryClient } from "@/lib/app-query-client";
import { createAppRouter } from "@/lib/app-router";
import { AppDocument, type ClientAssetEntry } from "@/ssr/document";

export async function renderSsrPage({
  request,
  assets,
}: {
  request: Request;
  assets: ClientAssetEntry;
}) {
  const requestHandler = createRequestHandler({
    request,
    createRouter: () =>
      createAppRouter({
        queryClient: createAppQueryClient(),
      }),
  });

  const callback: HandlerCallback<ReturnType<typeof createAppRouter>> = async ({
    router,
    responseHeaders,
  }) => {
    try {
      let html = ReactDOMServer.renderToString(
        <AppDocument router={router} assets={assets} />,
      );

      router.serverSsr?.setRenderFinished();

      const injectedHtml = await Promise.all(
        router.serverSsr?.injectedHtml ?? [],
      ).then((htmlParts) => htmlParts.join(""));

      html = html.replace("</body>", `${injectedHtml}</body>`);

      return new Response(`<!DOCTYPE html>${html}`, {
        status: router.state.statusCode,
        headers: responseHeaders,
      });
    } catch (error) {
      process.stderr.write(
        `SSR render failure: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
      );

      return new Response("Internal Server Error", {
        status: 500,
        headers: responseHeaders,
      });
    }
  };

  return requestHandler(callback);
}
