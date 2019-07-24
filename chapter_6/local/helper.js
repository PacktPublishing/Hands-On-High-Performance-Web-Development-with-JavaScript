import os from 'os';
import path from 'path';

const pipeName = 'temp';

// grabs the name of the pipe so all modules
// will know where to point themselves
export default function() {
    return os.platform() === 'win32' ?
        path.join('\\\\?\\pipe', process.cwd(), pipeName) :
        path.join(process.cwd(), pipeName);
}