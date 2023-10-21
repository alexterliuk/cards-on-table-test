import { areStrings, areNumbers } from '../lib/utils/value-checkers';

export default class Card {
  name: string;
  value: number;
  suit: string;
  rank: number;
  opened: boolean;

  constructor(name: string, value: number, suit: string, rank: number) {
    if (!areStrings(name, suit) || !areNumbers(value, rank)) {
      throw new Error(
        'Invalid param passed when creating new card: name, suit must be strings; value, rank must be numbers.',
      );
    }

    this.name = name;
    this.value = value;
    this.suit = suit;
    this.rank = rank;
    this.opened = false;
  }

  open() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }
}

export const cardKeys: (keyof Card)[] = [
  'name',
  'value',
  'suit',
  'rank',
  'opened',
  'open',
  'close',
];

// values of one card
export type CardValues = (string | number | boolean | (() => void))[];
