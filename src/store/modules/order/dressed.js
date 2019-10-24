export default {
    namespaced: true,
    state: {
        activeStatus: '-1',
        amountId:'',
        storeInfor:'1',
        reserveId:'',
        objInfor:{}
    },
    getters: {

    },
    mutations: {
        SET_RERVE_ID: (state, reserveId) => {
        
            state.reserveId = reserveId;
        },
        SET_STATUS: (state, activeStatus) => {
            state.activeStatus = activeStatus;
        },
        
        SET_STORE_INFOR:(state,storeInfor)=>{
            state.storeInfor=storeInfor
        },
        SET_AMOUNT_ID: (state, amountId) => {
        
            state.amountId = amountId;
        },
        SET_BOOKING_INFOR: (state, objInfor) => {
        
            state.objInfor = objInfor;
        },

    },
    actions: {
        setBookingInfor({
            commit
        }, objInfor) {
            commit('SET_BOOKING_INFOR', objInfor);
        },
        SetStoreInfor({
            commit
        }, storeInfor) {
            commit('SET_STORE_INFOR', storeInfor);
        },
        SetAmountId({
            commit
        }, amountId) {
            commit('SET_AMOUNT_ID', amountId);
        },
        SetStatus({
            commit
        }, activeStatus) {
            commit('SET_STATUS', activeStatus);
        },
        SetRerveId({
            commit
        }, reserveId ) {
            commit('SET_RERVE_ID', reserveId);
        },


    }

};
