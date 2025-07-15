// frontend/src/api/proposals.js

const BASE = '/api/proposals';

export async function getProposals() {
  const res = await fetch(BASE);
  return res.json();
}

export async function createProposal(data) {
  const res = await fetch(BASE, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateProposal(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteProposal(id) {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
}

export async function uploadProposalFile(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`/api/proposals/${id}/upload`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}
