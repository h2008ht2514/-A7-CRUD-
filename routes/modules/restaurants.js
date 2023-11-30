// 模組位於 routes / modules / todos.js，
// 一樣在開頭引入 Express 本身、Express 的路由器、Todo model，然後在結尾匯出檔案。

// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用  model
const Restaurant = require('../../models/restaurant')
// ?好像有小寫才不會有紅色底線


//
router.get("/new", (req, res) => {
  return res.render("new")
})

//接住 新增餐廳
router.post("/", (req, res) => {
  return Restaurant.create(req.body) //存入資料庫
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('show', (restaurantData)))
    .catch(err => console.log(err))
})

router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('edit', (restaurantData)))
    .catch(err => console.log(error))
})

router.put("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params //從動態路由參數中解構出 restaurantId 的值。

  console.log("Received data to update:", req.body);
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    // .lean()
    .then((restaurantData) => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// Delete:
router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  // Restaurant.findByIdAndDelete(restaurantId)
  Restaurant.findById(restaurantId)
    .then(restaurantData => restaurantData.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(error))
})


// Search restaurants
// router.get('/', (req, res) => {
//   const keyword = req.query.keyword.trim().toLowerCase();

//   if (!keyword) {
//     return res.redirect("/");
//   }

//   Restaurant.find({
//     $or: [
//       { name: { $regex: keyword, $options: 'i' } }, // 不區分大小寫的模糊搜尋
//       { category: { $regex: keyword, $options: 'i' } }
//     ]
//   })
//     .lean()
//     .then(filteredRests => {
//       if (filteredRests.length !== 0) {
//         res.render('index', { restaurants: filteredRests, keyword });
//       } else {
//         res.render('no-results', { keyword });
//       }
//     })
//     .catch(err => console.log(err));
// });




//
module.exports = router