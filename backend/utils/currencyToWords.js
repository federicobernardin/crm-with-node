// utils/currencyToWords.js

const writtenNumber = require('written-number');

/**
 * Converte un valore monetario in parole, supportando italiano e inglese.
 * @param {number|string} amount - importo numerico, es. 1234.56
 * @param {'it'|'en'} locale - lingua ('it' per italiano, 'en' per inglese)
 * @returns {string} - importo in lettere, es. 'milleduecentotrentaquattro euro e cinquantasei centesimi'
 */
function currencyToWords(amount, locale = 'it') {
  // Assicura che sia numero con due decimali
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) throw new Error('Importo non valido');

  // Separazione parte intera e decimale
  const [integerPart, decimalPart] = value.toFixed(2).split('.');
  const intNum = parseInt(integerPart, 10);
  const decNum = parseInt(decimalPart, 10);

  // Converte in parole con opzione lingua
  const intWords = writtenNumber(intNum, { lang: locale });
  const decWords = writtenNumber(decNum, { lang: locale });

  // Unità monetarie e gestione plurale
  let currencyUnit, centUnit;
  if (locale === 'it') {
    currencyUnit = 'euro';
    centUnit     = decNum === 1 ? 'centesimo' : 'centesimi';
  } else {
    currencyUnit = intNum === 1 ? 'dollar' : 'dollars';
    centUnit     = decNum === 1 ? 'cent' : 'cents';
  }

  return `${intWords} ${currencyUnit} e ${decWords} ${centUnit}`;
}

module.exports = currencyToWords;
