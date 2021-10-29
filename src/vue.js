
import patch from './mysnabbdom/patch';
import h from './mysnabbdom/h.js';
import Observer from "./observer";
export default class Vue {
    constructor(options) {
        this.data = options.data;
        this.el = options.el;
        new Observer(this.data);
        this.init();
    }
    init() {
        let myVnode1 = h('section', { key: 'S' }, [
            h('p', { key: 'A', watch:this }, "data.a"),
            h('p', { key: 'B' }, 'B'),
            h('p', { key: 'C' }, 'C'),
        ]);
        patch(this.el, myVnode1);
        const btn = document.getElementById('btn');
        btn.addEventListener('click', ()=> {
            this.data.a = "123"
            // patch(myVnode1, myVnode2);
            // let a=data.a;
            // data.d.A="4";
            // data.e[0]=0;
            // data.e[2]=9;
            // console.log("a=====",vuedata.a);
        })
    }
}