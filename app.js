
// --------------------------------------------
// U38建立一個叫 movie_list 的資料夾
// 在這個資料夾裡透過 npm 安裝 Node.js、Express、與 nodemon
// 建立 app.js 這個文件，載入 Express
// 建立 localhost 伺服器，並設定 port 3000 監聽
// 透過 nodemon 來啟動伺服器
// 在瀏覽器檢視伺服器的回應

const express = require('express')
const mongoose = require('mongoose')

// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantsData = require("./restaurant.json").results
const app = express()


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

const port = 3000

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
// app.engine：透過這個方法來定義要使用的樣板引擎，
// 第一個參數是這個樣板引擎的名稱
// 第二個參數是放入和此樣板引擎相關的設定。這裡設定了預設的佈局（default layout）需使用名為 main 的檔案。
// 宣告預設請用名為 main.handlebars 這支檔案當作佈局
// app.set：透過這個方法告訴 Express 說要設定的 view engine 是 handlebars。

app.use(express.static('public'))



// setting the route and corresponding response
app.get('/', (req, res) => {
  // const restList = [{
  //   "id": 1,
  //   "name": "靠北",
  //   "name_en": "Sababa Pita Bar",
  //   "category": "中東料理",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5635/01.jpg",
  //   "location": "台北市羅斯福路三段 283 巷 17 號",
  //   "phone": "02 2363 8009",
  //   "google_map": "https://goo.gl/maps/BJdmLuVdDbw",
  //   "rating": 4.1,
  //   "description": "沙巴巴批塔是台灣第一家純手工批塔專賣店,只選用最新鮮的頂級原料,以及道地的中東家傳配方。"
  // },
  // {
  //   "id": 2,
  //   "name": "梅子鰻蒲燒專賣店",
  //   "name_en": "Umeko Japanese Unagi House",
  //   "category": "日本料理",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5628/02.jpg",
  //   "location": "台北市中山區林森北路 107 巷 8 號",
  //   "phone": " 02 2521 2813",
  //   "google_map": "https://goo.gl/maps/cUJEmFSRKyH2",
  //   "rating": 4.3,
  //   "description": "鰻魚、鰻魚飯、真空鰻魚"
  // },
  // {
  //   "id": 3,
  //   "name": "ZIGA ZIGA",
  //   "name_en": "Ziga Zaga",
  //   "category": "義式餐廳",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5629/03.jpg",
  //   "location": "台北市信義區松壽路 2 號",
  //   "phone": "02 2720 1230",
  //   "google_map": "https://goo.gl/maps/bnZKC2YjYZp",
  //   "rating": 4.2,
  //   "description": "以頂級食材與料理技法完美呈現各類經典義式料理，獅頭造型烤爐現作pizza與開放式廚房現作龍蝦茄汁雞蛋銀絲麵是不可錯過的必嚐推薦！夜間國際級樂團的熱力演出，感受活力四射的現場魅力。"
  // },
  // {
  //   "id": 4,
  //   "name": "艾朋牛排餐酒館",
  //   "name_en": "A Point Steak & Bar",
  //   "category": "美式",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5630/04.jpg",
  //   "location": "110 台北市信義區忠孝東路五段 139 號 2 樓",
  //   "phone": "02 2756 7788",
  //   "google_map": "https://goo.gl/maps/6Lq7U2ahp152",
  //   "rating": 4.2,
  //   "description": "從味蕾開始，重拾美味感動。艾朋牛排餐酒館對高級料理的細選珍饌堅持，更勇於翻脫新意，要以平易親人的親切風格，同時不失料理獨家精髓，成功打動每吋挑剔味蕾，讓每位顧客享用鮮嫩Steak牛排風采，咀嚼Pasta義大利麵層次風味！"
  // },
  // {
  //   "id": 5,
  //   "name": "靠不",
  //   "name_en": "Gusto Pizza",
  //   "category": "義式餐廳",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5631/05.jpg",
  //   "location": "北市中正區連雲街 74 號",
  //   "phone": "02 2358 7001",
  //   "google_map": "https://goo.gl/maps/rqzbVyrR9Gp",
  //   "rating": 4.7,
  //   "description": "我們的披薩師傅從倫敦帶來別於一般口味的經典義大利披薩，而且披薩麵團至少發酵24小時。同時我們也窯烤麵包及甜點，但披薩才是GUSTO最強項。我們製做的每一份餐點，都充滿飽飽的口味及香氣。除此之外，遵循純手工及傳統方式製作是我們的堅持。"
  // },
  // {
  //   "id": 6,
  //   "name": "WXYZ Bar",
  //   "name_en": "WXYZ Bar",
  //   "category": "酒吧",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5632/06.jpg",
  //   "location": "台北市中山區雙城街",
  //   "phone": "02 7743 9999",
  //   "google_map": "https://goo.gl/maps/rFLNu87ruBM2",
  //   "rating": 4.3,
  //   "description": "紅酒吧，現代創意料理，開胃小館。提供純素選擇，提供無麩質選擇，提供素食選擇。"
  // },
  // {
  //   "id": 7,
  //   "name": "Fika Fika Cafe",
  //   "name_en": "Fika Fika Cafe",
  //   "category": "咖啡",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5633/07.jpg",
  //   "location": "台北市中山區伊通街 33 號",
  //   "phone": "02 2507 0633",
  //   "google_map": "https://goo.gl/maps/Y1iyiSK7EeR2",
  //   "rating": 4.3,
  //   "description": "我們在乎每一位顧客、賣出去的每一滴咖啡、每一粒咖啡豆。而今，「Fika Fika Cafe Online Store」更期望把如此美好的體驗，分享給喜歡我們的每一位顧客，希望您無論在世界的哪一個角落，都能與我們一起享受「Fika Fika」的美好時光。"
  // },
  // {
  //   "id": 8,
  //   "name": "布娜飛比利時啤酒餐廳",
  //   "name_en": "Bravo Beer",
  //   "category": "義式餐廳",
  //   "image": "https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5634/08.jpg",
  //   "location": "台北市松山區市民大道四段 185 號",
  //   "phone": "02 2570 1255",
  //   "google_map": "https://goo.gl/maps/V9mKwVJ4s5v",
  //   "rating": 4.7,
  //   "description": "我們希望帶給您的，不只是啤酒，有美食，還有一份對生活的熱情。 義大利語「Bravo」的原意─「喝采」、「讚揚」， 我想著如果有一個大家都能輕鬆品嚐美酒、享受美食的地方，那就真的是太棒了！ 因為這個念頭，加上一股對比利時啤酒的熱情， 於是「Bravo Beer布娜飛比利時啤酒餐廳」在2006年誕生了..."
  // }]


  res.render('index', { rests: restaurantsData })
})


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
  // }

  const rest = restaurantsData.find(rest => rest.id.toString() === req.params.rest_id)

  res.render('show', { rest: rest })
})

// function returnToRestaurantList() {
//   window.location.href = "/"; // 重定向到餐厅列表页面
// }

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