import createElement from './createElement';
import patchVnode from './patchVnode';

// 判断是否是同一个虚拟节点
function checkSameVnode(a, b) {
  return a.sel === b.sel && a.key === b.key
}

// 生成 key 与 index 索引对应的一个 map 表
function createKeyToOldIdx( children, beginIdx, endIdx) {    
  var i, key;    
  var map = {};    
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;        
      if (key) {
        map[key] = i;
      }
  }    
  return map
}

/**
 * 
 * @param {Element} parentElm 父节点
 * @param {Array} oldCh 旧Vnode节点中的children
 * @param {Array} newCh 新vnode中的children
 */
export default function updateChildren(parentElm, oldCh, newCh) {
  /**
   * 5种比较情况:
   * 1.oldStrat 和 newStrat 比较
   * 2.oldEnd 和 newEnd 比较
   * 3.oldStart 和 newEnd 比较
   * 4.oldEnd 和 newStart 比较
   * 5. 如果以上逻辑都匹配不到，再把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，
   *    然后用新 vnode 的 key 去找出在旧节点中可以复用的位置
   */

  // 每个集合两个指针(首尾)
  let oldStartIdx = 0,
    oldEndIdx = oldCh.length - 1,
    newStartIdx = 0,
    newEndIdx = newCh.length - 1;
  let oldStartVnode = oldCh[0], 
    oldEndVnode = oldCh[oldEndIdx],
    newStartVnode = newCh[0],
    newEndVnode = newCh[newEndIdx];

  let oldKeyToIdx // 旧Vnode中key Map表
  let idxInOld // 旧Vnode中是否存在新Vnode的指定Vnode
  let elmToMove // keyMap表中存在新vnode.key对应的vnode, 则需要移动
  // 开始遍历
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 首先不是判断命中，而是要过滤已经加undefined标记的东西
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    }
    else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
      oldEndVnode = oldCh[--oldEndIdx]
    }
    else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
      newStartVnode = newCh[++newStartIdx]
    }
    else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
      newEndVnode = newCh[--newEndIdx]
    } 
    else if (checkSameVnode(oldStartVnode, newStartVnode)) {
      // 旧前-新前
      patchVnode(oldStartVnode, newStartVnode);
      // 指针移动
      // 对应位置Vnode 移动
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    else if (checkSameVnode(oldEndVnode, newEndVnode)) {
      // 旧后-新后
      patchVnode(oldEndVnode, newEndVnode);
      // 指针移动
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    else if (checkSameVnode(oldStartVnode, newEndVnode)) {
      // 旧前-新后
      patchVnode(oldStartVnode, newEndVnode);
      // 将真实dom中，旧前dom移动到当前旧后dom后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
      // 指针移动
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    else if (checkSameVnode(oldEndVnode, newStartVnode)) {
      // 旧后-新前
      patchVnode(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    else {
      // 前4种未命中，则走此逻辑
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
      }
      // 判断旧-剩余节点中是否存在新前节点
      idxInOld = oldKeyToIdx[newStartVnode.key];
      if (!idxInOld) {
        // 如果不存在，则在旧-前节点前插入该节点
        const dom = createElement(newStartVnode);
        parentElm.insertBefore(dom, oldStartVnode.elm);
        // 新-前指针移动
        newStartVnode = newCh[++newStartIdx];
      }
      else {
        elmToMove = oldCh[idxInOld];
        // 如果选择器不一样，则直接插入
        if (elmToMove.sel !== newStartVnode.sel) {
          const dom = createElement(newStartVnode);
          parentElm.insertBefore(dom, oldStartVnode.elm);
        }
        else {
          // 如果选择器也一样，则进行patchVnode
          patchVnode(elmToMove, newStartVnode);
          oldCh[idxInOld] = null;
          parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
    // 此时表示oldVnode list已经遍历结束，newVnodeList 剩余Vnode 需要转换成真实Dom插入
    let base = oldEndVnode.elm;
    for (; newStartIdx <= newEndIdx; ++newStartIdx) {
      parentElm.insertBefore(createElement(newCh[newStartIdx]), base.nextSibling);
      base = base.nextSibling;
    }
  }
  else if (newStartIdx > newEndIdx) {
    // 此时表示newVnode list 已经遍历结束， oldVnodeList 剩余ndoe 需要移除
    for (;oldStartIdx <= oldEndIdx; ++oldStartIdx) {
      oldCh[oldStartIdx] && parentElm.removeChild(oldCh[oldStartIdx].elm);
    }
  }
}