/* eslint no-underscore-dangle: 0 */
const axios = require('axios');
const https = require('https');
const qs = require('querystring');

/**
 * 쿼리 스트링 빌더
 *
 * JSON 문자열을 QueryString으로 치환합니다.
 * e.x.) {"a":"b", "c":"d"}를
 * ?a=b&c=d 로 치환시켜줍니다.
 *
 * @param obj             JSON 오브젝트
 * @returns {string}      http query로 빌드 되어서 출력
 */
const queryStringBuilder = (obj) => {
  const queryString = qs.stringify(obj);
  return queryString ? `?${queryString}` : '';
};

/**
 * HTTPS Agent
 *
 * 전산체계에서 공인된 인증서를 신뢰하지 못하면 오류가 발생할 수 있기 때문에
 * 오류를 무시하기 위해 사용합니다.
 *
 * @type {module:https.Agent}
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * 오류 문장 표시 함수
 *
 * 오류 문장이나 기타 출력 후 종료를 목적으로 하기 위해 사용하는 함수입니다.
 *
 * @param status{boolean}              true / false
 * @param message{string}              오류 문장 입력
 * @param data{object}                 JSON Object 삽입
 * @return false                       별도의 함수 출력 없음
 */
const errorMessages = (status = false, message = '', data = {}) => {
  const messages = JSON.stringify({ status, message, data }).toString();
  console.log(messages);
  process.exit(0);

  // 안넣으면 오류나길래 넣었습니다.
  return false;
};

/**
 * 문장 출력 함수
 * @param status{boolean}              true / false
 * @param message{string}              기타 문장 입력
 * @param data{object}                 JSON Object 삽입
 * @returns {string}                   JSON stringify화 된 문장 출력
 */
const returnMessages = (status = false, message = '', data = {}) => {
  const messages = JSON.stringify({ status, message, data }).toString();
  return (messages);
};

/**
 * HTTP GET Method 편의기능
 *
 * HTTP의 GET Method를 편하게 사용할 수 있도록 처리하였습니다.
 *
 * @param url                         접속하고자 하는 주소
 * @param data                        Query String
 * @param options                     Headers 등의 추가기능 설정
 * @returns {Promise<unknown>}        Promise를 반환합니다.
 * @constructor
 */
const GET = async (url = '', data = {}, options = {}) => {
  const _options = {
    httpsAgent,
    ...options,
  };

  const _data = queryStringBuilder(data);
  return new Promise((resolve, reject) => {
    // POST 요청 보내기
    axios.get(`${url}${_data}`, _options)
      .then((response) => {
        resolve(returnMessages(true, response?.data));
      })
      .catch(() => {
        reject(errorMessages(false, '시스템 오류가 발생했습니다.'));
      });
  });
};

/**
 * HTTP POST Method 편의기능
 *
 * HTTP의 POST Method를 편하게 사용할 수 있도록 처리하였습니다.
 *
 * @param url                         접속하고자 하는 주소
 * @param data                        Query String
 * @param options                     Headers 등의 추가기능 설정
 * @returns {Promise<unknown>}        Promise를 반환합니다.
 * @constructor
 */
const POST = async (url = '', data = {}, options = {}) => {
  const _options = { httpsAgent, ...options };
  return new Promise((resolve, reject) => {
    // POST 요청 보내기
    axios.post(url, data, _options)
      .then((response) => {
        resolve(returnMessages(true, response?.data));
      })
      .catch(() => {
        reject(errorMessages(false, '시스템 오류가 발생했습니다.'));
      });
  });
};

/**
 * 배열 섞기
 *
 * Javascript의 배열을 섞습니다.
 * 섞는게 전부입니다.
 * Made by @ChatGPT
 *
 * @param array  섞을 배열을 넣습니다.
 */
const shuffleArray = (array) => {
  const newArray = [...array]; // 배열을 복사하여 새로운 배열 생성
  for (let i = 0; i < newArray.length - 1; i++) { // i를 0부터 시작하여 증가하도록 변경
    const j = Math.floor(Math.random() * (newArray.length - i) + i); // j의 범위를 변경하여 배열의 순서를 랜덤하게 섞음
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 배열 요소의 위치를 바꿔줌
  }
  return newArray;
};

module.exports = {
  GET, POST, returnMessages, errorMessages, shuffleArray,
};
