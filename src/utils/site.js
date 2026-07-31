export const isCardsSite =
  typeof window !== 'undefined' && window.location.hostname === 'cards.swagsolutions.lk';

export const cardsPrefix = isCardsSite ? '' : '/wedding';
