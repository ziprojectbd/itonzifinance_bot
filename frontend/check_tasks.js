// Debug script to check task states in localStorage
console.log('=== TASK DEBUG INFO ===');

// Check Admin Tasks
const adminTasks = localStorage.getItem('adminTasks');
console.log('Admin Tasks:', adminTasks ? JSON.parse(adminTasks) : 'No admin tasks found');

// Check Airdrop Tasks
const airdropTasks = localStorage.getItem('airdropTasks');
console.log('Airdrop Tasks:', airdropTasks ? JSON.parse(airdropTasks) : 'No airdrop tasks found');

// Summary
if (adminTasks) {
  const adminTasksParsed = JSON.parse(adminTasks);
  console.log(`Admin Tasks Count: ${adminTasksParsed.length}`);
  console.log(`Admin Tasks Completed: ${adminTasksParsed.filter(t => t.completed).length}`);
}

if (airdropTasks) {
  const airdropTasksParsed = JSON.parse(airdropTasks);
  console.log(`Airdrop Tasks Count: ${airdropTasksParsed.length}`);
  console.log(`Airdrop Tasks Completed: ${airdropTasksParsed.filter(t => t.completed).length}`);
}

console.log('=== END DEBUG INFO ===');
