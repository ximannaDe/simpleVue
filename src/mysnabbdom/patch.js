import vnode from './vnode.js';
import createElement from './createElement.js';
import patchVnode from './patchVnode.js';

export default function(oldVnode, newVnode) {
  // 判断oldVnode是dom节点还是vnode, 如果是dom节点，那么要包装为vnode
  if (!oldVnode.sel) {
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVnode
    );
  }
  // 判断oldVnode 和newVnode 是否为同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    console.log('patch-新旧节点为同一节点，进行pathVnode更新');
    patchVnode(oldVnode, newVnode);
  }
  else {
    console.log('patch-新旧节点不相同，则直接将新节点替换旧节点');

    /*
      此时先将Vnode转化为真实Dom
      再将newDom替换oldDom
    */
    const newDomNode = createElement(newVnode);
    if (newDomNode && oldVnode.elm) {
      // 插入新节点
      oldVnode.elm.parentNode.insertBefore(newDomNode, oldVnode.elm);
      // 删除旧节点
      oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
  }
}