import { PinataSDK } from "pinata-web3";

console.log({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY,
});

const pinata = new PinataSDK({
    pinataJwt: process.env.REACT_APP_PINATA_JWT,
    pinataGateway: process.env.REACT_APP_PINATA_GATEWAY,
});

// Function to upload JSON to IPFS
export async function uploadJSONToIPFS(jsonData) {
    try {
        const result = await pinata.upload.json(jsonData);
        return result;
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
}
