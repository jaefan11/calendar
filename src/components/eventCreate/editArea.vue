<template>
    <div id="editor">
        <div id="place">
            <span class="el-icon-location icon"></span>
            <el-autocomplete
                class="inline-input"
                v-model="place"
                :fetch-suggestions="querySearch"
                placeholder="添加地点"
                @select="handleSelect"
            ></el-autocomplete>
        </div>
        <div id="text-edit">
            <span class="el-icon-edit icon"></span>
            <quill-editor  v-model="content"
               :options="editorOption" 
               @blur="onEditorBlur($event)" 
               @focus="onEditorFocus($event)"
               @change="onEditorChange($event)">
             </quill-editor>
        </div>
        <div id="upload" v-if="uploadShow">
            <el-upload
            class="upload-demo"
            action="/upLoad"
            :http-request = "customUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :on-exceed="handleExceed"
            :file-list="fileList"
            v-loading="loading1"
            >
            <el-button size="small" type="primary">上传文件</el-button>
            </el-upload> 
            <!-- <div id="load">
                <el-button size="small" type="primary" disabled>下载文件</el-button>
            </div> -->
        </div>
    </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {download} from '../../utils/download.js'

import { quillEditor } from 'vue-quill-editor'

export default {
    data (){
        return{
            restaurants: [],
            place: '',
            content:'',
            editorOption:{
                modules:{
                        toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],        //加粗，斜体，下划线，删除线
//                             ['blockquote', 'code-block'],         //引用，代码块
//                             [{ 'header': 1 }, { 'header': 2 }],               // 标题，键值对的形式；1、2表示字体大小
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],          //列表
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // 上下标
                            [{ 'indent': '-1'}, { 'indent': '+1' }],          // 缩进
//                             [{ 'direction': 'rtl' }],                         // 文本方向
                            [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],         //几级标题
//                             [{ 'color': [] }, { 'background': [] }],          // 字体颜色，字体背景颜色
//                             [{ 'font': [] }],         //字体
                            [{ 'align': [] }],        //对齐方式
                            ['clean'],        //清除字体样式
                            ['image','video']        //上传图片、上传视频
                        ]
                    }
            },
            fileList: [],
            uploadShow:false,
            loading1:false
        }
    },
    methods: {
        initUpdate(event){
            if(event.place){
                this.place=event.place
            }
            if(event.content){
                this.content=event.content
            }
            if(event.fileList){
                this.fileList=event.fileList
            }
        },
        customUpload(file){
            console.log(file.file)
            let param = new FormData()
            param.append('files',file.file)
            param.append('id',this.$store.state.user.id)
            this.loading1=true
            this.axios({
                    method: 'post',
                    url: '/uploadFile',
                    headers: {'Content-Type':'multipart/form-data'},
                    data: param
                }).then((response)=>{
                    console.log(response)
                    if(response.data.status==200){
                        this.success(response.data.obj)
                         this.$message({message:response.data.msg,
                               type: "success"
                        })
                    }else{
                         this.loading1=false
                         this.$message({message:response.data.msg,
                               type: "error"
                        })
                    }
                    
                })
        
        },
        success(file){
            this.fileList.push(file)
            console.log(file)
            this.loading1=false
            this.$message({message: '上传成功',
                           type:'success'})
        },
        handleRemove(file, fileList) {
            let id = file.id
            this.axios.get("removeFile",{params:{id:id}}).then((response)=>{
                let status = response.data.status
                if(status==200){
                    this.fileList.splice(this.fileList.findIndex(v => v.id === id),1)
                    this.$message({message:"已删除",
                               type: "success"
                    })
                
                }else if(status==500){
                    this.$message({message:"删除失败",
                               type: "error"
                    })
                }
            })
            console.log(this.fileList)
        },
        handlePreview(file) {
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
                    this.download(response,file)
                })
            })
            console.log('handlePreview',file);
        },
        
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        };
        },
        loadAll() {
            if(this.$store.state.type==1){
                 return [
                            { "value": "四川大学计算机学院实验室411" },
                            { "value": "四川大学计算机学院办公室328"},
                            { "value": "荣升国际培深教育科技有限公司2703"},
                        ]
            }else{
                return []
            }
        },
        handleSelect(item) {
            console.log(item)
        },

        onEditorBlur(editor){
            //失去焦点事件    
 	    },
        onEditorFocus(editor){
            //获得焦点事件
        },
        onEditorChange({editor,html,text}){
            //编辑器文本发生变化
            //this.content可以实时获取到当前编辑器内的文本内容
            console.log(this.content);
        }
    },
    mounted() {
      this.restaurants = this.loadAll()
      if(this.$store.state.type==1){
            this.uploadShow=true
      }
      if(this.$store.state.update){
            console.log("编辑")
            this.initUpdate(this.$store.state.event)
        }
    },
    components: {
    quillEditor
  }
}
</script>
<style scoped>
#editor{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
#place{
    display: flex;
    flex-direction: row;
    height: 40px;
    width: 100%;
    margin-top: 20px;
    align-items: center;
}
.icon{
    font-size: 20px;
    margin-left: 8px;
}
.inline-input{
    width: 610px;
    margin-left: 30px;
}
#text-edit{
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    width: 100%;
    height: 300px;
}
.quill-editor{
    margin-left: 30px;
    height: 200px;
    width: 610px;
}
#upload{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 60px;
    margin-top: 0px;
    height: 80px;
}

.upload-demo{
    width: 95%;
}
#load{
    height: 40px;
    margin-right: 30px;
}
/* .upload-demo /deep/ .el-upload-list{
    border-style: solid;
    border-color: #e0e0e0;
    border-width: 1px;
    margin-top: 5px;
} */
</style>


