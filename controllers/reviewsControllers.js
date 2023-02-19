/*  body ={
     content,
     productId
} */
const addReview = async (req, res) => {
  const { content } = req.body
  if (!content)
    return res.status(400).json({ message: "All fields are required" })
  const sender = req.userId
  req.product.reviews.push({
    sender,
    content,
  })
  await req.product.save()

  res.status(201).json({ message: "New comment created" })
}
/* 
     body={
          reviewId,
          productId
     }
*/
const deleteReview = async (req, res) => {
  if (req.selectedReview.sender !== req.userId && req.role !== 1960)
    return res
      .status(401)
      .json({ message: "You are not allowed to delete this review" })
  await req.selectedReview.remove()
  await req.product.save()
  res.status(200).json({ message: "Item deleted successfully" })
}
/* 
     body={
          reviewId,
          productId,
          content
     }
*/
const editReview = async (req, res) => {
  const { content } = req.body
  if (!content) return res.sendStatus(400)
  if (req.selectedReview.sender !== req.userId && req.role !== 1960)
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this review" })
  req.selectedReview.content = content
  await req.product.save()
  res.status(200).json({ message: "Updated" })
}
/* 
     params ={ 
          productId
     }
*/
const getReviews = async (req, res) => {
  const product = await req.product.populate("reviews.sender", "name -_id")
  res.status(200).json(product.reviews)
}

module.exports = {
  addReview,
  editReview,
  getReviews,
  deleteReview,
}
