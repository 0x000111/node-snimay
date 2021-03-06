const ActivityProxy = require('../../proxy').Activity

function getList (req, res, next) {
  ActivityProxy.get({}, '_id title startTime endTime isVisible').then(function (list) {
    res.render('admin/activity_list', {
      list: list,
      layout: 'admin'
    })
  }).catch(function (err) {
    return next(err)
  })
}

function getAdd (req, res, next) {
  res.render('admin/activity_add', {
    layout: 'admin'
  })
}

function postAdd (req, res, next) {
  const title = req.body.title
  const isVisible = req.body.isVisible
  const endTime = new Date(req.body.endTime)
  const startTime = new Date(req.body.startTime)
  const pic = req.body.pic
  const description = req.body.description
  const content = req.body.content

  const params = {
    title,
    isVisible,
    endTime,
    startTime,
    pic,
    description,
    content
  }

  ActivityProxy.create(params).then(function (model) {
    req.flash('info', {
      message: '添加成功'
    })
    res.redirect('/admin/activity_list')
  }).catch(function (err) {
    return next(err)
  })
}

function getEdit (req, res, next) {
  const _id = req.params._id

  ActivityProxy.getBy_Id(_id).then(function (model) {
    res.render('admin/activity_edit', {
      model: model,
      layout: 'admin'
    })
  }).catch(function (err) {
    return next(err)
  })
}

function postEdit (req, res, next) {
  const _id = req.body._id
  const title = req.body.title
  const isVisible = req.body.isVisible
  const endTime = new Date(req.body.endTime)
  const startTime = new Date(req.body.startTime)
  const pic = req.body.pic
  const description = req.body.description
  const content = req.body.content

  const params = {
    _id,
    title,
    isVisible,
    endTime,
    startTime,
    pic,
    description,
    content
  }

  ActivityProxy.update(params).then(function () {
    req.flash('info', {
      message: '编辑成功'
    })
    res.redirect('/admin/activity_list')
  }).catch(function (err) {
    return next(err)
  })
}

function getRemove (req, res, next) {
  const _id = req.params._id
  ActivityProxy.remove(_id).then(function () {
    req.flash('info', {
      message: '删除成功'
    })
    res.redirect('/admin/activity_list')
  })
}

module.exports = {
  getList,
  getAdd,
  postAdd,
  getEdit,
  postEdit,
  getRemove
}
