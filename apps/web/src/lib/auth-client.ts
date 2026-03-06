import { AUTH_BASE_PATH } from "@suba-company-template/auth/constants";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { API_BASE_URL } from "@/lib/api-base";

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  basePath: AUTH_BASE_PATH,
  plugins: [adminClient()],
});
