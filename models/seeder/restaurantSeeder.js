// 設定資料庫連線
// 請把 app.js 裡和「資料庫連線」有關的程式碼都複製過來一份，另外，也要一併載入 Todo model，因為這裡要操作的資料和 Todo 有關。
const mongoose = require('mongoose')
const Restaurant = require('../restaurant') //載入model
const restaurantList = require("../../restaurant.json").results
// Node.js 似乎在某些作業系統環境下，在引入檔案時是不會區分大小寫的 (case insensitive)，所以才會明明檔名是 Restaurant.js 但 require("../restaurant") 也可以。


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

// 接下來要寫「新增資料」的腳本了，這段程式碼要寫在哪裡呢？它應該是「成功連線資料庫」之後執行的動作，因此讓我們把它寫在 db.once() 的 callback 函式裡。

// 連線異常:在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生，語法的意思是「只要有觸發 error 就印出 error 訊息」。
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功，針對「連線成功」的 open 情況，我們也註冊了一個事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，由於 once 設定的監聽器是一次性的，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('running rest script...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})

// Restaurant.create(restaurantList): 使用 create 方法將 restaurantList 中的資料新增到資料庫中。
// .then(() => {...}): 當新增操作成功完成時，執行的 callback 函式。在這裡，它印出一條訊息，然後關閉資料庫連線。
// .catch(err => console.log(err)): 當新增操作發生錯誤時，印出錯誤訊息。
