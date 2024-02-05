import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { country, number } = req.query;
    const url = `https://temp-number.com/temporary-numbers/${country}/${number}/1`;

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const messages = [];
    $(".direct-chat-msg").each((index, element) => {
      const sender = $(element).find(".direct-chat-name").text().trim();
      const time = $(element).find(".direct-chat-timestamp").text().trim();
      const text = $(element).find(".direct-chat-text").text().trim();

      messages.push({ sender, time, text });
    });

    // Extract SIM card information
    const simInfo = {
      status: $(".sim-info__status").text().trim(),
      country: $(".sim-info__country p").text().trim(),
      receivedToday: $('.sim-info:contains("Received Today") p').text().trim(),
      activeSince: $('.sim-info:contains("Active since") p').text().trim(),
    };

    res.json({ messages, simInfo });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
