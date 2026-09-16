import type { TabDef, TabId } from "./tabs";

interface TabNavProps {
  tabs: TabDef[];
  activeTab: TabId;
  onSelect: (id: TabId) => void;
}

export function TabNav({ tabs, activeTab, onSelect }: TabNavProps) {
  return (
    <nav className="tab-nav" aria-label="Main">
      {tabs.map((tab) => {
        const selected = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? "tab-btn tab-btn-active" : "tab-btn"}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
