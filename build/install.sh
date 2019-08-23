echo "Running Dependency Installation"
mkdir -p lib
cd "lib"
rm -rf "Library.Ecommerce.Framework"
git clone https://github.com/PseudonymLtd/Library.Ecommerce.Framework.git
cd "Library.Ecommerce.Framework"
npm run clean
npm install
cd "../../"
npm link lib/Library.Ecommerce.Framework