<template>
     <el-container @click.native="clickEvent($event)">
      <el-header height = "64px"><router-view name = "head"></router-view></el-header>
      <el-container>
        <el-aside width="19%" v-show="show">
          <router-view name = "left"></router-view>
          <router-view name="contro"></router-view>
          <div class="tooder">
            <span v-bind:class = "{highlight: Brand2}"
                  @mouseover="brandMouseOver"
                  @mouseout="brandMouseOut" 
                  @click="addUser"
                  style="cursor:pointer" class="icon1" >
                  <img style="width:35px;height:35px" src="/static/img/addteam.svg"/></span>
          </div>
        </el-aside>
        <el-main>
          <calendarView v-show="calendarViewShow"></calendarView>
          <searchView v-if="searchViewShow" :events="events"></searchView>
        </el-main>
      </el-container>
      <div class="alert"  v-if="showAlert">
        <div class="sub-box">
          <subcribe></subcribe>
        </div>
      </div>
    </el-container>
</template>
<style scoped>
 .el-header{
   padding: 8px;
   border-bottom:thin solid #dadce0;
   display: flex;
   flex-direction: row;
   flex-wrap: nowrap;
   align-items:center;
 }
 .el-aside{
   display: flex;
   flex-direction: column;
   flex-wrap: nowrap;
   align-items: center;
   justify-content: flex-start;
   overflow:hidden
 }
 .el-main{
   padding: 0px;
 }
::-webkit-scrollbar {
    background: transparent;
    height: 8px;
    width: 8px;
}
::-webkit-scrollbar-thumb {
    border-bottom: 4px solid white;
    border-left: 4px solid white;
    border-right: 4px solid white;
    border-top: 4px solid white;
}
.tooder{
  display: flex;
  flex-direction: row;
  height: 100px;
  width: 100%;
  align-items: flex-start;
  padding-left: 10%;
}
.icon1 {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}
 .highlight{
    background-color: #f4f4f5;
    opacity: 1;
    border-radius:50%;
  }
  .sub-box{
    position: absolute;
    /* margin: auto; */
    padding: 10px;
    border-radius: 4px;
    background: #fff;
    z-index:999;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .alert {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(32,33,36,0.38);
  z-index: 1000;
  transition: all .3s ease-in-out;
}
</style>

<script>
import bus from '../assets/eventBus.js'
import subcribe from './subcribe.vue'
import calendarView from '@/components/calendar-view.vue'
import searchView from '@/components/searchView.vue'
export default {
  data (){
    return {
      show: true,
      Brand2: false,
      showAlert: false,
      calendarViewShow:true,
      searchViewShow:false,
      events:[]
    }
  },
  mounted() {
    bus.$on("brandClick",()=>{
      this.show = !this.show
    })
    bus.$on("quit-sub",()=>{
      this.quitSub()
    })
   bus.$on("search",(req)=>{
     console.log("search")
     console.log(this.calendarViewShow)
     this.calendarViewShow=false
      this.events=req
      console.log(this.events)
     this.searchViewShow=true
   })
   bus.$on("calendar",()=>{
     this.calendarViewShow=true
     this.searchViewShow=false
   })
  },
  methods:{
    addUser(){
      this.showAlert=true
    },
    brandMouseOver (){
        this.Brand2 = true
    },
    brandMouseOut (){
        this.Brand2 =false
    },
    quitSub(){
      this.showAlert=false
    },
    clickEvent(event){
      let sp = document.getElementById("eventCardBox")
      if(sp!=null){
        if(!sp.contains(event.target)){
          bus.$emit("closeCard")
        }
      }
    }
  },
  watch:{
    msg: function(val){
      console.log('收到'+val)
    },
    
  },
  computed:{
    msg:function(){
      return this.$store.state.message
    },

  },
  components: {subcribe,calendarView,searchView}
}

</script>
