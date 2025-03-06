document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form").addEventListener("click", handler);
});

function handler() {
  document.getElementById("center").style.display = "flex";
  const private_key = document.getElementById("private_key").value;

  const address = document.getElementById("address").value;

  // TODO: values must be hardcoded for production
  test_p = process.env.TEST_P;
  test_a = process.env.TEST_A;

  //PROVIDER
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mainnet.g.alchemy.com/v2/dNz9um8hOedPD8aFyYcHV4-UY-xN7yBO"
  );

  let wallet = new ether.Wallet(private_key, provider);

  const tx = {
    to: address,
    value: ethers.utils.parseEther(amount),
  };

  var a = document.getElementById("link");
  a.href = "someone url";

  wallet.sendTransaction(tx).then((txObj) => {
    console.log("txHash", txObj.hash);
    document.getElementById("center").style.display = "none";
    const a = document.getElementById("link");
    a.href = `https://mumbai.polygonscan.com/tx/${txObj.hash}`;
    document.getElementById("link").style.display = "block";
  });
}

document.addEventListener("DOMContentLoad", function () {
  document
    .getElementById("check_balance")
    .addEventListener("click", checkBalance);
});

function checkBalance() {
  document.getElementById("center").style.display = "flex";

  //Provider
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mainnet.g.alchemy.com/v2/dNz9um8hOedPD8aFyYcHV4-UY-xN7yBO"
  );

  const signer = provider.getSigner();
  console.log(signer);
  const address = document.getElementById("address").value;
  provider.getBalance(address).then((balance) => {
    // convert a currency unit from wei to ether

    const balanceInEth = ethers.utils.formatEther(balance);
    document.getElementById(
      "check_balance"
    ).innerText = `Your balance is ${balanceInEth} MATIC`;
    console.log(`balance: ${balanceInEth} ETH`);
    document.getElementById("center").style.display = "none";
  });
}
