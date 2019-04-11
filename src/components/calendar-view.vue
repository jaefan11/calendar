<template>
  <div id="calendar-view" >
    <full-calendar  
      ref="calendar" 
      :header = "header" 
      :event-sources="eventSources"
      @event-selected = "eventSelected"
      @event-created = "eventCreated" 
      :config = "config"
      @view-render="viewReder">
    </full-calendar>

    <event-card ref="eventCard"
                :event-selected="selected" 
                :js-event="jsEvent"
                v-if="cardIsShow" 
                @cardClose="cardClose"
                :view="view"
                >
    </event-card>

     <div id="create">
        <div id="list-content" v-show="show">
          <span @mousemove="creListMove" 
                @mouseout="creListOut"
                value = 1
                @click="eventCre(1)"
                :class = "{hover_light : isConfence}">
            会议
          </span>
          <span @mousemove="creListMove" 
                @mouseout="creListOut"
                @click="eventCre(2)"
                value = 2
                :class = "{hover_light : isRoute}">
            行程
          </span>
          <span value = 3
                @mousemove="creListMove" 
                @mouseout="creListOut"
                @click="eventCre(3)"
                :class = "{hover_light : isSchedule}">
            课表
          </span>
        </div>
        <div id="creIcon" class="el-icon-plus" @click="creActy"></div>
      </div>
  </div>
</template>

<script>
import moment,{ months } from 'moment'
import bus from '../assets/eventBus.js'
import eventCard from './eventCard.vue'

export default {
  name: 'calendar-view',
  data() {
    return {
      nowDate: moment(new Date).format('YYYY-MM-DD'),
      header: false,
      show: false,
      isConfence: false,
      isRoute: false,
      isSchedule: false,
      defaultView: 'agendaWeek',
      changeView:'month',
      // events: [],
      config: {
        // eventClick: (event) => {
        //   this.selected = event;
        // },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        currentTimezone: 'Asia/Beijing',
        // navLinks:true
        
        editable: false
      },
      selected: {},
      cardIsShow: false,
      jsEvent: {},
      view: {},
      closeCard:0
    }
  },
  mounted(){
    let self=this
    bus.$on("changeView",(view)=>{
        this.achangeView(view)
      }
     )
    bus.$on("todayClick", ()=>{
      this.todayClick()
    })
    bus.$on("toNext",()=>{
      console.log(this.$refs.calendar)
      this.toNext()
    })
    bus.$on("toPrev",()=>{
      this.toPrev()
    })
    bus.$on("goToDay", (date)=>{
      this.goToDay(date)
    })
    bus.$on("remove-event",()=>{
      this.removeEvent()
    })
    bus.$on("closeCard",()=>{
      this.closeCard++
    })
    if(this.$store.state.event!=null){
      if(this.$store.state.event.start){
        let date = this.$store.state.event.start
        this.goToDay(date)
      }
      
      let data={
        update:false,
        event:{}}
      this.$store.commit('updateEvent',data)
    }
    console.log("selectevent"+this.$store.state.event)
  },

  watch: {
    closeCard(value){
      if(this.cardIsShow){
        if(value>1){
          this.cardIsShow=false
          this.closeCard=0
        }
      }else{
        this.closeCard=0
      }
    }
  },

  methods: {
    achangeView(view){
      this.$refs.calendar.fireMethod('changeView', view)
    },
    todayClick(){
      this.$refs.calendar.fireMethod('today')
    },
    toNext(){
      this.$refs.calendar.fireMethod('next')
    },
    toPrev(){
      this.$refs.calendar.fireMethod('prev')
    },
    eventCre(value){
      console.log(value)
      this.$store.commit('typeChange',value)
      this.$router.push('/create')
    },
    cardClose (){
      this.cardIsShow=false
      this.closeCard=0
    },
    goToDay(date){
      this.$refs.calendar.fireMethod('gotoDate',date)
    },
    creListOut (event){
      if(event.target.attributes.value.value == 1){
        this.isConfence = false 
      }else if (event.target.attributes.value.value == 2) {
        this.isRoute = false
      } else {
        this.isSchedule = false
      }
    },
    creListMove (event){
      if(event.target.attributes.value.value == 1){
        this.isConfence = true 
      }else if (event.target.attributes.value.value == 2) {
        this.isRoute = true
      } else {
        this.isSchedule = true
      }
    },
    creActy (){
      this.show = !this.show
    },
    viewReder (){
     let date = this.$refs.calendar.fireMethod('getDate')
     bus.$emit("viewReder",date)
    },
    refreshEvents() {
      this.$refs.calendar.$emit('refetch-events');
    },

    removeEvent() {
      let self=this
      this.$confirm('此操作将永久删除该事件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let event ={}
          event.id = self.selected.id
          event.type = this.$store.state.type
          this.axios.post("/deletEvent",event).then((response)=>{
                let status = response.data.status
                if(status==200){
                    self.$refs.calendar.$emit('remove-event', self.selected)
                    this.cardIsShow=false
                    this.selected = {};
                    this.$message({message:"删除成功",
                               type: "success"
                    })
                    this.$store.state.stomp.send("/receive",{},"删除"+moment())
                }else if(status==500){
                    this.$message({message:"删除失败",
                               type: "error"
                    })
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      
      
    },

    eventSelected(event, jsEvent, view) {
      this.selected = event
      this.jsEvent=jsEvent
      this.view=view
      this.cardIsShow=true
      this.$store.state.clickEvent=false
      this.$store.state.clickCard=false
    },

    eventCreated(...test) {
      console.log(test)
    },
    
  },

  computed: {
     eventSources() {
      const self = this;
      console.log( this.$store.state.msg)
      this.$store.state.subscribe
      this.$store.state.msg
      let type=self.$store.state.type
      return [
        {
          events(start, end, timezone, callback) {
            
            setTimeout(() => {
                  let id=self.$store.state.user.id
                  let s = moment(start).format('YYYY-MM-DD HH:mm')
                  let e = moment(end).format('YYYY-MM-DD HH:mm')
                  if(type<=3){
                      self.axios.post('/loadEvents',{
                      id: id,
                      type: type,
                      start: s,
                      end: e
                    }).then((response)=>{
                      // console.log(response.data)
                      // self.$refs.calendar.fireMethod('removeEvents')
                      // self.events=response.data
                      // self.$refs.calendar.fireMethod('renderEvents', this.events,true)
                      callback(response.data)
                    })
                  }else{
                    self.axios.post('/loadComEvents',{
                      id: id,
                      type: type,
                      start: s,
                      end: e
                    }).then((response)=>{
                      // console.log(response.data)
                      // self.$refs.calendar.fireMethod('removeEvents')
                      // self.events=response.data
                      // self.$refs.calendar.fireMethod('renderEvents', this.events,true)
                      callback(response.data)
                    })
                  }
                  
              
            }, 1000);
          },
        },
      ];
    }
  },
  components:{eventCard}
};
</script>

<style scoped>

#calendar-view {
  display: flex;
  color: #2c3e50;
  padding:0 5px;
  width: 100%;
  height: 100%;
}
#calendar{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: 100%;
    border-style:none;
}
#creIcon{
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  text-align: center;
  line-height:50px;
  font-size: 30px;
  color: white;
  cursor:pointer;
}
#create{
  display: flex;
  position: absolute;
  flex-direction: column;
  right: 50px;
  bottom: 50px;
  z-index:999;
  justify-content: flex-start;
  align-items: center;
}
#list-content {
  cursor:pointer;
  margin: 10px;
}
#list-content span{
  display: block;
  margin: 5px 0px;
  font-size: 17px;
  width: 100px;
  text-align: center;
  border-radius: 10%;
}
.hover_light{
  background-color: #ddd;
  color: black;
}

</style>
