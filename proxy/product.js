const models = require('../models');
const Product = models.Product;
const _ = require('lodash')

/**
 * 根据产品类别，获取产品的数量
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - count, 产品的数量
 * @param {Number} pid 产品类别 0.全部1.产品体验2.定制家具3.配套家具
 * @param {Function} callback 获取消息数量
 */
exports.getProductCount = function (pid, callback) {
    if (pid) {
        Product.count({
            pid: pid,
            isVisible: 1
        }, callback);
    } else {
        Product.count({isVisible: 1}, callback);
    }
};

/**
 * 根据产品Id获取产品
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - product, 产品的数量
 * @param {Number} id 产品类别 0.全部1.产品体验2.定制家具3.配套家具
 * @param {Function} callback 获取的产品
 */
exports.getProductById = function (id, callback) {
    Product.findOne({
        Id: id
    }, callback);
}


/**
 * 根据产品类别获取产品列表
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - products, 产品列表
 * @param {Number} cid 产品类别 0.全部1.产品体验2.定制家具3.配套家具
 * @param {Function} callback 获取消息数量
 */
exports.getProductByType = function (cid, callback) {
    if (cid) {
        Product.find({
            cid: cid
        }, callback);
    } else {
        Product.find({}, callback);
    }
};

/**
 * 根据条件联合分类表，标签表获取产品列表
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - result, 产品列表
 * @param {Function} callback 回调函数
 * @param {String} p_select 产品查询字段 如：'_id pid cid code skPic description price title lastModifyTime tags'
 * @param {String} c_select 分类查询字段 如：'reid tag title'
 * @param {String} t_select 标签查询字段 如：'reid tag title'
 * @param {Object} p_options 产品查询条件 如：{_id: { $gt: 0 }, isVisible: 1}
 * @param {Object} c_options 分类查询条件 如：{rank: 2}
 * @param {Object} t_options 标签查询条件 如：{rank: 2}
 * @param {Object} c_t_sort 标签和分类排序 如：{ sort: -1 }
 * @param {Object} p_sort 标签和分类排序 如：{ sort: -1 }
 */
exports.getProducts = function (callback, {p_select, c_select, t_select, p_options, c_options, t_options, c_t_sort, p_sort} = { p_select: '_id pid cid code skPic description price title lastModifyTime tags', c_select: 'reid tag title', t_select: 'reid tag title', p_options: { _id: { $gt: 0 }, isVisible: 1 }, c_options: { rank: 2, isVisible: 1 }, t_options: { rank: 2, isVisible: 1 }, c_t_sort: { sort: -1 }, p_sort: { sort: '-lastModifyTime' } }) {
    Product.find(p_options, p_select, p_sort).populate({ path: 'cid', match: c_options, select: c_select, options: { sort: c_t_sort } }).populate({ path: 'tags', match: t_options, select: t_select, options: { sort: c_t_sort } }).exec(callback);
};


/**
 * 分页获取产品
 * 
 * @param {any} select
 * @param {any} pageIndex
 * @param {any} pageSize
 * @param {any} options
 * @param {any} callback
 */
exports.getProductsByPage = function (select, pageIndex, pageSize, options, callback) {
    var numToSkip = (pageIndex - 1) * pageSize;
    Product.find(_.assign({ _id: { $gt: 0 }, isVisible: 1 }, options), select).skip(numToSkip).limit(pageSize).exec(callback);
}


/**
 * 新增和保存
 * 
 * @param {any} pid
 * @param {any} cid
 * @param {any} tags
 * @param {any} title
 * @param {any} content
 * @param {any} price
 * @param {any} description
 * @param {any} sliderPics
 * @param {any} skPic
 * @param {any} code
 * @param {any} count
 * @param {any} isVisible
 * @param {any} callback
 */
exports.newAndSave = function (pid, cid, tags, title, content, price, description, sliderPics, skPic, code, count, isVisible, callback) {
    var product = new Product();
    product.pid = pid;
    product.cid = cid;
    product.tags = tags;
    product.title = title;
    product.search = nodejieba.cut(sentence, true);
    product.content = content;
    product.price = price;
    product.description = description;
    product.sliderPics = sliderPics;
    product.skPic = skPic;
    product.code = code;
    product.count = count;
    product.isVisible = isVisible;

    product.save(callback);
};