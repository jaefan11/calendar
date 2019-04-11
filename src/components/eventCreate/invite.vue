<template>
    <div id="invite" ref="invite">
       <div style="text-align: center;height:100%">
            <el-transfer
            style="text-align: left; display: inline-block"
            v-model="value"
            filterable
            :left-default-checked="[]"
            :right-default-checked="[]"
            :titles="[group1, group2]"
            :button-texts="['取消', action]"
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
            <!-- <el-dropdown slot="right-footer" size="small" split-button @command="handleRightCommand">
              {{group2}}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="所有成员">所有成员</el-dropdown-item>
                <el-dropdown-item command="研一">研一</el-dropdown-item>
                <el-dropdown-item command="研二">研二</el-dropdown-item>
                <el-dropdown-item command="研三">研三</el-dropdown-item>
                <el-dropdown-item command="博士">博士</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            </el-transfer>
        </div>
    </div>
</template>
<script>
export default {
     data() {
      return {
        // data:[],
        left:[],
        persons:[],
        group1: "所有成员",
        group2: "",
        action:"",
        value: [],
        renderFunc(h, option) {
          return <div class="box"><img src={option.url} style="width:18px;height:auto; text-align: center;border-radius: 100%;margin-right:5px"/><span>  { option.label }</span></div>;
        }
      };
    },
    mounted(){
      this.personDataIni(this.$store.state.user.id)
      if(this.$store.state.update){
            this.initUpdate(this.$store.state.event)
        }
      this.initInterface()
    },
    methods: {
      initInterface(){
        if(this.$store.state.type==1){
          this.group2="参会人员"
          this.action="邀请"
        }else{
          this.group2="参与人员"
          this.action="参与"
        }
      },
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
      },
      handleLeftCommand(command){
        this.group1=command
      //  console.log('datat'+this.data)
      //  console.log('value'+this.value)
      //   console.log('left'+this.left)
      //  console.log('right',this.right)
        switch (command){
            case '所有成员':
            {
              this.left=this.persons
              break
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
               break
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
               break
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
               break
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
        // if(direction="right"){
        //   this.right.push.apply(this.right,value)
        // }else{
        //   this.left.push.apply(this.left,value)
          console.log(value, direction, movedKeys)
        // }
        
      }
    },
    computed: {
      data: function(){
        // console.log(this.group1)
        // console.log(this.left)
        // console.log(this.data)
        return this.left
      },
      // value: ()=>{
      //   return this.right
      // }
    },
    watch: {
    }
}
</script>
<style scoped>
#invite{
    display: flex;
    flex-direction: row;
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
</style>


