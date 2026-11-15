// SERVIZI
// Le 10 voci in `items` sono quelle del sito attuale (home), riportate parola per parola.
// Il raggruppamento in 5 aree e i testi descrittivi (`lead`, `body`, contenuti interattivi)
// sono scritti da Altalogik: DA FAR CONFERMARE AL CLIENTE.
import { site } from './content';

export type ServiceSlug = 'progettazione' | 'ristrutturazione-e-recupero' | 'interior-design' | 'direzione-lavori' | 'consulenze';

export type Service = {
  slug: ServiceSlug;
  n: string;
  title: string;
  /** voci originali del sito attuale incluse in quest'area */
  items: string[];
  lead: string;
  body: string[];
  /** foto reali da progetti dello studio */
  photoProjects: string[];
  interactive: string;
};

const pick = (...names: string[]) => names.map((n) => {
  const found = site.services.find((s) => s.toLowerCase() === n.toLowerCase());
  if (!found) throw new Error('Servizio non trovato nel contenuto importato: ' + n);
  return found;
});

export const services: Service[] = [
  {
    slug: 'progettazione',
    n: '01',
    title: 'Progettazione',
    items: pick('Progettazione ex-novo', 'Pianificazione urbanistica'),
    lead: 'Dal primo schizzo al progetto esecutivo: case, edifici e spazi pensati da zero, nel rispetto del luogo che li accoglie.',
    body: [
      'Ogni progetto nasce dall’ascolto: le esigenze di chi abiterà gli spazi, il contesto, il budget e i tempi. Da qui prendono forma le prime idee, che diventano disegni, verifiche e infine il progetto da portare in cantiere.',
      'Seguiamo anche la pianificazione urbanistica, il quadro di regole e scelte che permette a un intervento di inserirsi correttamente nel territorio.',
    ],
    photoProjects: ['villa-bioedilizia-gorle-2020', 'villa-a-chignolo-disola-bg-2016'],
    interactive: 'Percorso a tappe',
  },
  {
    slug: 'ristrutturazione-e-recupero',
    n: '02',
    title: 'Ristrutturazione e recupero',
    items: pick('Ristrutturazioni edilizie', 'Recupero edilizia storica'),
    lead: 'Dare nuova vita a ciò che esiste, dalle case di famiglia agli edifici storici vincolati di Città Alta.',
    body: [
      'Ristrutturare significa leggere un edificio prima di trasformarlo: la sua storia, i materiali, le stratificazioni. Interveniamo con rispetto, lasciando una firma contemporanea in armonia con l’esistente.',
      'Nel recupero dell’edilizia storica il rilievo e lo studio dell’esistente guidano ogni scelta, dal restauro all’adeguamento degli impianti, fino al miglioramento dell’efficienza energetica.',
    ],
    photoProjects: ['le-dimore-di-via-arena-in-citta-alta-2020', 'palazzo-calepio-2012', 'recupero-fienile-e-cascina-bg-2011', 'corti-storiche-a-cornate-dadda-mi-2013'],
    interactive: 'Prima il rilievo, poi il progetto',
  },
  {
    slug: 'interior-design',
    n: '03',
    title: 'Interior design e allestimenti',
    items: pick('Interior design', 'Allestimenti e installazioni'),
    lead: 'Interni su misura per case, ristoranti, uffici e spazi commerciali, fino agli allestimenti temporanei.',
    body: [
      'Progettiamo gli interni partendo da come si vive uno spazio: la luce, i percorsi, i materiali, gli arredi su misura. Ogni scelta è pensata per durare e per raccontare chi abita o lavora in quel luogo.',
      'Curiamo anche allestimenti e installazioni, dove la progettazione incontra la comunicazione.',
    ],
    photoProjects: ['appartamento-a-madonna-di-campiglio-2021', 'outdoor-da-vittorio-2022'],
    interactive: 'Esplora per ambiente',
  },
  {
    slug: 'direzione-lavori',
    n: '04',
    title: 'Direzione lavori e sicurezza',
    items: pick('Direzione lavori e sicurezza dei cantieri'),
    lead: 'Il progetto non finisce sul foglio: lo seguiamo in cantiere, fase dopo fase, fino alla consegna.',
    body: [
      'La direzione lavori garantisce che quanto disegnato venga realizzato come previsto: controllo della qualità, dei tempi e dei costi, coordinamento delle imprese e dei fornitori.',
      'Ci occupiamo inoltre del coordinamento della sicurezza in fase di progettazione ed esecuzione, perché ogni cantiere sia un luogo di lavoro sicuro.',
    ],
    photoProjects: ['villetta-a-schiera-2021', 'uffici-unigel-2020'],
    interactive: 'Il cantiere, fase per fase',
  },
  {
    slug: 'consulenze',
    n: '05',
    title: 'Consulenze e perizie',
    items: pick('Consulenza progettuale e perizie estimative', 'Variazioni catastali', 'Consulenza tecnica per il Tribunale'),
    lead: 'Pareri tecnici, valutazioni e pratiche: un supporto preciso quando serve una risposta professionale.',
    body: [
      'Offriamo consulenza progettuale a privati e aziende, perizie estimative per conoscere il valore di un immobile e variazioni catastali per aggiornare correttamente i documenti.',
      'Svolgiamo inoltre attività di consulenza tecnica per il Tribunale.',
    ],
    photoProjects: ['appartamento-in-citta-alta-2015', 'casa-sui-colli-bergamo-2014'],
    interactive: 'Quale consulenza Le serve?',
  },
];

export const serviceBySlug = (slug?: string) => services.find((s) => s.slug === slug);
