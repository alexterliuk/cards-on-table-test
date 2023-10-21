import Dealer from './actors/dealer';
import Player from './actors/player';
import Card from './inventory/card';
import Deck from './inventory/deck';
import Suit from './inventory/suit';
import Table from './inventory/table';
import { DeckCardsData } from './data/deck-cards-data';

class CardsOnTable {
  about: string;
  createTable: typeof createTable;

  constructor() {
    this.about =
      'Cards On Table - the library for the construction of playing cards game.';
    this.createTable = createTable;
  }
}

const cds = new CardsOnTable();

function createTable(deckCardsData: DeckCardsData, playerQty: number) {
  const deck = new Deck(deckCardsData);
  const players = Array(playerQty)
    .fill(null)
    .reduce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (acc: Player[], player: Player) => (acc.push(new Player(deck)), acc),
      [],
    );

  return new Table(deck, players);
}

export default cds;
export {
  DeckCardsData,
  SuitData,
  SuitCardsData,
  CardValues,
  SuitValues,
} from './index.d';
export { Dealer, Player, Card, Deck, Suit, Table };
