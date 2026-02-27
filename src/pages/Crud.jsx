import { useState } from "react";
import { createData, updateData, deleteData } from "../api";
import { formatIDR } from "../utils";

const EMPTY_FORM = {
  Periode: "", PolicyNumber: "", freq: "", Product: "",
  Premium: "", Fee: "", BAS: "", NPPBAS: "", LSR: "", NPPBSR: "", LSRUnit: "",
};

function Field({ label, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export default function Crud({ data, loading, onRefresh }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [editRow, setEdit]  = useState(null);
  const [saving, setSaving] = useState(false);

  function setF(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function buildPayload(source) {
    return {
      Periode: source.Periode,
      "Policy Number": source.PolicyNumber,
      "Issued Date": new Date().toISOString(),
      Frequency: source.freq,
      "Policy Status": "Inforce",
      "SPAJ Status": "Inforce",
      Product: source.Product,
      "Basic Premium Regular": Number(source.Premium),
      "Fee Based": Number(source.Fee),
      "Branch Name": "KCP RSAL DR.RAMELAN",
      NPPBAS: "BAS-" + source.NPPBAS,
      "BAS Name": source.BAS,
      "LSR NPP": source.NPPBSR,
      "LSR Name": source.LSR,
      "LSR Unit": source.LSRUnit,
    };
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    await createData(buildPayload(form));
    setForm(EMPTY_FORM);
    setSaving(false);
    onRefresh();
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    await updateData({
      id: editRow.id,
      Periode: editRow.Periode,
      Product: editRow.Product,
      "Basic Premium Regular": Number(editRow.Premium),
      "Fee Based": Number(editRow.Fee),
      "BAS Name": editRow.BAS,
      "LSR Name": editRow.LSR,
    });
    setEdit(null);
    setSaving(false);
    onRefresh();
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus data?")) return;
    await deleteData(id);
    onRefresh();
  }

  function openEdit(row) {
    setEdit({
      id: row.id,
      Periode: row["Periode"],
      Product: row["Product"],
      Premium: row["Basic Premium Regular"],
      Fee: row["Fee Based"],
      BAS: row["BAS Name"],
      LSR: row["LSR Name"],
    });
  }

  return (
    <div style={{ padding: "24px 32px" }} className="page-main">

      {/* ── Create Form Card ── */}
      <div className="card fade-up d1" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontWeight: 700, color: "#002960", fontSize: 16 }}>Tambah Data Baru</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Isi semua kolom untuk menambahkan entri baru
            </p>
          </div>
          <span className="badge">📋 Form Input</span>
        </div>

        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <Field label="Periode">
              <input type="text" className="form-input" placeholder="cth: January,2025"
                value={form.Periode} onChange={(e) => setF("Periode", e.target.value)} required />
            </Field>
            <Field label="Policy Number">
              <input type="number" className="form-input" placeholder="cth: 1234567890"
                value={form.PolicyNumber} onChange={(e) => setF("PolicyNumber", e.target.value)} required />
            </Field>
            <Field label="Frequency">
              <select className="form-input" value={form.freq}
                onChange={(e) => setF("freq", e.target.value)} required>
                <option value="" disabled>Pilih Frequency</option>
                {["Single", "Monthly", "Quarterly", "Yearly"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Product">
              <select className="form-input" value={form.Product}
                onChange={(e) => setF("Product", e.target.value)} required>
                <option value="" disabled>Pilih Produk</option>
                {["BLUP", "BLSD", "BLHYNP1"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Basic Premium (Rp)">
              <input type="number" className="form-input" placeholder="0"
                value={form.Premium} onChange={(e) => setF("Premium", e.target.value)} required />
            </Field>
            <Field label="Fee Based (Rp)">
              <input type="number" className="form-input" placeholder="0"
                value={form.Fee} onChange={(e) => setF("Fee", e.target.value)} required />
            </Field>
            <Field label="BAS Name">
              <input type="text" className="form-input" placeholder="Nama BAS"
                value={form.BAS} onChange={(e) => setF("BAS", e.target.value)} required />
            </Field>
            <Field label="NPP BAS">
              <input type="number" className="form-input" placeholder="NPP BAS"
                value={form.NPPBAS} onChange={(e) => setF("NPPBAS", e.target.value)} required />
            </Field>
            <Field label="LSR Name">
              <input type="text" className="form-input" placeholder="Nama LSR"
                value={form.LSR} onChange={(e) => setF("LSR", e.target.value)} required />
            </Field>
            <Field label="NPP LSR">
              <input type="number" className="form-input" placeholder="NPP LSR"
                value={form.NPPBSR} onChange={(e) => setF("NPPBSR", e.target.value)} required />
            </Field>
            <Field label="LSR Unit Name">
              <input type="text" className="form-input" placeholder="Unit LSR"
                value={form.LSRUnit} onChange={(e) => setF("LSRUnit", e.target.value)} required />
            </Field>
            <div style={{ gridColumn: "1 / -1", paddingTop: 4 }}>
              <button type="submit" className="btn-primary" disabled={saving}>
                ＋ {saving ? "Menyimpan..." : "Tambah Data"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Data Table Card ── */}
      <div className="card fade-up d2">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", borderBottom: "1px solid #f1f5f9",
        }}>
          <div>
            <h2 style={{ fontWeight: 700, color: "#002960", fontSize: 16 }}>Daftar Data Produksi</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Kelola semua entri data yang sudah tersimpan
            </p>
          </div>
          <span className="badge">📂 Data Table</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Product</th>
                <th>Premium</th>
                <th>BAS</th>
                <th>LSR</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
                    Memuat data...
                  </td>
                </tr>
              ) : !data || data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 14 }}>
                    Belum ada data
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>{row["Periode"]}</td>
                    <td>{row["Product"]}</td>
                    <td>{formatIDR(row["Basic Premium Regular"])}</td>
                    <td>{row["BAS Name"]}</td>
                    <td>{row["LSR Name"]}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-edit" onClick={() => openEdit(row)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", paddingTop: 24, paddingBottom: 8 }}>
        © 2025 BNI Life Insurance — Dashboard Produksi Internal
      </div>

      {/* ── Edit Modal ── */}
      {editRow && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setEdit(null)}
        >
          <div className="modal-box modal-animate">
            <div className="modal-header">
              <div>
                <h2 style={{ fontWeight: 700, color: "#002960", fontSize: 16 }}>Edit Data</h2>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                  Perbarui informasi entri yang dipilih
                </p>
              </div>
              <button
                onClick={() => setEdit(null)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#94a3b8", background: "transparent", border: "none",
                  cursor: "pointer", fontSize: 18, fontWeight: 700,
                }}
              >✕</button>
            </div>

            <form onSubmit={handleUpdate} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="grid-2">
                <Field label="Periode">
                  <input type="text" className="form-input" value={editRow.Periode}
                    onChange={(e) => setEdit((m) => ({ ...m, Periode: e.target.value }))} required />
                </Field>
                <Field label="Product">
                  <input type="text" className="form-input" value={editRow.Product}
                    onChange={(e) => setEdit((m) => ({ ...m, Product: e.target.value }))} required />
                </Field>
              </div>
              <div className="grid-2">
                <Field label="Basic Premium (Rp)">
                  <input type="number" className="form-input" value={editRow.Premium}
                    onChange={(e) => setEdit((m) => ({ ...m, Premium: e.target.value }))} required />
                </Field>
                <Field label="Fee Based (Rp)">
                  <input type="number" className="form-input" value={editRow.Fee}
                    onChange={(e) => setEdit((m) => ({ ...m, Fee: e.target.value }))} required />
                </Field>
              </div>
              <div className="grid-2">
                <Field label="BAS Name">
                  <input type="text" className="form-input" value={editRow.BAS}
                    onChange={(e) => setEdit((m) => ({ ...m, BAS: e.target.value }))} required />
                </Field>
                <Field label="LSR Name">
                  <input type="text" className="form-input" value={editRow.LSR}
                    onChange={(e) => setEdit((m) => ({ ...m, LSR: e.target.value }))} required />
                </Field>
              </div>
              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                  ✓ {saving ? "Menyimpan..." : "Update Data"}
                </button>
                <button type="button" className="btn-ghost" style={{ flex: 1 }} onClick={() => setEdit(null)}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
