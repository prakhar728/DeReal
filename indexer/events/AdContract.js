async function beginIndexingAdContract(provider, contract, db, iface) {
  console.log("Listening to AdContract Listeners");

  contract.on("AdSubmitted", async (ipfsLink, event) => {
    // user: address
    // postId: BigNumber
    // isEventPost: boolean
    // event: Event object (automatically added by ethers.js)

    const collection = db.collection("EventLogs_AdSubmitted");

    const adDetails = await (
      await fetch(
        `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${ipfsLink}`
      )
    ).json();

    const log = {
      transcationHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber,
      companyName: adDetails.companyName,
      description: adDetails.description,
      adDomain: adDetails.adDomain,
      hashtags: adDetails.hashtags,
      websiteLink: adDetails.websiteLink,
      bannerImage: adDetails.bannerImage,
    };

    await collection.insertOne(log);
  });
}

module.exports = { beginIndexingAdContract };
