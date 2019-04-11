<template>
    <div id='bottom'>
         <div id="head">
            <span class="brand1">{{brand1}}</span>
            <span class="brand2">{{brand2}}</span>
         </div>
        <el-container>
            <el-aside width='690px'>
                <edit-area ref="creEdit"></edit-area>
            </el-aside>
            <el-main>
                <invite ref="invite"></invite>
            </el-main>
        </el-container>
    </div>
</template>
<style scoped>
#bottom{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.el-aside{
    height: 420px;
}
#head{
    height: 60px;
    margin-left: 58px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-top: 35px;
}
.brand1{
    width: 49%;
    border-bottom-style: solid;
    border-bottom-color:#e0e0e0;
    border-bottom-width: 1px;
    color: #1a73e8;
}
.brand2{
    border-bottom-style: solid;
    border-bottom-color:#e0e0e0;
    border-bottom-width: 1px;
    margin-left: 5%;
    width: 43%;
    color: #1a73e8;
}
.el-main{
    margin-left: 25px
}
</style>
<script>
import editArea from './editArea.vue'
import invite from './invite.vue'

export default {
    name: 'bottom',
    data(){
        return{
            brand1:'',
            brand2:''
        } 
    },
    mounted(){
        this.intiData()
    },
    methods:{
        intiData(){
            console.log(this.$store.state.type)
            switch (this.$store.state.type){
                case 1:
                {
                    this.brand1='会议详情'
                    this.brand2='参会人员'
                    break
                }
                case 2:
                {
                    this.brand1='我的行程'
                    this.brand2='我的好友'
                    break
                }
                case 3:
                {
                    this.brand1='课程备注'
                    this.brand2='我的好友'
                    break
                }
            }
        }
    },
    components:{editArea,
                invite
    }
}
</script>


