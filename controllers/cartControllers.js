const getAll = async (req, res) => {
  const user = await req.user.populate(
    "cart.product",
    "-reviews -discount -description"
  )
  res.status(200).json(user.cart)
}

const addToCart = async (req, res) => {
  const { product, quantity } = req.body
  if (!product || !quantity) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const cart = await req.cart
  const existingItem = cart.find((item) => item.product == product)
  if (existingItem) {
    const foundItem = cart.id(existingItem._id)
    foundItem.quantity += 1
    const result = await req.user.save()
    return res.status(201).json({ message: "Item has been added to your cart" })
  }
  const newItem = await cart.push({
    product,
    quantity,
  })
  await req.user.save()
  res.status(201).json({ message: "Item has been added to your cart" })
}

const deleteFromCart = async (req, res) => {
  const { id } = req.body
  const cart = req.cart
  await cart.pull(id)
  await req.user.save()
  res.sendStatus(200)
}

const updateQty = async (req, res) => {
  const { id, newQty } = req.body
  const cart = req.cart
  const foundItem = cart.id(id)
  if (!foundItem) return res.sendStatus(400)
  foundItem.quantity = newQty
  await req.user.save()
  res.sendStatus(200)
}

const clearCart = async (req, res) => {
  const cart = req.cart
  cart = []
  await req.user.save()
  res.sendStatus(200)
}

module.exports = {
  clearCart,
  updateQty,
  addToCart,
  deleteFromCart,
  getAll,
}
