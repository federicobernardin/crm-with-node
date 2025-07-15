// backend/services/docxGenerator.js
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const currencyToWords = require ('../utils/currencyToWords');

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

  // Helper formato date (gestisce stringhe e Date)
  const formatDate = (d) => {
    if (!d) return '';
    return (d instanceof Date && typeof d.toISOString === 'function')
      ? d.toISOString().slice(0,10)
      : String(d);
  };

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
    payment_term:   prop.client.payment_term || '',
    proposal_code:  prop.code || '',
    proposal_date:  formatDate(prop.date),
    author:         prop.author || '',
    title:          prop.title || '',
    revenue:        prop.revenue != null ? prop.revenue.toFixed(2) : '',
    revenueLetter:        prop.revenue != null ? currencyToWords(prop.revenue.toFixed(2)) : '',
    version:        prop.version || '',
    notes:          prop.notes || 'prima versione',
    tranche:        prop.tranche || '',
    new_customer:   prop.new_customer ? 'Sì' : 'No',
    payment:        prop.payment || '',
    start_at:       formatDate(prop.start_at),
    stop_at:        formatDate(prop.stop_at),
    estimation_end: formatDate(prop.estimation_end),
    contacts:       contactsList,
    ...contactsData
  };

  doc.setData(data);
  doc.render();

  // Genera buffer .docx
  return doc.getZip().generate({ type: 'nodebuffer' });
}

module.exports = generateProposalDocx;
