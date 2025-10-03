// Testi personalizzabili per i template DOCX
// Imposta qui le stringhe che vuoi mostrare nel marcatore `conditionSigned`.
// Verrà scelta "new" se il cliente è nuovo (new_customer = true), altrimenti "existing".

module.exports = {
  it: {
    conditionSigned: {
      new: "allegate, che il Cliente, con la sottoscrizione della presente Lettera d’Incarico, dichiara di aver letto, compreso ed accettato",
      existing: " già in essere tra Arsenalia Digital ed il Cliente",
    },
  },
  en: {
    conditionSigned: {
      existing: "already in force between Arsenalia Digital and the Client",
      new: " which the Client, by signing this Letter of Engagement, declares to have read, understood, and accepted",
    },
  },
};