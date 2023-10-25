import axios from 'axios';
import * as fn from './../shared/fn';

const geckApiUrl = `https://api.coingecko.com/api/v3/`;

const mirrorNodeUrl = (env) => {
    if(!env) env = 'mainnet-public';
    return `https://${env}.mirrornode.hedera.com/api/v1/`
}

export const getTPS = async (env) => {
    try {
        const envUrl = mirrorNodeUrl(env);
        const url = `${envUrl}blocks?limit=1`;
        const response = await axios.get(url);
        return response;
    } catch(e) {
        console.info('axios error - getTPS');
        return e;
    }
}

export const getNetworkNode = async (gtNodeId, order) => {
    const endpoint = `network/nodes?limit=1&node.id=eq:${gtNodeId}`
    const response = await fetchEndpoint(endpoint);
    return response;
}

export const getNetworkNodes = async (gtNodeId, order) => {
    const nodeStr = gtNodeId===0 ? `&node.id=gte:${gtNodeId}` : `&node.id=gt:${gtNodeId}`;
    const endpoint = `network/nodes?limit=25&order=${order}${nodeStr}`
    const response = await fetchEndpoint(endpoint);
    return response;
}
export const getNetworkStake = async () => {
    const endpoint = `network/stake`;
    const response = await fetchEndpoint(endpoint);
    return response;
}
export const getAccount = async (accountId) => {
    const endpoint = `accounts/${accountId}`
    const response = await fetchEndpoint(endpoint);
    return response;
}
export const getAccountBalance = async (accountId) => {
    const endpoint = `balances?account.id=${accountId}`
    const response = await fetchEndpoint(endpoint);
    return response;
}
export const getNetworkSupply = async () => {
    const endpoint = `network/supply`
    const response = await fetchEndpoint(endpoint);
    return response;
}
export const getHbarPrice = async() =>{
    const response = fetchGeckEndpoint('coins/markets?vs_currency=usd&ids=hedera-hashgraph');
    return response;
}
export const getAccountGroups = async (name) => {
    try {
        const url=`${name}.json`;
        const response = await axios.get(url);
        return response;
    } catch(e) {
        console.info(e);
        //return e;
    }
}
export const fetchGeckEndpoint = async (ep) => {
    const url = `${geckApiUrl}${ep}`;
    try {              
        const response = await axios.get(url);
        return response;
    } catch(e) {
        console.info(url);
        //return e;
    }
  }
export const fetchEndpoint = async (endpt) => {
    try {
        const url=`${mirrorNodeUrl() + endpt}`;
        const response = await axios.get(url);
        return response;
    } catch(e) {
        console.info(e);
        return e;
    }
}
export const fetchLocalData = async (name) => {
    try {
        const url=`${name}.json`;
        const response = await axios.get(url);
        return response;
    } catch(e) {
        console.info(e);
        //return e;
    }
}

export const getHederaFees = async() => {
    const fetchInterval=43200000;
    const now = new Date().getTime();
    const item='sak-hh-fees'
    const itemFetch = item+'-fetch'
    const store = JSON.parse(sessionStorage.getItem(item));
    const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;

    if((now - parseInt(lastFetch)) > fetchInterval || !store) {
        const resp=await axios(`/.netlify/functions/getHederaFees`)
            .then(function (response) {                    
                return response;
        })

        sessionStorage.setItem(item, JSON.stringify(resp.data.data));
        sessionStorage.setItem(itemFetch, new Date().getTime());

        return resp.data.data;
    }
    else {
        return store;
    }
}

export const getNodeFees = async() => {
    const fetchInterval=3600000;
    const now = new Date().getTime();
    const item='sak-node-fees'
    const itemFetch = item+'-fetch'
    const store = JSON.parse(sessionStorage.getItem(item));
    const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;

    if((now - parseInt(lastFetch)) > fetchInterval || !store) {
        const resp=await axios(`/.netlify/functions/getNodeFees`)
            .then(function (response) {                    
                return response;
        })

        sessionStorage.setItem(item, JSON.stringify(resp.data.data));
        sessionStorage.setItem(itemFetch, new Date().getTime());

        return resp.data.data;
    }
    else {
        return store;
    }
}

export const getStakingFees = async() => {
    const fetchInterval=3600000;
    const now = new Date().getTime();
    const item='sak-staking-fees'
    const itemFetch = item+'-fetch'
    const store = JSON.parse(sessionStorage.getItem(item));
    const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;

    if((now - parseInt(lastFetch)) > fetchInterval || !store) {
        const resp=await axios(`/.netlify/functions/getStakingFees`)
            .then(function (response) {                    
                return response;
        })

        sessionStorage.setItem(item, JSON.stringify(resp.data.data));
        sessionStorage.setItem(itemFetch, new Date().getTime());

        return resp.data.data;
    }
    else {
        return store;
    }
}

export const getAdminData = async(fetchInterval, supabase) => {
    fetchInterval=3600000;
    const now = new Date().getTime();
    const item='sak-ad'
    const itemFetch = item+'-fetch'
    const store = JSON.parse(sessionStorage.getItem(item));
    const lastFetch = sessionStorage.getItem(itemFetch) ? sessionStorage.getItem(itemFetch) : 0;

    if((now - parseInt(lastFetch)) > fetchInterval || !store) {
        const resp=await axios(`/.netlify/functions/getAdminData`)
            .then(function (response) {                    
                return response;
        })

        sessionStorage.setItem(item, JSON.stringify(resp.data.data));
        sessionStorage.setItem(itemFetch, new Date().getTime());

        return resp.data.data;
    }
    else {
        return store;
    }
}

export const getNodeStake = async () => {
    const epoch = fn.getOperableEpoch();
    const res=await axios(`/.netlify/functions/getNodeStake?epoch=${epoch}`)
        .then(function (response) {                    
            return response;
    })
    .catch(function (error) {
        return {
            statusCode: 422,
            body: `Error: ${error}`
        }
    });

    return res;   
}

export const getEntityStake = async (account) => {
    const res=await axios(`/.netlify/functions/getEntityStake?account=${account}`)
        .then(function (response) {                    
            return response;
    })
    .catch(function (error) {
        return {
            statusCode: 422,
            body: `Error: ${error}`
        }
    });

    return res;   
}

export const createMember = async (id, authEmail, dateCreated) => {        
    const paramStr=`msmemberid=${id}&authemail=${authEmail}&datecreated=${dateCreated}`
    
    const res= axios(`/.netlify/functions/member-create?${paramStr}`)
        .then(function (response) {                    
            return response;
            
        })
        .catch(function (error) {
            return {
                statusCode: 422,
                body: `Error: ${error}`
            }
        });
        
    return res;
}

export const getMember = async (id) => {
    const res=axios(`/.netlify/functions/getMember?msmemberid=${id}`)
        .then(function (response) {                    
            return response;
            
        })
        .catch(function (error) {
            return {
                statusCode: 422,
                body: `Error: ${error}`
            }
        });
        
    return res;
}

export const createUserSession = async (msmemberid, tokenId, datecreated) => {
    if(!tokenId) tokenId='';

    const browser = fn.getBrowserIdentity();
    const paramStr=`msmemberid=${msmemberid}&tokenid=${tokenId}&browser=${browser}&datecreated=${datecreated}`
    
    const res=axios(`/.netlify/functions/session-create?${paramStr}`)
        .then(function (response) {                    
            return response;
            
        })
        .catch(function (error) {
            console.log(error);
            return {
                statusCode: 422,
                body: `Error: ${error}`
            }
        });
    return res;
}

export const expireUserSession = async (sessionId) => {
    if(!sessionId) return;

    const paramStr=`sessionid=${sessionId}`;    
    const res=axios(`/.netlify/functions/session-expire?${paramStr}`)
        .then(function (response) {                    
            return response;
            
        })
        .catch(function (error) {
            console.log(error);
            return {
                statusCode: 422,
                body: `Error: ${error}`
            }
        });
    return res;
}

export const logError = async (errorCode, errorMessage, errorDetail, msmemberid, sessionid) => {
    if(!msmemberid) msmemberid='';
    if(!sessionid) sessionid='';

    const paramStr=`errorCode=${errorCode}&errorMessage=${errorMessage}&errorDetail=${errorDetail}&msmemberid=${msmemberid}&sessionid=${sessionid}`
    const res=axios(`/.netlify/functions/error-insert?${paramStr}`)
        .then(function (response) {                    
            return response;
            
        })
        .catch(function (error) {
            console.log(error);
            return {
                statusCode: 422,
                body: `Error: ${error}`
            }
        });
    return res;
}