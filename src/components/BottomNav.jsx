import { LayoutDashboard, FilePen } from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "crud",      label: "Input Data", Icon: FilePen },
];

export default function BottomNav({ page, onNavigate }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={"bottom-nav-item" + (page === key ? " active" : "")}
          onClick={() => onNavigate(key)}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
}