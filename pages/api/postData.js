export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      walletAddress,
      chosenSquares: words,
      ipfs3RandomWordsLink,
      imageURL,
      ipfsCameraLink,
      imageAvatarURL,
      ipfsAvatarLink,
      price,
    } = req.body;

    saveDatabase(
      walletAddress,
      words,
      ipfs3RandomWordsLink,
      imageURL,
      ipfsCameraLink,
      imageAvatarURL,
      ipfsAvatarLink,
      price
    );
    res.status(200).send({ message: "Your Data has been saved successfully" });
  } else {
    res.status(401).send({ message: "Only POST requests allowed" });
  }
}

async function saveDatabase(
  walletAddress,
  words,
  ipfs3RandomWordsLink,
  imageURL,
  ipfsCameraLink,
  imageAvatarURL,
  ipfsAvatarLink,
  price
) {
  let res = await fetch("http://localhost:3000/api/connectDB", {
    method: "POST",
    body: JSON.stringify({
      walletAddress: walletAddress,
      words: words,
      ipfs3RandomWordsLink: ipfs3RandomWordsLink,
      imageURL: imageURL,
      ipfsCameraLink: ipfsCameraLink,
      imageAvatarURL: imageAvatarURL,
      ipfsAvatarLink: ipfsAvatarLink,
      price: price,
    }),
  });

  res = await res.json();
}
