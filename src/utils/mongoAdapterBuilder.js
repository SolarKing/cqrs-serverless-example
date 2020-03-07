const { MongoClient } = require("mongodb")
const uuid = require('uuid/v4')
const Promise = require('bluebird')

const mongoAdapterBuilder = {
  build: async ({ entityName }, { url, dbName } = {}) => {

    let client
    let eventsCollection
    let projectionCollection
    let metadataCollection
    
    let listeners = {}
    let notifyListeners = commit => Object.values(listeners).map(func => func(commit))

    try {
      client = await MongoClient.connect(url)
      const db = client.db(dbName)
      eventsCollection = db.collection(`events:${entityName}`)
      projectionCollection = db.collection(`projections:${entityName}`)
      metadataCollection = db.collection(`metadata:${entityName}`)
    } catch (error) {
      console.error(error)
      throw new Error("Issue connecting to Mongo client")
    }

    return {
      // write model methods
      addListener: (id, func) => {
        listeners[id] = func
      },
      removeListener: id => {
        delete listeners[id]
      },
      parseCommit: c => c,
      listCommits: async ({ commitId = '0' } = {}) => {
        const foundCommits = await eventsCollection.find({
          commitId: { $gt: commitId }
        }).toArray()
        // console.log("listCommits", {commitId, foundCommits})
        return foundCommits
      },
      loadEvents: async (id, version = 0) => {
        // console.log("loadEvents", { id, version })
        const foundEvents = await eventsCollection.find({
          id,
          version: { $gte: version }
        }).toArray()
        return foundEvents
      },
      append: async (id, version, events) => {
        const committedAt = Date.now()
        const commitId = `${committedAt}${uuid().split("-").join("")}`
        const commit = {
          id,
          events,
          commitId,
          committedAt,
          entity: entityName,
          version: parseInt(version)
        }
        await eventsCollection.insertOne(commit)
        notifyListeners(commit)
      }, // returns null
      // read model methods (currently in memory projections)
      get: async (id) => {
        const docs = await projectionCollection.find({ id }).toArray()
        // console.log("get", { id, docs, doc: docs[0] })
        return docs[0]
      }, // returns projection
      set: async (id, { version, state }) => {
        // console.log("set", { id, version, state })
        
        await projectionCollection.updateOne({ id }, {
          $set: {
            state,
            version,
          }
        }, {
          upsert: true
        })
        return state
      },
      batchGet: async (ids = []) => {
        const foundProjections = await projectionCollection.find({ $or: ids.map(id => ({ id }))}).toArray()
        return foundProjections
      },
      batchWrite: async (projections) => {
        // console.log('batchWrite', projections)
        await Promise.mapSeries(Object.keys(projections), id => {
          const { version, state } = projections[id]
          // console.log('forEach', { id, version, state })
          return projectionCollection.updateOne(
            { id },
            { $set: { state, version, } },
            { upsert: true }
          )
        })
        return {}
      },
      search: async (params) => {
        const data = await projectionCollection.find(params).toArray()
        // console.log("search", { params, data })
        return {
          data,
          total: data.length,
        }
      },
      // mongo specific methods
      close: async () => client.close(),
      // metadata methods
      setMetadata: async ({ version, state }) => {        
        const metadata = await metadataCollection.updateOne({ id: "metadata" }, {
          $set: {
            state,
            version,
          }
        }, {
          upsert: true
        })
        // console.log("setMetadata", { metadata, version, state })
        return state
      },
      getMetadata: async () => {
        const metadata = await metadataCollection.find({ id: "metadata" }).toArray()
        // console.log("getMetadata", metadata)
        return metadata[0]
      },
    }
  }
}

// TODO: how to get projections and metadata working

module.exports = mongoAdapterBuilder