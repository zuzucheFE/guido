import '../css/style.css';

import UMD from 'umd';

export default function importUMD() {
    console.log('importUMD call');
    UMD();
}
window.importUMD = importUMD;
console.log('importUMD mode');
