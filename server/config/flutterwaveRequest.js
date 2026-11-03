const createSafeFlutterwaveError = (error, operation = "request") => {
  const status = Number(error?.response?.status);
  const statusText = Number.isInteger(status) ? ` (HTTP ${status})` : "";
  return new Error(`Flutterwave ${operation} failed${statusText}.`);
};

const requestFlutterwave = async (request, operation) => {
  try {
    const response = await request();
    return response.data.data;
  } catch (error) {
    throw createSafeFlutterwaveError(error, operation);
  }
};

module.exports = { createSafeFlutterwaveError, requestFlutterwave };
