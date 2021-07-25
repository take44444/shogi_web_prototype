/* eslint-disable @typescript-eslint/no-var-requires */
console.log('pre-build-script.js is running...');

const fs = require('fs');

console.log(`[Task: 1/1] Removing Files in './dist' directory...`);

const distPath = './dist';

fs.readdir(distPath, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    fs.unlink(`${distPath}/${file}`, err => {
      if (err) {
        throw err;
      }
    });
  });
});

console.log(
  `[Task: 1/1] All Files in './dist' directory was removed successfully...`,
);

console.log('[Complete!] All tasks in pre-build-script.js was done!');
