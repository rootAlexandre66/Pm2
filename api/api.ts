
import express from 'express';
const app = express();
const port = 3001 // Porta da API


app.get('/', (req, res) => {
    const a = [1,2,3,4,5,6];
    res.json({ message: `Hello from the API!${a[0]}` });
  });

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});


