import wilayaData from "./data/wilaya-of-algeria.json";

// Source: https://github.com/AbderrahmeneDZ/Wilaya-Of-Algeria — the 58
// wilayas of Algeria (includes the 10 created in the 2019 redistricting).
export const WILAYAS: string[] = wilayaData
  .slice()
  .sort((a, b) => Number(a.id) - Number(b.id))
  .map((w) => w.ar_name);
