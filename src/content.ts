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

     So the headline does not lead with the molecule at all. It leads with
     the bill. Migration is the line item every enterprise archive owner
     already knows they are paying — PROBLEM lists it last and it is the
     one that recurs forever: each hardware generation is another full copy
     of everything, bought again. "The last archive you'll ever migrate"
     names the end of that, and the sub-head immediately says what makes it
     true, which is where protein finally enters.

     Why this survives the claim discipline, which is the test that matters
     here: it is a statement about the DESIGN, not about performance. A
     representation that is not tied to a hardware generation has nothing
     to migrate TO — that is a property of the format, true on day one, and
     it needs no density, lifespan or cost figure to hold. Compare "your
     archive will last centuries", which reads similarly and is a lifespan
     claim the technology has not yet validated.

     Previous headlines, and alternates — same structure, swap in one line:
       —  "The future of data storage"      / "is protein."
       —  "Store your archive in protein."  / "Not in machines."
       A  "Your coldest data,"              / "written in protein."
       B  "Data that outlives"              / "the machines that stored it."
       C  "Your archive doesn't"            / "belong on hardware."
     Deliberately NOT used: anything naming a density, a lifespan or a cost
     — "a petabyte in a protein" is the obvious headline and it is a claim
     the technology has not yet validated. */
  titleA: "The last archive",
  titleB: "you’ll ever migrate.",

  sub:
    "Paralelly encodes enterprise data into amino-acid and protein-based media – a molecular archive with no drive to spin, no format to migrate and no hardware generation to survive. Built for data that must be kept for decades and read almost never.",
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
    "Enterprises generate enormous amounts of data that may be accessed once every few years – and still has to be preserved, verifiably, for decades.",
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
    "The platform converts digital information into a molecular representation designed for archival storage – a layer below cold storage, for data measured in decades rather than quarters.",
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
    { tag: "Select", body: "The enterprise selects data for archival – database snapshots, historical records, research datasets, compliance archives, log archives, AI training data." },
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
    { name: "Molecular Archive", role: "Store", body: "The archival store itself – long-term enterprise data held in molecular media." },
    { name: "Molecular Vault", role: "Preserve", body: "The physical preservation layer, under controlled conditions." },
    { name: "Retrieval Engine", role: "Egress", body: "Recovers archived information on request and returns it as the original dataset." },
  ],
  plane: {
    name: "Archive Control Plane",
    role: "Governs all four",
    body: "Manage, monitor and govern archives – policies, retention, audit, access.",
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
    "The archival path end to end – ingest, classify, encode, preserve, retrieve, verify – with governance around it.",
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
    "The second list is roadmap, not capability. Nothing in it is available today – move an item up only when it ships.",
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
    "Stated as design intent. Density, lifespan and cost advantages will be published here as measured figures once the technology has validated them experimentally – not before.",
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
    "Readiness is self-assessed against internal testing. Replace these with measured figures – storage density, retrieval accuracy, error rates, stability and environmental testing – before this page is public.",
};

/* ── PUBLISHED EVIDENCE ─────────────────────────────────────────────────────
   THE FOURTH KIND OF NUMBER, AND THE ONLY ONE ON THIS PAGE THAT IS REAL.

   Everything else in this file is `plain`, `target` or `illustrative` — a
   design fact, a stated goal, or sample data. This block is different: every
   figure is a measured result from peer-reviewed literature, and each one
   carries the paper it comes from.

   ⚠ THE RULE FOR THIS BLOCK: these are OTHER GROUPS' results, not Paralelly's.
   They establish that peptide storage works as a field — encoding, recovery,
   density, error correction, preservation — which is exactly the question an
   enterprise buyer asks first. They do not say anything about this company's
   own system, and the copy must never imply they do. The moment a figure here
   is presented as ours it becomes the kind of unvalidated claim the discipline
   at the top of this file exists to prevent.

   Every `src` was read at the source, not taken from a summary. Add nothing
   here without doing the same. */
export const EVIDENCE = {
  eyebrow: "Published evidence",
  title: "Peptide storage is demonstrated, not hypothetical.",
  lede:
    "Independent groups have encoded files into peptides, read them back by mass spectrometry, and recovered them intact. These are their published results, not ours – cited so the claims can be checked.",
  items: [
    {
      k: "Files encoded and recovered",
      v: "A 848-bit text file was written to 40 18-mer peptides and recovered at 100%. A 13,752-bit music file was written to 511 peptides; 93.7% of amino acids were read correctly and the file was recovered in full after error correction.",
      src: "Ng et al., Nature Communications, 2021",
      href: "https://www.nature.com/articles/s41467-021-24496-9",
    },
    {
      k: "Encoding density",
      v: "3 bits per amino acid across an 8-amino-acid alphabet, measured at 1.7 × 10¹⁰ bits/g. Because synthesis does not require enzyme recognition, unnatural amino acids can extend the alphabet – a theoretical ceiling of 3.72× DNA.",
      src: "Ng et al., Nature Communications, 2021",
      href: "https://www.nature.com/articles/s41467-021-24496-9",
    },
    {
      k: "Error correction",
      v: "Ordinary coding theory, not a new discipline: LDPC codes tolerating 10% missing amino acids, and Reed–Solomon at code rate 0.562.",
      src: "Ng et al., Nature Communications, 2021",
      href: "https://www.nature.com/articles/s41467-021-24496-9",
    },
    {
      k: "Reading",
      v: "Liquid chromatography with tandem mass spectrometry (LC-MS/MS) – established analytical instrumentation, not a bespoke sequencer.",
      src: "Ng et al., Nature Communications, 2021",
      href: "https://www.nature.com/articles/s41467-021-24496-9",
    },
    {
      k: "Preservation under accelerated ageing",
      v: "Peptides held in a chitosan hydrogel returned their information in full after 3.5 days at 70 °C – an accelerated-ageing equivalent of over 600 years at 9.4 °C. Reported data density 2.44 × 10¹⁰ GB/g.",
      src: "Luo et al., Communications Materials, 2025",
      href: "https://www.nature.com/articles/s43246-025-00915-y",
    },
    {
      k: "Survival in deep time",
      /* The multiplier here is the paper's, not a press release's. Secondary
         coverage of this result says "almost 50 times older than any DNA
         record"; the paper itself makes the narrower and better-defined
         claim — a thermal age of ~16 Ma at 10 °C, two orders of magnitude
         beyond the oldest recovered DNA. Thermal age, not calendar age, is
         the comparison that controls for burial temperature, which is the
         whole reason the Laetoli material survived. Use the paper. */
      v: "Peptide sequences bound to mineral surfaces have been authenticated in 3.8-million-year-old ostrich eggshell from Laetoli – a thermal age of roughly 16 Ma at 10 °C, which the authors place two orders of magnitude beyond the oldest recovered DNA.",
      src: "Demarchi et al., eLife, 2016",
      href: "https://elifesciences.org/articles/17092",
    },
  ],
  note:
    "These are results published by independent research groups, cited so they can be verified. They establish the feasibility of the medium. They are not measurements of Paralelly's own system, and nothing on this page should be read as claiming otherwise.",
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
