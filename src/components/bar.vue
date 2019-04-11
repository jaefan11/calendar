<template>
  <el-row :gutter="24" >
    <el-col :span="5">
       <div class="mynav-head">
         <div class="avr-arrow-s" v-bind:class = "{highlight: isBrand}"
              style="width:45px;height:45px"
              @click="brandClick"
              @mouseover="brandMouseOver"
              @mouseout="brandMouseOut">
            <span class="span-brand-icon glyphicon glyphicon-menu-hamburger" style="font-size: 22px;
                  width: 52px;text-align:center;cursor:pointer" >
            </span>
         </div>
        <img src="/static/img/calendar.png" style="width:40px;height:40px">
        <span class="span-text" style="font-size:22px;color:#767676;" >日历</span>
       </div>
       
    </el-col>
    <el-col :span="15" style="justify-content: space-between;">
     <div class="mynav-middle_f">
        <el-button type="info" @click="todayClick" plain >今天</el-button>
        <div class="avr-arrow">
          <div class=" avr-arrow-s" v-bind:class = "{highlight: isLeft}">
            <span  style="cursor:pointer;width:24px;height:24px;text-align: center;"
              @mouseover="arrLeftMouseOver"
              @mouseout="arrLeftMouseOut"
               @click="toPrev">
              <span class="el-icon-arrow-left" style="font-weight:bold;margin-top:2px"></span>
            </span>
          </div>
          <div class="avr-arrow-s" :class = "{highlight: isRight}">
            <span style="cursor:pointer;width:24px;height:24px;text-align: center;"
              @mouseover="arrRightMouseOver"
              @mouseout="arrRightMouseOut"
               @click="toNext">
              <span class="el-icon-arrow-right" style="font-weight:bold;cursor:pointer;margin-top:2px"></span>
            </span>
          </div>
        </div>
        <div style="width:130px;height:55px;">
          <span style="color:#767676;font-size:22px;" >{{nowDate}}</span>
        </div>
     </div> 
     <div class="mynav-middle_s">
     <div style="width:200px;dispaly:flex;">
          <el-popover
            placement="bottom-end"
            width="455"
            slot="suffix"
            v-model="searchShow"
            >
             <el-form ref="searchForm" :model="searchForm" label-width="80px" size="mini" label-position="left">
              <el-form-item label="搜索范围">
                <el-select v-model="searchForm.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="搜索内容">
                <el-input
                    v-model="searchForm.content"
                    width="210px"
                    placeholder="请输入内容"
                    >
                </el-input>
              </el-form-item>
              <el-form-item label="参与者">
                <el-input
                    v-model="searchForm.person"
                    width="210px"
                    placeholder="参与者或组织者"
                    >
                </el-input>
              </el-form-item>
              <el-form-item label="地点">
                <el-input
                    v-model="searchForm.place"
                    width="210px"
                    placeholder="地点"
                    >
                </el-input>
              </el-form-item>
              <el-form-item label="日期">
               <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm(searchForm)">重置</el-button>
                <el-button type="primary" @click="search(searchForm)">搜索</el-button>
              </el-form-item>
             </el-form>
             <el-input
                slot="reference" 
                width="200px"
                size="mini"
                placeholder="搜索"
                readonly
                >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <i class="el-input__icon el-icon-caret-bottom" ></i>
              </el-input>
          </el-popover>
      </div>
      <div style="width:80px;dispaly:flex;">
        <el-dropdown trigger="click"  @command="handleCommand">
          <el-button type="info" plain >
             {{text}}<i class="el-icon-arrow-down el-icon--right"></i>
         </el-button>
          <el-dropdown-menu  slot="dropdown">
            <el-dropdown-item command="月">月</el-dropdown-item>
            <el-dropdown-item command="周">周</el-dropdown-item>
            <el-dropdown-item command="日">日</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
     </div>
    </el-col>
    <el-col :span="4">
      <div class="mynav-right">
        <el-popover
            placement="top"
            width="200"
            v-model="visible"
            >
            <div v-if="isMsg" >
              <div v-for="msg in msgList">
                <div class="msg-top" >
                  <p>{{msg.name}}给你发了一条会议信息！</p>
                  <span class="el-icon-close" style="cursor:pointer;margin-left:10px;padding-top:2px" @click="visible=false"></span>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button type="primary" size="mini" @click="msgCheck(msg)">查看</el-button>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="msg-top">
                <p>你目前没有消息！</p>
                <span class="el-icon-close" style="cursor:pointer;margining" @click="visible=false"></span>
              </div>
            </div>
             <el-badge slot="reference" :value="msgNum" class="item" :hidden="!isMsg">
              <el-button :plain="true"  class="el-icon-bell" style="font-size:20px;" ></el-button>
            </el-badge>
          </el-popover>
        
        <div class="user" >
          <el-popover
            trigger="hover"
            placement="top"
            width="200"
            >
            <p>你好，{{username}}！</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="logout">退出</el-button>
            </div>
             <img slot="reference" :src="userface" style="width:40px;height:40px;border-radius: 100%;cursor:pointer;">
          </el-popover>
        </div>
      </div>
    </el-col>
    
</el-row>
</template>
 <style scoped>
  .msg-top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .el-row {
    margin: 8px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    height: 100%;
    align-items:center;
    justify-content: space-between;
  }
  .el-col {
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items:center;
  }
  .mynav-head{
    width: 150px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-around;
    align-items:center;
  }
  .mynav-middle_f{
    width: 320px;
    height: 48px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center; 
  }
  .mynav-middle_f>div{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items:center;
  }
  .mynav-middle_s{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 350px;
    justify-content:space-between;
    align-items:center; 
  }
  .el-button{
    border-style: none;
    padding: 0 3px;
    width: 52px;
    height: 32px;
  }
  .avr-arrow{
    flex-wrap: nowrap;
    justify-content:space-between;
    width: 64px;
  }
  .avr-arrow-s{
    width:32px;
    height:32px;
    display:flex;
    flex-direction:row;
    flex-wrap: nowrap;
    align-items:center;
    justify-content:space-around;
  }
  .mynav-right{
    display: flex;
    width: 100%;
    padding: 0 0 0 40%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center;
  }
  .user{
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:space-between;
    align-items:center; 
  }
  .el-icon-caret-bottom{
    height: 25px;
    margin-top: 1.5px;
  }
</style> 
 

<script>
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'
  import url from '../assets/calendar_48dp.png'
  import bus from '../assets/eventBus.js'
  import moment,{ months } from 'moment';
  export default {
    name: "bar",
    data() {
      let date = moment()
      let year = date.get('year')
      let month = date.get('month')+1
      let nowDate = year + '年' + month + "月"
      return {
        calendar: url,
        nowDate: nowDate,
        text: '周',
        isLeft: false,
        isRight: false,
        isBrand: false,
        userface:'',
        visible2:false,
        username: this.$store.state.user.name,
        msgNum:0,
        msgList:[],
        visible:false,
        searchMore:false,
        options: [{
          value: 1,
          label: '会议'
        },{
          value: 2,
          label: '行程'
        },{
          value: 3,
          label: '课程'
        }],
        searchForm:{
          type:1,
          content:'',
          person:'',
          place:'',
          date:''
        },
        searchShow:false
       }
    },
    mounted(){
      this.loadMessage()
      this.userface=this.$store.state.user.userface
      console.log(this.userface)
      bus.$on("viewReder",(date)=>{
        let year = date.get('year')
        let month = date.get('month')+1
        this.nowDate = year + '年' + month + "月"
      })
    },
    methods: {
      msgCheck(value){
        let id=value.id
        this.axios.post('/deleteNote',{id:id}).then((response)=>{
            let status = response.data.status
            if(status==200){
                this.msgNum--
                this.$store.commit('typeChange',1)
                bus.$emit("goToDay", value.time)
                this.visible=false
                this.msgList.splice(this.msgList.findIndex(v => v.id === id),1)
            }
        })
      },
      
       loadMessage(){
        //  console.log("加载消息")
         let id = this.$store.state.user.id 
         this.axios.post('/loadMessage',{id:id}).then((response)=>{
          //  console.log(response.data)
            let status = response.data.status
            if(status==200){
              let obj = response.data.obj
              this.msgNum = obj.count
              this.msgList = obj.msg
            }
         })
       },
       todayClick (){
         bus.$emit("todayClick")
       },
       toPrev (){
         bus.$emit("toPrev")
       },
       toNext (){
         bus.$emit("toNext")
       },
       handleCommand (command){
          let view
          this.text = command
          switch (command){
            case '周':
            view='agendaWeek'
            break;
            case '月':
            view='month'
            break;
            case '日':
            view='agendaDay'
            break;
          }
          bus.$emit("changeView",view);
        },
      open (){
        this.$notify.info({
          title: '成功',
          message: '这是一条成功的提示消息',
           offset: 50
        });
      },
      arrLeftMouseOver (){
        this.isLeft = true
      },
      arrLeftMouseOut (){
        this.isLeft = false
      },
      arrRightMouseOver (){
        this.isRight = true
      },
      arrRightMouseOut (){
        this.isRight = false
      },
      searchMouseOver (){
        this.searchMore = true
      },
      searchMouseOut (){
        this.searchMore = false
      },
      brandMouseOver (){
        this.isBrand = true
      },
      brandMouseOut (){
        this.isBrand = false
      },
      brandClick (){
        bus.$emit("brandClick")
      },
      logout(){
        this.$store.commit('logout')
        this.$router.push('/login')
      },
      resetForm(form){
        this.searchForm.type=1;
        this.searchForm.content=""
        this.searchForm.person=""
        this.searchForm.place=""
        this.searchForm.date=""
      },
      search(form){
        let aform={
          type:form.type,
          content:form.content,
          person:form.person,
          place:form.place,
          start:form.date!=''?moment(form.date[0]).format("YYYY-MM-DD"):'',
          end:form.date!=''?moment(form.date[1]).format("YYYY-MM-DD"):'',
          id:this.$store.state.user.id
        }
       
        this.axios.post('/search',aform).then((response)=>{
          //  console.log(aform)
           this.searchShow=false
            bus.$emit("search",response.data)
        })
      },
   },
   computed:{
     isMsg: function(){
       if(this.msgNum>0){
         return true
       }
        return false
     },
     newMsg:function(){
       return this.$store.state.message
     }

   },
   watch:{
     newMsg:function(val){
       if (val==true){
         this.loadMessage()
         this.$store.commit('receiveMessage',false)
       }
     }
   }
  }
</script>
<style scoped>
  .highlight{
    background-color: #f4f4f5;
    opacity: 1;
    border-radius:50%;
    border-width:32px;
  }
</style>


