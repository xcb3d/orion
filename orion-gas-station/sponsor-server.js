import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3001;
const NETWORK = process.env.NETWORK || 'testnet';
const ENOKI_SECRET_KEY = process.env.ENOKI_SECRET_KEY;
const ENOKI_BASE_URL = process.env.ENOKI_BASE_URL || 'https://api.enoki.mystenlabs.com/v1';
if (!ENOKI_SECRET_KEY) {
  console.error('ERROR: ENOKI_SECRET_KEY is not defined in .env');
  process.exit(1);
}
const headers = {
  'Authorization': `Bearer ${ENOKI_SECRET_KEY}`,
  'Content-Type': 'application/json',
};
app.post('/sponsor', async (req, res) => {
  try {
    const { txBytes, sender, jwt } = req.body;
    if (!txBytes || (!sender && !jwt)) {
      return res.status(400).json({ error: 'Missing mandatory fields: txBytes, sender or jwt' });
    }
    const requestHeaders = { ...headers };
    if (jwt) requestHeaders['zklogin-jwt'] = jwt;
    const response = await fetch(`${ENOKI_BASE_URL}/transaction-blocks/sponsor`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        network: NETWORK,
        transactionBlockKindBytes: txBytes,
        sender: jwt ? undefined : sender,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Enoki Sponsorship failed');
    res.json({
        sponsoredTxBytes: result.data.bytes,
        digest: result.data.digest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/execute', async (req, res) => {
  try {
    const { digest, signature } = req.body;
    if (!digest || !signature) {
      return res.status(400).json({ error: 'Missing digest or signature' });
    }
    const response = await fetch(`${ENOKI_BASE_URL}/transaction-blocks/sponsor/${digest}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ signature }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Enoki Execution failed');
    res.json({ digest: result.data.digest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
    console.log(`Orion Gas Station running on port ${PORT}`);
    console.log(`Network: ${NETWORK.toUpperCase()}`);
});
