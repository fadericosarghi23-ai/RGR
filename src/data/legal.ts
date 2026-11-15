// TESTI LEGALI SCRITTI DA ALTALOGIK, DA FAR CONFERMARE AL CLIENTE (e, se possibile, al suo consulente privacy).
// Descrivono ciò che il nuovo sito usa davvero:
// hosting Netlify, modulo contatti Netlify Forms, font ospitati sul sito, nessun analytics,
// nessun cookie di profilazione, Google Maps caricata solo dopo un clic.
// Titolare ripreso dalla privacy policy attuale (iubenda 23388105, ultima modifica 22/12/2021).

export const titolare = {
  nome: 'Raffaella Guazzoni',
  studio: 'RGR Architetti',
  indirizzo: 'Via Teodoro Frizzoni 22, 24121 Bergamo',
  piva: '02950680161',
  email: 'privacy@rgrarchitetti.it',
  pec: 'raffaella.guazzoni@archiworldpec.it',
};

export const updated = '13 novembre 2026';

export type LegalSection = { title: string; body: string[] };

export const privacy: LegalSection[] = [
  {
    title: 'Titolare del trattamento',
    body: [
      `Titolare del trattamento è l’arch. ${titolare.nome}, ${titolare.studio}, ${titolare.indirizzo}, P.IVA ${titolare.piva}. Per qualsiasi richiesta sui dati personali può scrivere a ${titolare.email} oppure alla PEC ${titolare.pec}.`,
    ],
  },
  {
    title: 'Quali dati trattiamo',
    body: [
      'Dati di navigazione: i server che ospitano il sito registrano, come ogni sito web, dati tecnici quali indirizzo IP, data e ora della richiesta, pagina visitata e tipo di browser. Servono solo a garantire il funzionamento e la sicurezza del sito.',
      'Dati inviati con il modulo contatti: nome e cognome, email, telefono se indicato, argomento e testo del messaggio.',
      'Il sito non usa strumenti di statistica o di profilazione e non installa cookie di questo tipo.',
    ],
  },
  {
    title: 'Perché li trattiamo e base giuridica',
    body: [
      'I dati del modulo contatti sono usati esclusivamente per rispondere alla Sua richiesta e, se lo desidera, per formulare un preventivo. La base giuridica è l’esecuzione di misure precontrattuali adottate su Sua richiesta e il Suo consenso, espresso inviando il modulo.',
      'I dati di navigazione sono trattati sulla base del legittimo interesse del titolare a mantenere il sito sicuro e funzionante.',
    ],
  },
  {
    title: 'Fornitori e trasferimento dei dati',
    body: [
      'Il sito è ospitato da Netlify, Inc. (Stati Uniti), che riceve i dati di navigazione e i messaggi inviati con il modulo contatti in qualità di responsabile del trattamento. Il trasferimento avviene sulla base delle clausole contrattuali standard approvate dalla Commissione Europea.',
      'Se sceglie di mostrare la mappa nella pagina Contatti, il Suo browser si collega a Google Maps (Google Ireland Limited), che tratta i dati secondo la propria informativa. Senza il Suo clic nessun dato viene inviato a Google.',
    ],
  },
  {
    title: 'Per quanto tempo',
    body: [
      'I messaggi ricevuti tramite il modulo sono conservati per il tempo necessario a gestire la richiesta e comunque non oltre 24 mesi, salvo che ne nasca un rapporto professionale. I dati di navigazione sono conservati dal fornitore di hosting per il periodo previsto dai suoi termini di servizio.',
    ],
  },
  {
    title: 'I Suoi diritti',
    body: [
      'Può chiedere in qualsiasi momento l’accesso ai Suoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la portabilità e opporsi al trattamento, scrivendo a ' + titolare.email + '. Ha inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
    ],
  },
];

export const cookie: LegalSection[] = [
  {
    title: 'In breve',
    body: [
      'Questo sito non usa cookie di profilazione né strumenti di statistica. Per questo non Le chiediamo il consenso all’apertura della pagina.',
    ],
  },
  {
    title: 'Cookie e memorie tecniche',
    body: [
      'Il sito non imposta cookie propri. I caratteri tipografici e tutte le immagini sono ospitati sul sito stesso, senza collegamenti a servizi esterni.',
    ],
  },
  {
    title: 'Contenuti di terze parti caricati solo su richiesta',
    body: [
      'Nella pagina Contatti la mappa di Google Maps non viene caricata in automatico. Compare solo se Lei clicca su “Mostra la mappa”: da quel momento Google può impostare cookie propri, secondo la sua cookie policy (policies.google.com/technologies/cookies).',
      'I link alla rassegna stampa portano a siti esterni (ad esempio Interni, Arketipo, Divisare), che hanno proprie politiche sui cookie.',
    ],
  },
  {
    title: 'Come gestire i cookie',
    body: [
      'Può cancellare o bloccare i cookie dalle impostazioni del Suo browser. Per qualsiasi domanda può scrivere a ' + titolare.email + '.',
    ],
  },
];
