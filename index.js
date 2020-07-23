const {spawn} = require('child_process');

spawn('npm run start', {
    stdio: 'inherit',
    shell: true
});
