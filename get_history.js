const { execSync } = require('child_process');
const log = execSync('git log --date=short --pretty=format:"%ad | %s"').toString();
console.log(log);
