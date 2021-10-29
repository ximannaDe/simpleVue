

# 探究· 虚拟(Virtual) Dom Diff



## 什么是虚拟(Virtual) Dom

虚拟dom其实就是JavaScript对象将真实Dom抽象，对象属性描述节点信息，这个JavaScript对象描述了Dom树的结构，当然并不是真实的Dom树，所以称为虚拟Dom。

举个🌰

真实Dom

```html
<div class="container">
  <h1>hello</h1>
  <p>
    阳光正好，微风不燥
  </p>
  <p>
  	去见你想见的人吧
  </p>
</div>
```

虚拟Dom

```javascript
Vnode = {
  sel: "div", // 选择器
  props: {class: "container"},
  children: [
    {
      sel: "h1",
      props: {},
      children: "hello"
    },
    {
      sel: "p",
      props: {},
      children: "阳光正好，微风不燥"
    },
    {
      sel: "p",
      props: {},
      children: "去见你想见的人吧"
    }
  ]
}
```



## 虚拟(Virtual) Dom Diff

当虚拟dom中的某个或某些节点改变，会产生新的虚拟dom, 新、旧两个虚拟dom树中差异化的最优解映射到真实dom，即为虚拟 Dom Diff.

newVnode

```javascript
newVnode = {
  sel: "div",
  props: {class: "container"},
  children: [
    {
      sel: "h1",
      props: {},
      children: "hi"
    },
    {
      sel: "p",
      props: {},
      children: "阳光正好，微风不燥"
    },
    {
      sel: "p",
      props: {},
      children: "去见你想见的人吧"
    }
  ]
}
```

如图解：

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucpvpz7sj313e0u0di1.jpg" alt="image-20211027214535063" style="zoom:50%;" />

## 如何使用虚拟dom及学习其diff原理

这里借助现有的虚拟dom库来使用、了解、及学习。

这次选择的是vue2.x使用的虚拟dom库——[snabbdom.js](https://github.com/snabbdom/snabbdom)

**核心代码**

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucqu9j6vj30f4052mx6.jpg" alt="image-20211027220246134" style="zoom:80%;" />





### Diff  算法原理  

新旧虚拟dom只会在同层级之间进行比较，不会跨层级进行比较。

![截屏2021-08-08 上午11.32.47.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ca3d338e5a445ab80e40042c50ac79a~tplv-k3u1fbpfcp-watermark.awebp)

### Diff 对比流程

当数据改变，产生新的虚拟dom(newVnode),此时调用`pathch`方法，将新旧虚拟dom进行diff, 将结果映射到真实dom上，进而更新视图。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucrtf9yyj312l0u0gnq.jpg" alt="image-20211027224354551" style="zoom:50%;" />



### 具体分析

这是学习snabbdom.js源码后，自己实现简化版的虚拟dom, [链接](https://gitee.com/lsq128/study_snabbdom)，感兴趣的可以了解一下.

#### patch

patch是diff的入口，主要作用就是判断新旧虚拟dom是否为同一节点

```javascript
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
    console.log('patch-新旧节点为同一节点，进行pathVnode,进一步比较');
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
```

#### patchVnode

patchVnode主要作用是判断新旧虚拟dom子集的情况.根据不同的情况

```javascript
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
```



#### updateChildren

`updateChildren`是`patchVnode`中最复杂，最重要的一个环节，新旧虚拟dom子节点的比较就发生在这里。

**对比方式：**

新旧虚拟dom，每组 `首尾` 两个指针(start, end)，按照5中不同的情况依次比较，通过指针的移动，节点的比较，进而更新视图.

🌰

模版

```html
<- oldVnode ->
  <ul>
    <li>a</li>
    <li>b</li>
    <li>c</li>
  </ul>
<- newVnode ->
  <ul>
    <li>d</li>
    <li>c</li>
    <li>b</li>
    <li>e</li>
  </ul>
```

`首尾双指针`在虚拟dom的体现

<img src="http://tva1.sinaimg.cn/large/008i3skNly1gvucs9nzdlj325o0skmze.jpg" style="zoom:50%;" />



****

算法覆盖情况如下：

1.oldStart 和 newStart，如果sameVnode为`true`,进一步`patchVnode`,移动指针

2.oldEnd 和 newEnd，如果sameVnode为`true`,进一步`patchVnode`,移动指针

3.oldStart 和 newEnd，如果sameVnode为`true`,进一步`patchVnode`,移动指针

4.oldEnd 和 newStart，如果sameVnode为`true`,进一步`patchVnode`,移动指针

5.以上4种若都不匹配，则把所有剩余旧子节点按照key做了一个Map表，然后用新vnode的key去查找是否有可复用的位置.

6.如果新旧虚拟dom某一组先移动完成(start > end), 则需要安情况插入或删除指定节点



按照上述示例，图解

1.符合第5种情况,此时要将新Vnode中的startVnode，插入旧Vnode中startVnode的前面。注意：此操作是真实dom更新

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvuctauisbj30x80cwdgh.jpg" style="zoom:50%;" />



此时真实dom和指针移动情况

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvuctnql0cj314m0f8q3u.jpg" style="zoom:50%;" />

2.符合条件4，此时要操作真实dom,将oldEndVnode对应的节点插在oldStartVnode对应的节点前。

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucu2d4iqj30t60bg3z3.jpg" style="zoom:50%;" />



此时真实Dom和指针移动情况

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucufiti0j314c0fkgmj.jpg" style="zoom:50%;" />



3.同步骤2，依旧符合条件4.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucv32ujlj30uq0bsmxs.jpg" style="zoom:50%;" />

此时真实Dom情况和指针移动情况如下

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucwj9d6wj313u0ee0th.jpg" style="zoom:50%;" />

4.此时情况同上述步骤1，符合条件5.

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucwyl11aj30rw0auwey.jpg" style="zoom:50%;" />



此时真实Dom情况和指针移动情况

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucxbvd8vj316u0emmy3.jpg" style="zoom:50%;" />



5.此时newStart > newEnd, 表示newVnode遍历完成，oldVnode 剩余节点需要移除.

最终效果:

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gvucxnsvuij30sg04wwei.jpg" style="zoom:50%;" />





updateChildren源码如下

```javascript
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
```



### 参考链接

1. [snabbdom源码下载](https://github.com/snabbdom/snabbdom)
2. https://juejin.cn/post/6844903607913938951#heading-3
3. https://juejin.cn/post/6994959998283907102
