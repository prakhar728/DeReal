async function beginIndexingDeReal(provider, contract, db, iface) {
  console.log("Listening to DeReal Listeners");

  contract.on("PostCreated", async (user, postId, isEventPost, event) => {
    const collection = db.collection("EventLogs_PostCreated");

    const log = {
      transcationHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber,
      createdBy: user,
      postId: parseInt(postId),
      isEventPost: isEventPost,
    };

    await collection.insertOne(log);
  });

  contract.on(
    "EventTriggered",
    async (triggeredBy, timestamp, eventId, event) => {

      const collection = db.collection("EventLogs_EventTriggered");

      const log = {
        transcationHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
        triggeredBy: triggeredBy,
        timestamp: parseInt(timestamp),
        eventId: eventId,
      };

      await collection.insertOne(log);
    }
  );
}


module.exports = { beginIndexingDeReal };
