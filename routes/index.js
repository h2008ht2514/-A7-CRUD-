// 引用 Express 與 Express 路由器
const express = require('express');
const router = express.Router();

// 準備引入路由模組

// 回到總路由器 routes/index.js 來設定 home 模組：

// 引入 home 模組程式碼
const home = require('./modules/home')

const restaurants2 = require('./modules/restaurants')

// 將網址結構符合 / 字串的 request 導向 home 模組 
// 如果request路徑是"/"，就執行modules/home裡的程式碼
router.use('/', home)
// 確認功能不變
// 修改以後，記得把 app.js 裡的首頁路由刪掉，然後打開你的瀏覽器，看看首頁是否依然正常。如果正常運作，就代表你的路由器已經運作起來了！


//  將網址結構符合 /restaurants 字串開頭的 request 導向 restaurants2 模組 
router.use('/restaurants', restaurants2)

// 在此加入搜尋路由
router.use('/search', restaurants2);

// 匯出路由器
module.exports = router;





//
