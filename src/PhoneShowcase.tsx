import { useEffect, useMemo, useState } from "react";

type Module = {
  id: string;
  label: string;
  file: string;
  desc: string;
};

const base = import.meta.env.BASE_URL;

// 每个模块对应一个光晕主色，环境光晕随功能变化
const GLOW: Record<string, string> = {
  home: "#e85d4e",
  access: "#3aa0ff",
  service: "#27c39f",
  pay: "#f5a623",
  repair: "#ff6b9d",
  neighbor: "#9b6bff",
  mall: "#ff8a3d",
  life: "#22c3e6",
  homeplus: "#6fcf57",
  gift: "#ff5fa2",
};
function glowColor(id: string): string {
  return GLOW[id] || "#e85d4e";
}

export default function PhoneShowcase({
  onActiveChange,
}: {
  onActiveChange?: (m: Module | undefined) => void;
}) {
  const [modules, setModules] = useState<Module[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [imgOk, setImgOk] = useState<Record<string, boolean>>({});
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`${base}phone-app/modules.json`)
      .then((r) => r.json())
      .then((data: { default: string; modules: Module[] }) => {
        if (!alive) return;
        setModules(data.modules);
        setActiveId(data.default || data.modules[0]?.id || "");
      })
      .catch(() => {
        if (!alive) return;
        const fallback: Module[] = [{ id: "home", label: "首页", file: "home.jpg", desc: "优你家Plus" }];
        setModules(fallback);
        setActiveId("home");
      });
    return () => {
      alive = false;
    };
  }, []);

  const active = useMemo(
    () => modules.find((m) => m.id === activeId) || modules[0],
    [modules, activeId]
  );

  // 当前模块变化时，向上通知（用于场景文案联动）
  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  // 手机下方的入口按钮：始终列出全部模块，当前激活项高亮
  const dock = useMemo<Module[]>(() => {
    if (!active) return [];
    if (active.id === "home") return modules;
    // 非首页：把"首页"放在最前作为返回入口，其余照列
    return [
      { ...modules[0], label: "← 首页" },
      ...modules.slice(1),
    ];
  }, [active, modules]);

  const screenSrc = active ? `${base}phone-app/${active.file}` : "";

  function select(id: string) {
    if (id === activeId) return;
    setSwitching(true);
    setActiveId(id);
    window.setTimeout(() => setSwitching(false), 420);
  }

  if (!active) return null;

  return (
    <div
      className="phoneShowcase"
      style={{ "--glow": glowColor(active.id) } as React.CSSProperties}
    >
      {/* 桌面端：3D 手机 */}
      <div className="phoneStage onlyDesktop">
        <div className="phone3d">
          <div className="phoneFrame">
            <div className="phoneNotch" />
            <div className={`phoneScreen ${switching ? "switching" : ""}`}>
              {imgOk[active.id] === false ? (
                <div className="phonePlaceholder">
                  <span className="phonePhIcon">📱</span>
                  <strong>{active.label}</strong>
                  <small>{active.desc}</small>
                </div>
              ) : (
                <img
                  src={screenSrc}
                  alt={`优你家Plus ${active.label}界面`}
                  onError={() =>
                    setImgOk((p) => ({ ...p, [active.id]: false }))
                  }
                  onLoad={() => setImgOk((p) => ({ ...p, [active.id]: true }))}
                />
              )}
              <div className="phoneGlow" />
            </div>
          </div>
          <div className="phoneShadow" />
        </div>
        {/* 手机下方的入口按钮排 */}
        <div className="phoneDock" role="tablist" aria-label="优你家Plus 功能模块">
          {dock.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === activeId}
              className={`phoneDockBtn ${m.id === activeId ? "active" : ""}`}
              onClick={() => select(m.id)}
            >
              {m.label}
              {m.desc && <span className="phoneDockTip">{m.desc}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 移动端降级：功能卡片网格，无需 3D */}
      <div className="phoneMobileDeck" role="tablist" aria-label="优你家Plus 功能模块">
        {modules.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={m.id === activeId}
            className={`phoneMobileCard ${m.id === activeId ? "active" : ""}`}
            style={{ "--mc": glowColor(m.id) } as React.CSSProperties}
            onClick={() => select(m.id)}
          >
            <span className="phoneMobileCardLabel">{m.label}</span>
            <span className="phoneMobileCardDesc">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
