<template>
    <div class="contr">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="我的日历" name="1">
                <div :class="{iterm:myCon}" @click="myChange(1)" style="cursor:pointer">会议</div>
                <div :class="{iterm:myRou}" @click="myChange(2)"  style="cursor:pointer">行程</div>
                <div :class="{iterm:mySch}" @click="myChange(3)"  style="cursor:pointer">课表</div>
            </el-collapse-item>
            <el-collapse-item title="公共日历" name="2">
                <div :class="{iterm:my4}" style="cursor:pointer" @click="myChange(4)">会议</div>
                <div :class="{iterm:my5}" style="cursor:pointer" @click="myChange(5)">行程</div>
                <div :class="{iterm:my6}" style="cursor:pointer" @click="myChange(6)">课表</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        activeNames: ['1'],
      };
    },
    methods: {
      handleChange(val) {
        console.log(val)
      },
      myChange(value){
        console.log(value)
        this.$store.commit('typeChange',value)
      }
    },
    computed:{
      myCon: function(){
        if(this.$store.state.type==1){
          return true
        }else{
          return false
        }
      },
      myRou: function(){
        if(this.$store.state.type==2){
          return true
        }else{
          return false
        }
      },
      mySch: function(){
        if(this.$store.state.type==3){
          return true
        }else{
          return false
        }
      },
      my4: function(){
        if(this.$store.state.type==4){
          return true
        }else{
          return false
        }
      },
      my5: function(){
        if(this.$store.state.type==5){
          return true
        }else{
          return false
        }
      },
      my6: function(){
        if(this.$store.state.type==6){
          return true
        }else{
          return false
        }
      }
    }
  }
</script>
<style scoped>
    .contr{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding-left: 10%;
    }
    .el-collapse-item div{
        padding: 5px 30%;
    }
    .iterm{
      background-color: #f1f3f4;
      width: 85%;
      border-radius: 4px;
    }
    .el-collapse-item /deep/ .el-collapse-item__header{
      height: 45px;
    }
    .el-collapse-item /deep/ .el-collapse-item__content {
      padding-bottom: 10px;
    }
</style>
