import {parsePath} from "./utils";
import {pushTarget,popTarget} from "./dep";
export default class Watcher{
    constructor(vm,expor,cb){
        this.vm=vm;
        this.expor=expor;
        // this.exporFn=exporFn;
        this.getter=parsePath(expor)
        this.value=this.get();
    }
    // getter(){
    //     console.log("exporFn=====",this.exporFn1);
    //     return parsePath(this.exporFn1)
    // }
    get(){
        console.log("============");
        pushTarget(this);
        console.log("==pushTarget==========");
        let value=this.getter(this.vm);
        popTarget();
        console.log("==popTarget==========",value);
        return value;
    }
    update(){
        console.log("watcher====update======",this);
    }
}
