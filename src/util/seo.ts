/**
 * Per-route title and meta description for on-page SEO.
 * Used by App to set document.title and meta description on route change.
 */
const siteName = "Erin Dawn Campbell";

export const routeSeo: Record<string, { title: string; description: string }> = {
  "/": {
    title: `Handmade & Vintage Clothing | Charlotte NC | ${siteName}`,
    description:
      "Handmade and vintage clothing in Charlotte, NC. Custom clothing, one-of-a-kind dresses, sustainable fashion. Independent clothing designer — handmade to order and vintage inspired pieces.",
  },
  "/shop": {
    title: `Shop | Handmade Dresses & Custom Clothing Charlotte | ${siteName}`,
    description:
      "Shop handmade and vintage clothing in North Carolina. One-of-a-kind dresses, custom made clothing Charlotte NC, embellished vintage and unique handmade designs.",
  },
  "/about": {
    title: `About | Independent Clothing Designer Charlotte | ${siteName}`,
    description:
      "About Erin Dawn Campbell — local clothing designer in Charlotte, NC. Handmade and vintage clothing, custom pieces, one-of-a-kind dresses. Sustainable fashion and bespoke clothing.",
  },
  "/cart": {
    title: `Your Cart | ${siteName}`,
    description: "Your cart — handmade and vintage clothing by Erin Dawn Campbell, Charlotte NC.",
  },
  "/cart/success": {
    title: `Thank You | ${siteName}`,
    description: "Thank you for your order. Your handmade piece from Erin Dawn Campbell, Charlotte NC, is on its way.",
  },
  "/cart/cancel": {
    title: `Your Cart | ${siteName}`,
    description: "Your cart — handmade and vintage clothing by Erin Dawn Campbell, Charlotte NC.",
  },
  "/emailsignup": {
    title: `Join the Mailing List | ${siteName}`,
    description: "Join the mailing list for new handmade dresses, vintage inspired pieces, and custom clothing updates from Charlotte, NC.",
  },
  "/newemail": {
    title: `New Email | ${siteName}`,
    description: "Erin Dawn Campbell — handmade & vintage clothing, Charlotte NC.",
  },
  "/admin": {
    title: `Admin | ${siteName}`,
    description: "Admin.",
  },
};

const defaultSeo = {
  title: `Handmade & Vintage Clothing | Charlotte NC | ${siteName}`,
  description:
    "Handmade and vintage clothing by Erin Dawn Campbell, Charlotte NC. Custom clothing, one-of-a-kind dresses, sustainable fashion.",
};

/**
 * Get SEO title and description for a pathname.
 * Uses exact match first, then falls back to base path (e.g. /shop?id=1 -> /shop).
 */
export function getSeoForPath(pathname: string): { title: string; description: string } {
  const basePath = pathname.split("?")[0];
  return routeSeo[basePath] ?? routeSeo[pathname] ?? defaultSeo;
}

/**
 * Set document title and meta description. Call on route change.
 */
export function setPageSeo(pathname: string, productTitle?: string): void {
  const { title, description } = productTitle
    ? {
        title: `${productTitle} | Shop Handmade & Vintage | ${siteName}`,
        description: `${productTitle} — handmade and vintage clothing, Charlotte NC. One-of-a-kind piece by Erin Dawn Campbell.`,
      }
    : getSeoForPath(pathname);

  document.title = title;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    meta.content = description;
    document.head.appendChild(meta);
  } else {
    meta.content = description;
  }
}
