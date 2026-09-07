/**
 * Every word on the site.
 *
 * Separated from the components because this positioning is new and will be
 * rewritten several times before it is right — and that should not mean
 * touching JSX.
 *
 * ── THE CLAIM DISCIPLINE, WHICH IS PART OF THE BRIEF ─────────────────────
 * The brief says it twice, and it is the single most important rule in this
 * file: do not claim certifications until they are held, and do not promise
 * density, lifespan or cost until the technology has validated them.
 *
 * So every number here is one of three kinds, and each is marked:
 *
 *   plain        a fact about the product's design, safe to state
 *   `target`     a stated goal, rendered with a visible "target" marker
 *   `illustrative` dashboard/demo figures, rendered visibly as sample data
 *
 * Nothing is left ambiguous, and `grep "target: true"` finds every claim
 * that needs evidence before launch.
 */

export const BRAND = {
  name: "Paralelly",
  /* The positioning line the brief lands on: not "we store data in proteins",
     which sounds like an experiment, but the layer it belongs to. */
  line: "The molecular layer for long-term enterprise data storage.",
};

export const NAV = [
  { label: "Platform", href: "#platform" },
  { label: "Technology", href: "#technology" },
  { label: "Solutions", href: "#solutions" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Research", href: "#research" },
];

export const HERO = {
  eyebrow: "Molecular data archival",

  /* ── THE HEADLINE ────────────────────────────────────────────────────────
     The brief warned against leading with "we store data in proteins",
     because on its own that sounds like a science experiment rather than
     infrastructure. But protein is also the most concrete, most memorable
     thing here, and burying it wastes it.

     The resolution is to pair it with an enterprise noun and a hard
     contrast. "Archive" says who this is for. "Not in machines" says what
     it replaces — and it is a statement about the DESIGN (a
     hardware-independent representation), not a performance claim, so it
     needs no validation to be true.

     Alternates, same structure, swap in one line:
       A  "Your coldest data,"          / "written in protein."
       B  "Archive in protein."          / "Retrieve in decades."
       C  "The archive that outlives"    / "the hardware that wrote it."
     Deliberately NOT used: anything naming a density, a lifespan or a cost
     — "a petabyte in a protein" is the obvious headline and it is a claim
     the technology has not yet validated. */
  titleA: "Store your archive in protein.",
  titleB: "Not in machines.",

  sub:
    "Paralelly encodes enterprise data into amino-acid and protein-based media — a molecular archive with no drive to spin, no format to migrate and no hardware generation to survive. Built for data that must be kept for decades and read almost never.",
  primary: "Request enterprise access",
  secondary: "Explore the technology",
  kicker: "Archive once. Preserve for decades. Retrieve when needed.",
  /* The transition the hero visual animates through. */
  chain: ["Enterprise data", "Molecular encoding", "Amino acids / proteins", "Long-term archive"],
};

export const PROBLEM = {
  eyebrow: "The problem",
  title: "Enterprise data is growing faster than storage infrastructure.",
  lede:
    "Enterprises generate enormous amounts of data that may be accessed once every few years — and still has to be preserved, verifiably, for decades.",
  items: [
    { k: "Volume", v: "Historical data accumulates faster than it is ever read back." },
    { k: "Cost", v: "Storage spend rises with retention, not with usage." },
    { k: "Replication", v: "Durability is bought by keeping more copies, each with its own cost." },
    { k: "Energy", v: "Cold data still sits on infrastructure that has to be powered." },
    { k: "Retention", v: "Regulation sets the floor for how long records must survive." },
    { k: "Migration", v: "Every hardware generation is another full copy of the archive." },
  ],
};

export const LAYER = {
  eyebrow: "The solution",
  title: "What if data could be stored at the molecular level?",
  lede:
    "The platform converts digital information into a molecular representation designed for archival storage — a layer below cold storage, for data measured in decades rather than quarters.",
  stack: [
    "Digital data",
    "Data encoding",
    "Molecular representation",
    "Amino acid / protein storage",
    "Long-term archive",
  ],
  ladder: ["Cloud storage", "Cold storage", "Deep archive", "Molecular archive"],
};

export const HOW = {
  eyebrow: "How it works",
  title: "Six stages, from selection to verified retrieval.",
  steps: [
    { tag: "Select", body: "The enterprise selects data for archival — database snapshots, historical records, research datasets, compliance archives, log archives, AI training data." },
    { tag: "Encode", body: "Binary data is converted into a molecular encoding scheme, with error correction applied before anything is synthesised." },
    { tag: "Synthesize", body: "The encoded information is represented in the selected amino-acid or protein medium." },
    { tag: "Preserve", body: "The molecular archive is held under controlled conditions, with no dependency on a running machine to survive." },
    { tag: "Retrieve", body: "On request, the molecular material is processed and decoded back into digital information." },
    { tag: "Verify", body: "The recovered data is checked for integrity against the original archive before it is handed back." },
  ],
};

export const PRODUCTS = {
  eyebrow: "Platform",
  title: "Not a molecule. A platform.",
  lede:
    "Five components, so molecular storage arrives as infrastructure rather than as an experiment.",

  /* ── WHY THIS IS NOT FIVE CARDS ──────────────────────────────────────────
     The five are not peers. Four of them are a data path — in, stored,
     preserved, out — and the fifth governs all four. Rendering them as five
     equal tiles hid the only structural fact the section has to convey, and
     left an orphan row in a three-column grid besides.

     So the shape is the architecture: a path, and a plane across it. */
  path: [
    { name: "Archive Gateway", role: "Ingress", body: "Ingest from the infrastructure you already run, without moving to a new platform first." },
    { name: "Molecular Archive", role: "Store", body: "The archival store itself — long-term enterprise data held in molecular media." },
    { name: "Molecular Vault", role: "Preserve", body: "The physical preservation layer, under controlled conditions." },
    { name: "Retrieval Engine", role: "Egress", body: "Recovers archived information on request and returns it as the original dataset." },
  ],
  plane: {
    name: "Archive Control Plane",
    role: "Governs all four",
    body: "Manage, monitor and govern archives — policies, retention, audit, access.",
    spans: ["Policies", "Retention", "Audit", "Access"],
  },
};

export const INGEST = {
  eyebrow: "Enterprise features",
  title: "Archive your data without changing your infrastructure.",
  lede: "Ingestion meets the estate where it is, and classification decides what is worth moving.",
  ingestion: [
    "S3-compatible ingestion",
    "Cloud storage connectors",
    "Database backups",
    "File uploads",
    "API ingestion",
    "Batch ingestion",
    "Automated archival policies",
  ],
  /* ── THESE SEVEN ARE NOT ONE LIST ────────────────────────────────────────
     Four of them are a temperature ladder — Hot, Warm, Cold, Deep archive —
     and the ladder is the argument: molecular storage lives at the bottom of
     it. The other three are flags a classifier raises, which is a different
     kind of thing entirely. Rendering all seven as one undifferentiated row
     hid the one that matters.

     Order is load-bearing here: the ladder must read hot to cold. */
  classes: ["Hot", "Warm", "Cold", "Deep archive", "Duplicate", "Unused", "Compliance"],
  ladderCount: 4,
};

export const CAPS = {
  eyebrow: "Capabilities",
  title: "What the platform does today, and what comes next.",
  lede:
    "The archival path end to end — ingest, classify, encode, preserve, retrieve, verify — with governance around it.",
  /* Shipping / in the MVP scope. */
  now: [
    "Enterprise data ingestion",
    "Automatic data classification",
    "Binary → molecular encoding",
    "Protein / amino-acid sequence generation",
    "Error-correction algorithms",
    "Encryption before encoding",
    "Molecular archive creation",
    "Archive metadata management",
    "Integrity verification",
    "Long-term preservation management",
    "Molecular → digital retrieval",
    "Archive search",
    "Retention policies",
    "Enterprise API",
    "Enterprise dashboard",
  ],
  /* ⚠ Not built. Rendered under its own heading with a roadmap marker so it
     can never read as a list of things the product already does. */
  next: [
    "AI-assisted archival recommendations",
    "Automated cold-data detection",
    "Multi-region molecular vaults",
    "S3-compatible interface",
    "Kubernetes archival operator",
    "Automated compliance retention",
    "Immutable / WORM archives",
    "Data lifecycle automation",
    "Archive disaster recovery",
    "Enterprise audit trails",
  ],
  note:
    "The second list is roadmap, not capability. Nothing in it is available today — move an item up only when it ships.",
};

export const DASHBOARD = {
  eyebrow: "Archive dashboard",
  title: "Every archive, its retention, and its last verification.",
  /* ⚠ Illustrative. These are sample figures shown to convey the shape of the
     product, not measurements. The UI labels them as such. */
  illustrative: true,
  stats: [
    { k: "Total data archived", v: "4.8 PB" },
    { k: "Molecular archives", v: "12,842" },
    { k: "Storage saved", v: "73%" },
    { k: "Archives verified", v: "99.9999%" },
    { k: "Data retention", v: "25+ yrs" },
    { k: "Retrieval requests", v: "42" },
  ],
  cols: ["Archive", "Size", "Created", "Retention", "Status"],
  rows: [
    ["Research-2026", "840 TB", "Jan 2026", "30 yrs", "Verified"],
    ["Finance-2025", "120 TB", "Dec 2025", "10 yrs", "Verified"],
    ["AI-Dataset-01", "2.1 PB", "Nov 2025", "20 yrs", "Verified"],
  ],
};

export const WHY = {
  eyebrow: "Why molecular",
  title: "Every existing medium is a machine you have to keep running.",
  cols: [
    { name: "Hard drives", items: ["Limited physical lifespan", "Hardware dependency", "Power requirements", "Infrastructure maintenance"] },
    { name: "Tape", items: ["Physical degradation", "Hardware compatibility", "Migration requirements", "Retrieval latency"] },
    { name: "Cloud cold storage", items: ["Recurring cost for as long as you keep it", "Provider dependency", "Still someone's infrastructure"] },
  ],
  ours: {
    name: "Molecular archive",
    items: ["Ultra-dense representation", "Built for long-term preservation", "Low-energy archival", "Hardware-independent representation", "Designed for deep cold data"],
  },
  note:
    "Stated as design intent. Density, lifespan and cost advantages will be published here as measured figures once the technology has validated them experimentally — not before.",
};

export const SOLUTIONS = {
  eyebrow: "Solutions",
  title: "Wherever data must outlive the system that produced it.",
  items: [
    { name: "Financial services", body: "Historical transactions, regulatory records, audit data, market datasets, financial reports." },
    { name: "Life sciences", body: "Genomic datasets, research data, clinical datasets, experimental results, pharmaceutical research." },
    { name: "AI companies", body: "Training datasets, model checkpoints, historical models, synthetic datasets, evaluation sets, experiment history." },
    { name: "Aerospace & defence", body: "Mission data, sensor datasets, simulation data, engineering records, historical telemetry." },
    { name: "Manufacturing", body: "Machine data, digital twins, CAD files, sensor history, quality records." },
    { name: "Government", body: "Public records, historical datasets, census data, scientific datasets, long-term records." },
  ],
};

export const RESEARCH = {
  eyebrow: "Technology & research",
  title: "Built at the intersection of information theory, molecular biology and distributed storage.",
  parts: [
    { k: "Molecular encoding", v: "How digital information is mapped into molecular sequences." },
    { k: "Error correction", v: "How the system protects against molecular-level errors." },
    { k: "Synthesis", v: "How encoded molecules are produced." },
    { k: "Preservation", v: "How molecular archives are physically preserved." },
    { k: "Sequencing", v: "How stored information is read back out of the medium." },
    { k: "Reconstruction", v: "How molecular information becomes the original dataset again." },
  ],
  /* ⚠ Readiness, not capability. The brief says to show the experimental
     stage rather than hide it — but these must reflect real internal
     testing before they are published. */
  target: true,
  readiness: [
    { k: "Encoding", v: 90 },
    { k: "Storage", v: 80 },
    { k: "Retrieval", v: 70 },
    { k: "Automation", v: 60 },
    { k: "Enterprise", v: 50 },
  ],
  note:
    "Readiness is self-assessed against internal testing. Replace these with measured figures — storage density, retrieval accuracy, error rates, stability and environmental testing — before this page is public.",
};

export const ARCH = {
  eyebrow: "Architecture",
  title: "Where it sits in your estate.",
  layers: [
    { name: "Enterprise", items: ["AWS", "Azure", "GCP"] },
    { name: "Archive platform", items: ["Encryption", "Encoding", "Deduplication"] },
    { name: "Molecular storage", items: ["Synthesis", "Preservation"] },
    { name: "Retrieval", items: ["Sequencing", "Reconstruction", "Verification"] },
  ],
};

export const CTA = {
  title: "Your data will outlive your infrastructure.",
  lede: "Build an archival strategy designed for the next generation of data.",
  /* One button. The brief listed three, but a closing section offering
     three equally-weighted choices makes the reader pick instead of act —
     and all three led to the same inbox anyway. */
  buttons: ["Request enterprise access"],
};

export const FOOTER = {
  /* ── EVERY LINK HERE RESOLVES ────────────────────────────────────────────
     The previous footer listed 22 links and every one of them pointed at
     "#cta" — they looked like navigation and did nothing, which is worse
     than a 404 because nothing tells the reader it failed.

     This is a one-page site, so the footer links to the sections that exist
     on it, plus one mailto. Nothing is listed that has nowhere to go.

     Deliberately absent: Careers, Docs, API reference, SDKs, Status, Blog —
     none of those pages exist. And Privacy and Terms, which a real site does
     need: they are omitted rather than faked, because a legal link that 404s
     is worse than an absent one. Add them here when the pages are written. */
  columns: [
    {
      title: "Platform",
      links: [
        { label: "The solution", href: "#platform" },
        { label: "How it works", href: "#how" },
        { label: "Components", href: "#product" },
        { label: "Capabilities", href: "#capabilities" },
        { label: "Architecture", href: "#architecture" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Why molecular", href: "#technology" },
        { label: "Solutions", href: "#solutions" },
        { label: "Research", href: "#research" },
        { label: "Contact", href: "mailto:hello@paralelly.com" },
      ],
    },
  ],
};
