import React from "react";

import WeaponRenderer from "../weapon/WeaponRenderer";

import { InventoryContainer } from "../../styles/Inventory.styled";
const weapons = [
  { dna: "5948301827384950", lvl: "1" },
  { dna: "9829384617283748", lvl: "2" },
  { dna: "1293745749283749", lvl: "3" },
  { dna: "3982769740123042", lvl: "4" },
  { dna: "7940102037588923", lvl: "5" },
  { dna: "1209375847690857", lvl: "6" },
  { dna: "8458493938392749", lvl: "7" },
  { dna: "9202375918759385", lvl: "8" },
  { dna: "107785958456567", lvl: "9" },
  { dna: "7549384759048570", lvl: "1" },
];

const Inventory = () => {
  return (
    <InventoryContainer>
      {weapons.map((weapon, idx) => {
        return <WeaponRenderer key={idx} {...weapon} />;
      })}
    </InventoryContainer>
  );
};

export default Inventory;
