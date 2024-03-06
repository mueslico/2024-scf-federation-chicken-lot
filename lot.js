const {
  GET, POST, errorMessages, shuffleArray,
} = require('./libraries.cjs');

const reblogURL = 'https://ani.work/api/v1/statuses/112049306548713243/reblogged_by';
const discordHookURL = '';

/**
 * Reblog 정보 가져오기
 *
 * @returns {Promise<*>}
 */
const fetchReblog = async () => {
  const fetch = await GET(reblogURL, {}, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((data) => {
    const json = JSON.parse(data);
    return (json?.status === true) ? json?.message : errorMessages(false, '게시물이 삭제되었거나 불러오는 도중 문제가 발생하였습니다.');
  });
  return shuffleArray(fetch).filter((_, index) => index <= 10);
};

const simpleDiscordHook = async (url = '', data = '') => {
  await POST(url, {
    username: '당첨자 탄생',
    content: '치킨 이벤트 당첨자가 나왔어요~',
    embeds: [
      {
        title: 'Title',
        url: 'https://google.com/',
        description: '우리 모두 축하해줍시다!',
        fields: data,
      },
    ],
  });
};

/**
 * Application 시작
 *
 * @returns {Promise<*>}
 * @constructor
 */
const Main = async () => {
  const reblog = await fetchReblog();
  const winner = [];

  reblog.map((messageData) => {
    winner.push({
      name: messageData?.display_name,
      value: `@${messageData?.acct}`,
      inline: false,
    });
    return true;
  });

  await simpleDiscordHook(discordHookURL, winner);
};

Main().then(() => {
  console.log('동작완료!');
});
