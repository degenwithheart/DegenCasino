export interface HorseState {
  id: number;
  name: string;
  color: string;
  position: number; // 0-100 (percentage of track)
  speed: number;
  odds: number;
  stumbled: boolean;
  finished: boolean;
  isFavorite?: boolean;
}
export interface Bet {
  userId: string;
  horseId: number;
  amount: number;
}
