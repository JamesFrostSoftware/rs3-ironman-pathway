/**
 * Safe GitHub-flavoured markdown for assistant replies (tables, lists, links, etc.).
 */

const ALLOWED_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre',
  'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'hr', 'br', 'div',
]);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdown(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`\n]+)`/g, '<code class="agent-md-code">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return out;
}

function isTableRow(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|', 1);
}

function isTableSeparator(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line.trim());
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderTable(headerCells, bodyRows) {
  const head = headerCells.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('');
  const body = bodyRows
    .map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`)
    .join('');
  return `<div class="agent-md-table-wrap"><table class="agent-md-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderList(items, ordered) {
  const tag = ordered ? 'ol' : 'ul';
  const lis = items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('');
  return `<${tag} class="agent-md-${ordered ? 'ol' : 'ul'}">${lis}</${tag}>`;
}

function parseBlocks(raw) {
  const lines = String(raw || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const fence = trimmed.slice(0, 3);
      const lang = trimmed.slice(3).trim();
      i += 1;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({
        type: 'code',
        lang,
        text: codeLines.join('\n'),
      });
      continue;
    }

    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = parseTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    if (/^#{1,4}\s+/.test(trimmed)) {
      const level = trimmed.match(/^#+/)[0].length;
      const text = trimmed.replace(/^#+\s+/, '');
      blocks.push({ type: 'heading', level, text });
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quoteLines.join('\n') });
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const paraLines = [];
    while (i < lines.length) {
      const next = lines[i];
      const nextTrim = next.trim();
      if (!nextTrim) break;
      if (
        /^```/.test(nextTrim) ||
        isTableRow(next) ||
        /^#{1,4}\s+/.test(nextTrim) ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(nextTrim) ||
        /^>\s?/.test(nextTrim) ||
        /^[-*+]\s+/.test(nextTrim) ||
        /^\d+\.\s+/.test(nextTrim)
      ) {
        break;
      }
      paraLines.push(nextTrim);
      i += 1;
    }
    blocks.push({ type: 'p', text: paraLines.join('\n') });
  }

  return blocks;
}

function renderBlock(block) {
  switch (block.type) {
    case 'code':
      return `<pre class="agent-md-pre"><code>${escapeHtml(block.text)}</code></pre>`;
    case 'table':
      return renderTable(block.header, block.rows);
    case 'heading': {
      const level = Math.min(block.level, 4);
      return `<h${level} class="agent-md-h agent-md-h${level}">${inlineMarkdown(block.text)}</h${level}>`;
    }
    case 'hr':
      return '<hr class="agent-md-hr" />';
    case 'quote':
      return `<blockquote class="agent-md-quote">${inlineMarkdown(block.text).replace(/\n/g, '<br />')}</blockquote>`;
    case 'ul':
      return renderList(block.items, false);
    case 'ol':
      return renderList(block.items, true);
    case 'p':
      return `<p class="agent-md-p">${inlineMarkdown(block.text).replace(/\n/g, '<br />')}</p>`;
    default:
      return '';
  }
}

function sanitizeHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;

  const walk = (node) => {
    const children = [...node.childNodes];
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        continue;
      }
      const tag = child.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        const text = document.createTextNode(child.textContent || '');
        child.replaceWith(text);
        continue;
      }
      [...child.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (tag === 'a' && (name === 'href' || name === 'target' || name === 'rel')) return;
        if (name === 'class') return;
        child.removeAttribute(attr.name);
      });
      if (tag === 'a') {
        const href = child.getAttribute('href') || '';
        if (!/^https?:\/\//i.test(href)) {
          child.replaceWith(document.createTextNode(child.textContent || ''));
          continue;
        }
        child.setAttribute('target', '_blank');
        child.setAttribute('rel', 'noopener noreferrer');
      }
      walk(child);
    }
  };

  walk(template.content);
  const wrapper = document.createElement('div');
  wrapper.appendChild(template.content);
  return wrapper.innerHTML;
}

export function renderMarkdown(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';
  const html = parseBlocks(text).map(renderBlock).join('');
  return sanitizeHtml(html);
}
