# mangata-healthcheck


How to run:
`node src/numAuthors.js`

In docker: 
`docker run -it  47b620706fa9 /bin/bash -c "node /usr/src/numAuthors.js" `

# numAuthors.js
Ensures that in CLUSTERS, the number of block authors is >= AUTHORS for a number of BLOCKS. 

Env.Variables:
* Clusters to target the script to the webSocket-> CLUSTERS. Default: '["wss://prod-kusama-collator-01.mangatafinance.cloud/"]'

* Number of blocks:
Blocks to wait to be built in order to find a number of authors. -> BLOCKS. Default 20

* Number of authors:
Number of autors desired to be asserted. -> AUTHORS. Default 2
