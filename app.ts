import cultivation from './stages/cultivation';
import growing from './stages/growing';

let samples = cultivation();

samples = growing(samples);

console.log(samples)
