import clientPromise from "../../helpers/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("Earthverse");

  switch (req.method) {
    case "POST":
      const bodyObject = JSON.parse(req.body);
      const postEarthverse = await db
        .collection("earthverse")
        .insertOne(bodyObject);
      res.json({ status: 200, data: postEarthverse });
      break;
    case "GET":
      const getEarthverse = await db
        .collection("earthverse")
        .find({})
        .toArray();
      res.json({ status: 200, data: getEarthverse });
      break;
  }
}
