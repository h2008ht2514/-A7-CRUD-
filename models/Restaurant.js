// 這個檔案會代表 Todo model，以後每一種資料都會有一個獨立文件來管理

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
// 至於 r 是否需要大寫，這取決於你在 Restaurant.js 中導出的是什麼。
// 在 Restaurant.js 中，你使用 module.exports = mongoose.model('Restaurant', restaurantSchema) 導出了一個名為 Restaurant 的模型，
// 因此在引入時使用相同的名稱 Restaurant 是合適的。大小寫在這裡是敏感的，所以確保它和導出的名稱一致。