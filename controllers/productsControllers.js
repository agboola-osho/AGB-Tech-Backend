const Product = require("../model/Product")
const User = require("../model/User")

// @ desc get all products
// @route /GET /product
// access public
const getAllProducts = async (req, res) => {
  const result = await Product.find().select("-reviews")
  res.status(200).json(result)
}

// @ desc delete product
// @route /DELETE /product
// access private
const deleteProduct = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "id is required" })
  }

  const id = req.body.id

  const product = await Product.findById(id)

  if (!product) {
    return res.status(404).json({ message: "No product was found" })
  }
  const result = await product.deleteOne()
  const users = await User.find({ "cart.product": id })
  users.forEach((user) => {
    const item = user.cart.find((item) => item.product == id)
    user.cart.id(item._id).remove()
    user.save()
  })
  if (!result) {
    return res.status(400).json({ message: "Invalid Id" })
  }

  res.status(202).json({ message: `${result.title} has been deleted` })
}

// @ desc update product
// @route /PATCH /product
// access private
const updateProduct = async (req, res) => {
  const { title, description, images, price, category, brand, id, discount } =
    req.body
  if (
    !title ||
    !description ||
    !price ||
    !category ||
    !brand ||
    !id ||
    !discount ||
    !images
  ) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const product = await Product.findById(id).exec()
  if (!product) {
    return res
      .status(400)
      .json({ message: "No product maches the id provided" })
  }
  product.title = title
  product.description = description
  product.price = price
  product.category = category
  product.brand = brand
  product.discount = discount
  if (images?.length) product.images = images
  await product.save()
  res.status(200).json({ message: `${product.title} updated` })
}

// @ desc create product
// @route /POST /product
// access private
const createNewProduct = async (req, res) => {
  const { title, description, images, price, category, brand, discount } =
    req.body
  if (
    !title ||
    !description ||
    !price ||
    !category ||
    !brand ||
    !images ||
    !discount
  ) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const newProduct = await Product.create({
    title,
    description,
    images,
    brand,
    category,
    price,
    discount,
  })
  res.status(201).json({ message: `New product ${newProduct.title}` })
}

// @ desc get product by category
// @route /GET /product/categories/ :category
// access public
const getProductByCategory = async (req, res) => {
  if (!req?.params?.category) {
    return res
      .status(400)
      .json({ message: "The category is required" })
      .select("-reviews")
  }
  const category = req.params.category
  const result = await Product.find({ category }).exec()
  if (!result?.length) {
    return res
      .status(400)
      .json({ message: "No product in that category was found" })
  }
  res.status(200).json(result)
}

const getProductCategories = async (req, res) => {
  const categories = await Product.distinct("category")
  res.status(200).json(categories)
}

const getProductBrands = async (req, res) => {
  const brands = await Product.distinct("brand")
  res.status(200).json(brands)
}

// @ desc get product by brand
// @route /GET /product/brand/:brand
// access public
const getProductByBrand = async (req, res) => {
  if (!req?.params?.brand) {
    return res
      .status(400)
      .json({ message: "Brand is required" })
      .select("-reviews")
  }
  const brand = req.params.brand
  const result = await Product.find({ brand }).select("-reviews").exec()
  if (!result?.length) {
    return res
      .status(400)
      .json({ message: "No product with that brand was found" })
  }
  res.status(200).json(result)
}

// @ desc get product by search
// @route /GET /product/search
// access public
const searchProducts = async (req, res) => {
  const query = req.query.q
  const products = await Product.find().select("-reviews")
  const searchResults = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
  )
  if (!searchResults?.length) {
    return res
      .status(404)
      .json({ message: `No results for ${query} was found` })
  }
  res.status(200).json(searchResults)
}

module.exports = {
  getAllProducts,
  getProductByBrand,
  getProductByCategory,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getProductBrands,
  getProductCategories,
  searchProducts,
}
