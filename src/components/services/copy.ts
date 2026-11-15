// TESTI SCRITTI DA ALTALOGIK, DA FAR CONFERMARE AL CLIENTE
// Tutte le stringhe nuove delle pagine Servizi (indice, pagina servizio e sezioni interattive).
// Le voci originali del sito (site.services e services[].items) restano in src/data.
// Regola: niente trattini lunghi o medi, niente cifre inventate, si dà del Lei.

import type { ServiceSlug } from '@/data/services';

/* ------------------------------------------------------------------ indice /servizi */
export const indexCopy = {
  seoTitle: 'Servizi',
  seoDescription:
    'Progettazione, ristrutturazione e recupero, interior design, direzione lavori e consulenze: i servizi di RGR Architetti, studio di architettura a Bergamo.',
  kicker: 'Cosa facciamo',
  title: ['Servizi'],
  lead: 'Cinque aree di lavoro, un unico modo di procedere: ascoltare, disegnare con cura e seguire ogni progetto fino alla fine.',
  rowsLabel: 'Le aree di lavoro',
  rowCta: 'Scopra il servizio',
  voicesTitle: ['Le dieci voci', 'dello studio'],
  voicesIntro: 'L’elenco completo delle attività dello studio, raggruppate nelle aree di lavoro.',
  ctaKicker: 'Primo contatto',
  ctaTitle: ['Non sa da quale', 'servizio partire?'],
  ctaText: 'Ci racconti il Suo progetto o la Sua domanda: Le indicheremo il percorso più adatto.',
  ctaButton: 'Scriva allo studio',
};

/* ------------------------------------------------------------------ pagina servizio */
export const serviceCopy = {
  kicker: (n: string) => `Servizio ${n}`,
  bodyLabel: 'L’approccio',
  itemsLabel: 'Comprende',
  photosLabel: 'Dal nostro archivio',
  photoLink: 'Vedi il progetto',
  interactiveLabel: 'Da esplorare',
  relatedLabel: 'Progetti correlati',
  relatedTitle: ['Progetti', 'correlati'],
  prevLabel: 'Servizio precedente',
  nextLabel: 'Servizio successivo',
  allServices: 'Tutti i servizi',
  ctaKicker: 'Parliamo del Suo progetto',
  ctaTitle: ['Ha un progetto', 'in mente?'],
  ctaText: 'Ci scriva qualche riga: sarà il punto di partenza del primo incontro in studio.',
  ctaButton: 'Scriva allo studio',
  notFoundTitle: ['Servizio', 'non trovato'],
  notFoundText: 'La pagina che cerca non esiste o è stata spostata.',
  notFoundLink: 'Torna ai servizi',
};

/** introduzione breve sopra ogni sezione interattiva */
export const interactiveIntro: Record<ServiceSlug, string> = {
  progettazione:
    'Ogni progetto segue un percorso chiaro, dal primo incontro al cantiere. Scorra le tappe per vedere cosa succede in ognuna.',
  'ristrutturazione-e-recupero':
    'Ogni intervento sull’esistente comincia da una lettura attenta: misure, materiali, stato di conservazione. Scelga un progetto e trascini la linea per confrontare le due viste.',
  'interior-design':
    'Case, locali, uffici e negozi: filtri i progetti di interni e di spazi commerciali per tipo di ambiente.',
  'direzione-lavori':
    'Trascini il cursore lungo la linea del cantiere: per ogni fase, cosa fa la direzione lavori e cosa fa il coordinamento della sicurezza.',
  consulenze:
    'Tre domande per orientarsi tra le consulenze dello studio. Il risultato è un primo orientamento: ne parleremo insieme.',
};

/* ------------------------------------------------------------------ 01 progettazione: percorso a tappe */
export type StepIcon = 'ascolto' | 'idea' | 'preliminare' | 'pratiche' | 'esecutivo' | 'cantiere';
export const processSteps: { id: StepIcon; title: string; text: string }[] = [
  {
    id: 'ascolto',
    title: 'Ascolto',
    text: 'Il primo incontro serve a capire: come vive o lavora, cosa desidera, quali sono i vincoli di tempo e di budget.',
  },
  {
    id: 'idea',
    title: 'Idea',
    text: 'Dalle conversazioni nascono i primi schizzi a mano libera: forme, luce, rapporto con il luogo. La direzione si sceglie insieme.',
  },
  {
    id: 'preliminare',
    title: 'Progetto preliminare',
    text: 'Lo schizzo diventa disegno in scala: piante, sezioni e prime scelte sui materiali, con una stima di massima dell’intervento.',
  },
  {
    id: 'pratiche',
    title: 'Pratiche e autorizzazioni',
    text: 'Prepariamo e seguiamo le pratiche edilizie e, dove serve, i pareri degli enti, come avviene per gli edifici vincolati.',
  },
  {
    id: 'esecutivo',
    title: 'Progetto esecutivo',
    text: 'Ogni dettaglio viene definito: nodi costruttivi, impianti, finiture. È il riferimento per le offerte delle imprese e per il lavoro in cantiere.',
  },
  {
    id: 'cantiere',
    title: 'Cantiere',
    text: 'Il progetto prende forma. Lo seguiamo con la direzione lavori fino alla consegna, perché il risultato sia fedele al disegno.',
  },
];
export const processCopy = {
  stepOf: (i: number, n: number) => `Tappa ${String(i).padStart(2, '0')} di ${String(n).padStart(2, '0')}`,
  prev: 'Tappa precedente',
  next: 'Tappa successiva',
  hint: 'Usi le frecce della tastiera o i pulsanti per spostarsi tra le tappe.',
  listLabel: 'Tappe del percorso di progettazione',
};

/* ------------------------------------------------------------------ 02 ristrutturazione: rilievo / realizzato */
export const surveyCopy = {
  pickLabel: 'Scelga un progetto',
  before: 'Lettura dell’esistente',
  after: 'Il progetto realizzato',
  sliderLabel: 'Confronto tra lettura dell’esistente e progetto realizzato',
  valueText: (v: number) => `${v} per cento della vista lettura dell’esistente`,
  hint: 'Trascini la linea, oppure usi le frecce della tastiera.',
  note: 'Nota: la vista “Lettura dell’esistente” è una rielaborazione grafica della foto del progetto realizzato, con griglia e quote indicative. Non è una foto dello stato prima dei lavori.',
};

/* ------------------------------------------------------------------ 03 interior: esplora per ambiente */
export const ambientCopy = {
  all: 'Tutti',
  filterLabel: 'Filtra per ambiente',
  found: (n: number) => (n === 1 ? 'progetto trovato' : 'progetti trovati'),
  empty: 'Nessun progetto in questa categoria.',
  open: 'Apri il progetto',
};

/* ------------------------------------------------------------------ 04 direzione lavori: il cantiere fase per fase */
export const sitePhases: { title: string; dl: string[]; safety: string[] }[] = [
  {
    title: 'Consegna dei lavori',
    dl: [
      'Consegna formale dei lavori all’impresa, con verbale',
      'Verifica dei titoli edilizi e dei documenti di cantiere',
      'Condivisione del programma dei lavori con le imprese',
    ],
    safety: [
      'Piano di sicurezza e coordinamento condiviso con le imprese',
      'Verifica dei piani operativi di sicurezza delle imprese',
      'Riunione di coordinamento iniziale',
    ],
  },
  {
    title: 'Opere strutturali',
    dl: [
      'Verifica della conformità delle opere al progetto',
      'Controllo dei materiali e delle relative certificazioni',
      'Coordinamento con i tecnici delle strutture',
    ],
    safety: [
      'Sopralluoghi periodici in cantiere',
      'Verifica di ponteggi, scavi e opere provvisionali',
    ],
  },
  {
    title: 'Impianti',
    dl: [
      'Coordinamento tra impresa edile e impiantisti',
      'Verifica di tracciati e predisposizioni',
      'Contabilità e stati di avanzamento dei lavori',
    ],
    safety: [
      'Gestione delle interferenze tra imprese presenti insieme',
      'Aggiornamento del piano di sicurezza e coordinamento',
    ],
  },
  {
    title: 'Finiture',
    dl: [
      'Campionature e scelta dei materiali con il cliente',
      'Controllo della qualità di esecuzione',
      'Gestione di eventuali varianti',
    ],
    safety: [
      'Sopralluoghi e verbali di coordinamento',
      'Verifica dell’ordine e della pulizia delle aree di lavoro',
    ],
  },
  {
    title: 'Verifiche e collaudi',
    dl: [
      'Prove e verifiche sugli impianti',
      'Raccolta delle dichiarazioni di conformità',
      'Elenco delle eventuali lavorazioni da completare',
    ],
    safety: [
      'Controllo della smobilitazione del cantiere',
      'Aggiornamento del fascicolo con le caratteristiche dell’opera',
    ],
  },
  {
    title: 'Consegna al cliente',
    dl: [
      'Certificato di ultimazione dei lavori',
      'Conto finale dei lavori',
      'Documentazione per la segnalazione di agibilità',
    ],
    safety: [
      'Consegna del fascicolo dell’opera al committente',
      'Indicazioni per una manutenzione futura in sicurezza',
    ],
  },
];
export const siteCopy = {
  dlLabel: 'Direzione lavori',
  safetyLabel: 'Sicurezza',
  phaseOf: (i: number, n: number) => `Fase ${String(i).padStart(2, '0')} di ${String(n).padStart(2, '0')}`,
  sliderLabel: 'Fase del cantiere',
  hint: 'Trascini il cursore, tocchi una fase o usi le frecce della tastiera.',
  note: 'Le fasi sono indicative: ogni cantiere ha la sua sequenza.',
};

/* ------------------------------------------------------------------ 05 consulenze: quiz */
export type QuizWho = 'privato' | 'azienda' | 'legale';
export type QuizNeed = 'valore' | 'catasto' | 'parere' | 'causa';
export type QuizDocs = 'pronti' | 'da-raccogliere';
export type QuizResult = 'perizie' | 'catasto' | 'tribunale' | 'progettuale';

export const quizQuestions = [
  {
    key: 'who' as const,
    q: 'Chi sta cercando una consulenza?',
    options: [
      { value: 'privato', label: 'Un privato' },
      { value: 'azienda', label: 'Un’azienda' },
      { value: 'legale', label: 'Uno studio legale o il Tribunale' },
    ],
  },
  {
    key: 'need' as const,
    q: 'Di cosa ha bisogno?',
    options: [
      { value: 'valore', label: 'Conoscere il valore di un immobile' },
      { value: 'catasto', label: 'Aggiornare il catasto' },
      { value: 'parere', label: 'Un parere su un progetto' },
      { value: 'causa', label: 'Una consulenza in una causa' },
    ],
  },
  {
    key: 'docs' as const,
    q: 'A che punto è con i documenti?',
    options: [
      { value: 'pronti', label: 'Ho già i documenti' },
      { value: 'da-raccogliere', label: 'Devo ancora raccoglierli' },
    ],
  },
];

/** `title` per perizie, catasto e tribunale è la voce originale del sito, riportata parola per parola */
export const quizResults: Record<QuizResult, { title: string; text: string }> = {
  perizie: {
    title: 'Consulenza progettuale e perizie estimative',
    text: 'Una perizia estimativa stabilisce in modo motivato il valore di un immobile, a partire dal sopralluogo, dai documenti e dal confronto con il mercato. È utile, ad esempio, per una compravendita, una divisione o una successione.',
  },
  catasto: {
    title: 'Variazioni catastali',
    text: 'Quando un immobile cambia, per una ristrutturazione, un frazionamento o un cambio di destinazione, i dati catastali vanno aggiornati. Verifichiamo la situazione e predisponiamo la pratica di variazione.',
  },
  tribunale: {
    title: 'Consulenza tecnica per il Tribunale',
    text: 'Per le questioni tecniche che emergono in una causa, lo studio svolge attività di consulenza tecnica per il Tribunale: sopralluoghi, analisi dei documenti e relazioni scritte.',
  },
  progettuale: {
    title: 'Consulenza progettuale',
    text: 'Un parere tecnico su un progetto, su un acquisto o su un intervento da fare: cosa è possibile realizzare, con quali vincoli e con quali priorità.',
  },
};

export const quizCopy = {
  questionOf: (i: number, n: number) => `Domanda ${i} di ${n}`,
  back: 'Indietro',
  restart: 'Ricomincia',
  resultLabel: 'Il nostro suggerimento',
  cta: 'Scriva allo studio',
  docs: {
    pronti: 'Ha già i documenti: può elencarli nel messaggio, così il primo contatto sarà più rapido.',
    'da-raccogliere':
      'Nessun problema se i documenti non sono pronti: Le indicheremo noi quali servono, ad esempio visure, planimetrie o titoli edilizi.',
  } satisfies Record<QuizDocs, string>,
  progress: 'Avanzamento del questionario',
};
