import WebSocket from 'ws';

const color = {
  green: '\u001b[32m',
  red: '\u001b[31m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  reset: '\u001b[0m',
};

const port = 8888;
const wss = new WebSocket.Server({ port });
console.debug(`WebSocker Server Listen on ${port}`);

wss.on('connection', (ws, req) => {
  console.debug(
    `👍 ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset} Connected`
  );
  broadcast({
    body: `${req.socket.remoteAddress}:${req.socket.remotePort} Connected`,
    from: 'server',
    isBroad: true,
    option: {
      onlineList: getIPs(),
    },
  });

  ws.on('message', (data) => {
    console.debug(
      `${color.blue}<-${color.reset} ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset}`
    );
    console.debug(data);
    try {
      data = JSON.parse(data);

      if (data.to === '*') {
        broadcast(
          {
            body: data.body ?? '',
            from: `${req.socket.remoteAddress}:${req.socket.remotePort}`,
            isBroad: true,
            option: data.option ?? '',
          },
          ws
        );
      } else {
        unicast(
          {
            body: data.body ?? '',
            from: `${req.socket.remoteAddress}:${req.socket.remotePort}`,
            isBroad: false,
            option: data.option ?? '',
          },
          data.to ?? ''
        );
      }
    } catch (e) {
      console.error(`❌ JSON Parse Error ${data}`);
    }
  });

  ws.on('close', () => {
    console.debug(
      `👋 ${color.magenta}${req.socket.remoteAddress}:${req.socket.remotePort}${color.reset} Disconnected`
    );
    broadcast({
      body: `${req.socket.remoteAddress}:${req.socket.remotePort} Disconnected`,
      from: 'server',
      isBroad: true,
      option: { onlineList: getIPs() },
    });
  });
});

const broadcast = (message, ws = false, clients = wss.clients) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      if (ws === false || ws !== client) {
        client.send(JSON.stringify(message));
        console.debug(
          `${color.green}->${color.reset} ${color.magenta}${client._socket.remoteAddress}:${client._socket.remotePort}${color.reset}`
        );
        console.debug(`${JSON.stringify(message, null, 2)}`);
      }
    }
  });
};

const unicast = (message, target, clients = wss.clients) => {
  clients.forEach((client) => {
    if (
      `${client._socket.remoteAddress}:${client._socket.remotePort}` === target
    ) {
      client.send(JSON.stringify(message));
      console.debug(
        `${color.green}->${color.reset} ${color.magenta}${client._socket.remoteAddress}:${client._socket.remotePort}${color.reset}`
      );
      console.debug(`${JSON.stringify(message, null, 2)}`);
    }
  });
};

const getIPs = (clients = wss.clients) => {
  return [...clients].map(
    (client) => `${client._socket.remoteAddress}:${client._socket.remotePort}`
  );
};
