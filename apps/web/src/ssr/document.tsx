import {
  RouterContextProvider,
  RouterProvider,
  Scripts,
} from "@tanstack/react-router";

import { ManagedHeadServer } from "@/components/system/ManagedHead";
import type { createAppRouter } from "@/lib/app-router";
import { SITE_METADATA } from "@/lib/og-utils";

export interface ClientAssetEntry {
  entryScript: string;
  styles: string[];
  preloads: string[];
}

export function AppDocument({
  router,
  assets,
}: {
  router: ReturnType<typeof createAppRouter>;
  assets: ClientAssetEntry;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="application-name" content={SITE_METADATA.siteName} />
        <meta
          name="format-detection"
          content="telephone=no,address=no,email=no"
        />
        <meta name="theme-color" content={SITE_METADATA.themeColor} />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={SITE_METADATA.themeColor}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0D1426"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/site/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/site/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/site/favicon-16x16.png"
        />
        <link rel="icon" type="image/x-icon" href="/site/favicon.ico" />
        <link rel="manifest" href="/site/site.webmanifest" />
        {assets.styles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {assets.preloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} />
        ))}
        <RouterContextProvider router={router}>
          <ManagedHeadServer />
        </RouterContextProvider>
      </head>
      <body>
        <div id="app">
          <RouterProvider router={router} />
        </div>
        <RouterContextProvider router={router}>
          <Scripts />
        </RouterContextProvider>
        <script type="module" src={assets.entryScript} />
      </body>
    </html>
  );
}
