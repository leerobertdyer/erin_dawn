/**
 * Google Analytics 4 — init and event helpers.
 * No-op when VITE_GA_MEASUREMENT_ID is unset (e.g. dev).
 *
 * Env: set VITE_GA_MEASUREMENT_ID to your GA4 Measurement ID (e.g. G-XXXXXXXXXX).
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

function isEnabled(): boolean {
  return Boolean(typeof MEASUREMENT_ID === "string" && MEASUREMENT_ID.startsWith("G-"));
}

/**
 * Load gtag script and config. Call once at app boot.
 */
export function init_GA(): void {
  if (!isEnabled()) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("config", MEASUREMENT_ID);
}

/**
 * Send a page view (for SPA route changes).
 */
export function pageView_GA(path: string, title?: string): void {
  if (!isEnabled()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title ?? document.title,
  });
}

/**
 * Product detail view (GA4 recommended: view_item).
 */
export function viewItem_GA(product: { id: string; title: string; price: number }): void {
  if (!isEnabled()) return;
  window.gtag("event", "view_item", {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Add to cart (GA4 recommended: add_to_cart).
 */
export function addToCart_GA(product: { id: string; title: string; price: number }): void {
  if (!isEnabled()) return;
  window.gtag("event", "add_to_cart", {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Purchase (GA4 recommended: purchase). Call once per successful checkout.
 */
export function purchase_GA(params: {
  transactionId: string;
  value: number;
  items: { item_id: string; item_name: string; price: number; quantity: number }[];
}): void {
  if (!isEnabled()) return;
  window.gtag("event", "purchase", {
    transaction_id: params.transactionId,
    value: params.value,
    currency: "USD",
    items: params.items,
  });
}

/**
 * Email signup (GA4 recommended: sign_up, method: email).
 */
export function signUp_GA(): void {
  if (!isEnabled()) return;
  window.gtag("event", "sign_up", { method: "email" });
}
