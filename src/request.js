import qs from 'querystring';

const extractBody = ({ body, isBase64Encoded }) => {
  let value = body;
  if (isBase64Encoded) {
    try {
      value = Buffer.from(body, 'base64');
    } catch (e) {
      // do nothing
    }
  }

  try {
    const o = JSON.parse(value);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    // do nothing
  }

  try {
    return { ...qs.parse(value) };
  } catch (e) {
    // do nothing
  }

  return body;
};

export default ({
  headers = {},
  pathParameters = {},
  queryStringParameters = {},
  body = '',
  isBase64Encoded,
  ...event
}) => {
  const h = Object.keys(headers).reduce((a, key) => {
    a[key.toLowerCase()] = headers[key];
    return a;
  }, {});

  return {
    ...event,
    headers: h,
    data: {
      ...pathParameters,
      ...queryStringParameters,
      ...extractBody({ body, isBase64Encoded }),
    },
  };
};
