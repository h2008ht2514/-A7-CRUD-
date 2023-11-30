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

//search function
// 對 name 屬性按字母順序進行排序
// Search restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase();

  if (!keyword) {
    return res.redirect("/");
  }

  // 假設你有一個變數 sortType 用來標記排序方式
  const sortType = req.query.sortType;
  console.log("req.query", req.query)

  if (sortType === 'AtoZ') {
    // 如果按 A 到 Z 排序被選擇
    res.render('index', { restaurants: sortedRestaurants, sortByAZ: true, keyword });
  } else {
    // 如果按 A 到 Z 排序未被選擇
    res.render('index', { restaurants: restaurants, sortByAZ: false, keyword });
  }

  // 對 name 屬性按字母順序進行排序
  Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } }
    ]
  })
    .collation({ locale: 'en', strength: 2 }) // 設定排序的collation，strength: 2表示不區分大小寫
    .sort({ name: 1 }) // 1表示升序，-1表示降序
    .lean()
    .then(filteredRests => {
      if (filteredRests.length !== 0) {
        res.render('index', { restaurants: filteredRests, keyword });
      } else {
        res.render('no-results', { keyword });
      }
    })
    .catch(err => console.log(err));
});

module.exports = router

