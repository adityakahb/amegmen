var loadIO = function () {};
// var AMegMen = AMegMen || {};
if (AMegMen) {
  console.log("=======AMegMen", AMegMen);
  var thisMenu = AMegMen.init(".class-amegmen", {
    breakpoints: [
      {
        minWidth: 750,
        layout: "sm",
      },
      {
        minWidth: 1150,
        layout: "md",
      },
      {
        minWidth: 1660,
        layout: "lg",
      },
    ],
  });

  for (var i = 0; i < thisMenu.length; i++) {
    thisMenu[i].destroy();
  }
}
// console.log('===================', AMegMen);
// document.addEventListener('DOMContentLoaded', function () {
//   loadIO();
//   window.addEventListener('scroll', function () {
//     // if (window.scrollY > document.getElementById('top_intro').clientHeight) {
//     //   document.getElementById('btnGoToTop').removeAttribute('hidden');
//     // } else {
//     //   document.getElementById('btnGoToTop').setAttribute('hidden', 'true');
//     // }
//   });
// });
