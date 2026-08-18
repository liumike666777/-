export type Scene = {
  id: string;
  number: string;
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  still: string;
  start: number;
  accent: string;
};

// Replace these values from the approved storyboard and reviewed video timeline.
export const VIDEO_DURATION = 50;
const assetBase = import.meta.env.BASE_URL;

export const scenes: Scene[] = [
  { id: "open", number: "01", nav: "启幕", eyebrow: "中海物业增值服务", title: "从社区到城区，让空间持续创造价值", body: "40余年央企物业经验，首家在港上市。覆盖160+城市、2300+项目，服务1000万+业主，管理4.3亿㎡物业空间。", tags: ["全业态", "全周期", "全场景"], still: `${assetBase}stills/scene-01.png`, start: 0, accent: "#D4A574" },
  { id: "panorama", number: "02", nav: "全景", eyebrow: "服务版图", title: "全业态·全周期·全场景", body: "覆盖住宅、商业、城服、公建四大业态。从C端业主到B端企业，从A端资产到G端政府，全客群覆盖，全链路服务。", tags: ["住宅", "商业", "城服", "公建"], still: `${assetBase}stills/scene-02.png`, start: 10, accent: "#4A90A4" },
  { id: "deep", number: "03", nav: "深耕", eyebrow: "八大服务", title: "深耕服务，赋能每一处空间", body: "资产运营、租售服务、美居装修、生活服务、运维管理、能源管理、仟蚁集采、商企服务——八大增值赛道，覆盖空间全生命周期。", tags: ["资产运营", "租售服务", "美居装修", "生活服务", "运维管理", "能源管理", "仟蚁集采", "商企服务"], still: `${assetBase}stills/scene-03.png`, start: 20, accent: "#5CCB8A" },
  { id: "smart", number: "04", nav: "智慧", eyebrow: "优你家Plus", title: "一个 App，搞定社区生活的一切", body: "从开门回家到缴费报修，从邻里社交到到家服务——优你家Plus 把社区生活的每一件事都收进一部手机。中海智慧平台在背后默默运转，让服务随你所需、即时可达。", tags: ["优你家Plus", "智慧社区", "无感通行"], still: `${assetBase}stills/scene-04.png`, start: 30, accent: "#7F75E8" },
  { id: "winwin", number: "05", nav: "共赢", eyebrow: "合作共赢", title: "携手共建，城市美好未来", body: "从社区到城区，从万家灯火到企业生态。中海物业增值服务，与合作伙伴共建全场景服务生态，让城市运行更友好、更有生活味。", tags: ["合作共赢", "城市生态"], still: `${assetBase}stills/scene-05.png`, start: 40, accent: "#E85D4E" },
];
