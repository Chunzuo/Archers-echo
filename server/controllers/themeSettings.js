const { ThemeSetting } = require("../database/models")

exports.info = (req, res) => {
  ThemeSetting.find().then(result => {
    res.json(result[0])
  }).catch(error => {
    res.status(500).json(error)
  })
}

exports.update = (req, res) => {
  ThemeSetting.update({}, req.body, { upsert: true }).then(result => {
    res.json(result)
  }).catch(error => {
    res.status(500).json(error)
  })
}