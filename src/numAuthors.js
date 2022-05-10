import { Mangata } from "mangata-sdk";


const clusters = process.env.CLUSTERS
    ? process.env.CLUSTERS
    : '["wss://prod-kusama-collator-01.mangatafinance.cloud/"]';

const numberBlocks = process.env.BLOCKS
    ? process.env.BLOCKS
    :20;

const nAuthors = process.env.AUTHORS
    ? process.env.AUTHORS
    :2;

async function main() {
  const promises = [];
  const uris = JSON.parse(clusters);
  for (let index = 0; index < uris.length; index++) {

        const uri = uris[index];
        console.log(`Checking node : ${uri}`)
        const mangata = Mangata.getInstance(uri);
        const api = await mangata.getApi();
        const promise = waitForAtLeastNCollators(nAuthors, numberBlocks, api);
        promises.push(promise);
    
    };
    
    const results = await Promise.all(promises);
    console.log(`Result: ${results.toString()}`)
    process.exit(results.every( promiseResult => promiseResult === true) === true ? 0 : -1  );
  };

export const waitForAtLeastNCollators = (
  nAuthors,
  maxBlocks,
  api
) => {
  let count = 0;
  const authors = [];
  return new Promise(async (resolve) => {
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(
      async (head) => {
        const blockHashSignedByUser = await api.rpc.chain.getBlockHash(
          head.number.toNumber()
        );
        const header = await api.derive.chain.getHeader(blockHashSignedByUser);
        const author = header.author.toHuman();
        authors.push(author);
        const nCollators = authors.filter(
          (item, i, ar) => ar.indexOf(item) === i
        ).length;
        console.log(`Chain is at block: #${header.number} - Author: ${author.toString()}`);
        if (nAuthors <= nCollators) {
          unsubscribe();
          resolve(true);
        }
        if (++count === maxBlocks) {
          unsubscribe();
          resolve(false);
        }
      }
    );
  });
};

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
