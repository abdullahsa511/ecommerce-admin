// ==========================================================================
// exportUtils.js
// Dependency-free CSV / XLSX / PDF export utilities — reusable anywhere.
// Plain JavaScript (ES module). See exportUtils.d.ts for type hints.
// ==========================================================================

function getValue(row, col) {
  if (col.accessor) return col.accessor(row) ?? '';
  return row[col.key] ?? '';
}

// ==========================================================================
// Shared: file download helper
// ==========================================================================
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function sanitizeFileName(name) {
  return String(name ?? 'export')
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '_')
    .slice(0, 120) || 'export';
}

const PAPER_SIZES_PT = {
  A3: { width: 842, height: 1191 },
  A4: { width: 595, height: 842 },
  A2: { width: 1191, height: 1684 },
  Letter: { width: 612, height: 792 },
};

function pdfEscapeText(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, '?');
}

function charWidthPt(fontSize) {
  return fontSize * 0.52;
}

function measureMaxChars(colWidthPt, fontSize, cellPadH) {
  const maxWidth = colWidthPt - cellPadH * 2;
  return Math.max(1, Math.floor(maxWidth / charWidthPt(fontSize)));
}

function wrapTextToWidth(text, colWidthPt, fontSize, cellPadH) {
  const maxChars = measureMaxChars(colWidthPt, fontSize, cellPadH);
  const str = String(text ?? '').trim();
  if (!str) return [''];

  const breakLongToken = (token) => {
    if (token.length <= maxChars) return [token];
    const parts = [];
    for (let i = 0; i < token.length; i += maxChars) {
      parts.push(token.slice(i, i + maxChars));
    }
    return parts;
  };

  if (!/\s/.test(str)) return breakLongToken(str);

  const words = str.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const wordLines = breakLongToken(word);
    for (const part of wordLines) {
      const next = line ? `${line} ${part}` : part;
      if (next.length <= maxChars) {
        line = next;
      } else {
        if (line) lines.push(line);
        line = part;
      }
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function buildPdfBlob(opts) {
  const { columns, data } = opts;
  const paperSize = opts.paperSize || 'A3';
  const orientation = opts.orientation || 'portrait';
  const title = opts.title || 'Report';
  const subtitle = opts.subtitle || '';
  const generatedOn = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const size = PAPER_SIZES_PT[paperSize] || PAPER_SIZES_PT.A3;
  const pageW = orientation === 'landscape' ? size.height : size.width;
  const pageH = orientation === 'landscape' ? size.width : size.height;

  const margin = { top: 34, right: 34, bottom: 51, left: 34 };
  const contentW = pageW - margin.left - margin.right;
  const cellPadH = 6;
  const cellPadV = 6;
  const idxColW = 30;
  const totalColWidth = columns.reduce((sum, col) => sum + (col.width || 80), 0);
  const colWidths = columns.map(col => ((col.width || 80) / totalColWidth) * (contentW - idxColW));

  const headerFontSize = 9;
  const bodyFontSize = 9;
  const titleFontSize = 24;
  const metaFontSize = 11;
  const lineHeight = bodyFontSize + 5;

  const colLeft = [];
  let colStartX = margin.left + idxColW;
  for (let i = 0; i < columns.length; i++) {
    colLeft.push(colStartX);
    colStartX += colWidths[i];
  }

  const tableRows = data.map((row, i) => ({
    index: String(i + 1),
    cells: columns.map(col => String(getValue(row, col))),
  }));

  const headerCellLines = columns.map((col, i) =>
    wrapTextToWidth(col.header, colWidths[i], headerFontSize, cellPadH)
  );
  const headerLineCount = Math.max(...headerCellLines.map(lines => lines.length), 1);
  const headerRowH = headerLineCount * lineHeight + cellPadV * 2;

  const pages = [];
  let pageContent = [];
  let y = pageH - margin.top;
  let isFirstPage = true;

  const flushPage = () => {
    pages.push(pageContent.join('\n'));
    pageContent = [];
    y = pageH - margin.top;
    isFirstPage = false;
  };

  const ensureSpace = (needed) => {
    if (y - needed < margin.bottom) flushPage();
  };

  const drawText = (text, x, size, bold, color, yPos) => {
    const font = bold ? '/F2' : '/F1';
    const [r, g, b] = color || [0.12, 0.16, 0.23];
    const textY = yPos ?? y;
    pageContent.push('BT');
    pageContent.push(`${r} ${g} ${b} rg`);
    pageContent.push(`${font} ${size} Tf`);
    pageContent.push(`1 0 0 1 ${x} ${textY} Tm`);
    pageContent.push(`(${pdfEscapeText(text)}) Tj`);
    pageContent.push('ET');
  };

  const drawRect = (x, rectY, w, h, fill) => {
    pageContent.push(`${fill[0]} ${fill[1]} ${fill[2]} rg`);
    pageContent.push(`${x} ${rectY} ${w} ${h} re f`);
  };

  const drawLine = (x1, y1, x2, y2, stroke) => {
    pageContent.push(`${stroke[0]} ${stroke[1]} ${stroke[2]} RG`);
    pageContent.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  };

  const drawCellLines = (lines, x, colW, rowTop, rowH, fontSize, bold, color, align = 'left') => {
    const contentH = lines.length * lineHeight;
    const availableH = rowH - cellPadV * 2;
    const vOffset = Math.max(0, (availableH - contentH) / 2);
    let lineY = rowTop - cellPadV - vOffset - (fontSize * 0.75);

    for (const line of lines) {
      const textW = line.length * charWidthPt(fontSize);
      const textX = align === 'center'
        ? x + Math.max(cellPadH, (colW - textW) / 2)
        : x + cellPadH;
      drawText(line, textX, fontSize, bold, color, lineY);
      lineY -= lineHeight;
    }
  };

  const drawColumnGrid = (rowBottom, rowH) => {
    const rowTop = rowBottom + rowH;
    drawLine(margin.left, rowBottom, margin.left + contentW, rowBottom, [0.82, 0.86, 0.9]);
    drawLine(margin.left, rowTop, margin.left + contentW, rowTop, [0.82, 0.86, 0.9]);

    let x = margin.left;
    drawLine(x, rowBottom, x, rowTop, [0.88, 0.91, 0.94]);
    x += idxColW;
    drawLine(x, rowBottom, x, rowTop, [0.88, 0.91, 0.94]);
    for (let i = 0; i < colWidths.length; i++) {
      x += colWidths[i];
      drawLine(x, rowBottom, x, rowTop, [0.88, 0.91, 0.94]);
    }
  };

  if (isFirstPage) {
    drawText(title, margin.left, titleFontSize, true, [0.06, 0.09, 0.16]);
    y -= titleFontSize + 8;
    if (subtitle) {
      drawText(subtitle, margin.left, metaFontSize + 1, false, [0.39, 0.45, 0.55]);
      y -= metaFontSize + 10;
    }
    drawText(`Generated on ${generatedOn}`, margin.left, metaFontSize, false, [0.39, 0.45, 0.55]);
    y -= metaFontSize + 4;
    drawText(`Total records: ${data.length}`, margin.left, metaFontSize, false, [0.39, 0.45, 0.55]);
    y -= metaFontSize + 14;

    ensureSpace(28);
    drawRect(margin.left, y - 18, contentW, 22, [0.95, 0.96, 0.98]);
    drawText(`Total Records: ${data.length}`, margin.left + 8, metaFontSize, true, [0.28, 0.34, 0.41]);
    y -= 34;
  }

  const drawTableHeader = () => {
    ensureSpace(headerRowH + 4);
    const rowTop = y;
    const rowBottom = y - headerRowH;

    drawRect(margin.left, rowBottom, contentW, headerRowH, [0.12, 0.16, 0.23]);
    drawCellLines(['#'], margin.left, idxColW, rowTop, headerRowH, headerFontSize, true, [0.97, 0.98, 0.99], 'center');

    columns.forEach((col, i) => {
      drawCellLines(headerCellLines[i], colLeft[i], colWidths[i], rowTop, headerRowH, headerFontSize, true, [0.97, 0.98, 0.99]);
    });

    drawColumnGrid(rowBottom, headerRowH);
    y -= headerRowH;
  };

  drawTableHeader();

  for (let rowIdx = 0; rowIdx < tableRows.length; rowIdx++) {
    const row = tableRows[rowIdx];
    const wrappedCells = row.cells.map((cell, i) =>
      wrapTextToWidth(cell, colWidths[i], bodyFontSize, cellPadH)
    );
    const rowLines = Math.max(...wrappedCells.map(lines => lines.length), 1);
    const rowH = rowLines * lineHeight + cellPadV * 2;

    if (y - rowH < margin.bottom) {
      flushPage();
      drawTableHeader();
    }

    const rowTop = y;
    const rowBottom = y - rowH;

    if (rowIdx % 2 === 1) {
      drawRect(margin.left, rowBottom, contentW, rowH, [0.96, 0.97, 0.99]);
    }

    drawCellLines([row.index], margin.left, idxColW, rowTop, rowH, bodyFontSize, false, [0.58, 0.64, 0.72], 'center');

    wrappedCells.forEach((lines, i) => {
      drawCellLines(lines, colLeft[i], colWidths[i], rowTop, rowH, bodyFontSize, false, [0.12, 0.16, 0.23]);
    });

    drawColumnGrid(rowBottom, rowH);
    y -= rowH;
  }

  if (pageContent.length) flushPage();

  const pageCount = pages.length;
  const objects = [];
  const addObj = (body) => {
    objects.push(body);
    return objects.length;
  };

  const fontRegularId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBoldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  const contentIds = pages.map((content, i) => {
    const footer = [
      'BT',
      '/F1 9 Tf',
      '0.58 0.64 0.72 rg',
      `1 0 0 1 ${pageW - margin.right - 80} ${margin.bottom - 18} Tm`,
      `(Page ${i + 1} of ${pageCount}) Tj`,
      'ET',
    ].join('\n');
    return addObj(`<< /Length ${content.length + footer.length + 1} >>\nstream\n${content}\n${footer}\nendstream`);
  });

  const pageIds = contentIds.map((contentId) =>
    addObj(`<< /Type /Page /Parent PAGES_PLACEHOLDER /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> >>`)
  );

  const pagesId = addObj(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`);
  objects[pageIds[0] - 1] = objects[pageIds[0] - 1].replace('PAGES_PLACEHOLDER', `${pagesId} 0 R`);
  for (let i = 1; i < pageIds.length; i++) {
    objects[pageIds[i] - 1] = objects[pageIds[i] - 1].replace('PAGES_PLACEHOLDER', `${pagesId} 0 R`);
  }

  const catalogId = addObj(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export function xmlEscape(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ==========================================================================
// CSV EXPORT
// ==========================================================================
export function exportToCSV(opts) {
  const { columns, data } = opts;
  const fileName = `${opts.fileName || 'export'}_${todayStr()}.csv`;

  const headers = columns.map(c => c.header);
  const rows = data.map(row =>
    columns.map(col => {
      const val = String(getValue(row, col));
      return `"${val.replace(/"/g, '""')}"`;
    })
  );

  const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileName);
}

// ==========================================================================
// XLSX EXPORT — hand-rolled ZIP (STORE method) + minimal OOXML
// ==========================================================================
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  const u16 = (n) => new Uint8Array([n & 0xff, (n >> 8) & 0xff]);
  const u32 = (n) => new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff]);
  const concat = (...arrs) => {
    const total = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(total);
    let p = 0;
    for (const a of arrs) { out.set(a, p); p += a.length; }
    return out;
  };

  const dosTime = new Uint8Array([0, 0]);
  const dosDate = u16(0x21); // 1980-01-01, minimum valid DOS date

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const data = file.data;
    const crc = crc32(data);

    const localHeader = concat(
      u32(0x04034b50), u16(20), u16(0), u16(0),
      dosTime, dosDate,
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0),
      nameBytes
    );
    localParts.push(localHeader, data);

    const centralHeader = concat(
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0),
      dosTime, dosDate,
      u32(crc), u32(data.length), u32(data.length),
      u16(nameBytes.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset),
      nameBytes
    );
    centralParts.push(centralHeader);

    offset += localHeader.length + data.length;
  }

  const centralDir = concat(...centralParts);
  const localData = concat(...localParts);

  const eocd = concat(
    u32(0x06054b50), u16(0), u16(0),
    u16(files.length), u16(files.length),
    u32(centralDir.length), u32(localData.length), u16(0)
  );

  return new Blob([localData, centralDir, eocd], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

function colLetter(index) {
  let n = index + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildSheetXml(headers, rows) {
  const cell = (r, c, val, bold) => {
    const ref = `${colLetter(c)}${r}`;
    const s = bold ? ' s="1"' : '';
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(val)}</t></is></c>`;
  };

  const headerRow = `<row r="1">${headers.map((h, c) => cell(1, c, h, true)).join('')}</row>`;
  const dataRows = rows.map((row, i) =>
    `<row r="${i + 2}">${row.map((val, c) => cell(i + 2, c, val, false)).join('')}</row>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>${headerRow}${dataRows}</sheetData>
</worksheet>`;
}

function buildXlsxBlob(headers, rows, sheetName) {
  const encoder = new TextEncoder();
  const safeSheetName = xmlEscape(sheetName || 'Sheet1').slice(0, 31); // Excel sheet name limit

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${safeSheetName}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="1"><fill><patternFill patternType="none"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
</styleSheet>`;

  const files = [
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rootRels) },
    { name: 'xl/workbook.xml', data: encoder.encode(workbook) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
    { name: 'xl/styles.xml', data: encoder.encode(styles) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(buildSheetXml(headers, rows)) },
  ];

  return createZip(files);
}

export function exportToXLSX(opts) {
  const { columns, data } = opts;
  const fileName = `${opts.fileName || 'export'}_${todayStr()}.xlsx`;

  const headers = columns.map(c => c.header);
  const rows = data.map(row => columns.map(col => getValue(row, col)));

  const blob = buildXlsxBlob(headers, rows, opts.fileName || 'Sheet1');
  downloadBlob(blob, fileName);
}

// ==========================================================================
// PDF EXPORT — hand-rolled PDF (A3 default) with direct download
// ==========================================================================
export function exportToPDF(opts) {
  const fileName = `${sanitizeFileName(opts.fileName || 'export')}_${todayStr()}.pdf`;
  const blob = buildPdfBlob(opts);
  downloadBlob(blob, fileName);
}

// ==========================================================================
// One entry point for all three formats
// ==========================================================================
export function exportTableData(format, opts) {
  switch (format) {
    case 'csv': return exportToCSV(opts);
    case 'xlsx': return exportToXLSX(opts);
    case 'pdf': return exportToPDF(opts);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}