export type MenuTab = "category" | "brand";

export type BrandGroup = "의류" | "뷰티" | "신발" | "스니커즈";

export interface BrandItem {
  id: number;
  name: string;
  group: BrandGroup;
}

export const brandGroups: BrandGroup[] = ["의류", "뷰티", "신발", "스니커즈"];

const seedBrandsByGroup: Record<BrandGroup, string[]> = {
  의류: [
    "MUSINSA STANDARD",
    "MATIN KIM",
    "THISISNEVERTHAT",
    "ADERERROR",
    "COVERNAT",
    "LMC",
    "SATUR",
    "INSILENCE",
    "PARTIMENTO",
    "COOR",
    "YALE",
    "CRITIC",
    "DRAW FIT",
    "XTONZ",
    "ROCKCAKE",
    "UNIFORM BRIDGE",
    "ESPIONAGE",
    "MARK GONZALES",
    "AMOMENTO",
    "CLIF",
  ],
  뷰티: [
    "TAMBURINS",
    "NONFICTION",
    "HERA",
    "ROMAND",
    "CLIO",
    "3CE",
    "LAKA",
    "HINCE",
    "DASHU",
    "ROUND LAB",
    "ANUA",
    "TORRIDEN",
    "DR.G",
    "ABIB",
    "ILLIYOON",
    "AESTURA",
    "BIODANCE",
    "SKIN1004",
    "BANILA CO",
    "PERIPERA",
  ],
  신발: [
    "NIKE",
    "ADIDAS",
    "ASICS",
    "NEW BALANCE",
    "PUMA",
    "VANS",
    "CONVERSE",
    "REEBOK",
    "SALOMON",
    "MERRELL",
    "DR.MARTENS",
    "CLARKS",
    "UGG",
    "HOKA",
    "BIRKENSTOCK",
    "CROCS",
    "FILA",
    "KEDS",
    "SUPERGA",
    "MOONSTAR",
  ],
  스니커즈: [
    "JORDAN",
    "YEEZY",
    "DUNK CLUB",
    "AIR MAX LAB",
    "RUNNER SOCIETY",
    "RETRO COURT",
    "CITY SNEAKER",
    "STREET LACE",
    "SOLE UNION",
    "FOOTLAB",
    "SNEAKERSMITH",
    "KICKS DAILY",
    "LACE HOUSE",
    "STEP MODE",
    "SOLEFIELD",
    "NEXT KICKS",
    "MOTION SNEAKER",
    "URBAN STEP",
    "WAVE RUN",
    "BOLT KICKS",
  ],
};

function buildPopularBrands(): BrandItem[] {
  const firstList: BrandItem[] = [];
  let id = 1;

  brandGroups.forEach((group) => {
    seedBrandsByGroup[group].forEach((name) => {
      firstList.push({ id, name, group });
      id += 1;
    });
  });

  const fillerList: BrandItem[] = [];
  const fillerPrefixByGroup: Record<BrandGroup, string> = {
    의류: "STUDIO LABEL",
    뷰티: "BEAUTY LAB",
    신발: "SHOE FACTORY",
    스니커즈: "SNEAKER CLUB",
  };

  while (firstList.length + fillerList.length < 200) {
    const group = brandGroups[(id - 1) % brandGroups.length];
    fillerList.push({
      id,
      name: `${fillerPrefixByGroup[group]} ${id}`,
      group,
    });
    id += 1;
  }

  return [...firstList, ...fillerList];
}

export const popularBrands = buildPopularBrands();
