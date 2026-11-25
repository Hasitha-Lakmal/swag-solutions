// Renders JSON-LD inline so it is part of the prerendered HTML that search
// engines read (Google accepts JSON-LD anywhere in the document).
export default function SchemaMarkup({ schema }) {
  if (!schema) return null;
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
