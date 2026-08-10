export type Post = {
  id: number;
  area: string;
  cell: string;
  /** API・DB互換用の名前。1:撮影中 2:交流中 3:移動中 */
  crowd: number;
  body: string;
  createdAt: number;
};
