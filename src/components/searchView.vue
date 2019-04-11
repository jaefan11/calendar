<template>
    <el-card class="box-card">
        <div slot="header" class="box_head">
            <span style="font-size:18px">搜索结果：</span>
            <el-button size="mini" @click="back" type="primary">返回</el-button>
        </div>
        <el-card shadow="hover" v-for="data in datas" :key="data">
            <div class="box" style="cursor:pointer" @click="goToEvent(data)">
                <div class="label_1">{{data.day}}</div>
                <span class="label_2">{{data.label}}</span>
                <span class="time">{{data.time}}</span>
                <span class="title">{{data.title}}</span>
            </div>
        </el-card>
</el-card>
</template>
<script>
import moment,{ months } from 'moment'
import bus from '../assets/eventBus.js'
export default {
    props:['events'],
    data(){
        
        return {
           
        }
    },
    methods:{
        back(){
            bus.$emit("calendar")
        },
        goToEvent(data){
            let event=this.events[data.id]
            let date = moment(event.start).format("YYYY-MM-DD")
            this.$store.commit('typeChange',event.type)
            bus.$emit("calendar")
            bus.$emit("goToDay", date)
        }
    },
    computed:{
        datas:function(){
            let datas=[]
            let id=0
            console.log(this.events)
            for(let event of this.events) {
                let date = moment(event.start)
                let day = date.get('date')
                console.log(date.weekday())
                let label=''
                switch(date.weekday()){
                    case 1:{
                        label = date.format("YYYY年MM月")+"，周天"
                        break
                    }
                    case 2:{
                        label = date.format("YYYY年MM月")+"，周一"
                        break
                    }
                    case 3:{
                        label = date.format("YYYY年MM月")+"，周二"
                        break
                    }
                    case 4:{
                        label = date.format("YYYY年MM月")+"，周三"
                        break
                    }
                    case 5:{
                        label = date.format("YYYY年MM月")+"，周四"
                        break
                    }
                    case 6:{
                        label = date.format("YYYY年MM月")+"，周五"
                        break
                    }
                    case 7:{
                        label = date.format("YYYY年MM月")+"，周六"
                        break
                    }  
                }
                let end = event.end
                let time=""
                if(event.allDay){
                    time="全天"
                }else{
                    time= moment(event.start).format('HH:mm')
                    if (event.end != undefined){
                        time += ' - ' + moment(end).format('HH:mm')
                    }
                }
                let title=''
                if(event.title==''){
                    title="(无标题)"
                }else{
                    title=event.title
                }
                let data={
                    day:day,
                    label:label,
                    time:time,
                    title:title,
                    id:id
                }
                id++
                datas.push(data)
            }
            return datas
        }
    }
}
</script>
<style scoped>
.label_1{
    font-size: 26px;
    color: #70757a;
    margin-right: 10px;
}
.box{
    display: flex;
    flex-direction: row;
    align-items: center;
}
.label_2{
    color: #70777e;
}
.time{
    font-size: 18px;
    color: #70757a;
    margin-left: 40px;
}
.box_head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.title{
    font-size: 18px;
    color: #70757a;
    margin-left: 20px;
}
</style>


