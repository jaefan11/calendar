<template>
      <div id="eventCardBox" ref="eventCardBox" :style="style1">
        <div id="head" :style="style2">
            <div class="head-top">
                <div class="creator">
                    <img :src="creator.userface" class="creator-icon">
                    <span style="font-size:18px;color:#fff">{{creator.name}}</span>
                </div>
                <div>
                <span class="el-icon-edit" style="font-size:20px;color:#fff;padding-right:10px;cursor:pointer;" @click="editEvent"></span>
                <span class="el-icon-circle-close-outline" style="font-size:20px;color:#fff;padding-right:10px;cursor:pointer;"
                      @click="cardClose"
                ></span>
                </div>
            </div>
            <span class="event-tittle">{{eventSelected.title}}</span>
        </div>
        <div id="body">
            <div class="time items">
                <span class="el-icon-time icons"> </span>
                <span>{{time}}</span>
            </div>
            <div class="place items" v-show="palceIsNone">
                <span class="el-icon-location icons"> </span>
                <span>{{place}}</span>
            </div>
            <div class="person items-1" v-show="personIs">
                <span class="icons"><img src="/static/img/people.svg" style="width:20px;height:20px"> </span>
                <div v-for="person of persons" class="person-box"><img :src=person.userface style="width:25px;height:auto;border-radius: 100%;margin-right:10px"/>
                          <span style="font-size:5px;margin-right:10px">{{person.name}}</span>
                </div>
                <span v-if="overflow" style="font-size:18px;cursor:pointer;font:bold ">...</span>
            </div>
            <div class=" items-1" v-show="contentIs">
                <span class="icons"><img src="/static/img/left_align_text.svg" style="width:20px;height:20px"> </span>
                <div class="content" v-html="content">
                </div>
            </div>
            <div class="file items-1" v-show="fileIs">
                <span class="icons" ><img src="/static/img/open_folder.svg" style="width:20px;height:20px"> </span>
                <div class="file-box">
                    <a v-for="file in fileList" ref="file.url" style="cursor:pointer" @click="downloadFile(file)">{{file.name}}</a>
                </div>
            </div>
        </div>
        
        <div id="bottum" :style="style2">
            <span style="font-size:18px;color:#fff;cursor:pointer;width:80px;text-align: center" @click="removeEvent">删除</span>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import bus from '../assets/eventBus.js'
import {download} from '../utils/download.js'
export default {
    props: ['eventSelected','jsEvent','view'],
    data(){
        return {
            allPersons:[],
            overflow: false,
            cardHeight:0,
        }
    },
    mounted(){
        this.cardHeight=this.$refs.eventCardBox.clientHeight
    },
    updated(){
        // console.log(this.$refs.eventCardBox.clientHeight)
    },
    methods:{
        cardClose (){
            this.$emit('cardClose')
        },
        removeEvent(){
            if(this.$store.state.user.id==this.eventSelected.creator.id){
                bus.$emit('remove-event')
            }else{
                 this.$message({message:"你被禁止此次操作",
                               type: "warning",
                               center: true
                    })
            }
            
            
        },
        editEvent(){
             if(this.$store.state.user.id==this.eventSelected.creator.id){
                let data = {}
                data.event = this.eventSelected
                data.update = true
                this.$store.commit('updateEvent',data)
                this.$router.push('/create')
            }else{
                this.$message({message:"你被禁止此次操作",
                               type: "warning",
                               center: true
                    })
            } 
        },
        downloadFile(file){
            console.log("下载",file)
            this.$confirm('确定要下载文件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.axios(
                    {
                    method: 'post',
                    url: '/downloadFile',
                    data: {
                        id: file.id
                    },
                    responseType: 'blob'
                    }
                ).then(response => {
                    download(response,file)
                })
            })
        },
    },
    watch: {
        eventSelected: function(){
            
            // console.log(this.eventSelected.content)
        }
    },
    computed:{
        creator: function(){
            return this.eventSelected.creator
        },
        time: function(){
            let start = this.eventSelected.start
            let end = this.eventSelected.end
            let date = moment(start).format('YYYY/MM/DD HH:mm:ss')
            if (this.eventSelected.end != undefined){
                date = moment(start).format('YYYY/MM/DD HH:mm:ss') + ' - ' + moment(end).format('YYYY/MM/DD HH:mm:ss')
            }
            return date
        },
        place: function(){
            if(this.eventSelected.place){
                if (this.eventSelected.place){
                // console.log(this.eventSelected.place)
                return this.eventSelected.place
            }
            }
            
        },
        palceIsNone: function(){
            if(this.eventSelected.place){
                return true
            }
        },
        content: function(){
            if (this.eventSelected.content){
                return this.eventSelected.content
            }
        },
        personIs: function(){
            if(this.eventSelected.persons)
            {
                if(this.eventSelected.persons.length!=0){
                return true
             }
            }
        }, 
        persons: function(){
            if(this.eventSelected.persons)
            {
                let persons=this.eventSelected.persons
                if(persons.length!=0){
                    if(persons.length<=8){
                    return persons
                    }else{
                    this.overflow=true
                    return persons.slice(0,8)
                    }
                }
            }
        },
        contentIs: function(){
            if(this.eventSelected.content){
                return true
            }
        },
        fileIs: function(){
            // console.log(this.eventSelected.fileList)
             if(this.eventSelected.fileList){
                    if(this.eventSelected.fileList.length!=0){
                    // console.log(this.eventSelected.fileList)
                    return true
                }
            }
        },
        fileList: function(){
                if(this.eventSelected.fileList!=undefined){
                    if(this.eventSelected.fileList.length!=0){
                    // console.log(this.eventSelected.fileList)
                    return this.eventSelected.fileList
                }
            }
        },
        style1: function(){
            console.log("style1------",this.jsEvent)
            if(Object.keys(this.jsEvent).length != 0){
                // let cardHeight = this.$refs.eventCardBox.clientHeight
                let clientHeight = document.documentElement.clientHeight
                // console.log(this.view)
                // console.log(clientHeight)
                // console.log(this.cardHeight)
                let x
                if(this.jsEvent.pageX-this.jsEvent.offsetX>=500){
                        x=this.jsEvent.pageX-this.jsEvent.offsetX-360
                    }else{
                        let JsEventClientWidth = this.jsEvent.currentTarget.clientWidth
                        if (JsEventClientWidth >450){
                            JsEventClientWidth=JsEventClientWidth/2
                        }
                        x=this.jsEvent.pageX-this.jsEvent.offsetX+10+JsEventClientWidth
                    }
                let y=this.jsEvent.pageY-this.jsEvent.offsetY
                if(this.cardHeight>=350){
                    y=(clientHeight-this.cardHeight+50)/2
                }else if(this.cardHeight <350 && clientHeight-y-this.cardHeight<=30 ){
                   y=clientHeight-this.cardHeight-30
                }
                console.log("this.jsEvent.currentTarget.clientWidth-----"+this.jsEvent.currentTarget.clientWidth)
                console.log("this.jsEvent.pageX-this.jsEvent.offsetX---",this.jsEvent.pageX-this.jsEvent.offsetX)
                console.log('x',x)
                console.log(clientHeight-y-this.cardHeight)
                console.log('y',y)
                return {
                    top: y+'px',
                    left: x+'px'
                }}
        },
        style2:function(){
            console.log("style2------")
            return {
                backgroundColor: this.eventSelected.backgroundColor
            }
        }
    }

}
</script>

<style scoped>
#eventCardBox{
  position: fixed;
  border-radius: 8px;
  box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2);
  z-index: 100;
  left: 300px;
  top: 100px;
  width: 350px;
  background-color: #fff;
  
}
#head{
    position: relative;
    flex-shrink: 1;
    flex-direction: column;
    display: flex;
    height: 100px;
    /* background-color: #3F51B5; */
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 8px;
}
.head-top{
    display: flex;
    height: 60%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.creator{
    display: flex;
    align-items: center;
    width: 35%;
    justify-content: space-between;
}
.creator-icon{
    width:50px;
    height:50px;
    border-radius: 100%;
    text-align: center;
}
.event-tittle{
    text-align: center;
    font-size: 20px;
    color: #fff;
}
#body{
    display: flex;
    flex-direction: column;
    padding: 8px;
    max-height: 350px;
    
}
#bottum{
    display: flex;
    flex-direction: row;
    /* background-color: #3F51B5; */
    justify-content: center;
    height: 35px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding-top: 5px;
}
.items{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
}
.items-1{
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    align-items: top;
}
.icons{
    display: flex;
    font-size: 20px;
    margin-right: 10px;
    align-items: center;
    color: #8a8a8a;
    height: 20px;
    
}
.person-box{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.content{
    word-wrap:break-word ;
    overflow-y: auto;
}
.file-box{
    width:100%;
    display: flex;
    flex-direction: column;
    max-height:50px;
    word-wrap:break-word ;
    overflow-y: auto;
}

</style>

