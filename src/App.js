import {useContext, useState} from 'react'
import {Web3Context} from 'web3-hooks'
import {ethers} from 'ethers'

function App() {
  // utilise web3State via Web3Context (https://github.com/AbsoluteVirtueXI/web3-hooks/blob/main/src/useWeb3.js)
  const [web3State, login] = useContext(Web3Context)
  //recupere la balance de l’address By default  Balance à 0
  const [ethBalance, setEthBalance] = useState(0)
  // Via la doc ethers.io pr avoir une address by default ethers.constants.AddressZero)
  const [address, setAddress] = useState(ethers.constants.AddressZero)
  // Utiliser le state pr send eth
  const [eth2Send, setEth2Send] = useState(0)

  //fct qui recupere la balance de l’adress passer en input
  const handleClickGetBalance = async () => {
    try{
      // fct async qui va chercher la balance de l’address via web3State.provider.getBalance(address) se referrer au git 
      const balance = await web3State.provider.getBalance(address)
      // Nous retourne un bigNumber donc on le set ac ethers.utils.formatEther pr avoir une lecture en ether se referer à la doc ethers.io
      setEthBalance(ethers.utils.formatEther(balance))
    }catch(e){
      console.log(e)
    }
  }

  const handleClickSend = async() => {
    // Reconvertir en BigNumber pr l’envoi des ethers ac parseEthers (voir librairies ethers.io)
    const weiAmount = ethers.utils.parseEther(eth2Send)
    try {
      // SendTransac utiliser signer.sendTransaction(voir le github)
      const tx = await web3State.signer.sendTransaction({to: address, value: weiAmount})
      // attendre quelque bloc avant de send pr etre sur que l’on est pas dans un fork
      await tx.wait() 
      console.log('TX mined')
      //gestion des erreurs regarder ds l’objet et souvent code. ...
    }catch(e){
      console.log(e)
    }
  }


  return (
    <>
    {/* Est ce que la personne à metamask */}
      <p>MetaMask installed: {web3State.isMetaMask ? 'yes' : 'no'}</p>
      {/* Est ce que web 3 est injecté  */}
      <p>Web3: {web3State.isWeb3 ? 'injected' : 'no-injected'}</p>
      {/* demander à la personne si elle de se logger à notre Dapp */}
      {!web3State.isLogged && (
        <>
          <button onClick={login}>login</button>
        </>
      )}
      {/* Sur quelle id le chiffre qui correspond au network 1 => mainNet, 2 => Rinkeby... sommes nous  */}
      <p>Network id : {web3State.chainId}</p>
      {/* Sur quelle testNet ou mainNet sommes-nous */}
      <p>Network name : {web3State.networkName}</p>
      {/* Quelle est l’account connecter à notre web3 */}
      <p>account : {web3State.account}</p>
      {/* Savoir quelle est la balance de l’utilisateur */}
      <p>Balance : {web3State.balance}</p>
      {/* Recupere une address eth pr savoir la balance */}
      <label htmlFor="balanceOf">balanceOf</label>
      <input 
      type="text" 
      id="balanceOf" 
      value={address} 
      placeholder="ethereum address" 
      // On change set l’address à chaque chgmnt
      onChange={(e) => setAddress(e.target.value)} />
      {/* Button pr recuperer la balance de l’address recuperer au dessus */}
      {/* fct handleClickGetBalance pr recupere */}
      <button onClick={handleClickGetBalance}>get balance</button>
      {/* Affiche la balance */}
      <p>Balance of {address}: {ethBalance} ether</p>
      
      <label htmlFor="eth2Send">send to: {address}</label>
      <input 
      type="text" 
      id="eth2Send" 
      value={eth2Send} 
      placeholder="ethereum amount" 
      // On  set l’eth suivant l’amount à chaque chgmnt
      onChange={(e) => setEth2Send(e.target.value)} />
      {/* Button pr send à l’address recuperer au dessus */}
      {/* fct handleClickGetBalance pr recupere */}
      <button onClick={handleClickSend}>send</button>
    </>
  );
}

export default App;
