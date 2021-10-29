// import h from './mysnabbdom/h.js';
// import patch from './mysnabbdom/patch.js';
// import Watcher from './observer/watcher.js';
// import Observer from './observer/index.js';

import Vue from './vue.js';

const container = document.getElementById('container');
// const container2 = document.getElementById('container2');
// const container3 = document.getElementById('container3');

// let myVnode1 = h('div', {key: 'S'}, [
//   h('h1', {key: 'h1'}, 'hello'),
//   h('p', {key: 'p1'}, '微风不燥，阳光正好'),
//   h('p', {key: 'p2'}, '去见你想见的人吧')
// ]);

// let myVnode2 = h('div', {key: 'S'}, [
//   h('h1', {key: 'h1'}, 'hi~'),
//   h('p', {key: 'p1'}, '微风不燥，阳光正好'),
//   h('p', {key: 'p2'}, '去见你想见的人吧')
// ]);

// patch(container, myVnode1);
// const btn = document.getElementById('btn');
// btn.addEventListener('click', function() {
//   patch(myVnode1, myVnode2);
// });

// let myVnode3 = h('div', {key: 'S2'}, [
//   h('p', {key: 'a'}, 'a'),
//   h('p', {key: 'b'}, 'b'),
//   h('p', {key: 'c'}, 'c'),
// ]);

// let myVnode4 = h('div', {key: 'S2'}, [
//   h('p', {key: 'd'}, 'd'),
//   h('p', {key: 'c'}, 'c'),
//   h('p', {key: 'b'}, 'b'),
//   h('p', {key: 'e'}, 'e')
// ]);

// patch(container2, myVnode3);
// const btn2 = document.getElementById('btn2');
// btn2.addEventListener('click', function() {
//   patch(myVnode3, myVnode4);
// });

// let myVnode5 = h('div', {key: 'S2'}, [
//   h('p', {key: 'a'}, 'a'),
//   h('p', {key: 'b'}, 'b'),
//   h('ul', {key: 'ul'}, [
//     h('li', {key: 'li1'}, '1'),
//     h('li', {key: 'li2'}, '2')
//   ]),
//   h('p', {key: 'c'}, 'c')
// ]);

// let myVnode6 = h('div', {key: 'S2'}, [
//   h('p', {key: 'd'}, 'd'),
//   h('p', {key: 'a'}, 'a'),
//   h('p', {key: 'b'}, 'b'),
//   h('ul', {key: 'ul'}, [
//     h('li', {key: 'li1'}, '3'),
//     h('li', {key: 'li2'}, '1'),
//     h('li', {key: 'li4'}, [
//       h('ul', {key: 'ul2'}, [
//         h('li', {key: 'li1'}, '哈哈'),
//         h('li', {key: 'li2'}, '嘿嘿')
//       ])
//     ]),
//   ]),
//   h('p', {key: 'c'}, 'c'),
//   h('p', {key: 'e'}, 'e')
// ]);

// patch(container3, myVnode5);
// const btn3 = document.getElementById('btn3');
// btn3.addEventListener('click', function() {
//   patch(myVnode5, myVnode6);
// });
const vue= new Vue({
  el:container,
  data:{
    a:"1",
    b:"2",
    c:"3",
    d:{
      A:"A",
      B:"B"
    },
    e:["e1","e2"]
  }
});
// console.log("vue=====1111=======",vue);
// new Watcher(data,"data.a");
// new Watcher(data,"data.b");
// new Observer(data);
// let myVnode1 = h('section', {key:'S'}, [
//   h('p', {key: 'A',isWatch:true}, vue.data.a),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'C'}, 'C'),
// ]);

// let myVnode2 = h('section', {key: 'S'}, [
//   h('p', {key: 'C'}, 'C'),
//   h('p', {key: 'F'}, 'F'),
//   h('p', {key: 'H'}, 'H'),
//   h('p', {key: 'B'}, 'B'),
//   h('p', {key: 'D'}, 'D'),
//   h('p', {key: 'E'}, 'E'),
//   h('p', {key: 'A'}, 'A')
// ]);

// patch(container, myVnode1);

// const btn = document.getElementById('btn');
// btn.addEventListener('click', function() {
//   vue.data.a="123"
//   // patch(myVnode1, myVnode2);
//   // let a=data.a;
//   // data.d.A="4";
//   // data.e[0]=0;
//   // data.e[2]=9;
//   // console.log("a=====",vuedata.a);
// })
