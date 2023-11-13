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