import Card, { CardValues } from './card';
import { SuitData } from '../data/deck-cards-data';
import { isString } from '../lib/utils/value-checkers';

export default class Suit {
  name: string;
  cards: Card[];
  /**
   * @param cardsData - array of arrays with cards params ([name, value, rank])
   *    e.g. for suit with only 2 cards: [['king', 4, 2], ['queen', 3, 1]]
   */
  constructor({ name, cardsData }: SuitData) {
    if (!isString(name)) {
      throw new Error('name must be string when creating new Suit.');
    }

    this.name = name;
    this.cards = cardsData.map(cd => new Card(cd[0], cd[1], name, cd[2]));
  }
}

// values of one suit
export type SuitValues = { name: string; cardsState: CardValues[] };
