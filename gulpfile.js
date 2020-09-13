const less = require('gulp-less');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

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
  for (let i=0; i<length; i++) {
    genarr.push(mainArr[Math.floor(Math.random() * mainArr.length)]);
  }
  return genCap(genarr.join(' '));
}

const genPageMenu = (len, count) => {
  let navlength = len;
  let mainnavstr = '<nav class="__c--amegmen" id="_c_amegmen' + count + '"><ul>'
  for(let i = 0; i < navlength; i++) {
    let link0Str = '<li><a href="#">'
    link0Str += genName(randomNum(1, 2)) + '</a>';

    // let hasSubnav = randomNum(1, 2);
    let hasSubnav = 1;

    if (hasSubnav === 1) {
      let subnav0str = '<section>'
      let landing0link = '<div class="__c--amegmen-landing"><a href="#">Landing page: ' + genName(randomNum(3, 6)) + '</a></div>';
      subnav0str += landing0link;
      // let hasSubnav1 = randomNum(1, 2);
      let hasSubnav1 = 1;
      let subnav1str = '';
      if (hasSubnav1 === 1) {
        let columns1 = randomNum(1, 4);
        subnav1str = '<nav class="__c--amegmen-subnav">';
        for (let j=0; j < columns1; j++) {
          subnav1str += '<div class="__c--amegmen-col"><div class="__c--amegmen-col-spacer">';
          
          let subnav1len = randomNum(5, 10);
          let subnavlinks1str = '<ul>';

          for (let k=0; k < subnav1len; k++) {
            subnavlinks1str += '<li><a href="#">' + genName(randomNum(3, 6)) + '</a>';

            // let hasSubnav2 = randomNum(1, 2);
            let hasSubnav2 = 1;
            if (hasSubnav2 === 1) {
              let subnav2str = '<section>';
              let landing2link = '<div class="__c--amegmen-landing"><a href="#">Landing page: ' + genName(randomNum(3, 6)) + '</a></div>';
              subnav2str += landing2link;

              let columns2 = 5 - columns1;
              subnav2str += '<nav class="__c--amegmen-subnav">';
              for (let l=0; l < columns2; l++) {
                subnav2str += '<div class="__c--amegmen-col"><div class="__c--amegmen-col-spacer"><ul>';
                let subnav2len = randomNum(5, 8);

                for (let m=0; m < subnav2len; m++) {
                  subnav2str += '<li><a href="#">' + genName(randomNum(3, 6)) + '</a></li>';
                }

                subnav2str += '</ul></div></div>';
              }
              subnav2str += '</nav></section>';
              subnavlinks1str += subnav2str;
            }

            subnavlinks1str += '</li>';
          }

          subnavlinks1str += '</ul>';
          subnav1str += subnavlinks1str + '</div></div>';
        }
        subnav1str += '</nav>';
      }

      subnav0str += subnav1str + '</section>'
      link0Str += subnav0str;
    }

    mainnavstr += link0Str + '</li>';
  }
  mainnavstr += '</ul></nav>';

  return mainnavstr;
};

gulp.task('less', async function () {
  gulp.src(['./clientlibs/less/**/*.less', '!./clientlibs/less/**/_*.less'])
  .pipe(sourcemaps.init())
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./clientlibs/styles'));
});

gulp.task('generatedata', async function () {
  let m1 = genPageMenu(8, 1);
  let m2 = genPageMenu(4, 2);
  
  fs.writeFile('./components/megamenu.html', m1, function (err) {
    if (err) throw err;
    console.log('AMegMen 1 Replaced!');
  });

  fs.writeFile('./components/megamenu2.html', m2, function (err) {
    if (err) throw err;
    console.log('AMegMen 2 Replaced!');
  });
});