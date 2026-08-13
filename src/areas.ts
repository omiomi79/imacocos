// コミケのコスプレエリア定義。
// 開催回ごとにエリアと時間が変わるので、開催前にここを更新する。
// id は D1 に保存される値なので、一度使った id は変更しないこと（過去投稿と紐付かなくなる）。
// C108 公式案内: https://www.comiket.co.jp/info-p/

// 画像パスはルート相対で持つ。GitHub Pages のサブパスは表示側の assetPath() で付ける
// （このファイルは scripts/generate-map-cards.mjs から Node で直接読まれるため、
//  import.meta.env をここで使ってはいけない）

export type Point = { x: number; y: number };

/** 見取り図の上に置く四角形。斜め俯瞰の絵に合わせるため、正方形ではなく任意の四角形で持つ。
 *  順番は 奥左 → 奥右 → 手前右 → 手前左。座標は画像に対する 0〜1 の割合。 */
export type Quad = [Point, Point, Point, Point];

export type MapCell = {
  id: string;
  polygon: Point[];
  label: Point;
};

type GridAreaMap = {
  image: string;
  quad: Quad;
  /** 横（奥行き方向に直交）の分割数 */
  cols: number;
  /** 縦（手前↔奥）の分割数 */
  rows: number;
};

type CustomAreaMap = {
  image: string;
  /** 建物や木立などを避けて手作業で切った選択区画 */
  cells: MapCell[];
};

type StaticAreaMap = {
  /** 区画選択を行わず、エリア案内とXカードにだけ使う画像 */
  image: string;
  guide: string;
};

export type AreaMap = GridAreaMap | CustomAreaMap | StaticAreaMap;

export type Area = {
  id: string;
  label: string;
  /** 投稿一覧に出す短い名前 */
  short: string;
  /** 会場のエリアではない選択肢（休憩中など）は持たない */
  floor?: string;
  hours?: { day1: string; day2: string };
  /**
   * それ自体が状態を表す選択肢。
   * 状態の選択も区画の指定も行わず、ひとことだけ添えて投稿する。
   */
  standalone?: boolean;
  /** 見取り図がまだ用意できていないエリアは null */
  map: AreaMap | null;
};

export const AREAS: Area[] = [
  {
    id: 'east8',
    label: '東8コスプレエリア（内＋外）',
    short: '東8',
    floor: '1F',
    hours: { day1: '10:30〜16:30', day2: '10:30〜16:00' },
    map: { image: '/maps/east8.webp', guide: '黄色の建物が東8ホールです。' },
  },
  {
    id: 'antenna',
    label: '東7外アンテナサイト コスプレエリア',
    short: 'アンテナサイト',
    floor: '1F屋外',
    hours: { day1: '13:00〜16:00', day2: '13:00〜16:00' },
    map: {
      image: '/maps/antenna.webp',
      guide: '黄色の区画が東7外アンテナサイトです。',
    },
  },
  {
    id: 'garden',
    label: '庭園コスプレエリア',
    short: '庭園',
    floor: '1F',
    hours: { day1: '10:30〜16:30', day2: '10:30〜16:00' },
    map: {
      image: '/maps/garden.webp',
      // 建物・連絡橋・木立・左側道路を避け、立ち位置として使える地面だけを区画化
      cells: [
        {
          id: 'A1',
          polygon: [
            { x: 0.34, y: 0.33 },
            { x: 0.53, y: 0.34 },
            { x: 0.56, y: 0.44 },
            { x: 0.52, y: 0.53 },
            { x: 0.43, y: 0.43 },
          ],
          label: { x: 0.47, y: 0.41 },
        },
        {
          id: 'A2',
          polygon: [
            { x: 0.54, y: 0.35 },
            { x: 0.72, y: 0.4 },
            { x: 0.73, y: 0.54 },
            { x: 0.58, y: 0.62 },
            { x: 0.56, y: 0.45 },
          ],
          label: { x: 0.64, y: 0.48 },
        },
        {
          id: 'A3',
          polygon: [
            { x: 0.58, y: 0.62 },
            { x: 0.73, y: 0.54 },
            { x: 0.76, y: 0.61 },
            { x: 0.74, y: 0.73 },
            { x: 0.66, y: 0.75 },
          ],
          label: { x: 0.69, y: 0.65 },
        },
        {
          id: 'B1',
          polygon: [
            { x: 0.28, y: 0.51 },
            { x: 0.35, y: 0.47 },
            { x: 0.39, y: 0.54 },
            { x: 0.35, y: 0.62 },
            { x: 0.32, y: 0.68 },
            { x: 0.24, y: 0.65 },
            { x: 0.23, y: 0.56 },
          ],
          label: { x: 0.31, y: 0.58 },
        },
        {
          id: 'B2',
          polygon: [
            { x: 0.37, y: 0.77 },
            { x: 0.49, y: 0.75 },
            { x: 0.56, y: 0.82 },
            { x: 0.55, y: 0.89 },
            { x: 0.39, y: 0.9 },
            { x: 0.34, y: 0.84 },
          ],
          label: { x: 0.45, y: 0.83 },
        },
      ],
    },
  },
  {
    id: 'rooftop',
    label: '屋上展示場コスプレエリア',
    short: '屋上',
    floor: '4F',
    hours: { day1: '12:30〜16:30', day2: '12:30〜16:00' },
    map: {
      image: '/maps/rooftop.webp',
      // 画像上の屋上部分に合わせた座標
      quad: [
        { x: 0.3, y: 0.457 },
        { x: 0.711, y: 0.25 },
        { x: 0.814, y: 0.308 },
        { x: 0.381, y: 0.639 },
      ],
      cols: 5,
      rows: 2,
    },
  },
  {
    id: 'rest',
    label: '休憩中',
    short: '休憩中',
    standalone: true,
    map: { image: '/maps/rest.webp', guide: '' },
  },
];

export const NOTES = [
  '西4ホールはコスプレエリアではありません。',
  '雨天など悪天候により、コスプレエリアの使用を制限する場合があります。',
];

const AREA_MAP = new Map(AREAS.map((a) => [a.id, a]));

export function getArea(id: string): Area | undefined {
  return AREA_MAP.get(id);
}

/** 未知の id（定義を消した後の過去投稿など）でも落ちないようにする */
export function areaLabel(id: string): string {
  return AREA_MAP.get(id)?.short ?? id;
}

export function isValidArea(id: string): boolean {
  return AREA_MAP.has(id);
}

/** 行と列から "A1" 形式のラベルを作る */
export function cellId(row: number, col: number): string {
  return `${String.fromCharCode(65 + row)}${col + 1}`;
}

export function isValidCell(areaId: string, cell: string): boolean {
  const map = AREA_MAP.get(areaId)?.map;
  if (!map) return false;
  return mapCells(map).some((item) => item.id === cell);
}

/** Xカードと画面内プレビューで使う、選択セル入りの見取り図 */
export function mapCardImage(areaId: string, cell: string): string | null {
  const area = AREA_MAP.get(areaId);
  if (!area?.map) return null;
  if (mapCells(area.map).length === 0) return area.map.image;
  if (!isValidCell(areaId, cell)) return null;
  return `/maps/cards/${areaId}-${cell.toLowerCase()}.webp`;
}

/** 四角形の内側を u,v (0〜1) で線形に補間する。奥ほど詰まる見た目に自然に追従する */
export function quadPoint(quad: Quad, u: number, v: number): Point {
  const [nw, ne, se, sw] = quad;
  const topX = nw.x + (ne.x - nw.x) * u;
  const topY = nw.y + (ne.y - nw.y) * u;
  const bottomX = sw.x + (se.x - sw.x) * u;
  const bottomY = sw.y + (se.y - sw.y) * u;
  return {
    x: topX + (bottomX - topX) * v,
    y: topY + (bottomY - topY) * v,
  };
}

/** セル1つ分の四隅（描画・当たり判定に使う） */
export function cellCorners(map: GridAreaMap, row: number, col: number): Point[] {
  const u0 = col / map.cols;
  const u1 = (col + 1) / map.cols;
  const v0 = row / map.rows;
  const v1 = (row + 1) / map.rows;
  return [
    quadPoint(map.quad, u0, v0),
    quadPoint(map.quad, u1, v0),
    quadPoint(map.quad, u1, v1),
    quadPoint(map.quad, u0, v1),
  ];
}

export function mapCells(map: AreaMap): MapCell[] {
  if ('cells' in map) return map.cells;
  if (!('quad' in map)) return [];

  return Array.from({ length: map.rows * map.cols }, (_, index) => {
    const row = Math.floor(index / map.cols);
    const col = index % map.cols;
    return {
      id: cellId(row, col),
      polygon: cellCorners(map, row, col),
      label: quadPoint(map.quad, (col + 0.5) / map.cols, (row + 0.5) / map.rows),
    };
  });
}

/**
 * これから向かう状態。まだ到着していないので区画は選ばせず、
 * 投稿文でも「エリア」ではなく「向かう先」として扱う。
 */
export const HEADING_STATUS = 4;

export const STATUS_OPTIONS = [
  { value: 1, label: '撮影中', emoji: '●', code: 'REC' },
  { value: 2, label: '交流中', emoji: '◎', code: 'TALK' },
  { value: 3, label: '移動中', emoji: '→', code: 'MOVE' },
  { value: HEADING_STATUS, label: '向かいます', emoji: '⇢', code: 'HEAD' },
] as const;

export function statusMeta(value: number) {
  return STATUS_OPTIONS.find((status) => status.value === value) ?? STATUS_OPTIONS[1];
}
