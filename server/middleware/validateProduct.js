const validateProduct = (req, res, next) => {
   try {
      const { title, price, sku, stock, vendor, status, options, metaData } = req.body;

      if (!title || !price || !sku || !stock) {
         return res.status(400).json({ message: "Title, price, SKU, and stock are required" });
      }
      if (isNaN(price) || price < 0) {
         return res.status(400).json({ message: "Price must be a valid number greater than or equal to 0" });
      }
      if (isNaN(stock) || stock < 0) {
         return res.status(400).json({ message: "Stock must be a valid number greater than or equal to 0" });
      }
      if (status && !["draft", "active", "inactive"].includes(status.toLowerCase())) {
         return res.status(400).json({ message: "Invalid status. Allowed values: draft, active, inactive" });
      }
      req.body.status = status.toLowerCase()

      // Parse JSON fields safely
      try {
         if (options) req.body.options = JSON.parse(options);
         if (metaData) req.body.metaData = JSON.parse(metaData);
      } catch (error) {
         return res.status(400).json({ message: "Invalid JSON format for options or metaData" });
      }

      next();
   } catch (error) {
      res.status(500).json({ message: "Validation failed", error: error.message });
   }
};

module.exports = validateProduct;
