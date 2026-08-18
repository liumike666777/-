import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scenes, VIDEO_DURATION } from "./scenes";
import PhoneShowcase from "./PhoneShowcase";

const contactEmail = "ynhl@cohl.com";
const contactName = "商务合作联系人";
const contactPhone = "400-888-8888";
const repoUrl = `mailto:${contactEmail}`;

// 与 PhoneShowcase 一致的功能色，用于场景文案联动高亮
const GLOW: Record<string, string> = {
  home: "#e85d4e", access: "#3aa0ff", service: "#27c39f", pay: "#f5a623",
  repair: "#ff6b9d", neighbor: "#9b6bff", mall: "#ff8a3d", life: "#22c3e6",
  homeplus: "#6fcf57", gift: "#ff5fa2",
};
function glowColor(id: string): string {
  return GLOW[id] || "#e85d4e";
}
const assetBase = import.meta.env.BASE_URL;

// ── 八大服务详情数据 ──────────────────────────────────────────
type ServiceDetail = {
  id: string;
  name: string;
  shortDesc: string;
  highlights: { label: string; value: string }[];
  subServices: string[];
  accent: string;
};

const serviceDetails: ServiceDetail[] = [
  {
    id: "asset",
    name: "资产运营",
    shortDesc: "依托中海物业全国服务项目场地资源，从业主真实需求出发，创新打造「空间+生活」一体化运营体系。通过数字化运营平台与资源集约化管理，把空间资源盘活成有温度、有价值的生活场景。",
    highlights: [
      { label: "覆盖车位", value: "20万+" },
      { label: "运营广告位", value: "6万+" },
      { label: "服务场地", value: "6万+" },
    ],
    subServices: ["车位运营", "公区运营", "广告运营", "会所运营", "便民自助终端", "市集活动", "临时摆展"],
    accent: "#3B6FD4",
  },
  {
    id: "rental",
    name: "租售服务",
    shortDesc: "依托中海物业服务园区，打造社区型房产经纪机构「中海租售」。业务涵盖住宅、车位、商业写字楼各业态的二手房中介租售及新房项目分销代理。",
    highlights: [
      { label: "服务城市", value: "30+" },
      { label: "租售门店", value: "110+" },
      { label: "经纪人", value: "500+" },
    ],
    subServices: ["二手买卖", "二手租赁", "新房分销", "代办咨询", "交易撮合", "过户代办", "权证代办"],
    accent: "#5BA3D0",
  },
  {
    id: "home",
    name: "美居装修",
    shortDesc: "为新房和存量住宅业主提供从设计、施工、整装、局改到产品选购的一站式家装服务，并配套交付管控、售后维护等全流程托管。",
    highlights: [
      { label: "服务深耕", value: "7年" },
      { label: "服务客户", value: "70万" },
      { label: "优势品类", value: "10+" },
    ],
    subServices: ["全屋整装", "家具定制", "墙面刷新", "厨卫翻新", "新房拎包", "毛坯装修", "防水改造"],
    accent: "#5CCB8A",
  },
  {
    id: "life",
    name: "生活服务",
    shortDesc: "深耕全龄家庭日常吃喝玩乐的高频需求，打造「物业+生活服务」体系，通过线上电商与线下门店的双线布局，让业主在家门口体验「十五分钟便民生活圈」。",
    highlights: [
      { label: "服务客户", value: "200万+" },
      { label: "产品复购均值", value: "30%" },
      { label: "消费满意度", value: "92%" },
    ],
    subServices: ["平台商城", "家政服务", "家电清洗", "入户维修", "搬家服务", "衣物洗护", "社区团购"],
    accent: "#E8A84A",
  },
  {
    id: "ops",
    name: "运维管理",
    shortDesc: "做智慧建筑空间运维专家，围绕物业管理全链条，提供技术监管、公区运维、电梯更新及加装等多维度工程增值服务。",
    highlights: [
      { label: "运维项目", value: "2000+" },
      { label: "特种设备年检合格率", value: "100%" },
      { label: "设备故障平均修复时长", value: "92%" },
    ],
    subServices: ["公区维修", "消防维修改造", "电梯更新加装", "屋面防水", "地库地坪漆", "园区归家动线焕新"],
    accent: "#4A90A4",
  },
  {
    id: "energy",
    name: "能源管理",
    shortDesc: "致力发挥「深度管理+技术整合」的双重优势，构建涵盖技术研发、产品供应及专业运维的一站式能源管理闭环，与资产持有者并肩践行双碳战略。",
    highlights: [
      { label: "平均综合能耗优化率", value: "15%+" },
      { label: "能源数据在线采集率", value: "98%" },
      { label: "能源服务满意度", value: "95%" },
    ],
    subServices: ["智慧照明", "空调冰蓄冷", "智慧节水", "电池储能", "分布式光伏", "新能源充电"],
    accent: "#2DB88A",
  },
  {
    id: "procure",
    name: "仟蚁集采",
    shortDesc: "作为全国首个城市运营共建共享采购平台，锚定行业小而散特性，以自身体系的数十亿采购规模为基础，共享集采价格优势，推动行业采购走向生态化。",
    highlights: [
      { label: "成本压降", value: "5-30%" },
      { label: "优势品牌", value: "1000+" },
      { label: "细分品类", value: "350+" },
    ],
    subServices: ["集采降本", "统一物流", "品质把控", "数据资产", "合规溯源", "出海布局"],
    accent: "#7F75E8",
  },
  {
    id: "enterprise",
    name: "商企服务",
    shortDesc: "围绕商业不动产全生命周期价值管理，构建「资产经营+企业服务」的解决方案体系，由单一空间管理转向系统化经营能力输出。",
    highlights: [
      { label: "覆盖业态", value: "全业态" },
      { label: "服务维度", value: "全周期" },
      { label: "客户满意度", value: "高" },
    ],
    subServices: ["招商代理", "空间运营", "资产盘活", "办公选址", "企业搬家", "ESG服务", "高管专项"],
    accent: "#E85D4E",
  },
];

// ── 服务标签网格组件 ──────────────────────────────────────────
function ServiceTagGrid({ onOpen }: { onOpen: (svc: ServiceDetail) => void }) {
  return (
    <div className="serviceGrid">
      {serviceDetails.map((svc) => (
        <button
          key={svc.id}
          className="serviceCard"
          onClick={() => onOpen(svc)}
          style={{ "--svcAccent": svc.accent } as React.CSSProperties}
        >
          <span className="serviceCardName">{svc.name}</span>
          <span className="serviceCardArrow">→</span>
        </button>
      ))}
    </div>
  );
}

// ── 服务详情模态框 ────────────────────────────────────────────
function ServiceModal({
  svc,
  onClose,
}: {
  svc: ServiceDetail | null;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [svc, onClose]);

  if (!svc) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{ "--svcAccent": svc.accent } as React.CSSProperties}
      >
        <button className="modalClose" onClick={onClose} aria-label="关闭">
          ✕
        </button>

        <div className="modalHeader">
          <div className="modalAccentBar" />
          <h3>{svc.name}</h3>
        </div>

        <p className="modalDesc">{svc.shortDesc}</p>

        <div className="modalHighlights">
          {svc.highlights.map((h, i) => (
            <div className="modalHighlight" key={i} style={{ animationDelay: `${0.08 * (i + 1)}s` }}>
              <strong>{h.value}</strong>
              <span>{h.label}</span>
            </div>
          ))}
        </div>

        <div className="modalSubs">
          <h4>业务细分</h4>
          <div className="modalSubTags">
            {svc.subServices.map((s, i) => (
              <span key={i} style={{ animationDelay: `${0.06 * (i + 3)}s` }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 联系我们弹框 ────────────────────────────────────────────────
function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent contactModalContent"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modalClose" onClick={onClose} aria-label="关闭">
          ✕
        </button>

        <div className="modalHeader">
          <div className="modalAccentBar" style={{ background: "#E85D4E" }} />
          <h3>联系我们，开启合作</h3>
        </div>

        <p className="modalDesc">欢迎洽谈合作意向，我们将在 1 个工作日内与您取得联系。</p>

        <div className="contactGrid">
          <div className="contactInfo">
            <div className="contactItem">
              <span className="contactLabel">公司邮箱</span>
              <a className="contactValue" href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <div className="contactItem">
              <span className="contactLabel">联系人</span>
              <span className="contactValue">{contactName}</span>
            </div>
            <div className="contactItem">
              <span className="contactLabel">联系电话</span>
              <a className="contactValue" href={`tel:${contactPhone.replace(/[^0-9+]/g, "")}`}>{contactPhone}</a>
            </div>
            <a className="contactMailBtn" href={`mailto:${contactEmail}?subject=合作咨询&body=您好，我们希望与中海物业增值服务展开合作。`}>
              发送邮件咨询 →
            </a>
          </div>

          <div className="contactQr">
            <div className="contactQrFrame">
              <img
                src={`${assetBase}media/contact-qr.jpg`}
                alt="中海生活服务官 微信二维码"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const sib = (e.currentTarget as HTMLImageElement).nextElementSibling;
                  if (sib) (sib as HTMLElement).style.display = "flex";
                }}
              />
              <div className="contactQrFallback" style={{ display: "none" }}>
                <span>微信二维码<br />待上传</span>
              </div>
            </div>
            <p className="contactQrHint">扫码添加「中海生活服务官」</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDownloadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent contactModalContent"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modalClose" onClick={onClose} aria-label="关闭">
          ✕
        </button>

        <div className="modalHeader">
          <div className="modalAccentBar" style={{ background: "#7F75E8" }} />
          <h3>扫码下载优你家Plus</h3>
        </div>

        <p className="modalDesc">微信或浏览器扫一扫，下载 App 即刻体验社区智慧生活。</p>

        <div className="contactQr">
          <div className="contactQrFrame">
            <img
              src={`${assetBase}media/app-download-qr.png`}
              alt="优你家Plus App 下载二维码"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const sib = (e.currentTarget as HTMLImageElement).nextElementSibling;
                if (sib) (sib as HTMLElement).style.display = "flex";
              }}
            />
            <div className="contactQrFallback" style={{ display: "none" }}>
              <span>App 二维码<br />待上传</span>
            </div>
          </div>
          <p className="contactQrHint">扫码下载「优你家Plus」</p>
        </div>
      </div>
    </div>
  );
}

// ── 主应用 ────────────────────────────────────────────────────
export default function App() {
  const worldRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const raf = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [modalSvc, setModalSvc] = useState<ServiceDetail | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [appQrOpen, setAppQrOpen] = useState(false);
  const [phoneActiveModule, setPhoneActiveModule] = useState<{
    id: string;
    label: string;
    desc: string;
  } | null>(null);

  const starts = useMemo(() => scenes.map((scene) => scene.start / VIDEO_DURATION), []);

  const syncVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || failed || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    if (!video.seeking && Math.abs(targetTime.current - video.currentTime) > 0.035) {
      video.currentTime = targetTime.current;
    }
  }, [failed]);

  const update = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const rect = world.getBoundingClientRect();
    const distance = Math.max(world.offsetHeight - innerHeight, 1);
    const local = Math.min(Math.max(-rect.top / distance, 0), 1);
    const time = local * VIDEO_DURATION;
    let index = 0;
    scenes.forEach((scene, i) => { if (time >= scene.start) index = i; });
    targetTime.current = time;
    setProgress(local);
    setActive(index);
    syncVideo();
  }, [syncVideo]);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        update();
        raf.current = null;
      });
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [update]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const requestFrame = () => {
      video.currentTime = targetTime.current === 0 ? 0.001 : targetTime.current;
    };
    video.addEventListener("loadedmetadata", requestFrame);
    video.load();
    return () => video.removeEventListener("loadedmetadata", requestFrame);
  }, []);

  function jump(ratio: number) {
    const world = worldRef.current;
    if (!world) return;
    scrollTo({ top: world.offsetTop + ratio * (world.offsetHeight - innerHeight), behavior: "smooth" });
  }

  return (
    <main>
      <header className="header">
        <a className="brand" href="#start">中海物业增值服务 <small>COHL Property Value-Added Services</small></a>
        <nav>{scenes.map((scene, i) => <button className={i === active ? "active" : ""} onClick={() => jump(starts[i])} key={scene.id}>{scene.nav}</button>)}</nav>
        <button type="button" className="cta small" onClick={() => setContactOpen(true)}>联系我们 ↗</button>
      </header>

      <section className="world" id="start" ref={worldRef}>
        <div className="stage">
          <div className="media" aria-hidden="true">
            <img className={`poster ${ready && !failed ? "hidden" : ""}`} src={scenes[active].still} alt="" />
            <video
              ref={videoRef}
              className={ready && !failed ? "ready" : ""}
              src={`${assetBase}media/scroll-story.mp4?v=1`}
              poster={`${assetBase}stills/scene-01.png`}
              preload="auto"
              muted
              playsInline
              onLoadedData={() => setReady(true)}
              onCanPlay={() => setReady(true)}
              onSeeked={() => { setReady(true); requestAnimationFrame(syncVideo); }}
              onError={() => setFailed(true)}
            />
            <div className="wash" />
          </div>

          <div className="copyStack">
            {scenes.map((scene, i) => (
              <article className={`copy ${i === active ? "active" : ""}`} key={scene.id}>
                <div className="kicker"><span>{scene.number} / {String(scenes.length).padStart(2, "0")}</span><i style={{ background: scene.accent }} /><span>{scene.eyebrow}</span></div>
                {i === 0 ? <h1>{scene.title}</h1> : <h2>{scene.title}</h2>}
                <p>{scene.body}</p>
                
                {/* Scene 3 八大服务标签网格 */}
                {i === 2 ? (
                  <ServiceTagGrid onOpen={setModalSvc} />
                ) : (
                  <div className="tags">{scene.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                )}
                
                {i === scenes.length - 1 && (
                  <div className="ctaRow">
                    <button type="button" className="cta" onClick={() => setContactOpen(true)}>联系我们，开启合作 ↗</button>
                    <button type="button" className="cta ghost" onClick={() => setAppQrOpen(true)}>体验优你家Plus ↗</button>
                  </div>
                )}

                {/* Scene 4 文案与手机联动：随当前功能高亮 */}
                {i === 3 && (
                  <div
                    className={`smartLive ${phoneActiveModule ? "show" : ""}`}
                    style={{ "--glow": phoneActiveModule ? glowColor(phoneActiveModule.id) : "#e85d4e" } as React.CSSProperties}
                  >
                    <span className="dot" />
                    <span className="smartLiveText">
                      正在看：<b>{phoneActiveModule?.label || "优你家Plus"}</b>
                      {phoneActiveModule?.desc ? ` · ${phoneActiveModule.desc}` : ""}
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>

          {active === 3 && (
            <PhoneShowcase onActiveChange={setPhoneActiveModule} />
          )}

          <aside className="rail" aria-label={`当前场景：${scenes[active].nav}`}>
            <strong>{scenes[active].number}</strong>
            <div className="railTrack"><i style={{ height: `${progress * 100}%` }} />{scenes.map((scene, i) => <button className={i === active ? "active" : i < active ? "past" : ""} onClick={() => jump(starts[i])} aria-label={`前往${scene.nav}`} key={scene.id} />)}</div>
            <span>{String(scenes.length).padStart(2, "0")}</span>
          </aside>
        </div>
      </section>

      <section className="mobileStory">
        {scenes.map((scene, i) => (
          <article className="mobileScene" key={scene.id}>
            <img src={scene.still} alt={`${scene.nav}：${scene.title}`} />
            <div>
              <small>{scene.number} / {String(scenes.length).padStart(2, "0")} · {scene.eyebrow}</small>
              <h2>{scene.title}</h2>
              <p>{scene.body}</p>
              {i === 2 && <ServiceTagGrid onOpen={setModalSvc} />}
              {i === 3 && <PhoneShowcase onActiveChange={setPhoneActiveModule} />}
              {i === scenes.length - 1 && (
                <div className="ctaRow">
                  <button type="button" className="cta" onClick={() => setContactOpen(true)}>联系我们，开启合作 ↗</button>
                  <button type="button" className="cta ghost" onClick={() => setAppQrOpen(true)}>体验优你家Plus ↗</button>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <ServiceModal svc={modalSvc} onClose={() => setModalSvc(null)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <AppDownloadModal open={appQrOpen} onClose={() => setAppQrOpen(false)} />
    </main>
  );
}
