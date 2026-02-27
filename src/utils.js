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

export async function exportToPDF(element, filename = "Dashboard_Produksi") {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  // Landscape A4
  const PAGE_W = 297;
  const PAGE_H = 210;
  const MARGIN = 10;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#F0F4FA",
    onclone: (clonedDoc, clonedEl) => {
      const originalCanvases = element.querySelectorAll("canvas");
      const clonedCanvases   = clonedEl.querySelectorAll("canvas");
      originalCanvases.forEach((orig, i) => {
        const clone = clonedCanvases[i];
        if (!clone) return;
        clone.width  = orig.width;
        clone.height = orig.height;
        clone.getContext("2d").drawImage(orig, 0, 0);
      });
      clonedEl.querySelectorAll("*").forEach((el) => {
        el.style.overflow  = "visible";
        el.style.overflowX = "visible";
        el.style.overflowY = "visible";
      });
      clonedEl.querySelectorAll(".kpi-grid").forEach((el) => {
        el.style.display             = "grid";
        el.style.gridTemplateColumns = "repeat(3, 1fr)";
        el.style.overflowX           = "visible";
      });
    },
  });

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const contentW  = PAGE_W - MARGIN * 2;   // 277mm usable width
  const contentH  = PAGE_H - MARGIN * 2;   // 190mm usable height per page
  const pxPerMm   = canvas.width / contentW;
  const sliceH_px = contentH * pxPerMm;

  let offsetY_px = 0;
  let pageNum    = 0;

  while (offsetY_px < canvas.height) {
    const remaining = canvas.height - offsetY_px;
    const thisSlice = Math.min(sliceH_px, remaining);

    const slice = document.createElement("canvas");
    slice.width  = canvas.width;
    slice.height = thisSlice;
    slice.getContext("2d").drawImage(
      canvas,
      0, offsetY_px, canvas.width, thisSlice,
      0, 0,          canvas.width, thisSlice
    );

    const sliceImgH = thisSlice / pxPerMm;

    if (pageNum > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", MARGIN, MARGIN, contentW, sliceImgH);

    offsetY_px += sliceH_px;
    pageNum++;
  }

  // Footer tiap halaman
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(
      `© 2025 BNI Life Insurance — Dashboard Produksi Internal   |   Halaman ${i} dari ${totalPages}`,
      PAGE_W / 2, PAGE_H - 4,
      { align: "center" }
    );
  }

  pdf.save(`${filename}.pdf`);
}
