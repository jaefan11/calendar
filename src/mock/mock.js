import moment from 'moment'
const Mock = require('mockjs') // 获取mock对象
const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档
const domain = 'http://localhost:8080' // 定义默认域名，随便写
const code = 200 // 返回的状态码

var id=2
// 随机生成文章数据
const postData = req => {
  
  console.log(req) // 请求体，用于获取参数

  let posts = [] // 用于存放文章数据的数组
  
  for (let i = 0; i < 10; i++) {
    let post = {
      title: Random.csentence(10, 25), // 随机生成长度为10-25的标题
      icon: Random.dataImage('250x250', '文章icon'), // 随机生成大小为250x250的图片链接
      author: Random.cname(), // 随机生成名字
      date: Random.date() + ' ' + Random.time() // 随机生成年月日 + 时间
    }

    posts.push(post)
  }
  
  // 返回状态码和文章数据posts
  return {
    code,
    posts
  }
}
const events=[
              {
                id: 2,
                title: '会议',
                start: "2019-02-20 10:30",
                end: "2019-02-21 01:00",
                allDay: true,
                backgroundColor: '#78A6F4',
                borderColor: '#78A6F4',
                place: '荣升国际培深教育科技有限公司2703',
                content: '请与会人员统筹安排好相关工作，准时参会，14:50之前入场完毕。确因特殊原因不能参会者，请提前请假，并告知党政办公室（联系电话：68752802）。',
                fileList: [{
                  name: 'food.jpeg',
                  url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                  }, {
                  name: 'food2.jpeg',
                  url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                  },],
                  persons:[]
                
              }, 
              {
                id: 1,
                title: 'event2',
                start: "2019-02-21 10:30",
                backgroundColor: '#78A6F4',
                borderColor: '#78A6F4',
                place: '试验室',
                fileList: [],
                persons:[]
              },
              ]
const generatePerson=()=>{
  let persons=[]
  for(let i=0;i<30;i++){
    let person={
      key: i,
      label: Random.cname(),
      url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514093920321&di=913e88c23f382933ef430024afd9128a&imgtype=0&src=http%3A%2F%2Fp.3761.com%2Fpic%2F9771429316733.jpg",
      type:Random.integer( 0,4 )
    }
    persons.push(person)
  }
  return persons
}
const persons=generatePerson()
// 定义请求链接，类型，还有返回数据
// Mock.mock('/loadEvents',/post|get/i, ()=>{return events});

// Mock.mock('/addEvent',/post|get/i, (req)=>{
//   let event=JSON.parse(req.body)
//   event.id=++id
//   let value=event.persons
//   event.persons=[]
//   for(let i=0;i<value.length;i++){

//     event.persons.push(persons[value[i]])
//   }
//   events.push(event)
//   console.log(events)
//   return true});

Mock.mock('/upLoad',/post|get/i, (req)=>{
  console.log(req.body)
  return {
    code:200,
    url:""
  }});

  Mock.mock('/personDataIni',/post|get/i, (req)=>{
    return persons});
