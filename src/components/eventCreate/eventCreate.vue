<template>
    <el-container 
        v-loading="loading1"
        element-loading-text="正在保存中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-header height = '140px'>
         <div id = "back">
            <span class="el-icon-close" v-bind:class = "{b_highlight: isBack}"
                  style="cursor:pointer;width:40px;height:40px;text-align: center;line-height: 40px"
                  @click="backClick"
                  @mouseover="backMouseOver"
                  @mouseout="backMouseOut"
            ></span>
        </div>
        <router-view ref="creHead" name="head"></router-view>
        <div id="reserve">
            <el-button type="primary" 
                        @click="creReserve">保存</el-button>  
        </div>
        </el-header>
        <el-main>
            <router-view name="bottom" ref="bottom"></router-view>
        </el-main>
    </el-container>
</template>

<script>
import moment,{ months } from 'moment'
import bus from '../../assets/eventBus.js'

export default {
    data(){
        return {
            isBack:false,
            loading1:false
        }
    },
    mounted(){
        console.log(this.$store.state.type)
    //    
    },
    methods: {
         backClick (){
            this.$confirm('确定取消对事件的更改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                if(this.$refs.bottom.$refs.creEdit.fileList.length!=0 && !this.$store.state.update){
                    let fileList=this.$refs.bottom.$refs.creEdit.fileList
                    for(let file of fileList){
                        this.axios.get("removeFile",{params:{id:file.id}})
                    }
                }
                let data = {}
                data.update = false
                this.$store.commit('updateEvent',data)
                this.$router.push('/home')
            }).catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // })        
            })
           
        },
        creReserve (){
            let self = this
            let event = {}
            let date1 = this.$refs.creHead.date1
            let date2 = this.$refs.creHead.date2
            let time1 = this.$refs.creHead.time1
            let time2 = this.$refs.creHead.time2
            let invite=this.$refs.bottom.$refs.invite
            let start = moment(date1).format('YYYY-MM-DD')+' '+time1
            if(this.$refs.creHead.time2){
                console.log("----"+time2)
                 let end = moment(date2).format('YYYY-MM-DD')+' '+time2
                 event.end = end
            }
            
            event.title = this.$refs.creHead.event_tittle
            event.start = start
            event.allDay = this.$refs.creHead.checked
            
            if (this.$refs.bottom.$refs.creEdit.content){
                event.content=this.$refs.bottom.$refs.creEdit.content
            }

            if (this.$refs.bottom.$refs.creEdit.place){
                event.place=this.$refs.bottom.$refs.creEdit.place
            }

           if(this.$refs.bottom.$refs.creEdit.fileList.length!=0){
               event.fileList=this.$refs.bottom.$refs.creEdit.fileList
           }
            if (invite.value.length!=0){
                    event.persons=invite.value
            }
            let timeSlot={}
            if(this.$refs.creHead.value<=4){
                timeSlot={
                    value:this.$refs.creHead.value
                }
            }else{
                timeSlot={
                    value:this.$refs.creHead.value,
                    slot:this.$refs.creHead.form
                }
            }
            console.log(timeSlot)
            event.timeSlot=timeSlot
            
           event.creId=this.$store.state.user.id
           event.type = this.$store.state.type
           this.loading1=true
            if(this.$store.state.update){
                event.id=this.$store.state.event.id
                this.axios.post('/updateEvent',event).then((response)=>{
                this.$message({message:"修改成功",
                               type: "success"
                })
                this.loading1=false
                let data = {}
                data.update = false
                this.$store.state.stomp.send("/receive",{},"修改")
                this.$store.commit('updateEvent',data)
                self.$router.push('/home')
                }).catch(()=>{
                    this.loading1=false
                    this.$message({message:"修改失败",
                                type: "error"
                    })
                })
            }else{
                this.axios.post('/addEvent',event).then((response)=>{
                    this.$message({message:"创建成功",
                                type: "success"
                    })
                    this.loading1=false
                    let data = {}
                    data.update=false
                    data.event=event
                    this.$store.commit('updateEvent',data)
                    this.$store.state.stomp.send("/receive",{},"新消息")
                    self.$router.push('/home')
                }).catch(()=>{
                    this.loading1=false
                    this.$message({message:"创建失败",
                                type: "error"
                    })
                })
            }
            
            
        },
        backMouseOver (){
            this.isBack = true
        },
        backMouseOut (){
            this.isBack = false
        },
    }
}
</script>

<style scoped>
#back{
   padding-top: 14px;
}
.el-container{
    width: 100%;
    height: 100%;
}
.el-header{
    display: flex;
    flex-direction: row;
}
.el-main{
    padding-bottom: 5px;
}
#reserve{
    width: 3%;
    padding-top: 14px;
    padding-left: 0px;
    text-align: center;
}
.el-icon-close{
    
    font-size: 25px
}
.b_highlight{
    background-color: #f4f4f5;
    opacity: 1;
    border-radius:50%;
    border-width:32px;
  }
</style>

