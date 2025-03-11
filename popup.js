// We can't use require in browser extensions, so we'll use a different approach
// for environment variables if needed

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form").addEventListener("click", handler);
  document.getElementById("check_balance").addEventListener("click", checkBalance);
  
  // Clear status on input changes
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      setStatusMessage('');
    });
  });
});

function setStatusMessage(message, isError = false) {
  const statusElement = document.getElementById("status-message");
  statusElement.textContent = message;
  statusElement.style.color = isError ? '#ff5555' : '#00ff75';
  statusElement.style.textAlign = 'center';
  statusElement.style.padding = message ? '10px 0' : '0';
}

function handler() {
  // Hide any previous transaction link
  document.getElementById("link").style.display = "none";
  setStatusMessage('');
  
  // Show loader
  document.getElementById("center").style.display = "flex";
  
  const private_key = document.getElementById("private_key").value.trim();
  const address = document.getElementById("address").value.trim();
  const amount = document.getElementById("amount").value;

  if (!private_key || !address || !amount) {
    setStatusMessage('Please fill in all fields', true);
    document.getElementById("center").style.display = "none";
    return;
  }

  try {
    // Validate inputs
    if (!ethers.utils.isAddress(address)) {
      throw new Error("Invalid recipient address");
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new Error("Amount must be a positive number");
    }
    
    // PROVIDER
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/dNz9um8hOedPD8aFyYcHV4-UY-xN7yBO"
    );

    let wallet;
    try {
      wallet = new ethers.Wallet(private_key, provider);
    } catch (e) {
      throw new Error("Invalid private key");
    }

    const tx = {
      to: address,
      value: ethers.utils.parseEther(amount),
    };

    wallet.sendTransaction(tx)
      .then((txObj) => {
        console.log("txHash", txObj.hash);
        document.getElementById("center").style.display = "none";
        setStatusMessage('Transaction sent successfully!');
        
        const link = document.getElementById("link");
        link.href = `https://mumbai.polygonscan.com/tx/${txObj.hash}`;
        link.style.display = "block";
        
        // Clear the form
        document.getElementById("amount").value = "";
        document.getElementById("private_key").value = "";
      })
      .catch((error) => {
        console.error("Transaction error:", error);
        document.getElementById("center").style.display = "none";
        setStatusMessage(`Transaction failed: ${error.message}`, true);
      });
  } catch (error) {
    console.error("Validation error:", error);
    document.getElementById("center").style.display = "none";
    setStatusMessage(error.message, true);
  }
}

function checkBalance() {
  // Hide any previous transaction link
  document.getElementById("link").style.display = "none";
  setStatusMessage('');
  
  // Show loader
  document.getElementById("center").style.display = "flex";
  
  const address = document.getElementById("address").value.trim();
  
  if (!address) {
    setStatusMessage("Please enter an address to check balance", true);
    document.getElementById("center").style.display = "none";
    return;
  }

  try {
    // Validate address
    if (!ethers.utils.isAddress(address)) {
      throw new Error("Invalid address format");
    }
    
    // Provider
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/dNz9um8hOedPD8aFyYcHV4-UY-xN7yBO"
    );

    provider.getBalance(address)
      .then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance);
        const formattedBalance = parseFloat(balanceInEth).toFixed(6);
        document.getElementById("check_balance").innerText = `Balance: ${formattedBalance} MATIC`;
        setStatusMessage(`Address contains ${formattedBalance} MATIC`);
        console.log(`balance: ${balanceInEth} MATIC`);
        document.getElementById("center").style.display = "none";
      })
      .catch((error) => {
        console.error("Balance check error:", error);
        document.getElementById("center").style.display = "none";
        setStatusMessage(`Failed to check balance: ${error.message}`, true);
      });
  } catch (error) {
    console.error("Validation error:", error);
    document.getElementById("center").style.display = "none";
    setStatusMessage(error.message, true);
  }
}
