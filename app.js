const express = require('express')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const exphbs = require('express-handlebars')

const app = express()
const port = 3000

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})

app.get("/restaurants/new", (req, res) => {
  return res.render("new")
})

//接住 新增餐廳
app.post("/restaurants", (req, res) => {
  return Restaurant.create(req.body) //存入資料庫
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('show', (restaurantData)))
    .catch(err => console.log(err))
})

app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('edit', (restaurantData)))
    .catch(err => console.log(error))
})

app.put("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params //從動態路由參數中解構出 restaurantId 的值。

  console.log("Received data to update:", req.body);
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    // .lean()
    .then((restaurantData) => res.redirect(`/restaurants/${restaurantId}`))
    .catch(err => console.log(err))
})

// Delete:
app.delete("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  // Restaurant.findByIdAndDelete(restaurantId)
  Restaurant.findById(restaurantId)
    .then(restaurantData => restaurantData.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(error))
})



app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (!keyword) {
    return res.redirect("/");
  }
  const filteredRests = restaurantsData.filter((item => {
    return (item.name.toLowerCase().includes(keyword)
      || item.category.toLowerCase().includes(keyword)
    )
  }))

  if (filteredRests.length !== 0) {
    res.render('index', { rests: filteredRests, keyword })
  } else {
    res.render('no-results', { keyword })
  }
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})