// con fetch
const BASE_URL = 'https://nodejs.ddev.site/api/clients';

export async function getClients() {
  const res = await fetch(BASE_URL);
  console.log(res)
  return res.json();
}

export async function createClient(data) {
  console.log(data);
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateClient(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteClient(id) {
  await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
