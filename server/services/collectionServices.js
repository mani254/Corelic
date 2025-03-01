const Collection = require('../schema/collectionSchema');

class CollectionService {
   getMatchState(query) {
      const { search, status, showInHome } = query;
      let matchStage = {};

      if (search && search.trim() !== "") {
         matchStage.title = { $regex: search, $options: 'i' };
      }

      if (status) matchStage.status = status;

      if (showInHome) matchStage.showInHome = showInHome;

      return matchStage;
   }

   async fetchCollections(query) {
      try {
         const { sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10 } = query;

         const fetchingOptions = {
            _id: 1,
            title: 1,
            status: 1,
            image: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            showInHome: 1
         };

         const pageNumber = parseInt(page, 10) || 1;
         const pageSize = parseInt(limit, 10) || 10;
         const skip = (pageNumber - 1) * pageSize;

         const matchStage = this.getMatchState(query);

         const pipeline = [
            { $match: matchStage },
            {
               $facet: {
                  totalItems: [{ $count: 'count' }],
                  collections: [
                     { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
                     { $skip: skip },
                     { $limit: pageSize },
                     { $project: fetchingOptions }
                  ]
               }
            },
            {
               $project: {
                  totalItems: { $arrayElemAt: ['$totalItems.count', 0] },
                  collections: 1
               }
            }
         ];

         const result = await Collection.aggregate(pipeline);
         if (!result[0].totalItems) {
            return { totalItems: 0, collections: [] };
         }
         return result[0] || { totalItems: 0, collections: [] };

      } catch (error) {
         console.error('Error while fetching collections:', error);
         throw new Error(error.message);
      }
   }

   async addCollection(collectionData) {
      try {
         const newCollection = await Collection.create(collectionData);
         return newCollection
      }
      catch (err) {
         console.error('error while adding collection', err)
         throw new Error(err.message)
      }
   }

   async checkCollectionById(id) {
      try {
         return await Collection.findById(id);
      } catch (error) {
         console.error("Error checking collection by ID:", error);
         throw new Error(error.message);
      }
   }

   async checkMultipleCollectionsById(ids) {
      try {
         return await Collection.find({ _id: { $in: ids } }, { title: 1, _id: 1 })
      }
      catch (error) {
         console.error("Error checking multiple collection IDs:", error);
         throw new Error(error.message);
      }
   }

   async deleteCollectionById(id) {
      try {
         return await Collection.findByIdAndDelete(id);
      } catch (error) {
         console.error("Error deleting collection:", error);
         throw new Error(error.message);
      }
   }

   async deleteMultipleCollectionsById(ids) {
      try {
         const validCollections = await this.checkMultipleCollectionsById(ids)
         const validCollectionIds = validCollections.map(collection => collection._id.toString());
         const invalidCollectionIds = ids.filter(id => !validCollectionIds.includes(id));

         if (validCollectionIds.length > 0) {
            await Collection.deleteMany({ _id: { $in: validCollectionIds } });
         }

         return { deletedCollections: validCollections, invalidCollections: invalidCollectionIds };

      } catch (error) {
         console.error("Error deleting multiple collections:", error);
         throw new Error(error.message);
      }
   }


   async updateCollectionStatus(id, status) {
      try {
         return await Collection.findByIdAndUpdate(id, { status }, { new: true }); // Return updated collection
      } catch (error) {
         console.error("Error updating collection status:", error);
         throw new Error(error.message);
      }
   }

   async changeMultipleCollectionStatus(ids, status) {
      try {
         const validCollections = await this.checkMultipleCollectionsById(ids);
         const validCollectionIds = validCollections.map(collection => collection._id.toString());
         const invalidCollectionIds = ids.filter(id => !validCollectionIds.includes(id));

         if (validCollectionIds.length > 0) {
            await Collection.updateMany({ _id: { $in: validCollectionIds } }, { status });
         }

         return { updatedCollections: validCollections, invalidCollections: invalidCollectionIds };
      } catch (error) {
         console.error("Error updating multiple collection statuses:", error);
         throw new Error(error.message);
      }
   }


}

module.exports = new CollectionService();
