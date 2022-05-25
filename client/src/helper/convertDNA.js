import { weapons } from "../weapons";
export const convertDNA = (dna, lvl, durability) => {
  let tempDna = dna;
  while (tempDna.length < 16) tempDna = "0" + tempDna;
  return {
    dna,
    lvl,
    img: weapons[lvl][tempDna.substring(0, 2) % weapons[lvl].length],
    attack: (tempDna.substring(2, 4) % 10) + 10 * (Number(lvl) - 1),
    type: tempDna.substring(4, 6) % 8,
    speed: (tempDna.substring(6, 8) % 11) + 10 * (Number(lvl) - 1),
    critical: (tempDna.substring(8, 10) % 10) + 10 * (Number(lvl) - 1) + 100,
    criticalRate: (tempDna.substring(10, 12) % 10) + 5 * (Number(lvl) - 1),
    //durability: (tempDna.substring(12, 14) % 2) + Number(lvl),
    //enchant: (tempDna.substring(14, 16) % 4) + 1,
    durability,
    enchant: 3,
  };
};
