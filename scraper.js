const puppeteer = require('puppeteer');
// https://www.steimatzky.co.il/%D7%A1%D7%A4%D7%A8%D7%99%D7%9D.html

(async () => {
    const extractBooksPages = async (url) => {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log(`scraping: ${url}`)

        const data = await page.evaluate(async () => {
            let pager = document.querySelector('div[class="pager"] > ol > li > a[class="next i-next"]');
            const isLastPage = pager === null;

            let urls = [];

            const articles = document.querySelectorAll('section[id="product-grid"] > div[class="row"] > article');

            for (let i = 0; i < articles.length; i++) {
                urls.push(articles[i].querySelector('a[class="product-image"]').href);
                // const book = await self.browser.newPage();
                // await book.goto(articles[i].querySelector('a[class="product-image"]').href, { waitUntil: 'networkidle2' });
                //
                // const title = document.querySelector('div[id="product-info"] > h1[class="productTitle"]').innerText;
                // const author = document.querySelector('h2[class="authorTitle"] > a').innerText;
                // const description = document.querySelector('div[class="productDescription"]').innerText;
                // const price = document.querySelector('div[class="salePrice"] > span[class="price"]').innerText
                //     .replace(/[^0-9a-zA-Z.]/g, '');
                // const image = document.querySelector('div[class="zoom"] > img').src;
                //
                // books.push({ title, author, description, price, image });
                //
                // await book.close();
            }

            return [
                urls,
                isLastPage,
            ];
        });

        await page.close();

        if (data[1]) {
            return data[0];
        }

        const nextPageNumber = parseInt(url.match(/p=(\d+)$/)[1], 10) + 1;
        const nextUrl = `https://www.steimatzky.co.il/%D7%A1%D7%A4%D7%A8%D7%99%D7%9D.html?limit=120&p=${nextPageNumber}`;

        return data[0].concat(await extractBooksPages(nextUrl));
    }

    const browser = await puppeteer.launch({ headless: false });

    const steimatzky = 'https://www.steimatzky.co.il/%D7%A1%D7%A4%D7%A8%D7%99%D7%9D.html?limit=120&p=1';

    const booksUrls = await extractBooksPages(steimatzky)

    // console.log(booksUrls)

    // const data = await page.evaluate(() => {
    //     const title = document.querySelector('div[id="product-info"] > h1[class="productTitle"]').innerText;
    //     const author = document.querySelector('h2[class="authorTitle"] > a').innerText;
    //     const description = document.querySelector('div[class="productDescription"]').innerText;
    //     const price = document.querySelector('div[class="salePrice"] > span[class="price"]').innerText
    //         .replace(/[^0-9a-zA-Z.]/g, '');
    //     const image = document.querySelector('div[class="zoom"] > img').src;
    //
    //     return {
    //         title,
    //         author,
    //         description,
    //         price,
    //         image,
    //     }
    // });

    // console.log(data)

    await browser.close();
})();