// コミケ会場（東京ビッグサイト）のコスプレ関連エリア。
// 開催回ごとに使えるエリアが変わるので、開催前にここだけ直せば全体に反映される。
// id は D1 に保存される値なので、一度使った id は変更しないこと（過去投稿と紐付かなくなる）。

export type Area = {
  id: string;
  label: string;
  group: string;
};

export const AREAS: Area[] = [
  { id: 'east-parking', label: '東駐車場', group: '東地区' },
  { id: 'east-1-3', label: '東1〜3ホール', group: '東地区' },
  { id: 'east-4-6', label: '東4〜6ホール', group: '東地区' },
  { id: 'east-7-8', label: '東7・8ホール', group: '東地区' },

  { id: 'west-outdoor', label: '西屋外展示場', group: '西・南地区' },
  { id: 'west-1-2', label: '西1・2ホール', group: '西・南地区' },
  { id: 'west-3-4', label: '西3・4ホール', group: '西・南地区' },
  { id: 'south-1-2', label: '南1・2ホール', group: '西・南地区' },
  { id: 'south-3-4', label: '南3・4ホール', group: '西・南地区' },
  { id: 'rooftop', label: '屋上展示場', group: '西・南地区' },

  { id: 'conference', label: '会議棟', group: 'その他' },
  { id: 'bousai-park', label: '防災公園', group: 'その他' },
  { id: 'promenade', label: 'シンボルプロメナード公園', group: 'その他' },
];

export const AREA_GROUPS = [...new Set(AREAS.map((a) => a.group))];

const AREA_MAP = new Map(AREAS.map((a) => [a.id, a]));

/** 未知の id（エリア定義を消した後の過去投稿など）でも落ちないようにする */
export function areaLabel(id: string): string {
  return AREA_MAP.get(id)?.label ?? id;
}

export function isValidArea(id: string): boolean {
  return AREA_MAP.has(id);
}

export const CROWD_LEVELS = [
  { value: 1, label: '空いてる', hint: 'すぐ撮れる', emoji: '🟢' },
  { value: 2, label: 'ふつう', hint: '数人待ち', emoji: '🟡' },
  { value: 3, label: '激混み', hint: '行列できてる', emoji: '🔴' },
] as const;

export function crowdMeta(value: number) {
  return CROWD_LEVELS.find((c) => c.value === value) ?? CROWD_LEVELS[1];
}
