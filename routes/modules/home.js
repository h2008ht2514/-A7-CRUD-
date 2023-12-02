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

// 在路由 /search 中處理使用者的選擇
// 在路由 /search 中处理用户的选择

// 在路由 /search 中處理使用者的選擇
router.get('/search', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim().toLowerCase() : '';
  const sortType = req.query.sortType;

  if (!keyword && !sortType) {
    return res.redirect("/");
  }

  // 如果選擇 "A > Z" 或 "Z > A"
  if (sortType === 'az' || sortType === 'za') {
    const sortOrder = sortType === 'az' ? 1 : -1;

    Restaurant.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    })
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: sortOrder })
      .lean()
      .then(sortedRestaurants => {
        console.log(sortedRestaurants);
        res.render('index', { restaurants: sortedRestaurants, sortByAZ: sortType === 'az', keyword });
      })
      .catch(err => console.log(err));
  } else {
    // 如果選擇其他排序方式，執行原有的搜索邏輯
    Restaurant.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    })
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 })
      .lean()
      .then(filteredRests => {
        console.log(filteredRests);
        if (filteredRests.length !== 0) {
          res.render('index', { restaurants: filteredRests, keyword });
        } else {
          res.render('no-results', { keyword });
        }
      })
      .catch(err => console.log(err));
  }
});


// router.get('/search', (req, res) => {
//   const keyword = req.query.keyword ? req.query.keyword.trim().toLowerCase() : '';
//   const sortType = req.query.sortType;

//   if (!keyword && !sortType) {
//     return res.redirect("/");
//   }

//   // 如果选择 "A > Z" 或 "Z > A"
//   if (sortType === 'az' || sortType === 'za') {
//     const sortOrder = sortType === 'az' ? 1 : -1;

//     const query = {
//       $or: [
//         { name: { $regex: keyword, $options: 'i' } },
//         { category: { $regex: keyword, $options: 'i' } }
//       ]
//     };

//     // 添加额外的条件，确保只有英文餐廳受到排序影响
//     if (sortType === 'za') {
//       // 如果是 "Z > A" 且是英文餐廳，将排序条件改为反向
//       query.$or.push({
//         name: { $regex: keyword, $options: 'i', $not: /[^\x00-\x7F]/ },
//         $where: `this.name.match(/^\\w+$/) !== null`
//       });
//     } else {
//       // 如果是 "A > Z"，添加额外的条件，确保只有英文餐廳受到排序影响
//       query.$or.push({ name: { $regex: keyword, $options: 'i', $not: /[^\x00-\x7F]/ } });
//     }

//     Restaurant.find(query)
//       .collation({ locale: 'en', strength: 2 })
//       .sort({ name: sortOrder })
//       .lean()
//       .then(sortedRestaurants => {
//         console.log(sortedRestaurants);
//         res.render('index', { restaurants: sortedRestaurants, sortByAZ: sortType === 'az', keyword });
//       })
//       .catch(err => console.log(err));
//   } else {
//     // 如果选择其他排序方式，执行原有的搜索逻辑
//     Restaurant.find({
//       $or: [
//         { name: { $regex: keyword, $options: 'i' } },
//         { category: { $regex: keyword, $options: 'i' } }
//       ]
//     })
//       .collation({ locale: 'en', strength: 2 })
//       .sort({ name: 1 })
//       .lean()
//       .then(filteredRests => {
//         console.log(filteredRests);
//         if (filteredRests.length !== 0) {
//           res.render('index', { restaurants: filteredRests, keyword });
//         } else {
//           res.render('no-results', { keyword });
//         }
//       })
//       .catch(err => console.log(err));
//   }
// });




module.exports = router

