
export function getDate() {
 const now = new Date();

 return now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
}

export function getTime() {
  const now = new Date();

  return now.toTimeString().split(' ')[0].slice(0, 5); // Format: 'HH:MM'
}
