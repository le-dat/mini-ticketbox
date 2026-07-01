import http from 'k6/http';
import { sleep, check } from 'k6';

// k6 simulation options
export const options = {
  scenarios: {
    concert_rush: {
      executor: 'per-vu-iterations',
      vus: 5000,          // 5,000 concurrent virtual users
      iterations: 1,      // Each user executes exactly 1 reservation flow
      maxDuration: '45s', // Adjusted from 30s to allow full concurrent completion
    },
  },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  // Generate unique User ID for this iteration
  // Using __VU (Virtual User ID) and a random suffix to avoid collisions
  const randomStr = Math.random().toString(36).substring(2, 7);
  const userId = `user_${__VU}_${randomStr}`;
  const ticketTypeId = Math.random() > 0.4 ? 1 : 2; // Choose Regular (1) or VIP (2)

  // Step 1: Client enters homepage, checks available ticket types
  const getTypesRes = http.get(`${BASE_URL}/ticket-types`);
  check(getTypesRes, {
    'get ticket-types status is 200': (r) => r.status === 200,
  });
  
  // Simulate thinking time before pressing hold (0 - 2 seconds)
  sleep(Math.random() * 2);

  // Step 2: Client clicks to hold a ticket (POST /tickets/hold)
  const holdPayload = JSON.stringify({
    ticket_type_id: ticketTypeId,
    user_id: userId,
  });
  
  const holdParams = {
    headers: { 'Content-Type': 'application/json' },
  };

  const holdRes = http.post(`${BASE_URL}/tickets/hold`, holdPayload, holdParams);
  
  const holdSuccess = check(holdRes, {
    'hold request returns expected status': (r) => r.status === 200 || r.status === 409,
  });

  // If hold succeeds (HTTP 200), proceed to payment
  if (holdSuccess && holdRes.status === 200) {
    const responseBody = JSON.parse(holdRes.body);
    const ticketId = responseBody.ticketId; // Corrected from ticket_id based on NestJS service response

    if (ticketId) {
      // Simulate filling payment details (1 to 5 seconds)
      sleep(1 + Math.random() * 4);

      // Step 3: Client executes payment (POST /orders)
      const payPayload = JSON.stringify({
        ticket_id: ticketId,
        user_id: userId,
        amount: ticketTypeId === 1 ? 500000 : 1500000,
      });

      const payRes = http.post(`${BASE_URL}/orders`, payPayload, holdParams);
      
      check(payRes, {
        'payment successful': (r) => r.status === 200 || r.status === 201,
      });
    } else {
      console.warn(`Hold returned status 200 but ticketId was missing in response body: ${holdRes.body}`);
    }
  }
}
