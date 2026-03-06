export const BNI_COLORS = [
  "#003F87", "#F37021", "#00A99D", "#6C5CE7", "#E17055",
  "#0984E3", "#FDCB6E", "#00B894", "#D63031", "#A29BFE",
];

export function formatIDR(n) {
  const num = Number(n || 0);
  if (num >= 1e9) return "Rp " + (num / 1e9).toFixed(2) + " M";
  if (num >= 1e6) return "Rp " + (num / 1e6).toFixed(2) + " Jt";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function groupSum(arr, key, sumKey) {
  const map = {};
  arr.forEach((r) => {
    const k = r[key] || "Lainnya";
    map[k] = (map[k] || 0) + Number(r[sumKey] || 0);
  });
  return map;
}

export function exportToCSV(data) {
  if (!data || !data.length) { alert("Tidak ada data"); return; }
  const cols = Object.keys(data[0]);
  const rows = data.map((r) =>
    cols.map((c) => `"${String(r[c] || "").replace(/"/g, '""')}"`).join(",")
  );
  const csv = [cols.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Dashboard_Produksi.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ────────────────────────────────────────────────

function rrect(pdf, x, y, w, h, r, fill, stroke) {
  pdf.roundedRect(x, y, w, h, r, r, fill && stroke ? "FD" : fill ? "F" : "S");
}

function hexRGB(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function drawSlideBackground(pdf, PAGE_W, PAGE_H) {
  pdf.setFillColor(240, 244, 250);
  pdf.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top-left navy arc
  pdf.setFillColor(0, 41, 96);
  pdf.setGState(pdf.GState({ opacity: 0.08 }));
  pdf.circle(-15, -15, 55, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Bottom-right orange arc
  pdf.setFillColor(243, 112, 33);
  pdf.setGState(pdf.GState({ opacity: 0.08 }));
  pdf.circle(PAGE_W + 15, PAGE_H + 15, 60, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Subtle dot grid
  pdf.setFillColor(0, 63, 135);
  pdf.setGState(pdf.GState({ opacity: 0.035 }));
  for (let row = 0; row < PAGE_H; row += 9) {
    for (let col = 0; col < PAGE_W; col += 9) {
      pdf.circle(col, row, 0.55, "F");
    }
  }
  pdf.setGState(pdf.GState({ opacity: 1 }));
}

function drawHeader(pdf, PAGE_W, dateStr, title, subtitle) {
  // Navy bar
  pdf.setFillColor(0, 41, 96);
  rrect(pdf, 8, 6, PAGE_W - 16, 26, 4, true, false);

  // Orange left accent
  pdf.setFillColor(243, 112, 33);
  pdf.roundedRect(8, 6, 5, 26, 2, 2, "F");

  // BNI box
  pdf.setFillColor(0, 63, 135);
  rrect(pdf, 17, 10, 18, 18, 3, true, false);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("BNI", 26, 21, { align: "center" });
  pdf.setFontSize(4.5);
  pdf.setFont("helvetica", "normal");
  pdf.text("LIFE", 26, 25, { align: "center" });

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, 40, 17.5);

  // Subtitle
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(170, 200, 235);
  pdf.text(subtitle, 40, 24.5);

  // Date
  pdf.setFontSize(6);
  pdf.setTextColor(140, 180, 220);
  pdf.text("Dicetak pada", PAGE_W - 13, 14.5, { align: "right" });
  pdf.setFontSize(7.5);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.text(dateStr, PAGE_W - 13, 22, { align: "right" });
}

function drawFooter(pdf, PAGE_W, PAGE_H, pageNum, totalPages) {
  pdf.setDrawColor(0, 41, 96);
  pdf.setGState(pdf.GState({ opacity: 0.15 }));
  pdf.setLineWidth(0.3);
  pdf.line(8, PAGE_H - 8.5, PAGE_W - 8, PAGE_H - 8.5);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  pdf.setFontSize(6);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(130, 150, 180);
  pdf.text("© 2025 BNI Life Insurance — Dashboard Produksi Internal  |  CONFIDENTIAL", 12, PAGE_H - 4.5);
  pdf.setTextColor(0, 63, 135);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${pageNum} / ${totalPages}`, PAGE_W - 12, PAGE_H - 4.5, { align: "right" });
}

function drawKpiCard(pdf, x, y, w, h, label, value, pct, accentColor) {
  // Card
  pdf.setFillColor(255, 255, 255);
  rrect(pdf, x, y, w, h, 4, true, false);
  pdf.setDrawColor(220, 232, 248);
  pdf.setLineWidth(0.2);
  rrect(pdf, x, y, w, h, 4, false, true);

  // Accent bar
  const [r, g, b] = hexRGB(accentColor);
  pdf.setFillColor(r, g, b);
  pdf.roundedRect(x, y, 3.5, h, 2, 2, "F");

  // Icon bg circle
  pdf.setGState(pdf.GState({ opacity: 0.1 }));
  pdf.setFillColor(r, g, b);
  pdf.circle(x + w - 13, y + h / 2, 10, "F");
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Label
  pdf.setFontSize(6);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(148, 163, 184);
  pdf.text(label.toUpperCase(), x + 8, y + 11);

  // Value
  // const valStr = String(value);
  // const fs = valStr.length > 14 ? 8 : valStr.length > 10 ? 10 : 12.5;
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 41, 96);
  pdf.text(valStr, x + 8, y + 23);

  // Green badge
  // pdf.setFillColor(34, 197, 94);
  // rrect(pdf, x + 8, y + h - 12, 30, 7, 2, true, false);
  // pdf.setFontSize(5.5);
  // pdf.setFont("helvetica", "bold");
  // pdf.setTextColor(255, 255, 255);
  // pdf.text(`▲ ${pct} vs bln lalu`, x + 23, y + h - 7, { align: "center" });
}

function drawPanel(pdf, x, y, w, h, title, subtitle, badge, badgeColor = "#003F87") {
  pdf.setFillColor(255, 255, 255);
  rrect(pdf, x, y, w, h, 4, true, false);
  pdf.setDrawColor(220, 232, 248);
  pdf.setLineWidth(0.2);
  rrect(pdf, x, y, w, h, 4, false, true);

  // Top accent line
  const [r, g, b] = hexRGB(badgeColor);
  pdf.setFillColor(r, g, b);
  pdf.roundedRect(x, y, w, 3, 2, 2, "F");

  // Badge
  if (badge) {
    pdf.setGState(pdf.GState({ opacity: 0.1 }));
    pdf.setFillColor(r, g, b);
    rrect(pdf, x + w - 27, y + 7, 21, 7, 2, true, false);
    pdf.setGState(pdf.GState({ opacity: 1 }));
    pdf.setFontSize(5.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(r, g, b);
    pdf.text(badge, x + w - 16.5, y + 12, { align: "center" });
  }

  // Title
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 41, 96);
  pdf.text(title, x + 7, y + 13);

  // Subtitle
  if (subtitle) {
    pdf.setFontSize(6);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(148, 163, 184);
    pdf.text(subtitle, x + 7, y + 19.5);
  }
}

function drawBarChart(pdf, x, y, w, h, labels, values, color, formatFn) {
  if (!values || values.length === 0) return;
  const max = Math.max(...values, 1);
  const barAreaH = h;
  const barAreaW = w;
  const n = values.length;
  const barW = Math.min(barAreaW / n - 2, 16);
  const gap = (barAreaW - barW * n) / (n + 1);
  const [r, g, b] = hexRGB(color);

  // Horizontal grid lines (4 lines)
  pdf.setDrawColor(220, 232, 248);
  pdf.setLineWidth(0.15);
  for (let i = 1; i <= 4; i++) {
    const gy = y + barAreaH - (i / 4) * barAreaH;
    pdf.line(x, gy, x + barAreaW, gy);
    // Value label
    pdf.setFontSize(4);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(160, 180, 210);
    const gv = formatFn ? formatFn((i / 4) * max) : ((i / 4) * max).toFixed(0);
    pdf.text(gv, x - 1, gy + 1, { align: "right" });
  }

  // X axis
  pdf.setDrawColor(200, 220, 240);
  pdf.line(x, y + barAreaH, x + barAreaW, y + barAreaH);

  values.forEach((val, i) => {
    const barH = (val / max) * barAreaH;
    const bx = x + gap + i * (barW + gap);
    const by = y + barAreaH - barH;

    // Bar gradient simulation (lighter top)
    pdf.setFillColor(r, g, b);
    pdf.setGState(pdf.GState({ opacity: 0.85 }));
    pdf.roundedRect(bx, by, barW, barH, 1.5, 1.5, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));
    pdf.setFillColor(Math.min(r + 30, 255), Math.min(g + 30, 255), Math.min(b + 30, 255));
    pdf.setGState(pdf.GState({ opacity: 0.3 }));
    pdf.roundedRect(bx, by, barW, barH * 0.4, 1.5, 1.5, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Value label
    if (barH > 7) {
      pdf.setFontSize(4.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(r, g, b);
      const vStr = formatFn ? formatFn(val) : String(val);
      pdf.text(vStr, bx + barW / 2, by - 1.5, { align: "center" });
    }

    // X label
    pdf.setFontSize(4.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 120, 155);
    const lbl = String(labels[i] || "").slice(0, 6);
    pdf.text(lbl, bx + barW / 2, y + barAreaH + 5, { align: "center" });
  });
}

function drawHBarChart(pdf, x, y, w, h, labels, values, color, formatFn) {
  if (!values || values.length === 0) return;
  const max = Math.max(...values, 1);
  const n = values.length;
  const rowH = h / n;
  const labelW = 45;
  const barMaxW = w - labelW - 28;
  const [r, g, b] = hexRGB(color);

  values.forEach((val, i) => {
    const barW = Math.max((val / max) * barMaxW, 0);
    const by = y + i * rowH;
    const bh = rowH * 0.52;
    const bOffset = rowH * 0.24;

    // Rank badge
    pdf.setFillColor(r, g, b);
    pdf.setGState(pdf.GState({ opacity: 0.12 }));
    rrect(pdf, x, by + bOffset, 10, bh, 1.5, true, false);
    pdf.setGState(pdf.GState({ opacity: 1 }));
    pdf.setFontSize(5.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(r, g, b);
    pdf.text(`#${i + 1}`, x + 5, by + bOffset + bh / 2 + 1.5, { align: "center" });

    // Label
    pdf.setFontSize(5.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(30, 50, 90);
    const lbl = String(labels[i] || "").slice(0, 24);
    pdf.text(lbl, x + 13, by + bOffset + bh / 2 + 1.5);

    // Track
    pdf.setFillColor(230, 238, 250);
    pdf.roundedRect(x + labelW, by + bOffset, barMaxW, bh, 1.5, 1.5, "F");

    // Bar
    pdf.setFillColor(r, g, b);
    pdf.roundedRect(x + labelW, by + bOffset, barW, bh, 1.5, 1.5, "F");

    // Highlight top of bar
    pdf.setFillColor(255, 255, 255);
    pdf.setGState(pdf.GState({ opacity: 0.25 }));
    pdf.roundedRect(x + labelW, by + bOffset, barW, bh * 0.35, 1.5, 1.5, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));

    // Value
    pdf.setFontSize(5.5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(r, g, b);
    const vStr = formatFn ? formatFn(val) : String(val);
    pdf.text(vStr, x + labelW + barMaxW + 2, by + bOffset + bh / 2 + 1.5);
  });
}

function drawDonutChart(pdf, cx, cy, outerR, innerR, values, colors, labels, formatFn) {
  if (!values || values.length === 0) return;
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return;

  let startAngle = -Math.PI / 2;
  const TWO_PI = Math.PI * 2;
  const STEPS = 72;

  values.forEach((val, i) => {
    const slice = (val / total) * TWO_PI;
    const [r, g, b] = hexRGB(colors[i % colors.length]);

    const pts = [];
    for (let s = 0; s <= STEPS; s++) {
      const a = startAngle + (slice / STEPS) * s;
      pts.push([cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR]);
    }
    for (let s = STEPS; s >= 0; s--) {
      const a = startAngle + (slice / STEPS) * s;
      pts.push([cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR]);
    }

    pdf.setFillColor(r, g, b);
    pdf.setDrawColor(255, 255, 255);
    pdf.setLineWidth(0.7);
    pdf.lines(
      pts.slice(1).map((p, idx) => [p[0] - pts[idx][0], p[1] - pts[idx][1]]),
      pts[0][0], pts[0][1],
      [1, 1], "FD", true
    );

    if (val / total > 0.06) {
      const midA = startAngle + slice / 2;
      const labelR = (outerR + innerR) / 2;
      const lx = cx + Math.cos(midA) * labelR;
      const ly = cy + Math.sin(midA) * labelR;
      pdf.setFontSize(5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text(((val / total) * 100).toFixed(1) + "%", lx, ly + 1.5, { align: "center" });
    }

    startAngle += slice;
  });

  // White inner circle
  pdf.setFillColor(255, 255, 255);
  pdf.circle(cx, cy, innerR - 0.4, "F");

  // Center text
  pdf.setFontSize(5.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 41, 96);
  pdf.text("Total", cx, cy - 1.5, { align: "center" });
  pdf.setFontSize(5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 120, 160);
  pdf.text(formatFn ? formatFn(total) : String(total), cx, cy + 4, { align: "center" });

  // Legend
  const cols = 2;
  const legendY = cy + outerR + 7;
  const legendX = cx - outerR;
  const colW = (outerR * 2) / cols;
  values.forEach((val, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const lx = legendX + col * colW;
    const ly = legendY + row * 8;
    const [r, g, b] = hexRGB(colors[i % colors.length]);
    pdf.setFillColor(r, g, b);
    pdf.roundedRect(lx, ly, 5, 4, 1, 1, "F");
    pdf.setFontSize(5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(30, 50, 90);
    pdf.text(String(labels[i] || "").slice(0, 18), lx + 7, ly + 3.5);
  });
}

// ── MAIN exportToPDF ─────────────────────────────────────────
// Signature baru: tidak perlu element (no html2canvas)
// Terima chartData & totals langsung dari Dashboard.jsx
export async function exportToPDF(
  _element,          // tidak dipakai (backward compat)
  filename = "Dashboard_Produksi",
  chartData,
  totals,
  dateStr,
  BNI_COLORS_ARG,
  formatIDR_ARG
) {
  const COLORS = BNI_COLORS_ARG || BNI_COLORS;
  const fmtIDR  = formatIDR_ARG || formatIDR;

  const { default: jsPDF } = await import("jspdf");
  const PAGE_W = 297;
  const PAGE_H = 210;
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const { totalPremium, totalFee, totalPolicy } = totals;
  const { monthly, product, fee, bas, lsr } = chartData;

  const monthlyLabels  = Object.keys(monthly);
  const monthlyValues  = Object.values(monthly);
  const productLabels  = Object.keys(product);
  const productValues  = Object.values(product);
  const feeLabels      = Object.keys(fee);
  const feeValues      = Object.values(fee);
  const basLabels      = bas.map((b) => b[0]);
  const basValues      = bas.map((b) => b[1]);
  const lsrLabels      = lsr.map((b) => b[0]);
  const lsrValues      = lsr.map((b) => b[1]);

  const TOTAL_PAGES = 3;

  // ══════════════════════════════════════════════════
  // SLIDE 1 — Cover + KPI
  // ══════════════════════════════════════════════════
  drawSlideBackground(pdf, PAGE_W, PAGE_H);

  // Navy cover block (left ~44%)
  pdf.setFillColor(0, 41, 96);
  pdf.rect(0, 0, 130, PAGE_H, "F");

  // Orange diagonal accent
  pdf.setFillColor(243, 112, 33);
  pdf.triangle(98, 0, 130, 0, 130, 52, "F");

  // BNI logo box
  pdf.setFillColor(0, 63, 135);
  rrect(pdf, 20, 22, 38, 38, 6, true, false);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("BNI", 39, 38, { align: "center" });
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("LIFE", 39, 47, { align: "center" });

  // Main title
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("Dashboard", 20, 84);
  pdf.text("Produksi", 20, 99);

  // Tagline
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(243, 112, 33);
  pdf.text("BNI Life Insurance — Laporan 2025", 20, 109);

  // Divider
  pdf.setDrawColor(255, 255, 255);
  pdf.setGState(pdf.GState({ opacity: 0.18 }));
  pdf.setLineWidth(0.4);
  pdf.line(20, 115, 112, 115);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Date
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(170, 205, 245);
  pdf.text(`Dicetak: ${dateStr}`, 20, 124);

  // Confidential
  pdf.setFontSize(6.5);
  pdf.setGState(pdf.GState({ opacity: 0.65 }));
  pdf.setTextColor(243, 112, 33);
  pdf.text("INTERNAL — CONFIDENTIAL", 20, 132);
  pdf.setGState(pdf.GState({ opacity: 1 }));

  // Slide number indicator
  for (let n = 0; n < 3; n++) {
    pdf.setFillColor(n === 0 ? 243 : 255, n === 0 ? 112 : 255, n === 0 ? 33 : 255);
    pdf.setGState(pdf.GState({ opacity: n === 0 ? 1 : 0.28 }));
    pdf.circle(22 + n * 11, PAGE_H - 15, 2.8, "F");
    pdf.setGState(pdf.GState({ opacity: 1 }));
  }

  // Right side — KPI stack
  const cardX = 144;
  const cardW  = PAGE_W - cardX - 10;

  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 41, 96);
  pdf.text("Ringkasan Kinerja", cardX, 22);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(148, 163, 184);
  pdf.text("Overview produksi keseluruhan", cardX, 29);

  const kpiData = [
    { label: "Total Premium",   value: fmtIDR(totalPremium), pct: "12.4%", color: "#003F87" },
    { label: "Total Fee Based", value: fmtIDR(totalFee),     pct: "8.1%",  color: "#F37021" },
    { label: "Jumlah Polis",    value: String(totalPolicy),  pct: "5.7%",  color: "#00A99D" },
  ];
  kpiData.forEach((kpi, i) => {
    drawKpiCard(pdf, cardX, 35 + i * 53, cardW, 47, kpi.label, kpi.value, kpi.pct, kpi.color);
  });

  drawFooter(pdf, PAGE_W, PAGE_H, 1, TOTAL_PAGES);

  // ══════════════════════════════════════════════════
  // SLIDE 2 — Premium & Product Charts
  // ══════════════════════════════════════════════════
  pdf.addPage();
  drawSlideBackground(pdf, PAGE_W, PAGE_H);
  drawHeader(pdf, PAGE_W, dateStr, "Analisis Premium", "Tren Premi & Komposisi Produk — 2025");

  // Left: Premium bar chart panel
  drawPanel(pdf, 8, 36, 158, 98, "Premium per Bulan", "Tren premi bulanan tahun 2025", "2025", "#003F87");
  drawBarChart(pdf, 16, 57, 144, 68, monthlyLabels, monthlyValues, "#003F87", fmtIDR);

  // Right: Donut chart panel
  drawPanel(pdf, 171, 36, 118, 98, "Komposisi Produk", "Distribusi per jenis produk", "Produk", "#F37021");
  drawDonutChart(pdf, 230, 83, 27, 13, productValues, COLORS, productLabels, fmtIDR);

  // Bottom: Fee Based bar chart
  drawPanel(pdf, 8, 139, 281, 60, "Fee Based per Bulan", "Tren fee based bulanan tahun 2025", "Fee", "#00A99D");
  drawBarChart(pdf, 16, 160, 267, 32, feeLabels, feeValues, "#00A99D", fmtIDR);

  drawFooter(pdf, PAGE_W, PAGE_H, 2, TOTAL_PAGES);

  // ══════════════════════════════════════════════════
  // SLIDE 3 — Rankings BAS & LSR
  // ══════════════════════════════════════════════════
  pdf.addPage();
  drawSlideBackground(pdf, PAGE_W, PAGE_H);
  drawHeader(pdf, PAGE_W, dateStr, "Ranking Produksi", "Top 5 BAS & Kontribusi LG — 2025");

  // Left: BAS
  drawPanel(pdf, 8, 36, 138, 160, "Top 5 BAS", "BAS dengan premi tertinggi", "Ranking", "#F37021");
  drawHBarChart(pdf, 15, 58, 125, 130, basLabels, basValues, "#F37021", fmtIDR);

  // Right: LSR
  drawPanel(pdf, 151, 36, 138, 160, "Top 5 Kontribusi LG", "LSR dengan premi tertinggi", "Ranking", "#00A99D");
  drawHBarChart(pdf, 158, 58, 125, 130, lsrLabels, lsrValues, "#00A99D", fmtIDR);

  drawFooter(pdf, PAGE_W, PAGE_H, 3, TOTAL_PAGES);

  pdf.save(`${filename}.pdf`);
}