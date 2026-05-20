const base = 'https://campusbite-ylzz.onrender.com/api/auth';
const email = `livecheck+${Date.now()}@example.com`;
const password = 'Test1234!';

const registerRes = await fetch(base + '/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Live Check', email, password, role: 'buyer' })
});
console.log('register status', registerRes.status);
console.log('register body', await registerRes.text());

const loginRes = await fetch(base + '/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});
console.log('login status', loginRes.status);
console.log('login body', await loginRes.text());
