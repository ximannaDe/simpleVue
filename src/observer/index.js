
/**
 * 将数据变为可观测的数据
 * 类
 */
import Dep from "./dep";
import {def} from "./utils";
import {arrayMethods} from "./array";
const arrayKeys = Object.keys(arrayMethods)
 export default class Observer{
    constructor(value){
        //数组型数据
        if(Array.isArray(value)){
            copyAugment(value, arrayMethods, arrayKeys)
        }
        for(let key in value){
            defineReactive(value,key,value[key]);
        }
    }
}
/**
 * 将一个对象转化为可观测对象
 * @param {*} obj 对象
 * @param {*} key key
 * @param {*} val 值
 */
function defineReactive(obj,key,val){
    const dep = new Dep();
    //若为对象或数组，递归
    if(typeof val === 'object'||Array.isArray(val)){
        new Observer(val)
    }
    Object.defineProperty(obj,key,{
        enumerable:true,//可枚举性 （for，Object.keys()）
        configurable:true,//能否使用delete、能否改变属性特性
        get(){
            console.log("value===get===",key,val);
            if(Dep.target){
                dep.depend();
            }
            return val;
        },
        set(newVal){
            console.log("val======set==",val,newVal);
            val=newVal;
            dep.notify();
        }
    })
}

/**
 * 
 * @param {*} target 数组值
 * @param {*} src 数组方法对象
 * @param {*} keys 数组方法名组成的数组
 */
function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]
      def(target, key, src[key])
    }
  }
