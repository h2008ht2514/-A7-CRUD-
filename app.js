
// --------------------------------------------
// U38建立一個叫 movie_list 的資料夾
// 在這個資料夾裡透過 npm 安裝 Node.js、Express、與 nodemon
// 建立 app.js 這個文件，載入 Express
// 建立 localhost 伺服器，並設定 port 3000 監聽
// 透過 nodemon 來啟動伺服器
// 在瀏覽器檢視伺服器的回應

const express = require('express')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
// ? ./? 載入Restaurant  model
const bodyParser = require('body-parser')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 在這裡就有連線到資料庫，所以後續的Restaurant.find({})才能正常作用哦！
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
// mongoose.connect 是 Mongoose 提供的方法，當程式執行到這一行指令時，就會與資料庫連線。在這裡我們需要告知程式要去哪些尋找資料庫，因此需要傳入連線字串。

// require express-handlebars here
const exphbs = require('express-handlebars')
// const restaurantsData = require("./restaurant.json").results

const app = express()
const port = 3000


// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常:在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生，語法的意思是「只要有觸發 error 就印出 error 訊息」。
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功，針對「連線成功」的 open 情況，我們也註冊了一個事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，由於 once 設定的監聽器是一次性的，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
// app.engine：透過這個方法來定義要使用的樣板引擎，
// 第一個參數是這個樣板引擎的名稱
// 第二個參數是放入和此樣板引擎相關的設定。這裡設定了預設的佈局（default layout）需使用名為 main 的檔案。
// 宣告預設請用名為 main.handlebars 這支檔案當作佈局
// app.set：透過這個方法告訴 Express 說要設定的 view engine 是 handlebars。
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))



// 瀏覽全部餐廳
// 在你的路由中，你使用了 restaurants 這個名稱來傳遞資料給模板，但在模板中你卻使用了 restaurantsData 這個名稱來遍歷資料。這會導致在模板中無法正確訪問資料。
app.get('/', (req, res) => {
  Restaurant.find({})//取出
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
  // res.render('index', { rests: restaurantsData })
})
// 前面的步驟把資料處理好了，到了 .then() 這一步資料會被放進 todos 變數，你就可以用 res.render('index', { todos }) 把資料傳給 index 樣板。這裡 { todos } 是 { todos: todos } 的縮寫。
// 使用Todo.find()這個語法可以拿到所
// 有的todos資料，這個資料會被放在then括號內的箭頭函式的第一個argument，也就是第一個粗體的todos，接著你可以把這個變數傳進template，就是第二個粗體的地方。

// 新增一筆餐廳
// 設定路由
// 這條路由的工作內容只有一行程式碼，叫 view 引擎去拿 new 樣板，所以接下來要把 new 樣板做好
app.get("/restaurants/new", (req, res) => {
  return res.render("new")
})


// Create 功能：資料庫新增資料
// 首先設定一條新的路由，來接住表單資料，並且把資料送往資料庫。這個步驟就是 CRUD 裡的 Create 動作。
// 用 req.body 取出表單資料，表單資料會被 Express.js 統一整理在 req.body 裡，而這些屬性名稱 (e.g. name) 是跟著 <input> 框籤上的 name 屬性。
// 拿到 name 之後，可以把這筆資料寫作資料庫。
app.post("/restaurants", (req, res) => {
  // Express.js 要靠 body-parser 來幫忙解析 request body，才能成功把表單資料處理成 req.body：
  // console.log('req.body', req.body)
  // 果然得裝body parser，req.body(新輸入的東東)才出的來
  // req.body {
  // name: 'trtr',
  //   name_en: 'erwerw',
  //     category: 'ewrwe',
  //       image: 'https://pinkpinkteashoppe.com/',
  //         location: '北投區',
  //           phone: '09228623',
  //             google_map: 'https://www.bing.com/ck/a?!&&p=e28b7ded215485b8JmltdHM9MTY5OTkyMDAwMCZpZ3VpZD0yMjA5NzdlZi1hNjc4LTZhOTYtMDA3Ny02NTJjYTdlYzZiMmMmaW5zaWQ9NTI0Mw&ptn=3&ver=2&hsh=3&fclid=220977ef-a678-6a96-0077-652ca7ec6b2c&psq=coco+tea&u=a1aHR0cHM6Ly9jb2NvYnViYmxldGVhLmNvbS8&ntb=1',
  //               rating: '1',
  //                 description: 'dsf'
  return Restaurant.create(req.body) //存入資料庫
    .then(() => res.redirect('/'))  //新增完成後導回首頁
    .catch(err => console.log(err))
})
// ? 何時要{} 何時不用? return Todo.create({ name }) 


app.get('/rest/:rest_id', (req, res) => {
  console.log('req.params', req.params.rest_id)
  // 現在已經可以從 req.params.rest_id 取得使用者當前想要讀取的編號（id），
  // 現在只要把這部電影的資料從 restaurant.json 中篩選出來，再回傳到樣板引擎就可以了。
  // const restOne =
  // {
  //   id: 1,
  //   name: "Sababa 沙巴巴中東美食",
  //   name_en: "Sababa Pita Bar",
  //   category: "中東料理",
  //   image: "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg",
  //   location: "台北市羅斯福路三段 283 巷 17 號",
  //   phone: "02 2363 8009",
  //   google_map: "https://goo.gl/maps/BJdmLuVdDbw",
  //   rating: 4.1,
  //   description: "沙巴巴批塔是台灣第一家純手工批塔專賣店,只選用最新鮮的頂級原料,以及道地的中東家傳配方。"
  const rest = restaurantsData.find(rest => rest.id.toString() === req.params.rest_id)
  res.render('show', { rest: rest })
})

// function returnToRestaurantList() {
//   window.location.href = "/"; // 重定向到餐厅列表页面
// }

// 搜尋餐廳
app.get('/search', (req, res) => {
  // console.log('req.query', req.query)
  // console.log('req.query.keywords', req.query.keywords)
  const keyword = req.query.keyword.trim().toLowerCase()

  //  // 如果关键字为空（用户没有输入搜索关键字），将用户重定向回初始页面
  if (!keyword) {
    return res.redirect("/");
  }

  const filteredRests = restaurantsData.filter((item => {
    return (item.name.toLowerCase().includes(keyword)
      || item.category.toLowerCase().includes(keyword)

    )
  }))

  if (filteredRests.length !== 0) {
    // 如果没有符合关键字的餐厅，显示消息
    res.render('index', { rests: filteredRests, keyword })
  } else {
    res.render('no-results', { keyword })
  }
  // res.render('index', { rests: filteredRests, keyword: keyword })
})




// Listen the server when it started
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})