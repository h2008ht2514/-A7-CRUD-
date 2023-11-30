const express = require('express')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const handlebarsHelpers = require('handlebars-helpers')();

// 引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')

// 對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數。
require('./config/mongoose')


const exphbs = require('express-handlebars')

const app = express()
const port = 3000


app.engine("handlebars", exphbs({ defaultLayout: "main", helpers: handlebarsHelpers }))


app.set("view engine", "handlebars")
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

// 將 request 導入路由器
app.use(routes)


//-------------------------------------------------------
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})