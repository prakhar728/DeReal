import { Contract, ethers, Log } from "ethers";

import myContract from "../assets/contracts/DeReal.json";

let contract = ""


export async function initListeners(settriggerCapture) {
    if (contract) return;

    let provider = new ethers.InfuraWebSocketProvider(11155420, process.env.REACT_APP_INFURA_PROVIDER)
    
    contract = new Contract(process.env.REACT_APP_DEPLOYED_CONTRACT, myContract.abi, provider);

    contract.on("CamerasTriggered", (event) => {
        console.log(event);
        
        settriggerCapture(true);
    });
}


export async function triggerPhotos() {
    
}