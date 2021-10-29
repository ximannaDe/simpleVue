/**
 * 返回Vnode
 * @param {string} sel 选择器
 * @param {Object} data 选择器属性，比如class, href 等
 * @param {Array} children 子节点
 * @param {string} text 文本
 * @param {Element} elm 对应dom节点
 * @return {Vnode} 返回虚拟dom
 */
export default function (sel, data, children, text, elm) {
  const key = data && data.key;
  return {
    sel,
    data,
    children,
    text,
    elm,
    key
  }
}