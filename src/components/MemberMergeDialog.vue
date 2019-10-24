/*
* createTime：2019/6/20
* author：fujie.wen
* description: 会员整合弹窗
*/
<template>
    <div>
        <van-dialog
                v-model="show"
                message-align="left"
                show-cancel-button
                cancelButtonText="不整合"
                confirmButtonText="去确认"
                @cancel="cancelDialog"
                @confirm="confirmDialog">
            <div class="cont">
                <p class="merge-describe">
                    经系统检测，以下账号同属于您，请您确认，确认后，系统会将您的部分信息整合在一起
                </p>
                <ul class="merge-list">
                    <!--| phoneMask-->
                    <li class="merge-item"
                        :key="index"
                        v-for="(item,index) in memberList">
                        {{item.mobilePhone | phoneMask}}（{{item.vipAccount}}）
                    </li>
                </ul>
            </div>
        </van-dialog>
    </div>
</template>

<script>
    import MemberMergeMixins from '@/pages/merge/mixins/MemberMergeMixins'
    import { UserService } from "@/api/service";
    import { Toast } from 'vant';
    import Storage from "@/util/storage";

    export default {
        mixins: [ MemberMergeMixins ],
        components:{
        },
        props:{

        },
        data() {
            return {
                show: false,// 控制弹窗显示
                memberList: [], //会员列表

            }
        },
        methods: {
            // 弹窗取消事件
            cancelDialog(){
                let data = {
                    //                    todo
                        vipInfoHdId: Storage.get('USER_INFO').vipInfoId,
//                    vipInfoHdId: 653 || Storage.get('USER_INFO').vipInfoId,
                    confirmFlag: 0,// 0 表示不整合
                    ids: this.memberList.map(item => item.id)
                }
                UserService.memberMergeOperator(data).then(async (res)=>{
                    if(res != 1){
                        Toast('操作失败');
                        return;
                    }
                    this.dialogVisibleState(false);
                }, err=>{
                    Toast(err.errorMsg);
                })
            },
            // 弹窗确认事件
            confirmDialog(){
                this.dialogVisibleState(false);
                this.$router.push('/member-merge?useParent=dialog');
            },
            // 控制弹窗显示状态
            dialogVisibleState(boolean=true){
                this.show = boolean;
            },
        },
        watch:{
            memberList: {
                deep:true,
                immediate: true,
                handler(list){
                    updateRelationAccountLength();
                    this.$emit('changeList',list);
                }
            }
        },
        async created() {
            // 传1 表示弹窗调用
            this.memberList = await this.m_getMemberList(1);
        },
    }
</script>

<style scoped lang="scss">
    .cont{
        padding: computed(55);
        .merge-describe{
            color: #666;
            font-size: computed(28);
            line-height: computed(40);
            text-align: left;
        }
    }
    .merge-list{
        font-size: computed(24);
        padding-top: computed(15);
        .merge-item{
            line-height: computed(46);
        }
    }
</style>
