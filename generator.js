const fs = require('fs');

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let l0count = 6;
let l1cols = 4;
let l1count = 6;
let l2count = 6;
let l3count = 6;
let str = `<div data__amegmen data__amegmen-auto="{
  'breakpoints': [
      {
        'minWidth': 700,
        'layout': 'sm'
      },
      {
        'actOnHover': true,
        'minWidth': 1100,
        'layout': 'md'
      },
      {
        'minWidth': 1600,
        'layout': 'lg'
      }
  ]
}">
  <button type="button" data__amegmen-open aria-label="Open Nav">
    <span>Open</span>
  </button>
  <button type="button" data__amegmen-close aria-label="Close Nav">
    <span>Close</span>
  </button>
  <div data__amegmen-main>
    <div data__amegmen-mask>
    </div>
    <nav data__amegmen-nav>
        <ol data__amegmen-level="0">`;

for (let i = 0; i < l0count; i++) {
  str += `<li><a href="#">L0-${i}</a>`;
  str += `<div data__amegmen-subnav="0">`;
  str += `<div data__amegmen-landing><a href="#">Landing - ${i}</a></div>`;
  str += `<ol data__amegmen-grid>`;
  for (let j = 0; j < l1cols; j++) {
    str += `<li><ol data__amegmen-level="1">`;
    for (let k = 0; k <l1count; k++) {
      if (k === l1count - 2) {
        str += `<li><button type="button">L1-${i}.${j}.${k}</button>`;
      } else {
        str += `<li><a href="#">L1-${i}.${j}.${k}</a>`;
      }
     
      if (k === getRndInteger(0, l2count) || k === getRndInteger(0, l2count) || k === getRndInteger(0, l2count)) {
        str += `<div data__amegmen-subnav="1"><ol data__amegmen-level="2">`;
        for (let l = 0; l < getRndInteger(0, l3count) * 2; l++) {
          str += `<li><a href="#">L2-${i}.${j}.${k}.${l}</a>`;
          str += `</li>`;
        }
        str += `</ol></div>`;
      }

    }
    str += `</ol></li>`;
  }
  str += `</ol>`;
  str += `</div></li>`;
}
str += `</ol></nav></div></div>`;
fs.writeFile('./src/partials/_nav.html', str, () => {});
