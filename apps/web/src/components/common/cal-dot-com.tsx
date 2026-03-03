/* First make sure that you have installed the package */

/* If you are using yarn */
// yarn add @calcom/embed-react

/* If you are using npm */
// npm install @calcom/embed-react

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CAL_NAMESPACE = "introductory-consultation";
const CAL_LINK = "dsgeneralplc/introductory-consultation";

export default function CalDotCom() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({
        namespace: CAL_NAMESPACE,
      });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#628B35" },
          dark: { "cal-brand": "#628B35" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  return (
    <Cal
      namespace={CAL_NAMESPACE}
      calLink={CAL_LINK}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
