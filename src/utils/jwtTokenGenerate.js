const jwt = require('jsonwebtoken');

const accessTokenGenerate = user => {
  const userAccessJwt = jwt.sign(
    {
      _id: user._id,
      userId: user.userId,
      keyword: user.keyword,
      nickname: user.nickname,
      profile_url: user.profile_url,
      status: user.status
    },
    process.env.JWT_KEY_MESSAGE,
    {
      expiresIn: '24h'
    }
  );
  return userAccessJwt;
};

const refreshTokenGenerate = user => {
  const userRefreshJwt = jwt.sign(
    {
      _id: user._id

      //나중에 refresh 토큰에 기기 고유 아이디 꼭 받으셈!!!!!!!!
    },
    process.env.JWT_KEY_REFRESH
  );

  console.log(userRefreshJwt);

  return userRefreshJwt;
};

const adminAccessTokenGenerate = ({ userId, name, _id }) => {
  const adminUserAccessJwt = jwt.sign(
    {
      _id: _id,
      name: name,
      userId: userId
    },
    process.env.JWT_KEY_ADMIN_ACCESS,
    {
      expiresIn: '1h'
    }
  );
  return adminUserAccessJwt;
};

module.exports = {
  accessTokenGenerate,
  refreshTokenGenerate,
  adminAccessTokenGenerate
};
