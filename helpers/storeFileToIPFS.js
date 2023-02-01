import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET;

const authorization =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const storeFileToIPFS = async (file) => {
  if (!projectId || !projectSecret)
    throw new Error(
      'Invalid/Missing environment variable: "INFURA_PROJECT_ID or INFURA_API_KEY_SECRET"'
    );

  let ipfs;

  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
      },
    });

    const result = await ipfs.add(file);
    return `https://earthverse.infura-ipfs.io/ipfs/${result.path}`;
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }
};

export default storeFileToIPFS;
