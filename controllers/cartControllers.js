const getAll = async (req, res) => {
  const cart = req.cart
  if (!cart?.length)
    return res.status(404).json({ message: "Your cart is Empty" })
  res.status(200).json(cart)
}

const addToCart = async (req, res) => {
  const { title, image, quantity, price, source } = req.body
  if (!title || !image || !quantity || !price || !source) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const cart = req.cart
  const newItem = await cart.push({
    title,
    image,
    quantity,
    price,
    source,
  })
  await req.user.save()
  res.sendStatus(201)
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
