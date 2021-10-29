/**
 *  将vnode创建为真实dom节点
 * @param {Vnode} vnode 虚拟节点
 * @return {Element} 返回真实dom节点
 */
export default function createElement(vnode) {

  const {sel, children = [], text} = vnode;

  // 通过sel创建真实dom节点，此时为孤儿节点
  const domNode = document.createElement(sel);

  if (text && children.length === 0) {
    // 如果内部是文字
    domNode.innerText = text;
  }
  else {
    // 如果内部有子节点，需要递归创建每一个节点
    for (let i = 0; i < children.length; i++) {
      const ch = createElement(children[i]);
      domNode.appendChild(ch);
    }
  }
  // 为vnode 补充elm
  vnode.elm = domNode;
  return domNode;
}