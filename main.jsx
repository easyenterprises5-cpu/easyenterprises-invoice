import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutGrid, FileText, Users, Settings as SettingsIcon, Plus, Trash2,
  ChevronLeft, Printer, Search, X, Check, Clock, AlertCircle, Pencil,
  IndianRupee, Building2
} from "lucide-react";

// ---------- Design tokens ----------
const C = {
  bg: "#F4F3EF",
  panel: "#FFFFFF",
  charcoal: "#20242B",
  charcoal2: "#2C313A",
  steel: "#3E6B8A",
  steelDark: "#2B4C63",
  brass: "#B98F44",
  brassLight: "#D9B876",
  line: "#E2DFD6",
  textMuted: "#6B7280",
  paid: "#2F7A4F",
  paidBg: "#E7F3EC",
  overdue: "#B84C3E",
  overdueBg: "#FBEAE7",
  draft: "#8A8478",
  draftBg: "#EFEDE6",
  sent: "#8A6A2E",
  sentBg: "#F5EBD6",
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const fmtMoney = (n) =>
  "₹" + (Number(n) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (dateStr, days) => {
  const dt = new Date(dateStr);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

const DEFAULT_LOGO = "data:image/jpeg;base64,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";

const DEFAULT_SETTINGS = {
  companyName: "Easy Enterprises",
  address: "Chennai - 600003, Tamil Nadu",
  phone: "7904612651",
  email: "easyenterprises5@gmail.com",
  gstin: "",
  prefix: "EE",
  nextNumber: 1,
  defaultCgst: 9,
  defaultSgst: 9,
  terms: "Payment due within 7 days. Thank you for your business.",
  logoDataUrl: DEFAULT_LOGO,
};

function computeStatus(inv) {
  if (inv.status === "paid") return "paid";
  if (inv.dueDate && inv.dueDate < todayISO()) return "overdue";
  return inv.status || "draft";
}

const STATUS_STYLE = {
  paid: { bg: C.paidBg, fg: C.paid, label: "Paid", Icon: Check },
  overdue: { bg: C.overdueBg, fg: C.overdue, label: "Overdue", Icon: AlertCircle },
  draft: { bg: C.draftBg, fg: C.draft, label: "Draft", Icon: Pencil },
  sent: { bg: C.sentBg, fg: C.sent, label: "Sent", Icon: Clock },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.draft;
  const I = s.Icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <I size={12} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

// ---------- Storage helpers (browser localStorage, works on any deployed site) ----------
async function loadAll() {
  const out = { invoices: [], clients: [], settings: DEFAULT_SETTINGS };
  try {
    const inv = localStorage.getItem("ee-invoices");
    if (inv) out.invoices = JSON.parse(inv);
  } catch (e) {}
  try {
    const cl = localStorage.getItem("ee-clients");
    if (cl) out.clients = JSON.parse(cl);
  } catch (e) {}
  try {
    const st = localStorage.getItem("ee-settings");
    if (st) out.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(st) };
  } catch (e) {}
  return out;
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [view, setView] = useState("dashboard"); // dashboard | form | preview | clients | settings
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    loadAll().then((d) => {
      setInvoices(d.invoices);
      setClients(d.clients);
      setSettings(d.settings);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("ee-invoices", JSON.stringify(invoices)); } catch (e) {}
  }, [invoices, loaded]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("ee-clients", JSON.stringify(clients)); } catch (e) {}
  }, [clients, loaded]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem("ee-settings", JSON.stringify(settings)); } catch (e) {}
  }, [settings, loaded]);

  const activeInvoice = invoices.find((i) => i.id === activeId) || null;

  const remindersCount = invoices.filter((i) => {
    const s = computeStatus(i);
    if (s === "paid") return false;
    if (s === "overdue") return true;
    if (!i.dueDate) return false;
    const daysLeft = Math.ceil((new Date(i.dueDate) - new Date(todayISO())) / 86400000);
    return daysLeft <= 3;
  }).length;

  function goDashboard() {
    setActiveId(null);
    setView("dashboard");
  }
  function newInvoice() {
    setActiveId(null);
    setView("form");
  }
  function editInvoice(id) {
    setActiveId(id);
    setView("form");
  }
  function previewInvoice(id) {
    setActiveId(id);
    setView("preview");
  }
  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    if (activeId === id) goDashboard();
  }
  function saveInvoice(inv) {
    setInvoices((prev) => {
      const exists = prev.some((i) => i.id === inv.id);
      if (exists) return prev.map((i) => (i.id === inv.id ? inv : i));
      return [inv, ...prev];
    });
    if (!invoices.some((i) => i.id === inv.id) && inv.number) {
      const numPart = parseInt(inv.number.replace(/\D/g, ""), 10);
      if (!isNaN(numPart) && numPart >= settings.nextNumber) {
        setSettings((s) => ({ ...s, nextNumber: numPart + 1 }));
      }
    }
    setActiveId(inv.id);
    setView("preview");
  }
  function markPaid(id) {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: "paid" } : i)));
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-sm" style={{ color: C.textMuted, fontFamily: "Inter, sans-serif" }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.brassLight}; }
        @media print {
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
          body, .app-bg { background: white !important; }
        }
      `}</style>

      <Sidebar view={view} goDashboard={goDashboard} setView={setView} newInvoice={newInvoice} settings={settings} remindersCount={remindersCount} />

      <main className="flex-1 min-w-0">
        {view === "dashboard" && (
          <Dashboard
            invoices={invoices}
            clients={clients}
            newInvoice={newInvoice}
            editInvoice={editInvoice}
            previewInvoice={previewInvoice}
            deleteInvoice={deleteInvoice}
            markPaid={markPaid}
          />
        )}
        {view === "form" && (
          <InvoiceForm
            key={activeId || "new"}
            invoice={activeInvoice}
            clients={clients}
            setClients={setClients}
            settings={settings}
            onCancel={activeInvoice ? () => previewInvoice(activeInvoice.id) : goDashboard}
            onSave={saveInvoice}
          />
        )}
        {view === "preview" && activeInvoice && (
          <InvoicePreview
            invoice={activeInvoice}
            client={clients.find((c) => c.id === activeInvoice.clientId)}
            settings={settings}
            onBack={goDashboard}
            onEdit={() => editInvoice(activeInvoice.id)}
            onMarkPaid={() => markPaid(activeInvoice.id)}
          />
        )}
        {view === "clients" && <ClientsView clients={clients} setClients={setClients} invoices={invoices} />}
        {view === "reminders" && (
          <RemindersView
            invoices={invoices}
            clients={clients}
            previewInvoice={previewInvoice}
            markPaid={markPaid}
          />
        )}
        {view === "settings" && <SettingsView settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}

function Sidebar({ view, setView, goDashboard, newInvoice, settings, remindersCount }) {
  const items = [
    { key: "dashboard", label: "Invoices", icon: FileText },
    { key: "reminders", label: "Reminders", icon: Clock, badge: remindersCount },
    { key: "clients", label: "Clients", icon: Users },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <aside
      className="no-print w-56 shrink-0 flex flex-col justify-between p-5"
      style={{ background: C.charcoal, color: "#EDEBE4" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-8 px-1">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: settings?.logoDataUrl ? "white" : C.brass }}
          >
            {settings?.logoDataUrl ? (
              <img src={settings.logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 size={18} color={C.charcoal} strokeWidth={2.5} />
            )}
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm" style={{ fontFamily: "Sora, sans-serif" }}>
              {settings?.companyName || "Easy Enterprises"}
            </div>
            <div className="text-[11px]" style={{ color: "#9CA3AF" }}>
              Invoicing
            </div>
          </div>
        </div>

        <button
          onClick={newInvoice}
          className="w-full mb-6 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: C.brass, color: C.charcoal }}
        >
          <Plus size={16} strokeWidth={2.5} /> New Invoice
        </button>

        <nav className="flex flex-col gap-1">
          {items.map(({ key, label, icon: Icon, badge }) => {
            const active = view === key || (key === "dashboard" && (view === "preview" || view === "form"));
            return (
              <button
                key={key}
                onClick={() => (key === "dashboard" ? goDashboard() : setView(key))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left transition-colors"
                style={{
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  color: active ? "#FFFFFF" : "#B7B4AC",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {!!badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: C.overdue, color: "white" }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="text-[11px] px-1" style={{ color: "#6B7280" }}>
        Stainless Steel Hangers · Invisible Grills
      </div>
    </aside>
  );
}

function Dashboard({ invoices, clients, newInvoice, editInvoice, previewInvoice, deleteInvoice, markPaid }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const enriched = invoices.map((i) => ({ ...i, computedStatus: computeStatus(i) }));

  const stats = useMemo(() => {
    const outstanding = enriched
      .filter((i) => i.computedStatus !== "paid")
      .reduce((s, i) => s + (i.total || 0), 0);
    const paidThisMonth = enriched
      .filter((i) => {
        if (i.computedStatus !== "paid") return false;
        const d = new Date(i.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, i) => s + (i.total || 0), 0);
    const overdueCount = enriched.filter((i) => i.computedStatus === "overdue").length;
    return { outstanding, paidThisMonth, overdueCount, total: enriched.length };
  }, [enriched]);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "—";

  const filtered = enriched
    .filter((i) => (filter === "all" ? true : i.computedStatus === filter))
    .filter((i) => {
      const q = query.toLowerCase();
      if (!q) return true;
      return i.number?.toLowerCase().includes(q) || clientName(i.clientId).toLowerCase().includes(q);
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>
            Invoices
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>
            Everything billed to your customers, in one place.
          </p>
        </div>
        <button
          onClick={newInvoice}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold"
          style={{ background: C.steel, color: "white" }}
        >
          <Plus size={16} strokeWidth={2.5} /> New Invoice
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Outstanding" value={fmtMoney(stats.outstanding)} accent={C.overdue} />
        <StatCard label="Paid this month" value={fmtMoney(stats.paidThisMonth)} accent={C.paid} />
        <StatCard label="Overdue invoices" value={stats.overdueCount} accent={C.brass} plain />
        <StatCard label="Total invoices" value={stats.total} accent={C.steel} plain />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md flex-1"
          style={{ background: C.panel, border: `1px solid ${C.line}` }}
        >
          <Search size={15} color={C.textMuted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by invoice number or client…"
            className="text-sm w-full outline-none bg-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm px-3 py-2 rounded-md outline-none"
          style={{ background: C.panel, border: `1px solid ${C.line}`, color: C.charcoal }}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={28} color={C.line} className="mx-auto mb-3" />
            <div className="text-sm font-semibold" style={{ color: C.charcoal }}>
              {invoices.length === 0 ? "No invoices yet" : "No invoices match your search"}
            </div>
            <div className="text-xs mt-1" style={{ color: C.textMuted }}>
              {invoices.length === 0 ? "Create your first invoice to get started." : "Try a different search or filter."}
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.bg, color: C.textMuted }} className="text-left">
                <th className="font-medium px-4 py-2.5">Number</th>
                <th className="font-medium px-4 py-2.5">Client</th>
                <th className="font-medium px-4 py-2.5">Date</th>
                <th className="font-medium px-4 py-2.5">Due</th>
                <th className="font-medium px-4 py-2.5 text-right">Amount</th>
                <th className="font-medium px-4 py-2.5">Status</th>
                <th className="font-medium px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t cursor-pointer hover:bg-black/[0.02]"
                  style={{ borderColor: C.line }}
                  onClick={() => previewInvoice(inv.id)}
                >
                  <td className="px-4 py-3 font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
                    {inv.number}
                  </td>
                  <td className="px-4 py-3" style={{ color: C.charcoal }}>{clientName(inv.clientId)}</td>
                  <td className="px-4 py-3" style={{ color: C.textMuted }}>{fmtDate(inv.date)}</td>
                  <td className="px-4 py-3" style={{ color: C.textMuted }}>{fmtDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 text-right font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
                    {fmtMoney(inv.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.computedStatus} />
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {inv.computedStatus !== "paid" && (
                        <button
                          onClick={() => markPaid(inv.id)}
                          className="text-xs font-semibold px-2 py-1 rounded"
                          style={{ color: C.paid }}
                          title="Mark as paid"
                        >
                          Mark paid
                        </button>
                      )}
                      <button onClick={() => editInvoice(inv.id)} title="Edit" className="p-1.5 rounded hover:bg-black/5">
                        <Pencil size={14} color={C.textMuted} />
                      </button>
                      <button onClick={() => deleteInvoice(inv.id)} title="Delete" className="p-1.5 rounded hover:bg-black/5">
                        <Trash2 size={14} color={C.overdue} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, plain }) {
  return (
    <div className="rounded-lg p-4" style={{ background: C.panel, border: `1px solid ${C.line}`, borderLeft: `3px solid ${accent}` }}>
      <div className="text-xs font-medium mb-1.5" style={{ color: C.textMuted }}>{label}</div>
      <div
        className="text-xl font-bold"
        style={{ fontFamily: plain ? "Sora, sans-serif" : "JetBrains Mono, monospace", color: C.charcoal }}
      >
        {value}
      </div>
    </div>
  );
}

function emptyInvoice(settings) {
  return {
    id: uid(),
    number: `${settings.prefix}-${String(settings.nextNumber).padStart(4, "0")}`,
    date: todayISO(),
    dueDate: addDays(todayISO(), 7),
    clientId: "",
    items: [{ id: uid(), desc: "", hsn: "", qty: 1, rate: 0 }],
    cgstPercent: settings.defaultCgst ?? 9,
    sgstPercent: settings.defaultSgst ?? 9,
    discount: 0,
    notes: settings.terms || "",
    status: "draft",
  };
}

function InvoiceForm({ invoice, clients, setClients, settings, onCancel, onSave }) {
  const [form, setForm] = useState(invoice ? { ...invoice, items: invoice.items.map((it) => ({ ...it })) } : emptyInvoice(settings));
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "", address: "", gstin: "" });

  const subtotal = form.items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const cgstAmount = subtotal * ((Number(form.cgstPercent) || 0) / 100);
  const sgstAmount = subtotal * ((Number(form.sgstPercent) || 0) / 100);
  const total = Math.max(0, subtotal + cgstAmount + sgstAmount - (Number(form.discount) || 0));

  function updateItem(id, field, value) {
    setForm((f) => ({ ...f, items: f.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)) }));
  }
  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { id: uid(), desc: "", hsn: "", qty: 1, rate: 0 }] }));
  }
  function removeItem(id) {
    setForm((f) => ({ ...f, items: f.items.length > 1 ? f.items.filter((it) => it.id !== id) : f.items }));
  }
  function saveNewClient() {
    if (!newClient.name.trim()) return;
    const c = { id: uid(), ...newClient };
    setClients((prev) => [...prev, c]);
    setForm((f) => ({ ...f, clientId: c.id }));
    setNewClient({ name: "", phone: "", email: "", address: "", gstin: "" });
    setShowNewClient(false);
  }
  function handleSave() {
    if (!form.clientId) {
      alert("Please select or add a client before saving.");
      return;
    }
    onSave({ ...form, subtotal, cgstAmount, sgstAmount, total });
  }

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={onCancel} className="no-print flex items-center gap-1 text-sm mb-5" style={{ color: C.textMuted }}>
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>
        {invoice ? "Edit invoice" : "New invoice"}
      </h1>

      <div className="rounded-lg p-6 mb-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <Field label="Invoice number">
            <input
              value={form.number}
              onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
              className="input-field"
              style={inputStyle}
            />
          </Field>
          <Field label="Invoice date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              style={inputStyle}
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Bill to">
          {!showNewClient ? (
            <div className="flex gap-2">
              <select
                value={form.clientId}
                onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowNewClient(true)}
                className="px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
                style={{ background: C.bg, border: `1px solid ${C.line}`, color: C.charcoal }}
              >
                + New client
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-md space-y-2" style={{ background: C.bg, border: `1px solid ${C.line}` }}>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Client / business name" value={newClient.name} onChange={(e) => setNewClient((n) => ({ ...n, name: e.target.value }))} style={inputStyle} />
                <input placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient((n) => ({ ...n, phone: e.target.value }))} style={inputStyle} />
                <input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient((n) => ({ ...n, email: e.target.value }))} style={inputStyle} />
                <input placeholder="GSTIN (optional)" value={newClient.gstin} onChange={(e) => setNewClient((n) => ({ ...n, gstin: e.target.value }))} style={inputStyle} />
              </div>
              <textarea placeholder="Address" value={newClient.address} onChange={(e) => setNewClient((n) => ({ ...n, address: e.target.value }))} style={{ ...inputStyle, width: "100%", minHeight: 50 }} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowNewClient(false)} className="px-3 py-1.5 rounded text-sm" style={{ color: C.textMuted }}>Cancel</button>
                <button onClick={saveNewClient} className="px-3 py-1.5 rounded text-sm font-semibold text-white" style={{ background: C.steel }}>Save client</button>
              </div>
            </div>
          )}
        </Field>
      </div>

      <div className="rounded-lg p-6 mb-5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: C.textMuted }}>Line items</div>
        <div className="grid grid-cols-[1fr_90px_70px_100px_100px_32px] gap-2 text-xs font-medium mb-2" style={{ color: C.textMuted }}>
          <div>Description</div><div>HSN/SAC</div><div>Qty</div><div>Rate (₹)</div><div className="text-right">Amount</div><div></div>
        </div>
        {form.items.map((it) => (
          <div key={it.id} className="grid grid-cols-[1fr_90px_70px_100px_100px_32px] gap-2 mb-2 items-center">
            <input
              placeholder="e.g. Stainless steel ceiling hanger installation"
              value={it.desc}
              onChange={(e) => updateItem(it.id, "desc", e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="HSN/SAC"
              value={it.hsn}
              onChange={(e) => updateItem(it.id, "hsn", e.target.value)}
              style={inputStyle}
            />
            <input type="number" min="0" value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} style={inputStyle} />
            <input type="number" min="0" value={it.rate} onChange={(e) => updateItem(it.id, "rate", e.target.value)} style={inputStyle} />
            <div className="text-sm text-right font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
              {fmtMoney((Number(it.qty) || 0) * (Number(it.rate) || 0))}
            </div>
            <button onClick={() => removeItem(it.id)} className="p-1.5 rounded hover:bg-black/5">
              <X size={14} color={C.textMuted} />
            </button>
          </div>
        ))}
        <button onClick={addItem} className="flex items-center gap-1 text-sm font-semibold mt-2" style={{ color: C.steel }}>
          <Plus size={14} /> Add line item
        </button>

        <div className="flex justify-end mt-5">
          <div className="w-64 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: C.textMuted }}>Subtotal</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: C.textMuted }}>CGST %</span>
              <input
                type="number" min="0" value={form.cgstPercent}
                onChange={(e) => setForm((f) => ({ ...f, cgstPercent: e.target.value }))}
                style={{ ...inputStyle, width: 80, textAlign: "right" }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: C.textMuted }}>SGST %</span>
              <input
                type="number" min="0" value={form.sgstPercent}
                onChange={(e) => setForm((f) => ({ ...f, sgstPercent: e.target.value }))}
                style={{ ...inputStyle, width: 80, textAlign: "right" }}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: C.textMuted }}>Discount (₹)</span>
              <input
                type="number" min="0" value={form.discount}
                onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                style={{ ...inputStyle, width: 80, textAlign: "right" }}
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t font-bold text-base" style={{ borderColor: C.line, color: C.charcoal }}>
              <span>Total</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6 mb-6" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <Field label="Notes / terms">
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            style={{ ...inputStyle, width: "100%", minHeight: 70 }}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2.5 rounded-md text-sm font-semibold" style={{ color: C.textMuted }}>
          Cancel
        </button>
        <button onClick={handleSave} className="px-5 py-2.5 rounded-md text-sm font-semibold text-white" style={{ background: C.steel }}>
          Save invoice
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${C.line}`,
  fontSize: 14,
  outline: "none",
  color: C.charcoal,
  background: "white",
  fontFamily: "Inter, sans-serif",
};

function Field({ label, children }) {
  return (
    <div className="mb-1">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: C.textMuted }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InvoicePreview({ invoice, client, settings, onBack, onEdit, onMarkPaid }) {
  const status = computeStatus(invoice);
  return (
    <div className="p-8 max-w-3xl">
      <div className="no-print flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.textMuted }}>
          <ChevronLeft size={16} /> Back to invoices
        </button>
        <div className="flex gap-2">
          {status !== "paid" && (
            <button onClick={onMarkPaid} className="px-3 py-2 rounded-md text-sm font-semibold" style={{ background: C.paidBg, color: C.paid }}>
              Mark as paid
            </button>
          )}
          <button onClick={onEdit} className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold" style={{ background: C.bg, border: `1px solid ${C.line}`, color: C.charcoal }}>
            <Pencil size={14} /> Edit
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-semibold text-white" style={{ background: C.steel }}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="print-area rounded-lg p-10 relative overflow-hidden" style={{ background: "white", border: `1px solid ${C.line}` }}>
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${C.steelDark}, ${C.brass})` }} />

        {status === "paid" && (
          <div
            className="absolute font-extrabold pointer-events-none select-none"
            style={{
              top: 70, right: 50, fontSize: 42, color: C.paid, opacity: 0.18,
              border: `4px solid ${C.paid}`, borderRadius: 8, padding: "4px 18px",
              transform: "rotate(-12deg)", fontFamily: "Sora, sans-serif", letterSpacing: 2,
            }}
          >
            PAID
          </div>
        )}

        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden" style={{ background: settings.logoDataUrl ? "white" : C.brass, border: settings.logoDataUrl ? `1px solid ${C.line}` : "none" }}>
                {settings.logoDataUrl ? (
                  <img src={settings.logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Building2 size={16} color="white" />
                )}
              </div>
              <div className="text-lg font-bold" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>
                {settings.companyName}
              </div>
            </div>
            <div className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
              {settings.address}<br />
              {settings.phone} · {settings.email}
              {settings.gstin && <><br />GSTIN: {settings.gstin}</>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold tracking-wide" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>
              INVOICE
            </div>
            <div className="text-sm font-semibold mt-1" style={{ fontFamily: "JetBrains Mono, monospace", color: C.steel }}>
              {invoice.number}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: C.textMuted }}>Bill to</div>
            <div className="text-sm font-semibold" style={{ color: C.charcoal }}>{client?.name || "—"}</div>
            <div className="text-xs mt-0.5 leading-relaxed" style={{ color: C.textMuted }}>
              {client?.address}
              {client?.phone && <><br />{client.phone}</>}
              {client?.email && <><br />{client.email}</>}
              {client?.gstin && <><br />GSTIN: {client.gstin}</>}
            </div>
          </div>
          <div className="text-right">
            <div className="flex justify-end gap-8 text-xs mb-1">
              <span style={{ color: C.textMuted }}>Invoice date</span>
              <span className="font-semibold w-24" style={{ color: C.charcoal }}>{fmtDate(invoice.date)}</span>
            </div>
            <div className="flex justify-end gap-8 text-xs">
              <span style={{ color: C.textMuted }}>Due date</span>
              <span className="font-semibold w-24" style={{ color: C.charcoal }}>{fmtDate(invoice.dueDate)}</span>
            </div>
            <div className="mt-2 flex justify-end"><StatusBadge status={status} /></div>
          </div>
        </div>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.charcoal}` }} className="text-left">
              <th className="pb-2 font-semibold text-xs uppercase tracking-wide" style={{ color: C.charcoal }}>Description</th>
              <th className="pb-2 font-semibold text-xs uppercase tracking-wide" style={{ color: C.charcoal }}>HSN/SAC</th>
              <th className="pb-2 font-semibold text-xs uppercase tracking-wide text-right" style={{ color: C.charcoal }}>Qty</th>
              <th className="pb-2 font-semibold text-xs uppercase tracking-wide text-right" style={{ color: C.charcoal }}>Rate</th>
              <th className="pb-2 font-semibold text-xs uppercase tracking-wide text-right" style={{ color: C.charcoal }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it) => (
              <tr key={it.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                <td className="py-2.5" style={{ color: C.charcoal }}>{it.desc || "—"}</td>
                <td className="py-2.5" style={{ color: C.textMuted, fontFamily: "JetBrains Mono, monospace" }}>{it.hsn || "—"}</td>
                <td className="py-2.5 text-right" style={{ color: C.textMuted }}>{it.qty}</td>
                <td className="py-2.5 text-right" style={{ fontFamily: "JetBrains Mono, monospace", color: C.textMuted }}>{fmtMoney(it.rate)}</td>
                <td className="py-2.5 text-right font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
                  {fmtMoney((Number(it.qty) || 0) * (Number(it.rate) || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-56 space-y-1.5 text-sm">
            <div className="flex justify-between"><span style={{ color: C.textMuted }}>Subtotal</span><span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(invoice.subtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: C.textMuted }}>CGST ({invoice.cgstPercent || 0}%)</span><span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(invoice.cgstAmount)}</span></div>
            <div className="flex justify-between"><span style={{ color: C.textMuted }}>SGST ({invoice.sgstPercent || 0}%)</span><span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(invoice.sgstAmount)}</span></div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between"><span style={{ color: C.textMuted }}>Discount</span><span style={{ fontFamily: "JetBrains Mono, monospace" }}>−{fmtMoney(invoice.discount)}</span></div>
            )}
            <div className="flex justify-between pt-2 mt-1 font-bold text-base" style={{ borderTop: `2px solid ${C.charcoal}`, color: C.charcoal }}>
              <span>Total due</span>
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{fmtMoney(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="pt-5" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: C.textMuted }}>Notes</div>
            <div className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: C.textMuted }}>{invoice.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RemindersView({ invoices, clients, previewInvoice, markPaid }) {
  const clientName = (id) => clients.find((c) => c.id === id)?.name || "—";

  const relevant = invoices
    .map((i) => ({ ...i, computedStatus: computeStatus(i) }))
    .filter((i) => i.computedStatus !== "paid" && i.dueDate)
    .map((i) => ({ ...i, daysLeft: Math.ceil((new Date(i.dueDate) - new Date(todayISO())) / 86400000) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const overdue = relevant.filter((i) => i.computedStatus === "overdue");
  const dueSoon = relevant.filter((i) => i.computedStatus !== "overdue" && i.daysLeft <= 3);
  const upcoming = relevant.filter((i) => i.computedStatus !== "overdue" && i.daysLeft > 3);

  const Row = ({ inv }) => (
    <div
      className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-black/[0.02]"
      onClick={() => previewInvoice(inv.id)}
    >
      <div>
        <div className="text-sm font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
          {inv.number}
        </div>
        <div className="text-xs" style={{ color: C.textMuted }}>{clientName(inv.clientId)}</div>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right">
          <div className="text-sm font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: C.charcoal }}>
            {fmtMoney(inv.total)}
          </div>
          <div className="text-xs" style={{ color: inv.daysLeft < 0 ? C.overdue : C.textMuted }}>
            {inv.daysLeft < 0
              ? `${Math.abs(inv.daysLeft)} day${Math.abs(inv.daysLeft) === 1 ? "" : "s"} overdue`
              : inv.daysLeft === 0
              ? "Due today"
              : `Due in ${inv.daysLeft} day${inv.daysLeft === 1 ? "" : "s"}`}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); markPaid(inv.id); }}
          className="text-xs font-semibold px-2.5 py-1.5 rounded"
          style={{ background: C.paidBg, color: C.paid }}
        >
          Mark paid
        </button>
      </div>
    </div>
  );

  const Section = ({ title, items, tint }) =>
    items.length > 0 && (
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wide mb-2 px-1" style={{ color: tint }}>
          {title} · {items.length}
        </div>
        <div className="rounded-lg overflow-hidden divide-y" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
          {items.map((inv, idx) => (
            <div key={inv.id} style={{ borderTop: idx === 0 ? "none" : `1px solid ${C.line}` }}>
              <Row inv={inv} />
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>
        Reminders
      </h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>
        Unpaid invoices that are overdue or coming due soon.
      </p>

      {relevant.length === 0 ? (
        <div className="rounded-lg p-12 text-center" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
          <Clock size={28} color={C.line} className="mx-auto mb-3" />
          <div className="text-sm font-semibold" style={{ color: C.charcoal }}>Nothing to chase right now</div>
          <div className="text-xs mt-1" style={{ color: C.textMuted }}>Every unpaid invoice is comfortably within its due date.</div>
        </div>
      ) : (
        <>
          <Section title="Overdue" items={overdue} tint={C.overdue} />
          <Section title="Due within 3 days" items={dueSoon} tint={C.brass} />
          <Section title="Upcoming" items={upcoming} tint={C.textMuted} />
        </>
      )}
    </div>
  );
}

function ClientsView({ clients, setClients, invoices }) {
  const [editing, setEditing] = useState(null); // client object or "new"
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", gstin: "" });

  function startEdit(c) {
    setEditing(c.id);
    setForm(c);
  }
  function startNew() {
    setEditing("new");
    setForm({ name: "", phone: "", email: "", address: "", gstin: "" });
  }
  function save() {
    if (!form.name.trim()) return;
    if (editing === "new") {
      setClients((prev) => [...prev, { id: uid(), ...form }]);
    } else {
      setClients((prev) => prev.map((c) => (c.id === editing ? { ...form, id: editing } : c)));
    }
    setEditing(null);
  }
  function remove(id) {
    const used = invoices.some((i) => i.clientId === id);
    if (used && !confirm("This client has invoices linked to them. Delete anyway?")) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>Clients</h1>
        <button onClick={startNew} className="flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-semibold text-white" style={{ background: C.steel }}>
          <Plus size={16} /> Add client
        </button>
      </div>

      {editing && (
        <div className="rounded-lg p-5 mb-5 space-y-2" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Client / business name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={inputStyle} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={inputStyle} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={inputStyle} />
            <input placeholder="GSTIN (optional)" value={form.gstin} onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))} style={inputStyle} />
          </div>
          <textarea placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={{ ...inputStyle, width: "100%", minHeight: 50 }} />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded text-sm" style={{ color: C.textMuted }}>Cancel</button>
            <button onClick={save} className="px-3 py-1.5 rounded text-sm font-semibold text-white" style={{ background: C.steel }}>Save</button>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        {clients.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: C.textMuted }}>No clients yet. Add your first one.</div>
        ) : (
          clients.map((c, idx) => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: idx === 0 ? "none" : `1px solid ${C.line}` }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: C.charcoal }}>{c.name}</div>
                <div className="text-xs" style={{ color: C.textMuted }}>{[c.phone, c.email].filter(Boolean).join(" · ")}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(c)} className="p-1.5 rounded hover:bg-black/5"><Pencil size={14} color={C.textMuted} /></button>
                <button onClick={() => remove(c.id)} className="p-1.5 rounded hover:bg-black/5"><Trash2 size={14} color={C.overdue} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsView({ settings, setSettings }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  function save() {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "Sora, sans-serif", color: C.charcoal }}>Settings</h1>
      <div className="rounded-lg p-6 space-y-4" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
        <Field label="Logo">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-md flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: C.bg, border: `1px solid ${C.line}` }}
            >
              {form.logoDataUrl ? (
                <img src={form.logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 size={22} color={C.textMuted} />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="px-3 py-2 rounded-md text-sm font-semibold cursor-pointer inline-block"
                style={{ background: C.bg, border: `1px solid ${C.line}`, color: C.charcoal }}
              >
                Upload logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setForm((f) => ({ ...f, logoDataUrl: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {form.logoDataUrl && (
                <button
                  onClick={() => setForm((f) => ({ ...f, logoDataUrl: "" }))}
                  className="text-xs font-medium text-left"
                  style={{ color: C.overdue }}
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>
        </Field>
        <Field label="Company name">
          <input value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
        </Field>
        <Field label="Address">
          <textarea value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} style={{ ...inputStyle, width: "100%", minHeight: 50 }} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
        </div>
        <Field label="GSTIN (optional)">
          <input value={form.gstin} onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
        </Field>
        <div className="grid grid-cols-4 gap-3">
          <Field label="Invoice prefix">
            <input value={form.prefix} onChange={(e) => setForm((f) => ({ ...f, prefix: e.target.value }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
          <Field label="Next number">
            <input type="number" value={form.nextNumber} onChange={(e) => setForm((f) => ({ ...f, nextNumber: Number(e.target.value) }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
          <Field label="Default CGST %">
            <input type="number" value={form.defaultCgst} onChange={(e) => setForm((f) => ({ ...f, defaultCgst: Number(e.target.value) }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
          <Field label="Default SGST %">
            <input type="number" value={form.defaultSgst} onChange={(e) => setForm((f) => ({ ...f, defaultSgst: Number(e.target.value) }))} style={{ ...inputStyle, width: "100%" }} />
          </Field>
        </div>
        <Field label="Default notes / terms">
          <textarea value={form.terms} onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))} style={{ ...inputStyle, width: "100%", minHeight: 60 }} />
        </Field>
        <div className="flex items-center gap-3 pt-2">
          <button onClick={save} className="px-5 py-2.5 rounded-md text-sm font-semibold text-white" style={{ background: C.steel }}>Save settings</button>
          {saved && <span className="text-sm font-medium" style={{ color: C.paid }}>Saved ✓</span>}
        </div>
      </div>
    </div>
  );
}
