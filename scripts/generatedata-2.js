const fs = require('fs');

const htmltop = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AMegMen</title>
  <link rel="stylesheet" href="./dist/styles/index.css">
</head>
<body>`;

const htmlbottom = `
    <script src="./dist/scripts/index.js"></script>
    <script>
      var mm_instance1 = AMegMen.Root.getInstance();
      mm_instance1.init('.__amegmen');
    </script>
  </body>
</html>`;

const mainStr =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
  'Maecenas quam nunc, egestas ac porta ac, posuere eu metus. ' +
  'Etiam sollicitudin augue eget mauris vehicula, et congue purus pulvinar. ' +
  'Nullam vulputate metus sit amet odio mattis ultricies non sit amet nulla. ' +
  'Nulla facilisi. Nullam facilisis congue sollicitudin. ' +
  'In pharetra vehicula venenatis. Morbi eget tempor nisl, ut facilisis erat. ' +
  'Vivamus scelerisque, velit in faucibus maximus, turpis ipsum pulvinar ex, ac ultrices nunc quam commodo lacus. ' +
  'Vestibulum sed lacus volutpat, molestie erat nec, finibus massa. ' +
  'Phasellus laoreet malesuada tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ' +
  'Vivamus at luctus turpis, id fermentum ex. Proin at felis sit amet risus sodales porttitor et ut elit. ' +
  'In elementum arcu ut turpis gravida, finibus pulvinar urna lobortis. ' +
  'Praesent congue, felis ut fringilla aliquam, ex risus consectetur sem, vitae ornare lorem nunc a nulla. ' +
  'Curabitur aliquam neque purus, eget malesuada tortor ultricies id. ' +
  'Phasellus pellentesque tempus nibh vel vestibulum. ' +
  'Suspendisse consectetur maximus mattis. In eget nibh neque. ';

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomColor = () => {
  return (Math.floor(Math.random() * 16777215).toString(16) + '000000').substr(0, 6);
};

const genCap = (str) => {
  let arr = (str || '').split(' ');
  let returnArr = [];
  for (let i = 0; i < arr.length; i++) {
    if ((i + 1) === 1) {
      returnArr.push(arr[i].charAt(0).toUpperCase() + arr[i].slice(1));
    } else if ((i + 1) === 2 || (i + 1) === 3) {
      returnArr.push(arr[i]);
    } else {
      let isprime = true;
      for (let x = 2; x < i; x++) {
        if (i % x === 0) {
          isprime = false;
          break;
        }
      }
      returnArr.push(isprime ? arr[i].charAt(0).toUpperCase() + arr[i].slice(1) : arr[i]);
    }
  }
  return returnArr.join(' ');
};

let mainArr = [];
mainArr = mainStr.replace(/^\s+|\s+$/g, '').toLowerCase().split('. ').join(' ').split(', ').join(' ').split(' ');

const genName = (length) => {
  let genarr = [];
  for (let i = 0; i < length; i++) {
    genarr.push(mainArr[Math.floor(Math.random() * mainArr.length)]);
  }
  return genCap(genarr.join(' '));
}

const genPageMenu = (len, count) => {
  let navlength = len;
  let mainnavstr = '<nav id="__amegmen_' + count + '">';
  
  mainnavstr += `<button class="__amegmen--toggle-cta">
    <span class="sr-only">Menu</span>
    <span class="material-icons">menu</span>
  </button>`;
  mainnavstr += `<div class="__amegmen--canvas">
  <header>
    <button class="__amegmen--close-cta">
      <span class="sr-only">Close</span>
      <span class="material-icons">close</span>
    </button>
    </header>
    <section class="__amegmen--main">
  <ul>`;
  for (let i = 0; i < navlength; i++) {
    let link0StrLink = genName(randomNum(1, 3));
    let link0Str = '<li><a href="#' + '' + '">'
    link0Str += link0StrLink + '<span class="icon"><i class="material-icons d-none d-md-inline-block">arrow_drop_down</i><i class="material-icons d-md-none">filter_none</i></span></a>';

    // let hasSubnav = randomNum(1, 2);
    let hasSubnav = 1;

    if (hasSubnav === 1) {
      let subnav0str = '<section class="__amegmen--panel">';
      let landing0StrLink = genName(randomNum(3, 6));
      let landing0link = `<div class="__amegmen--landing">
      <button class="__amegmen--main-cta">
        <span class="sr-only">Main</span>
        <span class="material-icons">menu_open</span>
      </button>
      <a href="#">Landing page: ` + landing0StrLink + `<span class="icon"><i class="material-icons">chevron_right</i></span></a></div>`;
      subnav0str += landing0link;
      // let hasSubnav1 = randomNum(1, 2);
      let hasSubnav1 = 1;
      let subnav1str = '';
      if (hasSubnav1 === 1) {
        let columns1 = randomNum(1, 4);
        subnav1str = '<nav>';
        for (let j = 0; j < columns1; j++) {
          subnav1str += '<div class="__amegmen--col">';

          let subnav1len = randomNum(5, 10);
          let subnavlinks1str = '<ul>';

          for (let k = 0; k < subnav1len; k++) {
            let link1StrLink = genName(randomNum(3, 6));
            subnavlinks1str += '<li><a href="#' + '' + '">' + link1StrLink + '<span class="icon"><i class="material-icons">filter_none</i></span></a>';

            // let hasSubnav2 = randomNum(1, 2);
            let hasSubnav2 = 1;
            if (hasSubnav2 === 1) {
              let subnav2str = '<section class="__amegmen--panel">';
              let landing2linkStr = genName(randomNum(3, 6));
              let landing2link = '<div class="__amegmen--landing"><button class="__amegmen--back-cta"><span class="sr-only">Back</span><span class="material-icons">arrow_back</span></button><a href="#'
                + '' + '">Landing page: '
                + landing2linkStr + '<span class="material-icons">chevron_right</span></a></div>';
              subnav2str += landing2link;

              let columns2 = 1;
              subnav2str += '<nav>';
              for (let l = 0; l < columns2; l++) {
                subnav2str += '<div class="__amegmen--col"><ul>';
                let subnav2len = randomNum(5, 15);

                for (let m = 0; m < subnav2len; m++) {
                  subnav2str += '<li><a href="#">' + genName(randomNum(3, 6)) + '<span class="icon"><i class="material-icons">chevron_right</i></span></a></li>';
                }

                subnav2str += '</ul></div>';
              }
              subnav2str += '</nav></section>';
              subnavlinks1str += subnav2str;
            }

            subnavlinks1str += '</li>';
          }

          subnavlinks1str += '</ul>';
          subnav1str += subnavlinks1str + '</div>';
        }
        // subnav1str += '<div class="__amegmen--col">blank column</div>';
        subnav1str += '</nav>';
      }

      subnav0str += subnav1str + '</section>'
      link0Str += subnav0str;
    }

    mainnavstr += link0Str + '</li>';
  }
  mainnavstr += '</ul></section></div></nav>';

  return mainnavstr;
};

const generateData = () => {
  let m5 = genPageMenu(4, 5);

  fs.writeFile('./templates/m5.html', m5, function (err) {
    if (err) throw err;
    console.log('Menu 5 Replaced!');
  });
};

generateData();