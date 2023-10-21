const suitCardsData: SuitCardsData = [
  // name, value, rank
  ['ace', 14, 13],
  ['king', 13, 12],
  ['queen', 12, 11],
  ['jack', 11, 10],
  ['ten', 10, 9],
  ['nine', 9, 8],
  ['eight', 8, 7],
  ['seven', 7, 6],
  ['six', 6, 5],
  ['five', 5, 4],
  ['four', 4, 3],
  ['three', 3, 2],
  ['two', 2, 1],
];

// prettier-ignore
const diamondsSuitData: SuitData = { name: 'diamonds', cardsData: suitCardsData };
const spadesSuitData: SuitData = { name: 'spades', cardsData: suitCardsData };
const heartsSuitData: SuitData = { name: 'hearts', cardsData: suitCardsData };
const clubsSuitData: SuitData = { name: 'clubs', cardsData: suitCardsData };

const deckCardsData: DeckCardsData = {
  suitsData: [spadesSuitData, heartsSuitData, diamondsSuitData, clubsSuitData],
  trumpSuitCardsData: suitCardsData,
};

export default deckCardsData;

export type DeckCardsData = {
  suitsData: SuitData[];
  trumpSuitCardsData: SuitCardsData;
};
export type SuitData = {
  name: string;
  cardsData: SuitCardsData;
};
export type SuitCardsData = Array<[string, number, number]>;
