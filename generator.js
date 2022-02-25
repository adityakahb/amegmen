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
        <ul data-amegmen-level="0">`;

for (let i = 0; i < l0count; i++) {
  str += `<li><a href="#">L0-${i}</a>`;
  str += `<div data-amegmen-subnav="0"><div data-amegmen-grid><div data-amegmen-row>`;
  str += `<div data-amegmen-col data-amegmen-landing><a href="#">Landing - ${i}</a></div>`;
  for (let j = 0; j < l1cols; j++) {
    str += `<div data-amegmen-col><ul data-amegmen-level="1">`;
    for (let k = 0; k < l1count; k++) {
      if (k === l1count - 2) {
        str += `<li><button type="button">L1-${i}.${j}.${k}</button>`;
      } else {
        str += `<li><a href="#">L1-${i}.${j}.${k}</a>`;
      }

      if (k == 2) {
        str += `<div></div>`;
      }
      str += '</li>';
    }
    str += `</ul></div>`;
  }
  str += `</div></div></div></li>`;
}
str += `</ul></nav></div></div>`;
fs.writeFile('./src/partials/_nav.html', str, () => {});
