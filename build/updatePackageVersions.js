const fs = require('fs');
const path = require('path');

const version = process.argv[2].trim();

if (version.trim() == '') {
    throw 'version cannot be blank';
}

const WriteVersionToPackage = (packageJsonPath) => {
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    
    if (packageJson.version.trim() == version) {
        throw 'versions cannot be the same!';
    }

    packageJson.version = version;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
}

WriteVersionToPackage(path.join(__dirname, '/../package.json'));
WriteVersionToPackage(path.join(__dirname, '/../package-lock.json'));

console.info(`Updated package files versions to ${version}`);