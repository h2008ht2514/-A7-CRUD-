// 有了路由器之後，讓我們來封裝第一個路由模組 home，這支模組專門管理首頁。

// 在這裡需要引用的檔案有：

// Express 本身
// 呼叫 Express 的路由器功能 - express.Router()
// Restaurant model
// 然後最後要匯出這個路由模組。
// 中間的部分，直接把首頁的路由 GET / 搬進來即可，注意需要依前後文修改變數名稱，把 app.get 改成 router.get：

// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

//  定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})


module.exports = router

