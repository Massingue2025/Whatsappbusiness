const express = require('express');
const bodyParser = require('body-parser');
const wppconnect = require('@wppconnect-team/wppconnect');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

let client;
let connected = false;
let qrCodeBase64 = '';

// Inicializa o cliente WppConnect
wppconnect
  .create({
    session: 'cloud-session',
    catchQR: (base64Qr) => {
      qrCodeBase64 = base64Qr;
      connected = false;
      console.log("📷 QR Code atualizado");
    },
    statusFind: (statusSession) => {
      connected = (statusSession === 'isLogged' || statusSession === 'qrReadSuccess');
      console.log("🔄 Status da sessão:", statusSession);
    }
  })
  .then((cli) => {
    client = cli;
    console.log("✅ WppConnect iniciado com sucesso");
  })
  .catch((err) => {
    console.error("❌ Erro ao iniciar o WppConnect:", err);
  });

// Rota de status simples
app.get('/', (req, res) => {
  res.send('✅ Servidor WppConnect online');
});

// Retorna o QR Code com prefixo correto
app.get('/qr', (req, res) => {
  if (qrCodeBase64) {
    res.json({ qr: 'data:image/png;base64,' + qrCodeBase64 });
  } else {
    res.json({ qr: null });
  }
});

// Retorna o status de conexão
app.get('/status', (req, res) => {
  res.json({ conectado: connected });
});

// Envia a mensagem via WhatsApp
app.post('/enviar', async (req, res) => {
  const { numero, mensagem } = req.body;

  if (!connected) {
    return res.json({ status: '❌ Não conectado ao WhatsApp' });
  }

  try {
    await client.sendText(`${numero}@c.us`, mensagem);
    res.json({ status: '✅ Mensagem enviada com sucesso.' });
  } catch (err) {
    res.json({ status: '❌ Erro ao enviar.', erro: err.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
