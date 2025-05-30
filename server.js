const express = require('express');
const bodyParser = require('body-parser');
const wppconnect = require('@wppconnect-team/wppconnect');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let client, connected = false, qrCodeBase64 = '';

wppconnect
  .create({
    session: 'cloud-session',
    catchQR: (base64Qr) => {
      qrCodeBase64 = base64Qr;
      connected = false;
    },
    statusFind: (statusSession) => {
      connected = (statusSession === 'isLogged' || statusSession === 'qrReadSuccess');
    }
  })
  .then((cli) => {
    client = cli;
    console.log("✅ WppConnect iniciado");
  });

app.get('/', (req, res) => {
  res.send('Servidor WppConnect online');
});

app.get('/qr', (req, res) => {
  res.json({ qr: qrCodeBase64 });
});

app.get('/status', (req, res) => {
  res.json({ conectado: connected });
});

app.post('/enviar', async (req, res) => {
  const { numero, mensagem } = req.body;
  if (!connected) return res.json({ status: '❌ Não conectado ao WhatsApp' });

  try {
    await client.sendText(`${numero}@c.us`, mensagem);
    res.json({ status: '✅ Mensagem enviada com sucesso.' });
  } catch (err) {
    res.json({ status: '❌ Erro ao enviar.', erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
