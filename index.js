const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8008;

app.get('/numbers', async (req,res) => {
    const urls = req.query.url;

    if(!urls){
        return res.status(400).json({ error: 'No URLs provided' });
    }
    const fetchPromises = urls.map(url=>axios.get(url));
    try {
        const responses = await Promise.allSettled(fetchPromises);
        const numbers = responses.filter(response => response.status === 'fulfilled').map(response => response.value.data.numbers).flat();
        const uniqueNumbers = [...new Set(numbers)];
        const sortedNumbers = uniqueNumbers.sort((a,b) => a-b);

        return res.json({ numbers: sortedNumbers });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
