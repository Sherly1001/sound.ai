export interface Label {
  labelId: string;
  labelName: string;
}

export interface Score {
  label: Label;
  score: number;
}
