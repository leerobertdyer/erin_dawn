/**
 * Per-route title and meta description for on-page SEO.
 * Used by App to set document.title and meta description on route change.
 */
const siteName = "Erin Dawn Campbell";

export const routeSeo: Record<string, { title: string; description: string }> = {
  "/": {
    title: `Handmade & Vintage Clothing | ${siteName}`,
    description:
      "Handmade and vintage clothing by Erin Dawn Campbell, Charlotte NC. Custom clothing, one-of-a-kind dresses, sustainable fashion.",
  },
  "/shop": {
    title: `Shop | Handmade Dresses & Custom Clothing | ${siteName}`,
    description:
      "Shop handmade and vintage clothing. One-of-a-kind dresses, custom clothing Charlotte NC, embellished vintage and handmade designs.",
  },
  "/about": {
    title: `About | ${siteName}`,
    description:
      "About Erin Dawn Campbell — independent clothing designer in Charlotte, NC. Handmade and vintage clothing, custom pieces.",
  },
  "/cart": {
    title: `Your Cart | ${siteName}`,
    description: "Your shopping cart. Handmade and vintage clothing by Erin Dawn Campbell.",
  },
  "/cart/success": {
    title: `Thank You | ${siteName}`,
    description: "Thank you for your order. Handmade and vintage clothing by Erin Dawn Campbell.",
  },
  "/cart/cancel": {
    title: `Your Cart | ${siteName}`,
    description: "Your shopping cart. Handmade and vintage clothing by Erin Dawn Campbell.",
  },
  "/emailsignup": {
    title: `Join the Mailing List | ${siteName}`,
    description: "Join the mailing list for updates on new handmade and vintage clothing.",
  },
  "/newemail": {
    title: `New Email | ${siteName}`,
    description: "Erin Dawn Campbell.",
  },
  "/admin": {
    title: `Admin | ${siteName}`,
    description: "Admin.",
  },
};

const defaultSeo = {
  title: `Handmade & Vintage Clothing | ${siteName}`,
  description:
    "Handmade and vintage clothing by Erin Dawn Campbell, Charlotte NC. Custom clothing, one-of-a-kind dresses.",
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
        title: `${productTitle} | Shop | ${siteName}`,
        description: `${productTitle} — handmade and vintage clothing by Erin Dawn Campbell.`,
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
