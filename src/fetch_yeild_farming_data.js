require('dotenv').config();
(async () => {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const { print } = require('graphql');
    const gql = require('graphql-tag');
    const fs = require('fs');

    console.log(process.env.THE_GRAPH_API_KEY)
    const endpoint = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.THE_GRAPH_API_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;

    const query = gql`
     {
        pools(first: 5) {
            id
            totalValueLockedUSD
            volumeUSD
            feesUSD
        }
    }
    `;

    async function fetchYieldFarmingData() {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: print(query) })
            });

            const data = await response.json();
            if (data.errors) {
                console.error('Error fetching data:', data.errors);
            } else {
                console.log(data.data);
                fs.writeFileSync('src/yield_data.json', JSON.stringify(data.data, null, 2));
                console.log('Data fetched and saved to yield_data.json');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchYieldFarmingData();
})();
