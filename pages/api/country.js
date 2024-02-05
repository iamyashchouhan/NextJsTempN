import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { country } = req.query; // Access country parameter from req.query
    const url = `https://temp-number.com/countries/${country}/1`;

    // Fetch HTML content from the website
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);

    // Extract country data
    const countryData = [];

    // Iterate over each country box and extract relevant information
    $("div.country-box").each((index, element) => {
      const time = $(element).find(".add_time-top").text().trim();
      const phoneNumber = $(element).find(".card-title").text().trim();

      // Push extracted data into countryData array
      countryData.push({ time, phoneNumber, country });
    });

    // Send JSON response containing the extracted data
    res.json({ country, countryData });
  } catch (error) {
    // Handle errors by logging them and sending an error response
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
