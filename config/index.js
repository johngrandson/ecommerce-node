const isProd = process.env.NODE_ENV === "production";

module.exports = {
  secret: isProd ? process.env.SECRET : "ASDAHJKQWEUIOXZ2930287MXCNZ",
  api: isProd ? "https://api.loja-teste.ampliee.com" : "http://localhost:3000",
  store: isProd ? "https://loja-teste.ampliee.com" : "http://localhost:8000",
};
