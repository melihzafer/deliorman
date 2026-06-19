// Curated tags for every menu item. One-time data: keyed by item id.
//
// We tag every item across 9 dimensions. The scoring / pairing / rationale
// engines reason about these tags instead of brittle keyword matches on
// item titles. Updating a tag here updates the wizard's behaviour everywhere.

import type { ItemTags } from "./types";

const t = (over: Partial<ItemTags>): ItemTags => ({
  protein: "none",
  flavors: [],
  textures: [],
  temp: "room",
  state: "na",
  profile: "na",
  vibe: "comfort",
  portion: "snack",
  course: "snack",
  ...over,
});

// ---------------------------------------------------------------------------
// HOT BEVERAGES
// ---------------------------------------------------------------------------

const HOT_BEVERAGES: Record<string, ItemTags> = {
  "kafe-espreso": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "modern", portion: "snack", course: "drink", flavors: ["bitter", "umami"] }),
  "kafe-lavatsa-kapsula": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "modern", portion: "snack", course: "drink", flavors: ["bitter", "umami"] }),
  "nes-kafe": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "comfort", portion: "snack", course: "drink", flavors: ["sweet", "umami"] }),
  "kapuchino": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "modern", portion: "snack", course: "drink", flavors: ["sweet", "umami"], textures: ["creamy"] }),
  "mokachino": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "indulgent", portion: "snack", course: "drink", flavors: ["sweet", "umami"], textures: ["creamy"] }),
  "goresht-shokolad": t({ state: "non-alcoholic", profile: "caffeine", temp: "hot", vibe: "indulgent", portion: "snack", course: "drink", flavors: ["sweet", "umami"], textures: ["creamy"] }),
  "pryasno-mlyako": t({ state: "non-alcoholic", profile: "herbal", temp: "hot", vibe: "light", portion: "snack", course: "drink", protein: "dairy", flavors: ["fresh"], textures: ["smooth"] }),
  "chay-bilkov": t({ state: "non-alcoholic", profile: "herbal", temp: "hot", vibe: "light", portion: "snack", course: "drink", flavors: ["fresh", "bitter"] }),
  "plodov-chay": t({ state: "non-alcoholic", profile: "fruity", temp: "hot", vibe: "comfort", portion: "snack", course: "drink", flavors: ["sweet", "fresh", "tart"] }),
  "med": t({ state: "non-alcoholic", profile: "na", temp: "room", vibe: "comfort", portion: "snack", course: "snack", protein: "none", flavors: ["sweet"] }),
  "kanichka-mlyako": t({ state: "non-alcoholic", profile: "herbal", temp: "hot", vibe: "light", portion: "snack", course: "drink", protein: "dairy", flavors: ["fresh"] }),
  "smetana": t({ state: "non-alcoholic", profile: "na", temp: "cold", vibe: "comfort", portion: "snack", course: "snack", protein: "dairy", flavors: ["savory", "umami"] }),
};

// ---------------------------------------------------------------------------
// SALADS
// ---------------------------------------------------------------------------

const SALADS: Record<string, ItemTags> = {
  "shopska-salata": t({ protein: "vegetable", flavors: ["fresh", "savory"], textures: ["raw", "creamy"], temp: "cold", vibe: "traditional-bg", portion: "meal", course: "starter" }),
  "salata-deliorman": t({ protein: "mixed", flavors: ["fresh", "savory", "umami"], textures: ["raw", "creamy"], temp: "cold", vibe: "traditional-bg", portion: "feast", course: "main" }),
  "salata-ovcharska": t({ protein: "mixed", flavors: ["fresh", "savory", "umami"], textures: ["raw", "creamy"], temp: "cold", vibe: "traditional-bg", portion: "feast", course: "main" }),
  "salata-gratska": t({ protein: "vegetable", flavors: ["fresh", "savory"], textures: ["raw"], temp: "cold", vibe: "modern", portion: "meal", course: "starter" }),
  "salata-tsezar": t({ protein: "poultry", flavors: ["savory", "umami", "fresh"], textures: ["raw", "creamy", "crispy"], temp: "cold", vibe: "modern", portion: "meal", course: "main" }),
  "zelena-salata-s-riba-ton": t({ protein: "fish", flavors: ["fresh", "savory"], textures: ["raw"], temp: "cold", vibe: "light", portion: "meal", course: "main" }),
};

// ---------------------------------------------------------------------------
// HOT APPETIZERS
// ---------------------------------------------------------------------------

const HOT_APPETIZERS: Record<string, ItemTags> = {
  "lucheni-kragcheta": t({ protein: "vegetable", flavors: ["savory"], textures: ["fried", "crispy"], temp: "hot", vibe: "comfort", portion: "snack", course: "starter" }),
  "kashkaval-pane": t({ protein: "dairy", flavors: ["savory", "umami"], textures: ["fried", "crispy"], temp: "hot", vibe: "indulgent", portion: "snack", course: "starter" }),
  "pileshki-filentsa-s-kornfleyks": t({ protein: "poultry", flavors: ["savory"], textures: ["fried", "crispy"], temp: "hot", vibe: "comfort", portion: "meal", course: "starter" }),
  "parzheni-kartofi": t({ protein: "vegetable", flavors: ["savory"], textures: ["fried", "crispy"], temp: "hot", vibe: "comfort", portion: "snack", course: "side" }),
  "parzheni-kartofi-sas-sirene": t({ protein: "vegetable", flavors: ["savory", "umami"], textures: ["fried", "crispy", "creamy"], temp: "hot", vibe: "comfort", portion: "snack", course: "side" }),
  "pileshki-kriltsa": t({ protein: "poultry", flavors: ["savory", "smoky"], textures: ["fried", "crispy"], temp: "hot", vibe: "comfort", portion: "meal", course: "starter" }),
  "parzheni-kartofi-po-selski": t({ protein: "vegetable", flavors: ["savory"], textures: ["fried", "crispy"], temp: "hot", vibe: "traditional-bg", portion: "snack", course: "side" }),
  "omlet-s-shunka-i-garnitura": t({ protein: "mixed", flavors: ["savory", "umami"], textures: ["creamy", "smooth"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "portsiya-dyuner": t({ protein: "meat", flavors: ["savory", "spicy", "smoky"], textures: ["grilled"], temp: "hot", vibe: "indulgent", portion: "feast", course: "main" }),
  "svinski-rebra-pecheni": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "meal", course: "main" }),
  "topeni-sirentsa": t({ protein: "dairy", flavors: ["savory", "umami"], textures: ["creamy", "smooth"], temp: "hot", vibe: "indulgent", portion: "snack", course: "starter" }),
  "beybi-motsarela": t({ protein: "dairy", flavors: ["savory", "fresh", "umami"], textures: ["creamy", "smooth"], temp: "cold", vibe: "modern", portion: "snack", course: "starter" }),
};

// ---------------------------------------------------------------------------
// SOUPS, CHICKEN DELICACIES & SANDWICHES
// ---------------------------------------------------------------------------

const SOUPS_SANDWICHES: Record<string, ItemTags> = {
  "pileshka-supa": t({ protein: "poultry", flavors: ["savory", "umami"], textures: ["liquid", "smooth"], temp: "hot", vibe: "comfort", portion: "snack", course: "starter" }),
  "shkembe-chorba": t({ protein: "meat", flavors: ["savory", "umami", "spicy"], textures: ["liquid", "creamy"], temp: "hot", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "supa-topcheta": t({ protein: "meat", flavors: ["savory", "umami"], textures: ["liquid", "smooth"], temp: "hot", vibe: "comfort", portion: "snack", course: "starter" }),
  "tarator": t({ protein: "vegetable", flavors: ["fresh", "tart", "savory"], textures: ["liquid", "creamy", "smooth"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "pileshki-drobcheta": t({ protein: "poultry", flavors: ["savory", "umami", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "meal", course: "main" }),
  "pileshki-sartsa": t({ protein: "poultry", flavors: ["savory", "umami", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "meal", course: "main" }),
  "pileshki-vodenichki": t({ protein: "poultry", flavors: ["savory", "umami", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "meal", course: "main" }),
  "sandvich-kayma": t({ protein: "meat", flavors: ["savory", "umami"], textures: ["baked", "soft"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "sandvich-kashkaval-i-shunka": t({ protein: "mixed", flavors: ["savory", "umami"], textures: ["baked", "soft"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "sandvich-kashkaval": t({ protein: "dairy", flavors: ["savory", "umami"], textures: ["baked", "soft"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "sandvich-sirene-yaytsa-i-kashkaval": t({ protein: "mixed", flavors: ["savory", "umami", "fresh"], textures: ["baked", "soft"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "filiya-hlyab": t({ protein: "grain", flavors: ["savory"], textures: ["baked", "soft"], temp: "room", vibe: "light", portion: "snack", course: "side" }),
  "filiya-hlyab-prepechena": t({ protein: "grain", flavors: ["savory"], textures: ["baked", "crispy"], temp: "hot", vibe: "comfort", portion: "snack", course: "side" }),
  "gratska-pitka": t({ protein: "grain", flavors: ["savory"], textures: ["baked", "soft"], temp: "room", vibe: "comfort", portion: "snack", course: "side" }),
  "gratska-chesnova-pitka": t({ protein: "grain", flavors: ["savory", "umami"], textures: ["baked", "soft"], temp: "room", vibe: "comfort", portion: "snack", course: "side" }),
};

// ---------------------------------------------------------------------------
// PIZZAS
// ---------------------------------------------------------------------------

const PIZZAS: Record<string, ItemTags> = {
  "deliorman": t({ protein: "mixed", flavors: ["savory", "umami", "smoky"], textures: ["baked", "chewy"], temp: "hot", vibe: "modern", portion: "meal", course: "main" }),
  "bondzhorno": t({ protein: "dairy", flavors: ["savory", "umami", "fresh"], textures: ["baked", "chewy"], temp: "hot", vibe: "modern", portion: "meal", course: "main" }),
  "margarita": t({ protein: "dairy", flavors: ["savory", "umami", "fresh"], textures: ["baked", "chewy"], temp: "hot", vibe: "modern", portion: "meal", course: "main" }),
  "kompira": t({ protein: "mixed", flavors: ["savory", "umami", "fresh"], textures: ["baked", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "karleona": t({ protein: "mixed", flavors: ["savory", "umami", "smoky", "tart"], textures: ["baked", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "antigua": t({ protein: "mixed", flavors: ["savory", "umami"], textures: ["baked", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "neapolitana": t({ protein: "poultry", flavors: ["savory", "umami", "fresh"], textures: ["baked", "chewy"], temp: "hot", vibe: "modern", portion: "meal", course: "main" }),
};

// ---------------------------------------------------------------------------
// GRILL
// ---------------------------------------------------------------------------

const GRILL: Record<string, ItemTags> = {
  "kyufte": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "snack", course: "main" }),
  "kebapche": t({ protein: "meat", flavors: ["savory", "smoky", "spicy"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "snack", course: "main" }),
  "teleshko-kyufte": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "snack", course: "main" }),
  "pileshki-shish": t({ protein: "poultry", flavors: ["savory", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "svinski-shish": t({ protein: "meat", flavors: ["savory", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "comfort", portion: "snack", course: "main" }),
  "pileshka-parzhola-but": t({ protein: "poultry", flavors: ["savory", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "svinska-parzhola": t({ protein: "meat", flavors: ["savory", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "adana-kebap": t({ protein: "meat", flavors: ["savory", "spicy", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "adventurous", portion: "snack", course: "main" }),
  "tatarsko-kyufte": t({ protein: "meat", flavors: ["savory", "umami"], textures: ["grilled", "creamy", "chewy"], temp: "hot", vibe: "adventurous", portion: "snack", course: "main" }),
  "meshena-skara": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "feast", course: "main" }),
};

// ---------------------------------------------------------------------------
// SAJ, FISH & SPECIALTIES
// ---------------------------------------------------------------------------

const SAJ_FISH: Record<string, ItemTags> = {
  "pileshki-sach-sas-zelenchutsi": t({ protein: "poultry", flavors: ["savory", "smoky", "fresh"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "feast", course: "main" }),
  "svinski-sach-sas-zelenchutsi": t({ protein: "meat", flavors: ["savory", "smoky", "fresh"], textures: ["grilled", "chewy"], temp: "hot", vibe: "traditional-bg", portion: "feast", course: "main" }),
  "agneshki-sach-sas-zelenchutsi": t({ protein: "meat", flavors: ["savory", "smoky", "fresh"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "feast", course: "main" }),
  "teleshki-ezik": t({ protein: "meat", flavors: ["savory", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "adventurous", portion: "meal", course: "main" }),
  "hapki-deliorman": t({ protein: "mixed", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "feast", course: "main" }),
  "mecha-lapa": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "adventurous", portion: "meal", course: "main" }),
  "tsatsa": t({ protein: "fish", flavors: ["savory", "umami"], textures: ["fried", "crispy"], temp: "hot", vibe: "comfort", portion: "snack", course: "starter" }),
  "skumriya": t({ protein: "fish", flavors: ["savory", "umami", "smoky"], textures: ["grilled", "chewy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
  "sharan-na-tigan": t({ protein: "fish", flavors: ["savory", "umami"], textures: ["fried", "crispy"], temp: "hot", vibe: "traditional-bg", portion: "feast", course: "main" }),
};

// ---------------------------------------------------------------------------
// BURGERS
// ---------------------------------------------------------------------------

const BURGERS: Record<string, ItemTags> = {
  "burger-afrodita": t({ protein: "poultry", flavors: ["savory", "umami"], textures: ["fried", "crispy", "creamy"], temp: "hot", vibe: "modern", portion: "meal", course: "main" }),
  "olimp-burger": t({ protein: "meat", flavors: ["savory", "umami", "smoky"], textures: ["grilled", "creamy"], temp: "hot", vibe: "indulgent", portion: "meal", course: "main" }),
  "royal-burger": t({ protein: "poultry", flavors: ["savory", "umami"], textures: ["grilled", "creamy"], temp: "hot", vibe: "comfort", portion: "meal", course: "main" }),
};

// ---------------------------------------------------------------------------
// NEW SPECIALTIES
// ---------------------------------------------------------------------------

const NEW_SPECIALTIES: Record<string, ItemTags> = {
  "shish-deliorman": t({ protein: "meat", flavors: ["savory", "smoky", "spicy"], textures: ["grilled", "chewy"], temp: "hot", vibe: "indulgent", portion: "meal", course: "main" }),
  "teleshko-pecheno": t({ protein: "meat", flavors: ["savory", "smoky", "umami"], textures: ["grilled", "chewy"], temp: "hot", vibe: "celebratory", portion: "feast", course: "main" }),
  "agneshki-delikates-na-shish": t({ protein: "meat", flavors: ["savory", "smoky", "fresh"], textures: ["grilled", "chewy"], temp: "hot", vibe: "celebratory", portion: "feast", course: "main" }),
};

// ---------------------------------------------------------------------------
// COLD APPETIZERS & SIDES
// ---------------------------------------------------------------------------

const COLD_APPETIZERS: Record<string, ItemTags> = {
  "lukanka": t({ protein: "meat", flavors: ["savory", "spicy", "smoky"], textures: ["chewy"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "sudzhuk": t({ protein: "meat", flavors: ["savory", "spicy", "smoky"], textures: ["chewy"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "pastarma": t({ protein: "meat", flavors: ["savory", "umami", "spicy"], textures: ["chewy"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "sirene": t({ protein: "dairy", flavors: ["savory", "tart", "umami"], textures: ["crumbly"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "kashkaval": t({ protein: "dairy", flavors: ["savory", "umami"], textures: ["crumbly"], temp: "cold", vibe: "traditional-bg", portion: "snack", course: "starter" }),
  "topla-garnitura": t({ protein: "grain", flavors: ["savory"], textures: ["soft"], temp: "hot", vibe: "light", portion: "snack", course: "side" }),
  "studena-garnitura-zele": t({ protein: "vegetable", flavors: ["fresh", "tart"], textures: ["raw", "crispy"], temp: "cold", vibe: "light", portion: "snack", course: "side" }),
  "studena-garnitura-domati": t({ protein: "vegetable", flavors: ["fresh", "savory"], textures: ["raw", "smooth"], temp: "cold", vibe: "light", portion: "snack", course: "side" }),
};

// ---------------------------------------------------------------------------
// NUTS & DESSERTS
// ---------------------------------------------------------------------------

const NUTS_DESSERTS: Record<string, ItemTags> = {
  "leshnitsi": t({ protein: "legume", flavors: ["savory", "umami"], textures: ["crispy"], temp: "room", vibe: "light", portion: "snack", course: "snack" }),
  "bademi": t({ protein: "legume", flavors: ["savory", "umami"], textures: ["crispy"], temp: "room", vibe: "light", portion: "snack", course: "snack" }),
  "indiysko-kashu": t({ protein: "legume", flavors: ["savory", "umami"], textures: ["crispy"], temp: "room", vibe: "light", portion: "snack", course: "snack" }),
  "fastatsi": t({ protein: "legume", flavors: ["savory", "umami"], textures: ["crispy"], temp: "room", vibe: "light", portion: "snack", course: "snack" }),
  "kyunefe": t({ protein: "dairy", flavors: ["sweet", "umami"], textures: ["creamy", "chewy"], temp: "hot", vibe: "indulgent", portion: "meal", course: "dessert" }),
  "sladoled": t({ protein: "dairy", flavors: ["sweet", "fresh"], textures: ["creamy", "smooth"], temp: "cold", vibe: "indulgent", portion: "snack", course: "dessert" }),
};

// ---------------------------------------------------------------------------
// RAKIA
// ---------------------------------------------------------------------------

const RAKIA: Record<string, ItemTags> = {
  "peshterska-grozdova-otlezhala": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "bitter"] }),
  "kehlibar-grozdova": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky"] }),
  "burgaska-muskatova": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "sweet"] }),
  "burgaska-grozdova": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky"] }),
  "burgas-63": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "bitter"] }),
  "burgas-63-barel": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "bitter"] }),
  "slivenska-perla-barel": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "sweet"] }),
  "kaylashka-grozdova": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky"] }),
  "troyanska-slivova-otlezhala": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "sweet"] }),
  "targovishte-muskatova-otlezhala": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "sweet"] }),
  "korten-otlezhala-rezerva": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "bitter"] }),
  "straldzhanska-muskatova-barel": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "smoky"] }),
  "isperih-kaysieva": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "fruity"] }),
};

// ---------------------------------------------------------------------------
// WINES
// ---------------------------------------------------------------------------

const WINES: Record<string, ItemTags> = {
  "targovishte-muskat-sovin-on-blan": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "tart", "fresh"] }),
  "kvantum-shardone-sovin-on-blan": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "tart", "fresh"] }),
  "pearl-white-sovin-on-blan-semiyon": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "fresh"] }),
  "korten-shardone": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "tart", "fresh"] }),
  "nalivna-kana-bialo": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "fruit", flavors: ["fruity", "tart", "fresh"] }),
  "nalivna-chasha-bialo": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "fruit", flavors: ["fruity", "tart", "fresh"] }),
  "targovishte-kaberne": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "kvantum-kaberne-merlo": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "deep-red-kaberne": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "korten-merlo-kaberne": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "nalivna-kana-cherveno": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "nalivna-chasha-cherveno": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "fruity", "bitter"] }),
  "targovishte-roze": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "light", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
  "kvantum-roze": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "light", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
  "pure-pink-roze-sira-murvedar": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
  "korten-roze-sira": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "celebratory", portion: "meal", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
  "nalivna-kana-roze": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "light", portion: "snack", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
  "nalivna-chasha-roze": t({ state: "alcoholic", profile: "wine", temp: "cold", vibe: "light", portion: "snack", course: "drink", protein: "fruit", flavors: ["fruity", "fresh", "tart"] }),
};

// ---------------------------------------------------------------------------
// BEER, CIDER & OTHER DRINKS
// ---------------------------------------------------------------------------

const BEER_OTHER: Record<string, ItemTags> = {
  "carlsberg": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "carlsberg-0-0": t({ state: "non-alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "1664-blanc": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "modern", portion: "snack", course: "drink", protein: "grain", flavors: ["fruity", "fresh", "bitter"] }),
  "budweiser": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "tuborg": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "shumensko-svetlo": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "shumensko-spetsialno": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "pirinsko": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "pirinsko-mlado-pivo": t({ state: "alcoholic", profile: "malty", temp: "cold", vibe: "light", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "fruity", "bitter"] }),
  "samarsbi": t({ state: "alcoholic", profile: "fruity", temp: "cold", vibe: "light", portion: "snack", course: "drink", protein: "fruit", flavors: ["fruity", "sweet", "fresh"] }),
  "uzo-plumari": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "none", flavors: ["umami", "bitter"] }),
  "mastika-peshtera": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "none", flavors: ["umami", "bitter"] }),
  "dzhin-savoy": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "none", flavors: ["umami", "bitter", "fresh"] }),
  "konyak-metaksa": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "fruit", flavors: ["umami", "smoky", "sweet"] }),
  "menta-peshtera": t({ state: "alcoholic", profile: "herbal", temp: "room", vibe: "traditional-bg", portion: "snack", course: "drink", protein: "none", flavors: ["sweet", "fresh", "bitter"] }),
};

// ---------------------------------------------------------------------------
// WHISKEY & VODKA
// ---------------------------------------------------------------------------

const WHISKEY_VODKA: Record<string, ItemTags> = {
  "pasport": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "bitter"] }),
  "balantays": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "bitter"] }),
  "dzheymsan": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky"] }),
  "dzhoni-uokar-red-leybal": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "bitter"] }),
  "dzhim-biym": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "sweet"] }),
  "tyulamor-dyu": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "fruity"] }),
  "dzhak-daniels": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "sweet"] }),
  "dzhoni-uokar-blek-leybal": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "bitter"] }),
  "chivas-regal": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky", "fruity"] }),
  "bushmils-blek-bush": t({ state: "alcoholic", profile: "spirit", temp: "room", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "smoky"] }),
  "vodka-flirt": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-alyaska": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "comfort", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-smirnof": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-absolyut": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-ruski-standart": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-finlandiya": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "fresh"] }),
  "vodka-beluga": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
  "vodka-siva-gaska": t({ state: "alcoholic", profile: "spirit", temp: "cold", vibe: "celebratory", portion: "snack", course: "drink", protein: "grain", flavors: ["umami", "bitter"] }),
};

// ---------------------------------------------------------------------------
// Export — the full tag map keyed by item id.
// ---------------------------------------------------------------------------

export const ITEM_TAGS: Record<string, ItemTags> = {
  ...HOT_BEVERAGES,
  ...SALADS,
  ...HOT_APPETIZERS,
  ...SOUPS_SANDWICHES,
  ...PIZZAS,
  ...GRILL,
  ...SAJ_FISH,
  ...BURGERS,
  ...NEW_SPECIALTIES,
  ...COLD_APPETIZERS,
  ...NUTS_DESSERTS,
  ...RAKIA,
  ...WINES,
  ...BEER_OTHER,
  ...WHISKEY_VODKA,
};

export function getItemTags(id: string): ItemTags {
  return ITEM_TAGS[id] ?? {
    protein: "none",
    flavors: [],
    textures: [],
    temp: "room",
    state: "na",
    profile: "na",
    vibe: "comfort",
    portion: "snack",
    course: "snack",
  };
}
