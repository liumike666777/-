import { useEffect, useMemo, useState } from "react";

type Module = {
  id: string;
  label: string;
  file: string;
  desc: string;
};

const base = import.meta.env.BASE_URL;

export default function PhoneShowcase() {
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
    <div className="phoneShowcase">
      {/* 3D 手机 */}
      <div className="phoneStage">
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
