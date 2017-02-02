const fs = require("fs");
const Uint64BE = require("int64-buffer").Uint64BE;
let offset = 0;
let arr;

fs.readFile("txnlog.dat", function(err, data) {
  arr = Buffer.from(data);
  // Header
  const header = arr.slice(offset,offset+=4).toString('utf8');
  const version = arr.slice(offset,offset+=1).toString('hex');
  const numRecords = parseInt(arr.slice(offset,offset+=4).toString('hex'),16).toString(10);
  console.log(header, version, numRecords);

  while(offset < Buffer.byteLength(arr)) {
    getRecord();
  }
});

function getRecord() {
  let recordType = arr.slice(offset,offset+=1).toString('hex');
  let unixTimestamp = parseInt(arr.slice(offset,offset+=4).toString('hex'),16).toString(10);
  // Not enough precision. 2456938384156277000 vs 2456938384156277127 so I used a 'int64-buffer' lib
  // let userID = parseInt(arr.slice(offset,offset+=8).toString('hex'),16).toString(10);
  let userID = new Uint64BE(arr.slice(offset,offset+=8)).toString(10);
  if(recordType == 00 || recordType == 01) {
    let dollarAmt = arr.slice(offset,offset+=8).readDoubleBE().toFixed(4);
    console.log(recordType, new Date(unixTimestamp*1000).toLocaleString('en-US'), userID, dollarAmt);
  } else {
    console.log(recordType, new Date(unixTimestamp*1000).toLocaleString('en-US'), userID);
  }
}