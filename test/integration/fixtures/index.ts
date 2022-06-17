import './index.css';

async function run() {
  console.log(await import('./async'));
  console.log(await import('./second'));
}

run();
