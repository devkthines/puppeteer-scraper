import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  const quotes = [];

  let currentPage = 1;
  const maxPages = 10; // Assuming there are 10 pages

  while (currentPage <= maxPages) {
    await page.goto(`http://quotes.toscrape.com/page/${currentPage}/`, { waitUntil: "domcontentloaded" });

    const pageQuotes = await page.evaluate(() => {
      const quoteList = document.querySelectorAll(".quote");
      return Array.from(quoteList).map((quote) => {
        const text = quote.querySelector(".text").innerText;
        const author = quote.querySelector(".author").innerText;
        return { text, author };
      });
    });

    quotes.push(...pageQuotes);

    const nextButton = await page.$(".pager > .next > a");
    if (nextButton) {
      await nextButton.click();
      currentPage++;
    } else {
      break; // No more pages, exit the loop
    }
  }

  console.log(quotes);
  await browser.close();
};

getQuotes();