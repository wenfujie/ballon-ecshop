// export default function (func, time = 1000) {
//     var previous = 0;
//     return function (...params) {
//         var now = Date.now();
//         if (now - previous > time) {
//             func.apply(this, params);
//             previous = now;
//         }
//     };
// }

// export default (func, time = 1000) => {
//     let timer = null;
//     return function (...params) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             func.apply(this, params);
//         }, time);
//     };
// }

export default function debounce(fn, delay = 1000, immediate = true) {
    var timeout,
        args,
        context,
        timestamp,
        result;
    var later = function () {
        var last = Date.now() - timestamp;

        if (last < delay && last >= 0) {
            timeout = setTimeout(later, delay - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = fn.apply(context, args);

                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = setTimeout(later, delay);
        }
        if (callNow) {
            result = fn.apply(context, args);
            context = args = null;
        }
        return result
    }
};
