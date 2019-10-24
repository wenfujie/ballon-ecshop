import ysf from "./ysf-sdk"
class ysfService {
    static wakeUp(uid, name, email, mobile) {
        ysf.on({
            'onload': function () {
                ysf.config({
                    uid: uid,
                    name: name,
                    email: email,
                    mobile: mobile,
                    success: function () {
                        location.href = ysf.url();
                    },
                    error: function () {
    
                    }
                });
            }
        });
    }
}
export default ysfService