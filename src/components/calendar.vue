<template>
    <div id="calendar1">
        <v-date-picker 
        :attributes = 'attributes'
        :theme-styles = 'themeStyles'
        :is-inline = 'isInline'
        @dayclick = "dayClick"
        v-model = "selectedValue"
        :select-attribute = 'myAttribute'
        >
        </v-date-picker>
    </div>
</template>
<script>
import bus from '../assets/eventBus.js'
import moment from 'moment'
export default {
  data() {
    return {
        selectedValue: new Date(),
        isInline: true,
        attributes: [
          {
            key: 'today',
            highlight: {
              backgroundColor: '#1a73e8'
            },
            contentStyle: {
              color: '#fafafa',
            },
            dates: new Date()
        }],
        themeStyles:{
            wrapper: {
              background: '#fff',
            
            },
            header: {
              padding: `10px 20px`,
            
            },
            weekdays: {
              // New color
              fontWeight: '700', // And bolder font weight
              padding: `5px  20px `,
            },
            weeks: {
              padding: `0 20px`,
              fontWeight: '700',
            },
        }
  }
  },
  mounted (){
    let self = this
    bus.$on("todayClick",function (){
      self.selectedValue = new Date()
      // self.minPage = new Date
    })
    bus.$on('viewReder',(date)=>{
      self.selectedValue=new Date(moment(date).format('YYYY,MM,DD'))
    })
  },
  methods: {
    dayClick (day){
      let date = moment(day.date).format('YYYY-MM-DD')
      this.selectedValue = day
      console.log("dayClick----"+day)
      bus.$emit("goToDay", date)
    }
  },
  computed:{
    myAttribute:function(){
      let day = this.selectedValue
      let date = moment(day).format('YYYY-MM-DD')
      console.log("computed---"+this.selectedValue)
      if(moment(new Date()).format('YYYY-MM-DD')!= date){
        return {
            highlight: {
            backgroundColor: '#d2e3fc'
            },
            contentStyle: {
              color: '#1a73e8',
            }
        }
      }else{
        return {
            highlight: {
            backgroundColor: '#1a73e8'
            },
            contentStyle: {
              color: '#fafafa',
            }
        }
      }
    }
  }
}
</script>
<style scoped>
  #calendar1{
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
  }
</style>
