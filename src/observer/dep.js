/**
 * 收集
 */
export default class Dep{
    constructor(){
        this.subs=[];
    }
    addSub(sub){
        this.subs.push(sub);
    }
    depend(){
        if(Dep.target){
            this.addSub(Dep.target);
        }
    }
    notify () {
      const subs = this.subs.slice()
      console.log("subs====",subs);
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
}
Dep.target=null;
export function pushTarget(target){
    Dep.target=target;
};
export function popTarget(){
    Dep.target=null;
}