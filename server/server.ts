import express from 'express';
import cluster from 'cluster';
import os from 'os'; // Para obter o número de CPUs
import { LinxBigCommand } from './linx-big.command';

const app = express();

const getChangedProducts = async () => {
  console.log(`Searching for products with changes`);
  const productsChanged = await LinxBigCommand.getProductsChanged();

  if (productsChanged && productsChanged.length > 0) {
    console.log(`${productsChanged.length} products found with changes`);
    return productsChanged;
  } else {
    console.log('No products found with changes');
    return [];
  }
};

const createWorker = async () => {
  const products = await getChangedProducts(); // Certifique-se de aguardar o resultado

  if (cluster.isPrimary) {
    for (let i = 0; i < 2; i++) { // Número fixo de Workers
      cluster.fork(); // Cria um Worker
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} saiu com código ${code}`);
      cluster.fork(); // Reinicia o Worker se ele falhar
    });
  } else {
    const workerIndex = cluster.worker.id - 1; // Índice do Worker
    const partSize = Math.ceil(products.length / 2); // Tamanho da parte para cada Worker
    const start = workerIndex * partSize; // Índice inicial
    const end = Math.min(start + partSize, products.length); // Índice final

    const workerData = products.slice(start, end); // Parte dos dados para este Worker

    const port = 3000 + cluster.worker.id; // Porta para cada Worker
    
    app.listen(port, () => {
      console.log(`Worker ${process.pid} está ouvindo na porta ${port}`);
    });

    app.get('/index', (req, res) => {
  const jsonResponse = JSON.stringify(workerData, null, 2); // Formato JSON com identação
  res.setHeader('Content-Type', 'application/json'); // Define o tipo de conteúdo
  res.send(jsonResponse);
    });
  }
};


// Chama a função para criar os workers
createWorker();
