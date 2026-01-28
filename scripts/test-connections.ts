import axios from 'axios';

async function testSources() {
    const sources = [
        { name: 'Himalayas API', url: 'https://himalayas.app/jobs/api?limit=1' },
        { name: 'Himalayas Feed', url: 'https://himalayas.app/jobs/feed/' },
        { name: 'Remotive API', url: 'https://remotive.com/api/remote-jobs?limit=1' },
        { name: 'Arbeitnow API', url: 'https://www.arbeitnow.com/api/job-board-api' },
        { name: 'WWR Feed', url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss' },
    ];

    for (const source of sources) {
        try {
            console.log(`Testing ${source.name}...`);
            const res = await axios.get(source.url, { timeout: 5000 });
            console.log(`Success! Status: ${res.status}`);
        } catch (err: any) {
            console.log(`Failed! Error: ${err.message}`);
        }
    }
}

testSources();
