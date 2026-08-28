// Server-side HTML renderer with DOMPurify defense-in-depth sanitization.
// The backend already sanitizes via DOMPurify (article.service.ts).
// This adds a second pass on the client/edge before rendering.

import DOMPurify from "isomorphic-dompurify";

type Props = {
  html: string;
  className?: string;
};

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "blockquote", "code", "pre",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "img",
  "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr",
];

const ALLOWED_ATTR = ["href", "title", "alt", "src", "loading", "target", "rel", "class"];

export default function SafeHtml({ html, className }: Props) {
  const clean = DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
  return (
    <div
      className={className ?? "article-prose"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
