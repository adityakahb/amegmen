const fs = require('fs');

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let l0count = 6;
let l1cols = 4;
let l1count = 6;
let l2count = 6;
let l3count = 6;
let str = `<div data-amegmen data-amegmen-auto="{
  'device': 'small',
  'breakpoints': [
      {
        'minWidth': 700,
        'layout': 'medium'
      },
      {
        'actOnHover': true,
        'minWidth': 1100,
        'layout': 'large'
      }
  ]
}">
  <button type="button" data-amegmen-toggle aria-label="Toggle Nav">
    <span>Open</span>
  </button>
  <div data-amegmen-main>
    <div data-amegmen-mask>
    </div>
    <nav data-amegmen-nav>
      <div>
        <ul data-amegmen-ul0>`;

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
str += `</ul></nav></div></div>`;
fs.writeFile('./src/partials/_nav.html', str, () => {});
