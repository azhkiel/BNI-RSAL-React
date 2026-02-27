export default function BottomNav({ page, onNavigate }) {
  const items = [
    { icon: "📊", label: "Dashboard", key: "dashboard" },
    { icon: "📝", label: "Input Data", key: "crud" },
    {
      icon: "📁",
      label: "Excel",
      href: "https://docs.google.com/spreadsheets/d/1MPb4aMPFwzZM_xheqP_Gzrxf8Gn-eMxa-NOyqRekJgQ/edit?usp=sharing",
    },
    { icon: "➕", label: "Tambah", key: "crud" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="bottom-nav-item"
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ) : (
          <button
            key={item.label}
            className={"bottom-nav-item" + (page === item.key ? " active" : "")}
            onClick={() => onNavigate(item.key)}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      )}
    </nav>
  );
}
