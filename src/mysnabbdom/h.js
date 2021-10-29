import vNode from './vnode';
import Watcher from '../observer/watcher';
import {parsePath} from "../observer/utils";

// 编写一个低配版的h函数，这个函数必须接受3个参数，缺一不可
// 相当于它的重置功能较弱
// 也就是说，调用的时候形态必须是下面的三种之一
/*
  形态①：h('div', {}, '文字')
  形态②：h('div', {}, [
    h('p', {}, 'A'),
    h('p', {}, 'B')
  ])
  形态③：h('div', {}, h())
*/
export default function (sel, data, c) {
  //添加watch依赖
  if(data.watch){
    console.log("data.watch=======",data.watch);
    new Watcher(data.watch,c);
    const getter=parsePath(c);
    c=getter(data.watch);
  }
  if (arguments.length !== 3) {
    throw new Error('参数必须为3个');
  }
  if (typeof c === 'string' || typeof c === 'number') {
    // 形态1
    return vNode(sel, data, undefined, c, undefined);
  }
  else if (Array.isArray(c)) {
    // 形态2
    const children = [];
    for (let i = 0; i < c.length; i++) {
      const item = c[i];
      // 正常情况下，每一项都为Vnode, 且有sel属性
      if (typeof item === 'object' && item.hasOwnProperty('sel')) {
        children.push(item);
      }
      else {
        throw new Error('参数有误');
      }
    }
    return vNode(sel, data, children, undefined, undefined);
  }
  else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 形态3
    const children = [c];
    return vNode(sel, data, children, undefined, undefined);
  }
  else {
    throw new Error('参数有误');
  }
}