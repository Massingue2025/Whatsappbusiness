# WppConnect Cloud com Render

Servidor para envio de mensagens WhatsApp, usando WppConnect, rodando automaticamente na Render.com.

## Endpoints

- `GET /qr`: Retorna o QR code em base64
- `GET /status`: Retorna se o WhatsApp está conectado
- `POST /enviar`: Envia uma mensagem

Exemplo JSON:
```json
{
  "numero": "25884XXXXXXX",
  "mensagem": "Olá!"
}
```

## Deploy no Render

- Conecte este repositório ao Render
- Use:
  - Build Command: `npm install`
  - Start Command: `node server.js`
