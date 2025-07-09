export function logUserAction(type, payload = {}) {
  const logs = JSON.parse(localStorage.getItem('userActions') || '[]');
  logs.push({
    type,          // ex: 'REMOVE_SERIE', 'ADD_SERIE', 'EPISODE_CHANGE'
    payload,       // objet: { name: ..., etc. }
    at: new Date().toISOString(),
  });
  localStorage.setItem('userActions', JSON.stringify(logs));
}
