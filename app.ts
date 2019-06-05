import cultivation from './stages/cultivation';
import growing from './stages/growing';

let garden = cultivation();

garden = growing(garden);

console.log(garden)
