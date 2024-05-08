const axios = require('axios');

const WINDOW_SIZE = 10;
const THIRD_PARTY_API_URL = "http://third-party-api.com/numbers";
const QUALIFIED_IDS = ['p', 'f', 'e', 'r'];

let numbers = [6,8,10,12,14,16,18,20,22,24,26,28,30];

const fetchNumbers = async (qualifiedId) => {
    try {
        const response = await axios.get(`${THIRD_PARTY_API_URL}/${qualifiedId}`);
        return response.data.numbers || [];
    } catch (error) {
        console.error("Error fetching numbers:", error.message);
        return [];
    }
};

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
};

const validateQualifiedId = (req, res, next) => {
    const { qualifiedId } = req.params;
    if (!QUALIFIED_IDS.includes(qualifiedId)) {
        return res.status(400).json({ error: "Invalid qualified ID" });
    }
    next();
};

const handleRequest = async (req, res) => {
    const { qualifiedId } = req.params;
    const fetchedNumbers = await fetchNumbers(qualifiedId);

    if (fetchedNumbers.length > 0) {
        numbers = fetchedNumbers.concat(numbers);
    }

    const windowPrevState = numbers.slice(-WINDOW_SIZE * 2, -WINDOW_SIZE); // Take the last WINDOW_SIZE elements from the second last set
    const windowCurrState = numbers.slice(-WINDOW_SIZE);

    const average = calculateAverage(windowCurrState);

    const response = {
        numbers,
        windowPrevState,
        windowCurrState,
        avg: parseFloat(average.toFixed(2))
    };
    res.json(response);
};



module.exports = { validateQualifiedId, handleRequest };
