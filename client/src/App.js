import "./App.css";
import game from "./PhaserGame";
import Caver from "caver-js";

function App() {
  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const account = window.klaytn.selectedAddress;

        const caver = new Caver(window.klaytn);
        const balance = await caver.klay.getBalance(account);
        console.log(balance);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className='App'>
      <button onClick={connectToWallet}>지갑 연결</button>
    </div>
  );
}

export default App;
