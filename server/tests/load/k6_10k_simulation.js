import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 1000 },  // Ramp-up to 1,000 VUs
    { duration: '2m', target: 5000 },  // Ramp-up to 5,000 VUs
    { duration: '3m', target: 10000 }, // Peak load at 10,000 VUs
    { duration: '1m', target: 0 },     // Ramp-down to 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests must finish within 500ms
    http_req_failed: ['rate<0.01'],                  // Failure rate must be < 1%
    checks: ['rate>0.99'],                           // > 99% check pass rate
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:5000';

export default function () {
  // 1. Health Check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
  });

  // 2. Fetch Cached DSA Topics
  const topicsRes = http.get(`${BASE_URL}/api/dsa/topics`);
  check(topicsRes, {
    'topics status is 200': (r) => r.status === 200 || r.status === 304,
  });

  // 3. User Login Simulation
  const loginPayload = JSON.stringify({
    email: 'student@codesphere.io',
    password: 'Password123!',
  });

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  // 4. Code Execution Simulation
  const execPayload = JSON.stringify({
    code: 'console.log("CodeSphere 10K Load Test")',
    language: 'javascript',
  });

  const execRes = http.post(`${BASE_URL}/api/execute/run`, execPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(execRes, {
    'execution status valid': (r) => r.status === 200 || r.status === 429 || r.status === 503,
  });

  sleep(1);
}
