export function generateFullHtml(content: string, projectName: string): string {
  if (content.includes("<!DOCTYPE") || content.includes("<html")) {
    return content;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
}

export function downloadAsHtml(content: string, projectName: string): void {
  const fullHtml = generateFullHtml(content, projectName);
  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAsZip(content: string, projectName: string): Promise<void> {
  // For ZIP export, we'll create a simple structure with index.html
  // Using JSZip would be ideal but for simplicity, we'll create a data URL approach
  const fullHtml = generateFullHtml(content, projectName);
  
  // Create a basic ZIP file structure manually
  // For a proper implementation, you'd want to use a library like JSZip
  // For now, we'll just export as HTML with a note
  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
