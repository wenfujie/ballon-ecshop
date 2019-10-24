/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 复制指令
 * @Date: 2019-04-12 13:29:43
 * @LastEditTime: 2019-04-12 15:13:18
 */
// import ClipboardJS from "clipboard";
// import { Toast } from "vant";
// export default {
//     inserted: (el, binding, vnode) => {
//         console.log('!!!!!!!!!!!!!!!!!!!')
//         var clipboard = new ClipboardJS(el);
//         clipboard.on("success", e => {
//             Toast("复制成功");
//             e.clearSelection();
//         });
//
//         clipboard.on("error", function() {
//             Toast("复制失败,请重试");
//         });
//     }
// };

import ClipboardJS from "clipboard";
import { Toast } from "vant";
export default {
	inserted: (el, binding, vnode) => {
		var clipboard = new ClipboardJS(el, {
			text: function() {
				return binding.value;
			}
		});
		clipboard.on("success", e => {
			Toast("复制成功");
		});

		clipboard.on("error", function() {
			Toast("复制失败,请重试");
		});
	}
};
