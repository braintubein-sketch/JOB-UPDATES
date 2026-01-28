import axios from 'axios';
import * as cheerio from 'cheerio';

async function testFoundTheJobFeed() {
    try {
        const { data } = await axios.get('https://foundthejob.com/feed/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            }
        });
        const $ = cheerio.load(data, { xmlMode: true });

        $('item').each((i, itemEl) => {
            const title = $(itemEl).find('title').text();
            const content = $(itemEl).find('content\\:encoded').text();
            const inner$ = cheerio.load(content);

            console.log(`\n--- ${title} ---`);
            inner$('a').each((j, el) => {
                const href = inner$(el).attr('href');
                if (href && !href.includes('foundthejob.com') && !href.includes('telegram.dog') && !href.includes('instagram.com') && !href.includes('youtube.com') && !href.includes('addtoany.com')) {
                    console.log(`External Link: ${href} (Text: ${inner$(el).text()})`);
                }
            });
        });

    } catch (err) {
        console.error(err);
    }
}

testFoundTheJobFeed();
