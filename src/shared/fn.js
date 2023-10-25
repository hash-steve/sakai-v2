import $ from 'jquery';
import * as cnst from './constants';

export const msInHour=3600000;
export const tinyBarTncr=100000000;
export const rateDivisor=100000000;

export const toHbar = (tinybars) => {
    const hbars = tinybars / tinyBarTncr;
    return hbars;
}

export const formatHbar = (tinybars) => {
    var val = toHbar(tinybars);
    val = formatFloat(val);
    return formatHbarLabel(val);
}

export const formatHbarLabel = (val) => {
    return val + cnst.LBL_HBAR_SYMBOL;
}

export function formatInt(val) {
    return parseInt(val).toLocaleString();
}

export function formatToDecimal(val, precision) {
    if(!val) return;
    var fixed = parseFloat(val.toFixed(precision))
    return fixed;
}

export function formatFloat(val) {
    const float = parseFloat(val).toLocaleString();
    return float;
}

export function formatMoney(val) {
    if(!val) return;
    
    const retVal = val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return retVal;
}

export const formatPct = (val, precision) => {
    return val + '%';
}

//takes an array and returns the same array
export function formatData(data) {
    data.forEach(function(rec, idx){
        var objStr = '{';
        var ctr = 0;
        for (const [key, value] of Object.entries(rec)) {
            const formatted = formatDataValue(key, value);
            if(ctr > 0) {
                objStr += ', ';
            }
            objStr += '"' + key + '": "' + formatted + '"';
            ctr+=1;
        }

        objStr +=  '}';
        this[idx] = JSON.parse(objStr);

    }, data);

    return data;
}

function formatDataValue(key, value) {
    if(key.includes("timestamp")) {
        value = tsToDate(value);
    }
    if(key.includes("amount")) {
        value = formatHbar(value);
    }
    if (typeof value == "boolean") {
        value = value ? cnst.LBL_TRUE_VALUE : cnst.LBL_FALSE_VALUE;
    }
    
    value = (value===null) ? "" : value.toString();
    return value;
}

export function truncateString(str, len) {
    return str.substring(0, len - 1)
}

export function randomString(length) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let counter = 0;
    while (counter < length) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
      counter += 1;
    }
    return result;
}

export function isAdmin(member) {
    return member.permissions[0]==='admin';
}

export function getUrl() {
    console.lof(window.location);
}

export function getUrlParam() {
    console.lof(window.location);
}

export function emailRegex() {
    var pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    return pattern;
}

export function getNoRestrictionsPermissions() {
    return ["user:all", "public:restricted", "contributor:all", "admin"]
}

export function getAdminPermissions() {
    return ["9703094d-7ef3-4293-994b-4aff487b5add"]
}

export function getFullAccessPermissions() {
    return ["f02bab43-194c-49a2-8cc3-e231a330f472", "916ea8dc-2799-4fe6-9b45-0cbf043a0f08", "9703094d-7ef3-4293-994b-4aff487b5add"]
}

export function memberHasPlan(member) {
    const memberHasPlan = member.planConnections.length > 0;
    return memberHasPlan;
}

export function getBreakpoints() {
    return { '960px': '75vw', '640px': '100vw' }
}

export function getSubDirectory() {
    const start = (window.location.toString().lastIndexOf('/')) + 1;
    const end = window.location.toString().length;
    const subdir = window.location.toString().substring(start, end).replace('#', '');
    //console.log('sdir: ' + subdir);
    return subdir;
}

export function calcPercent(a, b) {
    if(!a || !b) return;

    const num=a.toString().replaceAll(',','');
    const denom=b.toString().replaceAll(',','');

    return Math.round((num/denom + Number.EPSILON) * 100).toFixed(2);
}

export const getMetadataString = (hexx) => {
    let hex = hexx.toString() //force conversion
    hex = hex.split('\\x')[1]
    let str = ''
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
}


export const getTimestamp = () => {
    var str = new Date().getTime().toString();
    var nanoStr = str.substring(10, str.length);  
    const ts = str.substring(0, 10)+ '.' + nanoStr.padStart(9-parseInt(nanoStr.length), '0');
    return ts;
}

// export const showHTML = () => {
//     $(function() {
//         var editorContent = $(".admin.editor .p-editor-content .ql-editor").html();
//         //console.log(editorContent);
//     });
// }

export const groupArrayBy = function(arr, key) {
    return arr.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  export const groupArray = function(array, arrayProps) {
    //arrayProps = ['sector', 'geolocation']
    const grouped = Object.values(array.reduce((r, o) => {
        const key = arrayProps.map(k => o[k]).join('|');
        (r[key] ??= []).push(o);
        return r;
    }, {}));

    return grouped;
  }

  export const _groupArrBy = (array, f) => {
    var groups = {};
    array.forEach( function(o)
    {
        var group = JSON.stringify( f(o) );
        groups[group] = groups[group] || [];
        groups[group].push( o );  
    });

    return Object.keys(groups).map( function( group ) {
        return groups[group]; 
    })

  }

/* --- Date functions ---*/

export function tsToDate(ts) {
    if(!ts) return;

    const dt = new Date(parseInt(ts.split('.')[0] + '000'));
    return dateToLocalDate(dt);
}

export const dateToLocalDate = (dt) => {
    var tempDt = new Date(dt).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    if(tempDt==="Invalid Date") return "Failed to parse date";

    var arr = tempDt.split(',')
    return arr[1].replace(" ","") + arr[2];
}

export function calendarDateToUtcDate(dt) {
    return Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

export function getDateParts(dt) {
    const arr = [];
        arr.push('day', dt.getDate());
        arr.push('month', dt.getMonth());
        arr.push('year', dt.getFullYear());
}

export function getHoursAgoTs(hrsAgo) {
    if(!hrsAgo) hrsAgo = 24;

    var ts = new Date(getUtcDate() - (hrsAgo * 60 * 60 * 1000));
    return ts.getTime();
}

export function getUTCEndOfDay() {
    var end = new Date();
    const eod = end.setUTCHours(23,59,59,999);
    return eod.toUTCString();
}

export function getLocalDateStr() {
    return new Date(new Date().toUTCString());
}

export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

//leave ts param empty to drop timestamp
export function getUtcDate(ts) {
    const a = new Date();
    let utcDate;
    if(!ts)
        utcDate = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    else {
        var dt = getUtcCalendarDate();
        utcDate = Date.parse(dt);
    }

    return utcDate;
}

export function getUtcYear(dt) {
    const d = new Date(dt)
    return d.getUTCFullYear();
}

export function getUtcMonth(dt) {
    let month = new Date(dt).getUTCMonth()+1;
    return month;
}

export function getUtcDay(dt) {
    let day = new Date(dt).getUTCDate();
    return day;
}

export function getDaysAgo(daysAgo) {

}
export function daysDiff(startDt, endDt) {
    const oneDay = 1000 * 60 * 60 * 24;
  
    const start = Date.UTC(endDt.getFullYear(), endDt.getMonth(), endDt.getDate());
    const end = Date.UTC(startDt.getFullYear(), startDt.getMonth(), startDt.getDate());

    return (start - end) / oneDay;
  }


export function getUtcCalendarDate() {
    return new Date().toISOString();
}
export function getUtcEpochDate() {
    var now = getLocalDateStr();
    return Math.floor(now/8.64e7);
}

export function getOperableEpoch() {
    var days = getUtcEpochDate();
    return days - 1;
}

export const getUtcDateMidnight = (year, month, day) => {
    if(!year) {
        year= new Date().getFullYear();
        month=1;
        day=1
    }
    const dt = new Date(`${year}/${month}/${day}`).setUTCHours(0,0,0,0);
    return dt;
}

export const daysToHours = (days) => {
    return days * 24;
}

export const hoursToMs=(hours) => {
    return hours * msInHour;
}
export const daysAgoToUtcDate = (daysAgo) => {
    var d = new Date(getUtcCalendarDate());
    var daysAgoDt = d.setDate(d.getDate() - daysAgo) - daysAgo;
    return daysAgoDt;
}

export const mapFilterOption = (val) => {
    const n = parseInt(val);
    let ret;
    if(!isNaN(n)) {
        ret = daysAgoToUtcDate(n)
    }
    else {
        if(val==='YTD') {
            ret=getUtcDateMidnight();
        }
        else {
            ret=getUtcDateMidnight(2019,9,16);
        }
    }
    return ret;
}

/* --- End date functions ---*/

/* --- Start utility functions ---*/

export const calcTxns_ = (arr) => {
    return arr.map(function(v) { return v[1] })         // second value of each
        .reduce(function(a,b) { 
          return a + b;
    });      // sum
}

export function pxToVw(value) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth;
      //y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  
    var result = (100*value)/x;
    document.getElementById("result_px_vw").innerHTML = result;
    return result;
}

export function pxToVh(value) {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;
      //x = w.innerWidth || e.clientWidth || g.clientWidth,

    var result = (100*value)/y;
    document.getElementById("result_px_vh").innerHTML = result;
    return result;
}

export function vwToPx(value) {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    //y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var result = (x*value)/100;
    return result;
}

export function vhToPx(value) {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    //x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var result = (y*value)/100;
    return result;
}

export function getElementsByClass(cls) {
    return document.getElementsByClassName(cls);
}
export function getElementById(id) {
    return document.getElementById(id);
}
export function getElementsByRole(role) {
    return document.querySelectorAll(`[role=${role}`)
}

export function hideElementsByClass(cls) {
    var elems = getElementsByClass(cls);
    for(var i = 0; i < elems.length; i++){
        elems[i].style.visibility = "hidden";
        elems[i].style.display = "none";
    }
}

export function hideElementsByRole(role) {
    var elems = getElementsByRole(role);
    for(var i = 0; i < elems.length; i++){
        elems[i].style.visibility = "hidden";
        elems[i].style.display = "none";
    }

    hideElementsByClass('gm-style-iw-tc');
}

export function addClass(elem, cls) {
    elem.classList.add(cls);
}
export function removeClass(elem, cls) {
    elem.classList.remove(cls);
}
export function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

/*--- End utility functions --*/


/*--- Start string functions --*/



/*--- End string functions --*/

export const concatShardReamAccountNum = (shard, realm, accountNum) => {
    return shard+'.'+realm+'.'+accountNum;
}

export function fieldNameToColumnName(field) {
    var arr = field.split("_");
    if(arr.length===1) {
        arr = field.split(".");
    }

    var colName="";
    arr.forEach((part, idx) => {
        part = part.replace("timestamp","date");

        part = capitalizeFirstChar(part)
        if(idx > 0) {
            part = " " + part;
        }
        colName += part;        
    });

    return colName;
    //const isNoise = arr.some(r=> noiseList.includes(r));
}

export function capitalizeFirstChar(word) {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = word.slice(1);    
    return firstLetterCap + remainingLetters;
}

export function getPaginatorTemplate(){
    return "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown";
}

export function getRowsPerPage() {
    return [10,20,50];
}

export function groupByKey(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

export function replaceAll(str, replaceChar, replaceWith) {
    return str.split(replaceChar).join(replaceWith);
}

export function getDefaultDataVizPalette() {
    return ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];
}

export const setDefaultSettings = () => {
    const lsDvp = localStorage.getItem('sak-data-viz-palette');
    
    if(lsDvp) {
        try {
            JSON.parse(lsDvp);
        } catch (ex) {
            localStorage.setItem('sak-data-viz-palette', JSON.stringify(getDefaultDataVizPalette()));
        }
    } else {
        localStorage.setItem('sak-data-viz-palette', JSON.stringify(getDefaultDataVizPalette()));
    }    
}

export function getDataVizPalette() {
    const lsDvp = localStorage.getItem('sak-data-viz-palette');
    var retVal;
    
    if(lsDvp) {
        try {
            retVal = JSON.parse(lsDvp);            
        } catch (ex) {
            retVal = getDefaultDataVizPalette();
        }
    } else {
        retVal = getDefaultDataVizPalette();
    }

    //const list = exemples.sort((a,b) => a.index - b.index).map((exemple, index, array) => exemple.name)
    return retVal.sort();
}

export function arraysMatch(a, b) {
    return a.toString()===b.toString();
}

export const randomHslColor = () => {
    const h = Math.floor(Math.random() * 360),
          s = Math.floor(randomInt(10, 90)) + '%',
          l = Math.floor(randomInt(25, 90)) + '%';// max value of l is 100, but I set to 60 cause I want to generate dark colors
                                                   // (use for background with white/light font color)
    return `hsl(${h},${s},${l})`;
};
export function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sortArray(arr, propIndex) {
    const comp = comparator(propIndex);
    return arr.sort(comp);
}

export function comparator(idx) {
    if(!idx) idx = 0;
    return (a, b) => {
        if (a[idx] < b[idx]) return -1;
        if (a[idx] > b[idx]) return 1;
        return 0;
      }
}

export function getMemberAvatar(member) {
    var str = "";
    if(member.customFields['first-name'] && member.customFields['last-name']) {
        str = member.customFields['first-name'].charAt(0) + member.customFields['last-name'].charAt(0)
    } else {
        str = member.auth['email'].charAt(0)
    }

    return str;
}

    function stringToHslColor(str, s, l) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        var h = hash % 360;
        return 'hsl('+h+', '+s+'%, '+l+'%)';
    }
    
    export function getHslFromString(str) {
        var s = randomInt(35, 100);
        var l = randomInt(25, 100);
        var textColor = l > 70 ? '#555' : '#fff';    
        var bgColor = stringToHslColor(str, s , l);

        return [bgColor, textColor].toString();
    }

    export function secondsPerDay() {
        return 86400
    }

    export const debounce = (func, timeout = 500) => {
        let timeoutId;
        return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, timeout);
        };
    };

    export const getMsMember = () => {
        return JSON.parse(localStorage.getItem('_ms-mem'));
    }

    export const getMsToken = () => {
        return localStorage.getItem('_ms-mid');
    }
    export function right(str, chr) {
        const rightStr=str.substr(str.length-chr,str.length);
        return rightStr;
    }
    export function left(str, cnt) {
        return str.substr(0, cnt)
    }
    export function capitalizeString(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    export const loadLoginModal = (openModal, hideModal, navigate) => {
        var redirect = sessionStorage.getItem('loginRedirect');
        if(!redirect) redirect ="/dashboard";

        openModal({
            type: "LOGIN",
        })
        .then(({ data, type }) => {
            if(!data) {
                hideModal();
                return navigate("/login");
            }         

            hideModal();
            navigate(data.member.loginRedirect);
        });    
    }

    export const getBrowserIdentity = () => {
        const browser = navigator.userAgent+'|'+navigator.userAgentData.brands[0].brand+'|'+navigator.userAgentData.brands[0].version;
        return browser;
    }

    export const emptyGuid = () => {
        return "00000000-0000-0000-0000-000000000000";
    }

    export const findIndexById = (records, id, PK) => {
        let index = -1;
        for (let i = 0; i < records.length; i++) {
            if (records[i][PK]===id) {
                index = i;
                break;
            }
        }
        return index;
    }

    export function padTrailingZeros(num, totalLength) {
        return String(num).padEnd(totalLength, '0');
    }

    export function calcTps(response) {
        const blocks = response.data.blocks[0].count ?? .1;
        const tsTo = response.data.blocks[0].timestamp.to;
        const tsFrom = response.data.blocks[0].timestamp.from
        var tps = Math.round(1 / (tsTo - tsFrom) * blocks) !== undefined ? Math.round(1 / (tsTo - tsFrom) * blocks) : 0;
        
        if(tps===Infinity || !tps) tps = 0;

        return tps;
    }

    export const setVariableInterval = (callbackFunc, timing) => {
    var variableInterval = {
      interval: timing,
      callback: callbackFunc,
      stopped: false,
      runLoop: function() {
        if (variableInterval.stopped) return;
        var result = variableInterval.callback.call(variableInterval);
        if (typeof result == 'number') {
            if (result === 0) return;
            variableInterval.interval = result;
        }
        variableInterval.loop();
      },
      
      stop: function() {
        this.stopped = true;
        window.clearTimeout(this.timeout);
      },
      
      start: function() {
        this.stopped = false;
        return this.loop();
      },
      
      loop: function() {
        this.timeout = window.setTimeout(this.runLoop, this.interval);
        return this;
      }
    };
  
    return variableInterval.start();
    };

    export const calcActualApy = (stakingRewardRate, stakeRewarded) => {
        const apy = stakingRewardRate/stakeRewarded * 365;
        return apy
    }

    export const calcDailyPaidOut = (maxRewardRatePerHbar, stakeRewarded) => {
        return (maxRewardRatePerHbar / 1000000) * toHbar(stakeRewarded);
    }

    export const calcStakingRewards = (rewardRate, stakeRewarded) => {
        return (rewardRate / 1000000) * toHbar(stakeRewarded)
    }

    export function testDateMethods() {
        console.clear();
        console.log('getUtcDateMidnight(2023,1,1): ' + getUtcDateMidnight(2023,1,1));
        console.log('getUtcDateMidnight(2019,9,16): ' + getUtcDateMidnight(2019,9,16));
        console.log('getUtcDateMidnight(): ' + getUtcDateMidnight());
        console.log('daysToHours(7): ' + daysToHours(7));
        console.log('daysAgoToUtcDate(7): ' + daysAgoToUtcDate(7));
        console.log('daysAgoToUtcDate(1): ' + daysAgoToUtcDate(1));
        console.log('daysAgoToUtcDate(365): ' + daysAgoToUtcDate(365));
        console.log('getUtcCalendarDate(): ' + getUtcCalendarDate());
        // const date1 = new Date(getUtcYear(), getUtcMonth(), getUtcDay());
        // const date2 = new Date(getUtcYear(), getUtcMonth(), getUtcDay()-1);
        // console.log('daysDiff()', daysDiff(date1, date2));
        console.log('getUtcDay(getUtcCalendarDate()): ' + getUtcDay(getUtcCalendarDate()));
        console.log('getUtcMonth(getUtcCalendarDate()): ' + getUtcMonth(getUtcCalendarDate()));
        console.log('getUtcYear(getUtcCalendarDate()): ' + getUtcYear(getUtcCalendarDate()));
        console.log('getUtcDate no ts: ' + getUtcDate());
        console.log('getUtcDate(1) with ts: ' + getUtcDate(1));   
        console.log('tsToDate("1694044799"): ' + tsToDate('1694044799'));
        console.log('getOperableEpoch: ' + getOperableEpoch());
        console.log('getLocalDateStr: ' + getLocalDateStr());
        console.log('getUtcEpochDate: ' + getUtcEpochDate());
    }

    //testDateMethods();

