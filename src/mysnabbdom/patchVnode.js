import createElement from './createElement.js';
import updateChildren from './updateChildren';

// 判断Vnode 的children是否为空
const checkChildrenEmpty = (Vnode) => {
  return !Array.isArray(Vnode.children) || Vnode.children.length === 0;
}
export default function patchVnode(oldVnode, newVnode) {
  /**
   * 判断newVnode是text or children
   *  newVnode是text节点，需要将oldDom中子元素清空，添加文本内容为newVnode.text
   *  newVnode是含children节点，则需要进一步判断oldVnode是否还有children子节点？
   *    oldVnode不含children,则将文本内容清空，将newVnode中children转为真实Dom插入到oldDom中
   *    oldVnode也是含有children内容，则需要进一步精细化对比，最优雅diff
   */
  if (newVnode.text) {
    if (!checkChildrenEmpty(oldVnode)) {
      oldVnode.elm.innerHtml = "";
      oldVnode.elm.innerText = newVnode.text;
    }
    else if (newVnode.text !== oldVnode.text) {
      oldVnode.elm.innerText = newVnode.text;
    }
  }
  else {
    if (checkChildrenEmpty(oldVnode)) {
      for (let i = 0; i < newVnode.children.length; i++) {
        const ch = createElement(newVnode.children[i]);
        oldVnode.elm.appendChild(ch);
      }
    }
    else {
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
    }
  }
}