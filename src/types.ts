export interface WilhelmLine {
  text: string;
}

export interface Hexagram {
  english: string;
  vietnamese?: string;
  pinyin?: string;
  chinese?: string;
  upperTrigram?: string;
  lowerTrigram?: string;
  wilhelm_judgment: {
    text: string;
  };
  wilhelm_lines: Record<string, WilhelmLine>;
}

export type HexagramDataset = Record<string, Hexagram>;

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: number;
}

export interface DrawResult {
  que: number;
  hao: number;
  question: string;
  hexagram: Hexagram;
}

export type AppMode = 'oracle' | 'codex' | 'about';
