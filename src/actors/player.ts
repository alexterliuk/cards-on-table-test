import Deck from '../inventory/deck';
import Card from '../inventory/card';
import Table from '../inventory/table';
import getRandomFloor from '../lib/utils/get-random-floor';
import findIndexOfMatchedArray from '../lib/find-index-of-matched-array';
import areAllValsInTarget from '../lib/utils/are-all-vals-in-target';

export default class Player {
  deck: Deck;
  table: Table | null;
  ownCards: Card[];
  combinations: Card[][];
  fines: { name: string; value: number }[];
  bonuses: { name: string; value: number }[];

  constructor(deck: Deck) {
    if (!(deck instanceof Deck)) {
      throw new Error(
        'deck must be instance of Deck when creating new Player.',
      );
    }
    this.deck = deck;
    this.table = null;
    this.ownCards = [];
    this.combinations = [];
    this.fines = [];
    this.bonuses = [];
  }

  // when new table is instantiated
  // it invokes this method of each got player
  connectToTable(table: Table) {
    if (table.addPlayer(this)) {
      this.table = table;
      return true;
    }
    return false;
  }

  isConnectedToTable() {
    return this.table instanceof Table;
  }

  // ===============================================================
  // interacting with ownCards || combinations || takes
  // (takes collection is in table's playersCorners)

  addCardToOwnCards(card: Card | null, idx?: number): boolean {
    if (card instanceof Card) {
      if (!this.ownCards.includes(card)) {
        // add to given index or to end
        this.ownCards.splice(idx || this.ownCards.length, 0, card);
        return true;
      }
    }
    return false;
  }

  // returns index at which card was before removal, or -1
  removeCardFromOwnCards(card: Card): number {
    const idx = this.ownCards.findIndex(c => c === card);
    if (idx < 0) return -1;
    this.ownCards = this.ownCards.filter(c => c !== card);
    return idx;
  }

  takeRandomCardFromOwnCards(): { card: Card | null; idx: number } {
    const idx = getRandomFloor(0, this.ownCards.length);
    return !this.ownCards.length
      ? { card: null, idx: -1 }
      : { card: this.ownCards.splice(idx, 1)[0], idx };
  }

  // used by table's takeCombinationFromBulkOfPlayer which is responsible
  // for removing combination from playersBulks (it removes in case if
  // player's addCombinationToCombinations successfully fulfills its job)
  // prettier-ignore
  addCombinationToCombinations(combination: Card[]): boolean {
    const allCardsAbsentInCombinations =
      areAllValsInTarget('absent', combination, this.combinations, 2);
    const allCardsAbsentInOwnCards = 
      areAllValsInTarget('absent', combination, this.ownCards);

    if (!allCardsAbsentInCombinations || !allCardsAbsentInOwnCards)
      return false;

    this.combinations.push(combination);
    return true;
  }

  // prettier-ignore
  addCombinationToCombinationsFromOwnCards(combination: Card[]): boolean {
    const allCardsAbsentInCombinations =
      areAllValsInTarget('absent', combination, this.combinations, 2);
    const allCardsPresentInOwnCards =
      areAllValsInTarget('present', combination, this.ownCards);

    if (!allCardsAbsentInCombinations || !allCardsPresentInOwnCards)
      return false;

    const copiedOwnCards = this.ownCards.map(c => c);
    const indices = combination.map(card => this.removeCardFromOwnCards(card));
    if (indices.length !== combination.length) {
      // all cards which compose combination should have been removed,
      // but it's not for unknown reason; return cards back to ownCards
      indices.forEach(idx => this.addCardToOwnCards(copiedOwnCards[idx], idx));
      return false;
    }

    this.combinations.push(combination);
    return true;
  }

  // this method calls table's method
  addCombinationToBulkOfPlayerFromCombinations(combination: Card[]) {
    if (!this.table) return false;
    const idx = findIndexOfMatchedArray(this.combinations, combination);
    if (idx === -1) return false;
    const added = this.table.addCombinationToBulkOfPlayer(combination, this);
    return added ? (this.combinations.splice(idx, 1), true) : false;
  }

  // this method calls table's method
  addCombinationToCombinationsFromBulkOfPlayer(combination: Card[]) {
    if (!this.table) return false;
    const takeBack = this.table.takeCombinationFromBulkOfPlayer;
    return !!takeBack(combination, this, 'combinations');
  }

  // prettier-ignore
  returnCombinationToOwnCards(combination: Card[]) {
    let idx = findIndexOfMatchedArray(this.combinations, combination);
    if (idx === -1) {
      this.addCombinationToCombinationsFromBulkOfPlayer(combination);
      idx = findIndexOfMatchedArray(this.combinations, combination);
    }

    if (idx > -1) {
      const safeToReturn = areAllValsInTarget('absent', combination, this.ownCards);
      if (safeToReturn) {
        this.combinations.splice(idx, 1);
        combination.forEach(card => this.addCardToOwnCards(card));
        return true;
      }
    }

    return false;
  }

  ditchAllCardsToDiscardPile() {
    const cards = [...this.ownCards, ...this.combinations].flat();
    const ditchedAll = this.table?.addCombinationToDiscardPile(cards);
    if (ditchedAll) {
      this.ownCards = [];
      this.combinations = [];
      return true;
    }
    return false;
  }

  pickUpAllBeatAreaCards(destination: 'ownCards' | 'takes') {
    if (this.isConnectedToTable()) {
      const tbl = this.table as Table;
      const cards = tbl.getCardsFromBeatArea();

      if (destination === 'ownCards') {
        const ownCardsBackup = this.ownCards.slice();
        const pickedUp = cards.map(c => this.addCardToOwnCards(c));
        if (!pickedUp.includes(false)) {
          tbl.clearBeatArea();
          return true;
        }
        this.ownCards = ownCardsBackup;
      }

      if (destination === 'takes') {
        const pickedUp = tbl.addTakeToTakes(cards, this);
        if (pickedUp) {
          tbl.clearBeatArea();
          return true;
        }
      }
    }
    return false;
  }

  pickUpAllBeatAreaCardsToOwnCards() {
    return this.pickUpAllBeatAreaCards('ownCards');
  }

  pickUpAllBeatAreaCardsToTakes() {
    return this.pickUpAllBeatAreaCards('takes');
  }

  beatWithCard(card: Card) {
    if (this.isConnectedToTable() && this.ownCards.includes(card)) {
      const tbl = this.table as Table;
      const added = tbl.addCardToBeatArea(card, this);
      if (added) {
        card.open();
        this.removeCardFromOwnCards(card);
        return true;
      }
    }
    return false;
  }

  // ===============================================================
  // interacting mainly with deck

  shuffleDeck(): Card[] {
    return this.deck.shuffle();
  }

  shuffleDeckManyTimes(max = 100): Card[] {
    return this.deck.shuffleManyTimes(max);
  }

  returnObtainedCardBackToDeck(card: Card | null) {
    // as card was taken from start, return it also to start
    const returnedToDeck = this.deck.returnCardToDeck(card, null, 'toStart');
    if (!returnedToDeck) {
      throw new Error(
        'Card was taken from deck, player rejected it, and card failed to return back to deck.',
      );
    }
    return true;
  }

  returnOwnCardBackToOwnCards(card: Card, cardIdx?: number) {
    const returnedToOwnCards = this.addCardToOwnCards(card, cardIdx);
    if (!returnedToOwnCards) {
      throw new Error(
        'Card was taken from player, deck rejected it, and card failed to return back to player.',
      );
    }
    return true;
  }

  // used when player tries to get first card from deck, so eventually they either get card, or null
  addCardToOwnCardsOrReturnBackToDeck(card: Card | null): Card | null {
    return this.addCardToOwnCards(card)
      ? card
      : (this.returnObtainedCardBackToDeck(card), null);
  }

  // used when player tries to return own card to deck, so if deck takes it back the player gets true,
  // but if deck fails to do it, the card is returned to ownCards - and the card is returned from this function
  // with the meaning 'card rejected by deck'
  returnCardToDeckOrReturnBackToOwnCards(
    card: Card,
    cardIdx: number,
  ): true | Card {
    return this.deck.returnCardToDeck(card)
      ? true
      : (this.returnOwnCardBackToOwnCards(card, cardIdx), card);
  }

  takeCardFromDeck(): Card | null {
    const card = this.deck.takeCardFromAllCards();
    return this.addCardToOwnCardsOrReturnBackToDeck(card);
  }

  takeRandomCardFromDeck(): Card | null {
    const card = this.deck.takeRandomCardFromAllCards();
    return this.addCardToOwnCardsOrReturnBackToDeck(card);
  }

  // if failed to return to deck, it returns to ownCards to same index the card was taken from
  // prettier-ignore
  returnOwnCardToDeck(card: Card): boolean {
    const cardIdx = this.removeCardFromOwnCards(card);
    // card was not found, so no removal performed
    if (cardIdx === -1) return false;

    const cardInDeckOrCard = this.returnCardToDeckOrReturnBackToOwnCards(card, cardIdx);
    return cardInDeckOrCard instanceof Card
      ? false // card returned to ownCards
      : true; // card returned to deck
  }

  // if failed to return to deck, it returns to ownCards to same index the card was taken from
  // prettier-ignore
  returnRandomOwnCardToDeck(): boolean {
    const { card, idx } = this.takeRandomCardFromOwnCards();
    if (card) {
      const cardInDeckOrCard = this.returnCardToDeckOrReturnBackToOwnCards(card, idx);
      return cardInDeckOrCard instanceof Card
        ? false // card returned to ownCards
        : true; // card returned to deck
    }
    return false;
  }

  returnAllOwnCardsToDeck(): boolean {
    let maxIterations = this.deck.length;
    while (this.ownCards.length) {
      const card = this.ownCards[this.ownCards.length - 1];
      this.returnOwnCardToDeck(card);
      if (!--maxIterations) break;
    }
    return !this.ownCards.length;
  }

  assignTrumpSuit(suitName: string) {
    this.deck.assignTrumpSuit(suitName);
  }

  clearTrumpSuit() {
    this.deck.clearTrumpSuit();
  }

  openTrumpCard() {
    this.deck.openTrumpCard();
  }

  closeTrumpCard() {
    this.deck.closeTrumpCard();
  }

  closeTrumpCardAndHide() {
    this.deck.closeTrumpCardAndHide();
  }
}
