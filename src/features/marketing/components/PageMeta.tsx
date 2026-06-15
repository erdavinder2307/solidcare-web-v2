import React, { useEffect } from "react";
import { SITE } from "../config/site";

interface PageMetaProps {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

export function PageMeta({ title, description, path = "", noIndex = false }: PageMetaProps) {
  const fullTitle = title.includes("Solidcare") ? title : `${title} | Solidcare`;
  const desc = description ?? SITE.description;
  const canonical = `${SITE.domain}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", SITE.name, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonical);

    let robotsEl = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robotsEl) {
        robotsEl = document.createElement("meta");
        robotsEl.setAttribute("name", "robots");
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute("content", "noindex, nofollow");
    } else if (robotsEl) {
      robotsEl.remove();
    }
  }, [fullTitle, desc, canonical, noIndex]);

  return null;
}
