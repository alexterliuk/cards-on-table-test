import Table from '../inventory/table';

export default class Dealer {
  table: Table;
  dealingConfig: DealingConfig;

  constructor(table: Table, dealingConfig: DealingConfig) {
    if (!(table instanceof Table)) {
      throw new Error(
        'table must be instance of Table when creating a Dealer.',
      );
    }
    this.table = table;
    this.dealingConfig = dealingConfig;
  }

  deal() {
    const {
      playersQty,
      cardsQtyToPlayer,
      buyInCardsQty,
      openTrumpCard,
    } = this.dealingConfig;

    const dealtCards = this.table.deck.deal(
      playersQty,
      cardsQtyToPlayer,
      buyInCardsQty,
      openTrumpCard,
    );

    const players = this.table.getAllPlayers();

    if (playersQty > players.length) {
      throw new Error(
        `Dealer can't deal cards to more players than present at the table.`,
      );
    }

    players.forEach((player, i) => {
      const ownCards = dealtCards[i][0];
      const buyInCards = dealtCards[i][1];

      ownCards.forEach(card => player.addCardToOwnCards(card));
      this.table.addCardsToBuyInCards(buyInCards, player);
    });
  }
}

export type DealingConfig = {
  playersQty: number;
  cardsQtyToPlayer: number;
  buyInCardsQty?: number;
  openTrumpCard?: boolean;
};
