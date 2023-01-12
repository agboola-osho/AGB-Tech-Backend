/*  body ={
     content,
     productId
} */
const addReview = async (req, res) => {
  const { content } = req.body
  if (!content)
    return res.status(400).json({ message: "All fields are required" })
  const sender = req.name
  const newReview = req.reviews.push({
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
  if (req.selectedReview.sender !== req.name || req.role === 1960)
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this review" })
  await req.selectedReview.remove()
  await req.product.save()
  res.sendStatus(200).json({ message: "Item deleted successfully" })
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
  if (req.selectedReview.sender !== req.name || req.role !== 1960)
    return res
      .status(401)
      .json({ message: "You are not allowed to edit this review" })
  req.selectedReview.content = content
  await req.product.save()
  res.status(200).json({ message: "Updated" })
}
/* 
     body ={ 
          productId
     }
*/
const getReviews = async (req, res) => {
  const reviews = req.reviews
  if (!reviews.length)
    return res.status(404).json({ message: "No reviews found" })
  res.status(200).json({ reviews })
}

module.exports = {
  addReview,
  editReview,
  getReviews,
  deleteReview,
}
