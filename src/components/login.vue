<template>
    <div class="login-box">
        <div class="log-brand" >
            <img src="/static/img/calendar.png" style="width:80px;height:auto;">
            <span style="text-align: center" >登    陆</span>
        </div>
        <div class="log-in">
        <el-form label-position="top" label-width="80px" >
            <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="password"></el-input>
            </el-form-item>
            <el-form-item class="log-button">
                <el-button type="primary" @click="onSubmit">登陆</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        onSubmit (){
            let username = this.username
            let password = this.password
            this.axios.post('/login',{
                username: username,
                password: password
            }).then((responce)=>{
                console.log(responce.data)
                let status = responce.data.status
                // let user=responce.data.obj.user
                // let token=responce.data.obj.token
                // console.log("login"+token)
                if(status==200){
                    this.$store.commit('login',responce.data.obj)
                    this.$router.push('/home')
                }else if(status==500){
                    this.$message({message:"用户名不存在或密码错误",
                               type: "error"
                    })
                }
            })
            
        }
    }
}
</script>
<style scoped>
.login-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    border-style: solid;
    border-width: 1px;
    border-color: #e0e0e0;
    position:fixed;
    width: 30%;
    left: 35%;
    top: 15%;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2);
  
}
.log-brand{
    display: flex;
    flex-direction: column;
    font-size: 25px;
    color: #606266;
}
.log-in{
    width: 100%;
}
.log-button{
    text-align: center
}
</style>

