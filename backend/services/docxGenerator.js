// backend/services/docxGenerator.js
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const currencyToWords = require ('../utils/currencyToWords');
const docxTexts = require('../config/docxTexts');

/**
 * Genera un buffer .docx a partire da un Proposal con dati Client e Contacts
 * Cerca il template in minuscolo: proposal_<language>_<type>.docx
 * @param {object} prop - instance Sequelize di Proposal con include client e contacts
 * @returns {Promise<Buffer>} buffer del file .docx generato
 */
async function generateProposalDocx(prop) {
  // Nome template in minuscolo basato su language e type
  const lang = (prop.language || '').toLowerCase();
  const typ  = (prop.type     || '').toLowerCase();
  const templateName = `proposal_${lang}_${typ}.docx`;
  const templatePath = path.resolve(__dirname, '../templates', templateName);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template non trovato: ${templateName}`);
  }

  // Leggi template
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  // Formatta numeri in valuta italiana (euro): punto per migliaia, virgola per decimali
  const formatCurrencyIt = (value) => {
    if (value === null || value === undefined) return '';

    const toNumber = (val) => {
      if (typeof val === 'number') {
        return Number.isFinite(val) ? val : null;
      }
      if (typeof val !== 'string') return null;

      const trimmed = val.trim();
      if (!trimmed) return null;

      const sanitized = trimmed.replace(/[^0-9.,-]/g, '');
      if (!sanitized) return null;

      const lastComma = sanitized.lastIndexOf(',');
      const lastDot = sanitized.lastIndexOf('.');
      const decimalIndex = Math.max(lastComma, lastDot);
      const decimalSep = decimalIndex === -1
        ? null
        : (decimalIndex === lastComma ? ',' : '.');

      let integerPart = sanitized;
      let fractionPart = '';
      if (decimalSep) {
        fractionPart = sanitized.slice(decimalIndex + 1).replace(/[^0-9]/g, '');
        integerPart = sanitized.slice(0, decimalIndex);
      }

      integerPart = integerPart.replace(/[^0-9-]/g, '');
      let sign = '';
      if (integerPart.startsWith('-')) {
        sign = '-';
        integerPart = integerPart.slice(1);
      }

      integerPart = integerPart.replace(/[^0-9]/g, '');
      if (!integerPart) integerPart = '0';

      const normalized = fractionPart
        ? `${sign}${integerPart}.${fractionPart}`
        : `${sign}${integerPart}`;

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const num = toNumber(value);
    if (num === null) return '';

    try {
      const formatted = num.toLocaleString('it-IT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      if (
        formatted &&
        (Math.abs(num) < 1000 || /[.\s\u00A0\u202F]/.test(formatted))
      ) {
        return formatted;
      }
    } catch (_) {}

    const fixed = num.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${withThousands},${decPart}`;
  };

  // Prepara dati sostituzione contatti
  const contactsData = prop.contacts.map((c, i) => ({
    [`contact${i+1}_first`]: c.first_name,
    [`contact${i+1}_last`]:  c.last_name,
    [`contact${i+1}_email`]: c.email || '',
    [`contact${i+1}_phone`]: c.phone || ''
  })).reduce((acc, obj) => ({ ...acc, ...obj }), {});

  const contactsList = prop.contacts
    .map(c => `${c.first_name || ''} ${c.last_name || ''}`.trim())
    .filter(name => name)
    .join(', ');

  // Helper formato date in base alla lingua (IT => gg/mm/aaaa)
  const formatDate = (d) => {
    if (!d) return '';

    const toParts = (val) => {
      if (val instanceof Date) {
        return { y: val.getFullYear(), m: val.getMonth() + 1, d: val.getDate() };
      }
      if (typeof val === 'string') {
        // Prova match YYYY-MM-DD (DATEONLY)
        const m = val.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) return { y: +m[1], m: +m[2], d: +m[3] };
        // Fallback: parse come Date
        const dt = new Date(val);
        if (!isNaN(dt)) {
          return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
        }
        return null;
      }
      return null;
    };

    const parts = toParts(d);
    if (parts) {
      if (lang === 'it') {
        const dd = String(parts.d).padStart(2, '0');
        const mm = String(parts.m).padStart(2, '0');
        const yyyy = String(parts.y);
        return `${dd}/${mm}/${yyyy}`;
      } else {
        const yyyy = String(parts.y);
        const mm = String(parts.m).padStart(2, '0');
        const dd = String(parts.d).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
    }

    // Ultimo fallback: restituisci stringa originale
    return String(d);
  };

  const paymentTerm = (() => {
    const hasValue = (val) => val != null && String(val).trim() !== '';

    if (hasValue(prop.payment_term)) return String(prop.payment_term).trim();
    if (hasValue(prop.payment)) return String(prop.payment).trim();
    if (prop.client && hasValue(prop.client.payment_term)) {
      return String(prop.client.payment_term).trim();
    }
    return '';
  })();

  const data = {
    company:        prop.client.company || '',
    address:        prop.client.address || '',
    city:           prop.client.city || '',
    state:          prop.client.state || '',
    zip:            prop.client.zip || '',
    vat:            prop.client.vat || '',
    sdi:            prop.client.sdi || '',
    pec:            prop.client.pec || '',
    email:          prop.client.email || '',
    payment_term:   paymentTerm,
    proposal_code:  prop.code || '',
    proposal_date:  formatDate(prop.date),
    author:         prop.author || '',
    title:          prop.title || '',
    revenue:        prop.revenue != null ? formatCurrencyIt(prop.revenue) : '',
    amountLetter:        prop.revenue != null ? currencyToWords(prop.revenue.toFixed(2)) : '',
    version:        prop.version || '',
    notes:          prop.notes || 'prima versione',
    tranche:        prop.tranche || '',
    // Tranche di fatturazione per tabella nel template DOCX
    // Atteso array di { text, value }
    billing_tranches: (() => {
      const raw = prop.billing_tranches;
      let arr = [];
      if (Array.isArray(raw)) arr = raw;
      else if (typeof raw === 'string' && raw.trim()) {
        try { arr = JSON.parse(raw); } catch { arr = []; }
      }
      // normalizza e aggiunge formattazioni utili
      return arr
        .filter(it => it && (it.text || it.value != null))
        .map(it => ({
          text: (it.text || '').toString(),
          //value: it.value != null ? Number(it.value) : null,
          value_formatted: (it.value != null) ? formatCurrencyIt(it.value) : ''
        }));
    })(),
    new_customer:   prop.new_customer ? 'Sì' : 'No',
    start_at:       formatDate(prop.start_at),
    stop_at:        formatDate(prop.stop_at),
    estimation_end: formatDate(prop.estimation_end),
    // Testo condizionale per firma/condizioni, basato su cliente nuovo o esistente
    conditionSigned: (() => {
      const locale = docxTexts[lang] || docxTexts.it || {};
      const block = (locale && locale.conditionSigned) || { new: '', existing: '' };
      return prop.new_customer ? (block.new || '') : (block.existing || '');
    })(),
    contacts:       contactsList,
    ...contactsData
  };

  doc.setData(data);
  doc.render();

  // Genera buffer .docx
  return doc.getZip().generate({ type: 'nodebuffer' });
}

module.exports = generateProposalDocx;
