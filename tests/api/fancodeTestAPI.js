'use strict';

const axios = require('axios');
const assert = require('chai').assert;
const expect = require('chai').expect;
const fs = require('fs');

let fullGETUri;

let fancodeResponseObj = {};

const restHeaders = {
    'content-type': 'application/json',
    'User-Agent': 'Test User',
    'json': true,
};


const buildFanCodeUri = function (params) {
    const uri = [
        `http://jsonplaceholder.typicode.com/`,
        `${params ? params : ''}`,
    ]
    return uri.join('');
};

async function submitFancodeUri (done, params) {
    fullGETUri = buildFanCodeUri(params);
    console.log('fullGETUri: ' + fullGETUri);
    const getOptions = {
        url: fullGETUri,
        method: 'GET',
        headers: restHeaders,
    };
        try {
            const response = await axios(getOptions);
            fancodeResponseObj = response.data;
            done();
            if (!response.data) {
                process.env.ERRORCODE = 'FanCode Service Error >>No response returned from Fancode Service';
                process.env.SCRIPT_STATUS = 'failure';
                throw new Error(process.env.ERRORCODE);
            } else if (response.data.resultCode !== 200 || response.data.resultMessage !== 'SUCCESS') {
                process.env.ERRORCODE = 'Fancode Service Error >> resultCode and resultMessage are not successful';
                process.env.SCRIPT_STATUS = 'failure'; throw new Error(process.env.ERRORCODE);
            }
        } catch (err) {
            process.env.ERRORCODE = err; 
            process.env.SCRIPT_STATUS = 'Failure'; 
            throw err;
        }
};


module.exports.validateFancodeTodosList = async function (done) {
    await submitFancodeUri(done, "TODOS");
    const FancodeTodoResponse = JSON.stringify(fancodeResponseObj);
    const expectedResponse = JSON.parse(fs.readFileSync('testData/mochData.json'));
    expect(JSON.stringify(expectedResponse.sc01)).to.be.equal(FancodeTodoResponse);
    done();
};

module.exports.validateUserFromFanCodeCity = async function (done) {
    let fancodeUserCityCount =0;
    await submitFancodeUri(done, "Users");
    Object.keys(fancodeResponseObj).forEach((address) => {
        if ((between(fancodeResponseObj[address].geo[lat], -40, 5)) && (between(fancodeResponseObj[address].geo[lng], 5, 100))) {
          
          fancodeUserCityCount++;
          console.log('User belongs to fancode city', fancodeUserCityCount);
        }
      });
      assert.isAbove(fancodeUserCityCount, 0)
    done();

};

module.exports.validateCompletedTaskFromUsers = async function (done) {
    let fancodeUserCompletedTaskCount =0;
    await submitFancodeUri(done, "TODOS");
    for (const address of fancodeResponseObj) {
        if (address.completed === 'false') {
        fancodeUserCompletedTaskCount++;
      }
    }
    if (fancodeUserCompletedTaskCount < fancodeResponseObj.length){
        console.log("Fancode Todo tasks are less than 50%" + fancodeUserCompletedTaskCount);
    }
    
    done();

};

function between(x, min, max) {
    return x >= min && x <= max;
}
