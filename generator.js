const fs = require('fs');

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let l0count = 6;
let l1cols = 4;
let l1count = 6;
let l2count = 6;
let l3count = 6;
let str = '<nav data-amegmen><div><ul data-amegmen-ul0>';

for (let i = 0; i < l0count; i++) {
  str += `<li><a href="#">L0-${i}</a>`;
  str += `<div data-amegmen-subnavwrap><div><div>`;
  for (let j = 0; j < l1cols; j++) {
    str += `<div><ul>`;
    for (let k = 0; k < l1count; k++) {
      str += `<li><a href="#">L1-${i}.${j}.${k}</a>`;
      str += '</li>';
    }
    str += `</ul></div>`;
  }
  str += `</div></div></div></li>`;
}
str += '</ul></div></nav>';
fs.writeFile('./src/partials/_nav.html', str, () => {});
