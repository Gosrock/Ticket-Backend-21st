/*
https://code.google.com/archive/p/crypto-js/
https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/crypto-js/CryptoJS%20v3.1.2.zip
*/

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
const { NaverError } = require('../errors');
const CryptoJS = require('crypto-js');
const axios = require('axios');

async function naverMessage(caller, receiver, content) {
  //서명
  const date = Date.now().toString();
  const uri = process.env.NAVER_SERVICE_ID; //서비스 ID
  const secretKey = process.env.NAVER_SECRET_KEY; // Secret Key
  const accessKey = process.env.NAVER_ACCESS_KEY; //Access Key
  const method = 'POST';
  const space = ' ';
  const newLine = '\n';
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);

  //문자 송신 요청
  try {
    await axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-type': 'application/json; charset=utf-8', //400
        'x-ncp-apigw-timestamp': date, //401
        'x-ncp-iam-access-key': accessKey, //401
        'x-ncp-apigw-signature-v2': signature //401
      },
      data: {
        type: 'SMS',
        countryCode: '82',
        from: caller, //"발신번호기입",
        content: content, //문자내용 기입,
        messages: [{ to: `${receiver}` }]
      }
    });
  } catch (err) {
    throw new NaverError(err, err.response.status);
  }
}

module.exports = { naverMessage };
