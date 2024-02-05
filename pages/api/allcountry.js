import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://temp-number.com/";
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const status = "on";
    const countries = [];

    $(".country-link").each((index, element) => {
      const countryLink = $(element).attr("href");
      const countryCode = countryLink.split("/").pop();
      const countryName = $(element).find(".card-title").text().trim();

      // Exclude specific countries
      if (
        ![
          "france",
          "netherlands",
          "poland",
          "lithuania",
          "estonia",
          "timor leste",
          "estonia",
          "italy",
          "hong kong",
          "canada",
        ].includes(countryName.toLowerCase())
      ) {
        countries.push({ countryCode, countryName });
      }
    });

    res.status(200).json({ status, countries });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
