import Vue from 'vue'
import Vuex from 'vuex'
import '../lib/sockjs'
import '../lib/stomp'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            // id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
            // name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
            // userface: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userface,
            // username: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).username,
        },
        token: null,
        update: false,
        event:null,
        type:1,
        stomp:null,
        message:false,
        msg:'',
        isConnect:false,
        cardIsShow:false,
        subscribe:false
    },
    mutations: {
        login(state, data){
            // console.log(data)
            state.user = data.user
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.token = data.token;
            state.token = data.token;
          },
        logout(state){
        window.localStorage.removeItem('user')
        localStorage.removeItem('token')
        state.token = null
        state.user = null
        },
        typeChange(state,type){
            state.type=type
        },
        updateEvent(state,data){
            state.update=data.update
            if(data.event){
                state.event=data.event
            }
        },
        receiveMessage(state,data){
            
            state.message=data.massage
            state.msg=data.msg
        },
        connectToggle(state,value){
            state.isConnect=value
        },
        isSubscribe(state){
            state.subscribe=!state.subscribe
        }
    },
    actions:{
        connect(context){
            // console.log("action")
            context.state.stomp = Stomp.over(new SockJS("/ws/endpointChat"))
            context.state.stomp.connect({},frame=>{
                    console.log('Connected: ' + frame)
                    context.commit('connectToggle', true)
                    // 客户端订阅消息的目的地址：此值BroadcastCtl中被@SendTo("/topic/getResponse")注解的里配置的值
                    context.state.stomp.subscribe('/topic/getResponse', function(respnose){ 
                        let data={
                            massage:true,
                            msg:respnose.body
                        }
                        context.commit('receiveMessage',data)
                })
            })
         }
    }

})