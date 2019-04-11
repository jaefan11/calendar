<template>
    <div id="subcribe" ref="subcribe">
        <div id = "back">
            <span style="font-size:20px"><img style="width:30px;height:30px;margin-right:5px" src="/static/img/add user.svg" />添加关注</span>
            <span class="el-icon-close " v-bind:class = "{b_highlight: isBack}"
                  style="font-size: 25px;cursor:pointer;width:40px;height:40px;text-align: center;line-height: 40px"
                  @click="backClick"
                  @mouseover="backMouseOver"
                  @mouseout="backMouseOut"
            ></span>
        </div>
       <div style="text-align: center;height:100%">
            <el-transfer
            style="text-align: left; display: inline-block"
            v-model="value"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="[group1, '已关注']"
            :button-texts="['取消', '关注']"
            :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="data"
            :render-content="renderFunc">
            
            <el-dropdown slot="left-footer" size="small" split-button @command="handleLeftCommand">
             {{group1}}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="所有成员">所有成员</el-dropdown-item>
                <el-dropdown-item command="研一">研一</el-dropdown-item>
                <el-dropdown-item command="研二">研二</el-dropdown-item>
                <el-dropdown-item command="研三">研三</el-dropdown-item>
                <el-dropdown-item command="博士">博士</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button  class="transfer-footer" 
                        slot="right-footer" 
                        size="small" 
                        type="primary"
                        @click="creSubscribe"
             >保存</el-button>
            </el-transfer>
        </div>
    </div>
</template>
<script>
import bus from '../assets/eventBus.js'
export default {
     data() {
      return {
        // data:[],
        left:[],
        persons:[],
        group1: "所有成员",
        value: [],
        isBack: false,
        renderFunc(h, option) {
          return <div class="box"><img src={option.url} style="width:18px;height:auto; text-align: center;border-radius: 100%;margin-right:5px"/><span>  { option.label }</span></div>;
        }
      };
    },
    mounted(){
      this.personDataIni(this.$store.state.user.id)
    },
    methods: {
      initUpdate(event){
        if(event.persons){
          for(let person of event.persons){
            this.value.push(person.id)
          }
        }
      },
      personDataIni(id){
        this.axios.post('/creInitPerson',{id:id}).then((response)=>{
          let data=[]
          for(let i in response.data){
            let person={
              key: response.data[i].id,
              label: response.data[i].name,
              url: response.data[i].userface,
              type: response.data[i].type

            }
            data.push(person)
          }
          this.persons=data
          // this.data=response.data
          this.left=data
        })
        this.axios.post('/intiSubscribe',{id:id}).then((response)=>{
          console.log(response)
          this.value=response.data
        })
      },
      handleLeftCommand(command){
        this.group1=command
        switch (command){
            case '所有成员':
            {
              this.left=this.persons
              break;
            }
            case '研一':
            {
              this.left=[]
              for(let person of this.persons){
                // console.log(person)
                if(person.type==1){
                  this.left.push(person)
                }
              }
               break;
            }
            case '研二':
            {
              this.left=[]
              for(let person of this.persons){
                // console.log(person)
                if(person.type==2){
                  this.left.push(person)
                }
              }
               break;
            }
            case '研三':
            {
              this.left=[]
              for(let person of this.persons){
                // console.log(person)
                if(person.type==3){
                  this.left.push(person)
                }
              }
               break;
            }
            case '博士':
            {
              this.left=[]
              for(let person of this.persons){
                // console.log(person)
                if(person.type==4){
                  this.left.push(person)
                }
              }
               break;
            }
          }
        
      },
      handleRightCommand(command){
        this.group2=command
      },
      handleChange(value, direction, movedKeys) {
      },
      backMouseOver(){
        this.isBack = true
      },
      backMouseOut(){
        this.isBack = false
      },
      backClick(){
          console.log("quit")
        bus.$emit("quit-sub")
      },
      creSubscribe(){
          let id = this.$store.state.user.id
          this.axios.post('/subscribe',{
              id: id,
              data:this.value}).then((response)=>{
              let status = response.data.status
              if(status==200){
                  this.$message({
                    message:"添加成功",
                    type: "success"
                  })
                  this.$store.commit("isSubscribe")
                  this.backClick()
              }else{
                  this.$message({
                    message:"添加失败",
                    type: "error"
                  })
              }
          })
      }
    },
    computed: {
      data: function(){
        return this.left
      },
    },
    watch: {
    }
}
</script>
<style scoped>
#subcribe{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
   
}
.el-transfer /deep/ .el-transfer-panel__body {
    height: 305px;
}
.el-transfer /deep/ .el-transfer-panel__list.is-filterable {
    height: 220px;
    padding-top: 0;
}
.box{
  display: flex;
  flex-direction: row;
  align-items: center;
  
}
#back{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
.b_highlight{
    background-color: #f4f4f5;
    opacity: 1;
    border-radius:50%;
    border-width:32px;
  }
.transfer-footer{
    margin-left: 70%
}
</style>

