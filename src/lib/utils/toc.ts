import { slugify } from "./slug";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Injects deterministic id attributes into h2, h3, h4 headings in HTML
 * and returns the extracted Table of Contents list.
 */
export function processHeadingsAndExtractToc(html: string): {
  processedHtml: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const usedSlugs = new Map<string, number>();

  const processedHtml = html.replace(
    /<(h[2-4])(\s+[^>]*)?>(.*?)<\/\1>/gi,
    (match, tag, existingAttrs, content) => {
      const level = Number.parseInt(tag.charAt(1), 10);
      const text = content.replace(/<[^>]*>?/gm, "").trim();

      let baseSlug = slugify(text) || `section-${toc.length + 1}`;
      let count = usedSlugs.get(baseSlug) || 0;
      count += 1;
      usedSlugs.set(baseSlug, count);

      const uniqueId = count === 1 ? baseSlug : `${baseSlug}-${count}`;

      toc.push({
        id: uniqueId,
        text,
        level,
      });

      // Preserve existing attributes if any, removing any old id
      let cleanAttrs = (existingAttrs || "")
        .replace(/\bid=(["']).*?\1/gi, "")
        .trim();

      const attrString = cleanAttrs ? ` ${cleanAttrs}` : "";
      return `<${tag} id="${uniqueId}"${attrString}>${content}</${tag}>`;
    }
  );

  return { processedHtml, toc };
}
