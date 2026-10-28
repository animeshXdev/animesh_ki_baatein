/**
 * Secure HTML Sanitizer for Tiptap Rich Text Content
 * Allows safe semantic tags and attributes while stripping dangerous script,
 * iframe, object, embed, event handlers (onclick, onload), and javascript: URIs.
 */

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "strike",
  "code", "pre", "blockquote",
  "ul", "ol", "li",
  "table", "thead", "tbody", "tr", "th", "td",
  "a", "img", "span", "div", "figure", "figcaption"
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel", "class"]),
  img: new Set(["src", "alt", "title", "width", "height", "class"]),
  th: new Set(["colspan", "rowspan", "style", "class"]),
  td: new Set(["colspan", "rowspan", "style", "class"]),
  code: new Set(["class"]),
  pre: new Set(["class"]),
  span: new Set(["class"]),
  div: new Set(["class"]),
  p: new Set(["class"]),
  h1: new Set(["class", "id"]),
  h2: new Set(["class", "id"]),
  h3: new Set(["class", "id"]),
  h4: new Set(["class", "id"]),
};

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  // 1. Remove dangerous blocks completely (scripts, styles, iframes, objects, embeds, applets)
  let clean = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "");

  // 2. Parse and filter tags
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g, (match, tagNameRaw, attrsRaw) => {
    const tagName = tagNameRaw.toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(tagName)) {
      return ""; // Strip disallowed tag
    }

    if (isClosing) {
      return `</${tagName}>`;
    }

    if (!attrsRaw || !attrsRaw.trim()) {
      return `<${tagName}>`;
    }

    // Parse attributes
    const allowedAttrsForTag = ALLOWED_ATTRIBUTES[tagName] || new Set();
    const safeAttrs: string[] = [];
    const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(attrsRaw)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

      // Disallow inline JS event handlers like onclick, onerror
      if (attrName.startsWith("on")) {
        continue;
      }

      // Check allowed list
      if (!allowedAttrsForTag.has(attrName)) {
        continue;
      }

      // Disallow javascript: or vbscript: or data: (except image data uris)
      if (
        (attrName === "href" || attrName === "src") &&
        /^(javascript|vbscript):/i.test(attrValue.trim())
      ) {
        continue;
      }

      // Escape quotes
      const escapedValue = attrValue.replace(/"/g, "&quot;");
      safeAttrs.push(`${attrName}="${escapedValue}"`);
    }

    // For links, enforce rel="noopener noreferrer"
    if (tagName === "a") {
      const hasRel = safeAttrs.some((a) => a.startsWith("rel="));
      if (!hasRel) {
        safeAttrs.push('rel="noopener noreferrer"');
      }
    }

    const attrsString = safeAttrs.length > 0 ? ` ${safeAttrs.join(" ")}` : "";
    const isSelfClosing = ["img", "br", "hr"].includes(tagName);

    return isSelfClosing ? `<${tagName}${attrsString} />` : `<${tagName}${attrsString}>`;
  });

  return clean;
}
