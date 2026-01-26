const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    console.log('Keys in .env:');
    lines.forEach(line => {
        const parts = line.split('=');
        if (parts[0]) {
            console.log(`- ${parts[0].trim()}`);
        }
    });
} else {
    console.log('.env not found');
}
