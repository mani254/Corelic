const collectionSchema = require("../schema/collectionSchema");
const collectionServices = require("../services/collectionServices");

const collectionsController = {

   async fetchCollections(req, res) {
      try {
         const { sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10, status } = req.query;

         const allowedSortFields = ['createdAt', 'title']
         if (sortBy && !allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: "Invalid sort field. Allowed fields: createdAt,title" });
         }

         if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
            return res.status(400).json({ message: "Invalid sort order. Allowed values: asc, desc." });
         }

         const pageNumber = parseInt(page, 10);
         const pageSize = parseInt(limit, 10)
         if (isNaN(pageNumber) || isNaN(pageSize) || pageSize < 1) {
            return res.status(400).json({ message: "Page and limit must be valid positive numbers." });
         }

         if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
         }

         const data = await collectionServices.fetchCollections(req.query)

         return res.status(200).json({ message: 'Collections fetched successfully', collections: data.collections, totalItems: data.totalItems })

      }
      catch (err) {
         console.error('error while fetching collections', err)
         return res.status(500), json({ message: 'internal server error', error: err.message })
      }
   },

   async addCollection(req, res) {
      try {
         const collectionData = req.body;

         if (!req.file) {
            return res.status(400).json({ message: "Atleast one image is required" })
         }

         const image = {
            path: req.file.path,
            alt: collectionData.title
         }
         collectionData.image = image

         const newCollection = await collectionServices.addCollection(collectionData)

         res.status(201).json({ message: 'Collection added successfully', collection: newCollection })

      }
      catch (error) {
         console.error("Error adding Collection:", error);
         res.status(500).json({ message: "Internal server error", error: error.message });
      }
   },

   async deleteCollection(req, res) {
      try {
         const { id } = req.params;

         const collection = await collectionServices.checkCollectionById(id)
         if (!collection) {
            return res.status(404).json({ message: "Collection does not exist" });
         }

         const delCollection = await collectionServices.deleteCollectionById(id);
         res.status(204).json({ message: "Collection deleted successfull", collection: delCollection });
      }
      catch (err) {
         console.error("Error deleting collection:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async deleteMultipleCollections(req, res) {
      try {
         const { ids } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of collection IDs." });
         }

         const { deletedCollections, invalidCollections } = await collectionServices.deleteMultipleCollections(ids);

         res.status(207).json({
            message: "Collections deletion process completed.",
            deletedCollections,
            invalidCollections
         });

      } catch (err) {
         console.error("Error deleting multiple collections:", err);
         res.status(500).json({ message: err.message });
      }
   },

   async changeCollectionStatus(req, res) {
      try {
         const { id } = req.params;
         const { status } = req.body;

         // Check if collection exists
         const collection = await collectionServices.checkCollectionById(id);
         if (!collection) {
            return res.status(404).json({ message: "Collection does not exist" });
         }

         // Update collection status
         const updatedCollection = await collectionServices.updateCollectionStatus(id, status);
         return res.status(200).json({
            message: "Collection status updated successfully",
            collection: updatedCollection
         });

      } catch (err) {
         console.error("Error updating collection status:", err);
         res.status(500).json({ message: err.message });
      }
   },


   async changeMultipleCollectionStatus(req, res) {
      try {
         const { ids, status } = req.body;

         if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Invalid request. Provide an array of collection IDs." });
         }

         const { updatedCollections, invalidCollections } = await collectionServices.changeMultipleCollectionStatus(ids, status);

         res.status(207).json({
            message: "Collections status update completed.",
            updatedCollections,
            invalidCollections
         });

      } catch (err) {
         console.error("Error updating multiple collection statuses:", err);
         res.status(500).json({ message: err.message });
      }
   }

}


module.exports = collectionsController
