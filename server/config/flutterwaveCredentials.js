const getFlutterwaveSecretKey = (env = process.env) => {
  const secretKey = env.FLW_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error(
      "FLW_SECRET_KEY is required to initialize Flutterwave payments.",
    );
  }

  return secretKey;
};

module.exports = { getFlutterwaveSecretKey };
