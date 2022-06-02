import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT || "8000",
  MELI_API_HOST: process.env.MELI_API_HOST || "https://api.mercadolibre.com/",
  AUTHOR_NAME: process.env.AUTHOR_NAME || "",
  AUTHOR_LASTNAME: process.env.AUTHOR_LASTNAME || "",
};

export default ENV;
