function validateCollection(req, res, next) {
   try {
      const { title, status, showInHome } = req.body

      if (!title || !status) {
         return res.status(400).json({ message: "title is required" })
      }

      if (status && !['active', 'inactive'].includes(status.toLowerCase())) {
         return res.status(400).json({ message: "invalid status, allowed values: active, inactive" })
      }

      req.body.status = status.toLowerCase()
      req.body.metaData = {
         metaTitle: req.body.metaTitle,
         metaDescription: req.body.metaDesscription
      }

      next()

   }
   catch (err) {
      console.error('error while validating the collection', err.message)
      return res.status(500).json({ message: 'internal server error', error: err.message })
   }
}

module.exports = validateCollection