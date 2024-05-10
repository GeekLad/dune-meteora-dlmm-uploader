import { DuneClient } from "@duneanalytics/client-sdk";

const DUNE_API_KEY = process.env.DUNE_API_KEY;

if (!DUNE_API_KEY)
  throw new Error(`DUNE_API_KEY envioronment variable not set.`);

export interface MeteoraDlmmPair {
  address: string;
  name: string;
  mint_x: string;
  mint_y: string;
  reserve_x: string;
  reserve_y: string;
  reserve_x_amount: number;
  reserve_y_amount: number;
  bin_step: number;
  base_fee_percentage: string;
  max_fee_percentage: string;
  protocol_fee_percentage: string;
  liquidity: string;
  reward_mint_x: string;
  reward_mint_y: string;
  fees_24h: number;
  today_fees: number;
  trade_volume_24h: number;
  cumulative_trade_volume: string;
  cumulative_fee_volume: string;
  current_price: number;
  apr: number;
  apy: number;
  farm_apr: number;
  farm_apy: number;
  hide: boolean;
}

async function fetchPairs(): Promise<MeteoraDlmmPair[]> {
  const response = await fetch("https://dlmm-api.meteora.ag/pair/all", {
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });
  const data: MeteoraDlmmPair[] =
    (await response.json()) as unknown as MeteoraDlmmPair[];
  return data;
}

function pairHeaders(pair: MeteoraDlmmPair): string {
  return Object.keys(pair).join(",");
}

function pairHas24HVolume(pair: MeteoraDlmmPair): Boolean {
  return pair.trade_volume_24h > 0;
}

function pairToString(pair: MeteoraDlmmPair): string {
  return Object.values(pair).join(",");
}

async function uploadDlmmDataToDune(api_key: string) {
  const client = new DuneClient(api_key);
  const pairs = await fetchPairs();
  const data =
    pairHeaders(pairs[0]) +
    "\n" +
    pairs.filter(pairHas24HVolume).map(pairToString).join("\n");
  const result = await client.table.uploadCsv({
    table_name: "meteora_dlmm_api_market_data",
    description: "Meteora DLMM pairs wih 24H volume",
    data,
    is_private: false,
  });
  if (!result) throw new Error(`Something went wrong uploading the data`);
}

(async function () {
  await uploadDlmmDataToDune(DUNE_API_KEY);
  console.log("Upload complete!");
})();
