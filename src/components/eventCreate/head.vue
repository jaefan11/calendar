<template>
    <div id = "head">
        <div id = "main">
            <div id="tittle">
                <el-input
                    v-model="event_tittle"
                    placeholder="添加标题"
                    >
                </el-input>
            </div>
            <div id="pickTime">
                <div class="date-sel">
                    <el-date-picker
                        v-model="date1"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        size="small"
                        >
                        
                    </el-date-picker>
                </div>
                <div class="time-sel">
                    <el-time-picker
                        v-model="time1"
                        :picker-options="{
                            selectableRange: '00:00:00 - 23:59:59'
                        }"
                        placeholder="选择时间"
                        size="small"  value-format="HH:mm" format="HH:mm">
                    </el-time-picker>
                </div>
                <span>至</span>
                <div class="time-sel">
                    <el-time-picker
                        v-model="time2"
                        :picker-options="{
                           selectableRange: '00:00:00 - 23:59:59'
                        }"
                        placeholder="选择时间"
                        size="small"  value-format="HH:mm" format="HH:mm">
                    </el-time-picker>
                </div>
                <div class="date-sel">
                    <el-date-picker
                        v-model="date2"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        size="small">
                    </el-date-picker>
                </div>
            </div>
            <div id="repeat">
                <el-checkbox v-model="checked">全天</el-checkbox>
                <el-col :span="17">
                <el-select v-model="value" placeholder="请选择" size="small" :style="{width:inputWidth+'px'}" @change="selectClick">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-col>
            </div>
            <el-dialog
            title="自定义周期"
            :visible.sync="dialogVisible"
            width="33%"
            :show-close="showClose"
            :close-on-click-modal="closeOnClickModa">
                <el-form ref="form" :model="form" label-width="80px" size="mini" label-position="top">
                    <el-form-item label="重复频率：" size="mini">
                        <el-col :span="1">每</el-col>
                        <el-col :span="15">
                            <el-input-number v-model="form.num1" size="mini" controls-position="right" :min="1"></el-input-number>
                            <span>周</span>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="重复时间：">
                        <el-checkbox-group v-model="form.week1" size="mini">
                            <el-checkbox-button v-for="week in weeks" :label="week" :key="week">{{week}}</el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="结束时间：" size="small">
                        <el-col :span="16">
                             <el-radio v-model="form.radio" label='1' >永不</el-radio>
                        </el-col>
                        <el-col :span="20">
                             <el-radio v-model="form.radio" label='2' style="margin-right:20px" >结束日期:</el-radio>
                            <el-date-picker
                                v-model="form.date3"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                size="mini"
                                :disabled="date3disabled">     
                            </el-date-picker>
                        </el-col>
                        <el-col :span="30" >
                             <el-radio v-model="form.radio" label='3' style="margin-right:52px">重复</el-radio>
                              <el-input-number v-model="form.num2" size="mini" controls-position="right" :min="1" :disabled="numDisabled"></el-input-number>
                            <span>次后</span>
                        </el-col>      
                    </el-form-item>
                    <el-form-item style="padding-left:65%" size="small">
                        <el-button @click="formQuit(form)">取消</el-button>
                        <el-button  type="primary" @click="formSubmit(form)">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import moment,{ months } from 'moment';
  export default {
    data() {
      return {
        isBack: false,
        options: [{
          value: 1,
          label: '不重复'
        }, {
          value: 2,
          label: '每天'
        }, {
          value: 3,
          label: '每个月'
        },
        {
          value: 4,
          label: '每年'
        }, {
          value: 5,
          label: '自定义...'
        }],
        event_tittle: '',
        closeOnClickModa:false,
        showClose:false,
        value: 1,
        date1: '',
        date2: '',
        time1: '',
        time2: '',
        checked: false,
        dialogVisible:false,
        inputWidth:150,
        weeks:['周日','周一','周二','周三','周四','周五','周六'],
        form:{
            num1:1,
            week1:['周一'],
            radio:'1',
            date3:'',
            num2:1
        }
      }
    },
    mounted(){
        this.date1=moment().format('YYYY-MM-DD')
        this.time1=moment().format('HH:mm')
        if(this.$store.state.update){
            this.initUpdate(this.$store.state.event)
        }
    },
    methods:{
        formSubmit(form){
            if(form.radio=='2'){
                if(form.date3==null){
                    this.$confirm('请输入结束时间', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    }).then(()=>{
                        return
                    })
                }
            }
            this.generatePeriod(this.form.num1,this.form.week1,this.form.radio,this.form.date3,this.form.num2)
            this.dialogVisible=false
        },
        formQuit(form){
            this.form.num1=1
            this.form.week1=['周一']
            this.form.radio='1'
            this.form.date3=''
            this.form.num2=1
            this.value=1
            this.dialogVisible=false
        },
        selectClick(value){
            console.log(this.options.length)
            if(value==this.options.length){
                this.dialogVisible=true
            }
        },
        initUpdate(event){
            console.log(event)
            if(event.title){
                this.event_tittle=event.title
            }
           if(event.start){
               console.log(event.start)
               let start=[]
               let str = moment(event.start).format('YYYY-MM-DD HH:mm')
               start=str.split(" ")
               console.log(start[0],start[1])
               this.date1=start[0]
               this.time1=start[1]
           }
           if(event.end){
               let end=[]
               let str = moment(event.end).format('YYYY-MM-DD HH:mm')
               end=str.split(" ")
               console.log(end[0],end[1])
               this.date2=end[0]
               this.time2=end[1]
           }
           if(event.allDay){
               this.checked=event.allDay
           }
           if(event.timeSlot){
               
               if(event.timeSlot.value>=5){
                   let form=event.timeSlot.form
                   console.log()
                   this.generatePeriod(form.num1,form.week.split(","),form.radio,form.dateEnd,form.num2)
                   this.form.num1=form.num1
                   this.form.week1=form.week.split(",")
                   this.form.radio=form.radio
                   this.form.date3=form.dateEnd
                   this.form.num2=form.num2
               }else{
                   this.value=event.timeSlot.value
               }
           }
        },
        generatePeriod(num1,week1,radio,date3,num2){
            let period='每'+num1+'周'
            if(week1.length>1){
                let week=[]
                for (let w of week1){
                    console.log(w)
                    switch(w){
                        case '周日':{
                            week[0]='周日'
                            break
                        }
                        case '周一':{
                            week[1]='周一'
                            break
                        }
                        case '周二':{
                            week[2]='周二'
                            break
                        }
                        case '周三':{
                            week[3]='周三'
                            break
                        }
                        case '周四':{
                            week[4]='周四'
                            break
                        }
                        case '周五':{
                            week[5]='周五'
                            break
                        }
                        case '周六':{
                            week[6]='周六'
                            break
                        }
                    }
                }
                let idex=[]
                for(let w in week){
                    console.log(w)
                    idex.push(w)
                }
                console.log(idex)
                console.log("week"+week)
                let first=idex[0]
                let count=idex.length
                let final=idex[count-1]
                console.log("final"+final)
                let con=(first+count-1)==final?true:false
                if(con){
                    period+=week[first]+'到'+week[final]
                }else{
                    for(let i of idex){
                        console.log(i,week[i])
                        if(i==final){
                            period+=week[i]
                        }else{
                            period+=week[i]+'、'
                        }
                    }
                }
            }else{
                period+=week1
            }
            if(radio=='2'){
                period+=' 到'+date3+'结束'
            }else if(radio=='3'){
                period+='，重复'+num2+'次后'
            }
            this.options.splice(this.options.length-1,1,{
                value:this.options.length,
                label:period
            })
            this.options.splice(this.options.length,0,{
                value:this.options.length+1,
                label:'自定义...'
            })
            let relLength=0
            for(let i=0;i<period.length;i++){
                let charCode = period.charCodeAt(i)
                if (charCode >= 0 && charCode <= 128) relLength += 1
                else relLength += 2
            }
            this.inputWidth=relLength*14
            this.value=this.options.length-1
        }
    },
    watch: {
        date1: function(value){
            // console.log(value)
            if(value==null){
                this.date1=moment().format('YYYY-MM-DD')
            }
            this.date2=value
            this.date3=value
        },
        time1:function(value){
            // console.log(value)
            if(value==null){
                this.time1=moment().format('HH:mm')
            }
            if(this.time2==''){
                this.time2=this.time1
            }
        },

    },
    computed:{
        date3disabled:function(){
            if(this.form.radio=='2'){
                return false
            }else{
                return true
            }
        },
        numDisabled:function(){
            if(this.form.radio=='3'){
                return false
            }else{
                return true
            }
        }
    }
  }
</script>
<style scoped>
.b_highlight{
    background-color: #f4f4f5;
    opacity: 1;
    border-radius:50%;
    border-width:32px;
  }
#head{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 15px 6px 0px 6px;
    height: 100%;
    width: 52%;
}
#main{
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 100%;
    justify-content: space-between;
}
.date-sel /deep/ .el-date-editor{
    width: 180px;
    margin-right: 2px;
    font-size:13px;
}
.time-sel /deep/ .el-date-editor{
    width: 115px;
    margin-right: 2px;
    font-size:13px;
}
#pickTime{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

}
#repeat{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
}
#repeat .el-select{
    padding: 0px 10px;
    width: 135px;
}
.el-icon-close{
    font-size: 25px
}
</style>