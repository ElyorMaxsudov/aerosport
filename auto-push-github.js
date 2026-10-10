const { spawn, execSync } = require('child_process');

console.log('🚀 GitHub avtorizatsiya boshlanmoqda...');

const gh = spawn('C:\\Users\\USER\\gh\\bin\\gh.exe', [
  'auth',
  'login',
  '--web',
  '-h',
  'github.com',
  '-p',
  'https'
], { stdio: ['pipe', 'pipe', 'pipe'] });

let codeFound = false;

gh.stderr.on('data', (data) => {
  const str = data.toString();
  console.log(str);

  const match = str.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);
  if (match && !codeFound) {
    codeFound = true;
    const code = match[1];
    console.log('\n======================================================');
    console.log('🔑 BIR MARTALIK KODINGIZ: ' + code);
    console.log('🌐 Brauzerda ochilmoqda: https://github.com/login/device');
    console.log('======================================================\n');

    // Open browser directly
    try {
      execSync('cmd.exe /c start https://github.com/login/device');
    } catch (e) {}
  }
});

gh.stdout.on('data', (data) => {
  console.log(data.toString());
});

gh.on('close', (exitCode) => {
  console.log(`gh auth login tugadi, exit code: ${exitCode}`);
  if (exitCode === 0) {
    console.log('✅ Avtorizatsiya muvaffaqiyatli! Git sozlanmoqda va push qilinmoqda...');
    try {
      execSync('C:\\Users\\USER\\gh\\bin\\gh.exe auth setup-git');
      const pushOut = execSync('C:\\Users\\USER\\mingit\\cmd\\git.exe push -u origin main').toString();
      console.log('📦 PUSH NATIJASI:\n', pushOut);
      console.log('🎉 TABRIKLAYMIZ! Loyiha https://github.com/ElyorMaxsudov/aerosport ga to\'liq yuklandi!');
    } catch (err) {
      console.error('❌ Push xatosi:', err.message);
      if (err.stdout) console.log(err.stdout.toString());
      if (err.stderr) console.error(err.stderr.toString());
    }
  } else {
    console.log('⚠️ Avtorizatsiya yakunlanmadi.');
  }
});
