//const axios = require('axios');
import axios from 'axios';
const getNFTsByAccount = async (accountId) => {

        const endpoint = "https://beta.api.hgraph.io/v1/graphql"
        const headers = {
            'content-type': 'application/json',
            'x-api-key': process.env.REACT_APP_HGRAPH_API_KEY,
        }

        const nftByAccountQuery = {
            operationName:"GetAccountsNfts",
            query:`query GetAccountsNfts($accountId:bigint) {
                nft(where: {account_id: {_eq: $accountId}}) {
                  token_id
                  serial_number
                  metadata
                }
              }`,
              variables: {
                accountId: accountId
              }
        }

        const getNFTsByAccountResponse = await axios({
            url: endpoint,
            method: 'post',
            headers: headers,
            data: nftByAccountQuery
        })

        const data = getNFTsByAccountResponse.data;
        //const nftsByAccount = data.data.nft;    ////nft maps to the query object "nft" - line 14
        console.log(data.data)
}

getNFTsByAccount(306412);