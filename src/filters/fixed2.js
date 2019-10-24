import Vue from "vue"
import check from "@/util/check"


Vue.filter("fixed2", (val) => {
    if (check.isEmpty(val)) return 0;
    val = Number(val)
    return val.toFixed(2)
});
let getFilter = Vue.filter('fixed2');