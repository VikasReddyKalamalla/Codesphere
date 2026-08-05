import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
const wsConnectDuration = new Trend('ws_connect_duration');
const wsMessagesReceived = new Counter('ws_messages_received');
const httpErrorRate      = new Rate('http_error_rate');

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 VUs
    { duration: '1m',  target: 500 },  // Scale up to 500 VUs
    { duration: '1m',  target: 1000 }, // Peak load: 1,000 concurrent virtual users
    { duration: '30s', target: 0 },    // Ramp down smoothly
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_error_rate:   ['rate<0.01'], // Less than 1% error rate
    ws_connect_duration: ['p(95)<1000'], // WebSocket handshake under 1,000ms
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5000';
const WS_URL   = __ENV.WS_TARGET_URL || 'ws://localhost:5000/socket.io/?EIO=4&transport=websocket';

export default function () {
  // ─── 1. Health Check Endpoint Test ──────────────────────────────────────────
  const healthRes = http.get(`${BASE_URL}/health`);
  const healthOk = check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });
  httpErrorRate.add(!healthOk);

  sleep(0.5);

  // ─── 2. Fetch Public Learning Paths Endpoint ───────────────────────────────
  const pathsRes = http.get(`${BASE_URL}/api/learning/paths`);
  const pathsOk = check(pathsRes, {
    'learning paths returned 200': (r) => r.status === 200,
    'learning paths array exists': (r) => r.body.includes('success'),
  });
  httpErrorRate.add(!pathsOk);

  sleep(0.5);

  // ─── 3. Concurrent WebSocket / Socket.IO Connection Test ──────────────────
  const startTime = new Date();
  const res = ws.connect(WS_URL, null, function (socket) {
    wsConnectDuration.add(new Date() - startTime);

    socket.on('open', () => {
      // Send Socket.IO connection probe
      socket.send('40');
    });

    socket.on('message', (msg) => {
      wsMessagesReceived.add(1);
      // Socket.IO heartbeat ping/pong
      if (msg === '2') {
        socket.send('3');
      }
    });

    socket.setTimeout(() => {
      socket.close();
    }, 5000);
  });

  check(res, { 'WebSocket connected successfully': (r) => r && r.status === 101 });

  sleep(1);
}
