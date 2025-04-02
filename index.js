const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/generate-email', async (req, res) => {
  try {
    const response = await axios.get('https://rapido.zetsu.xyz/api/tempmail/gen');
    res.json({ email: response.data.email });
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

app.get('/api/check-inbox', async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    return res.status(400).json({ error: 'Email parameter is required' });
  }
  
  try {
    const response = await axios.get(`https://rapido.zetsu.xyz/api/tempmail/inbox?email=${encodeURIComponent(email)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error checking inbox:', error);
    res.status(500).json({ error: 'Failed to check inbox' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});