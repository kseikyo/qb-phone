var SelectedCryptoTab = Config.DefaultCryptoPage;
var ActionTab = null;
var Coinbase = {
  IsSignedIn: false,
  Wallet: null,
};
const CDP = window.CDP;

// Runtime diagnostic for Coinbase CDP availability
(function () {
  try {
    if (typeof CDP !== "undefined") {
      console.info("CDP global detected in NUI:", CDP);
      if (typeof CDP.getCurrentUser === "function") {
        // call but don't block; log whatever comes back (may be null if not signed in)
        CDP.getCurrentUser()
          .then(function (u) {
            console.info("CDP.getCurrentUser():", u);
          })
          .catch(function (err) {
            console.warn("CDP.getCurrentUser() error:", err);
          });
      } else {
        console.info("CDP.getCurrentUser is not a function (CDP API surface may differ)");
      }
    } else {
      console.warn(
        "CDP global not found. Ensure the module import in index.html runs before NUI scripts."
      );
    }
  } catch (e) {
    console.error("CDP runtime diagnostic threw:", e);
  }
})();

$(".cryptotab-" + SelectedCryptoTab).css({ display: "block" });
$(".crypto-header-footer")
  .find('[data-cryptotab="' + SelectedCryptoTab + '"]')
  .addClass("crypto-header-footer-item-selected");

var CryptoData = [];
CryptoData.Portfolio = 0;
CryptoData.Worth = 1000;
CryptoData.WalletId = null;
CryptoData.History = [];

function SetupCryptoData(Crypto) {
  CryptoData.History = Crypto.History;
  CryptoData.Portfolio = Crypto.Portfolio.toFixed(6);
  CryptoData.Worth = Crypto.Worth;
  CryptoData.WalletId = Crypto.WalletId;

  $(".crypto-action-page-wallet").html(
    "Wallet: " + CryptoData.Portfolio + " Qbit('s)"
  );
  $(".crypto-walletid").html(CryptoData.WalletId);
  $(".cryptotab-course-list").html("");
  if (CryptoData.History.length > 0) {
    CryptoData.History = CryptoData.History.reverse();
    $.each(CryptoData.History, function (i, change) {
      var PercentageChange =
        ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
      var PercentageElement =
        '<span style="color: green;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg);" class="fas fa-arrow-right"></i> +(' +
        Math.ceil(PercentageChange) +
        "%)</span>";
      if (PercentageChange < 0) {
        PercentageChange = PercentageChange * -1;
        PercentageElement =
          '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg);" class="fas fa-arrow-right"></i> -(' +
          Math.ceil(PercentageChange) +
          "%)</span>";
      }
      var Element =
        '<div class="cryptotab-course-block">' +
        '<i class="fas fa-exchange-alt"></i>' +
        '<span class="cryptotab-course-block-title">Value change</span>' +
        '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$' +
        change.PreviousWorth +
        '</span> to <span style="font-size: 1.3vh;">$' +
        change.NewWorth +
        "</span>" +
        PercentageElement +
        "</span>" +
        "</div>";

      $(".cryptotab-course-list").append(Element);
    });
  }

  $(".crypto-portofolio").find("p").html(CryptoData.Portfolio);
  $(".crypto-course")
    .find("p")
    .html("$" + CryptoData.Worth);
  $(".crypto-volume")
    .find("p")
    .html("$" + Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function UpdateCryptoData(Crypto) {
  CryptoData.History = Crypto.History;
  CryptoData.Portfolio = Crypto.Portfolio.toFixed(6);
  CryptoData.Worth = Crypto.Worth;
  CryptoData.WalletId = Crypto.WalletId;

  $(".crypto-action-page-wallet").html(
    "Wallet: " + CryptoData.Portfolio + " Qbit('s)"
  );
  $(".crypto-walletid").html(CryptoData.WalletId);
  $(".cryptotab-course-list").html("");
  if (CryptoData.History.length > 0) {
    CryptoData.History = CryptoData.History.reverse();
    $.each(CryptoData.History, function (i, change) {
      var PercentageChange =
        ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
      var PercentageElement =
        '<span style="color: green; font-weight: bolder;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg); "class="fas fa-arrow-right"></i> +(' +
        Math.ceil(PercentageChange) +
        "%)</span>";
      if (PercentageChange < 0) {
        PercentageChange = PercentageChange * -1;
        PercentageElement =
          '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg); "class="fas fa-arrow-right"></i> -(' +
          Math.ceil(PercentageChange) +
          "%)</span>";
      }
      var Element =
        '<div class="cryptotab-course-block">' +
        '<i class="fas fa-exchange-alt"></i>' +
        '<span class="cryptotab-course-block-title">Value change</span>' +
        '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$' +
        change.PreviousWorth +
        '</span> to <span style="font-size: 1.3vh;">$' +
        change.NewWorth +
        "</span>" +
        PercentageElement +
        "</span>" +
        "</div>";

      $(".cryptotab-course-list").append(Element);
    });
  }

  $(".crypto-portofolio").find("p").html(CryptoData.Portfolio);
  $(".crypto-course")
    .find("p")
    .html("$" + CryptoData.Worth);
  $(".crypto-volume")
    .find("p")
    .html("$" + Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function RefreshCryptoTransactions(data) {
  $(".cryptotab-transactions-list").html("");
  if (data.CryptoTransactions.length > 0) {
    data.CryptoTransactions = data.CryptoTransactions.reverse();
    $.each(data.CryptoTransactions, function (i, transaction) {
      var Title =
        "<span style='color: green; font-weight: bolder;'>" +
        transaction.TransactionTitle +
        "</span>";
      if (
        transaction.TransactionTitle == "Sold" ||
        transaction.TransactionTitle == "Transferred"
      ) {
        Title =
          "<span style='color: red; font-weight: bolder;'>" +
          transaction.TransactionTitle +
          "</span>";
      }
      var Element =
        '<div class="cryptotab-transactions-block"> <i class="fas fa-exchange-alt"></i> <span class="cryptotab-transactions-block-title">' +
        Title +
        '</span> <span class="cryptotab-transactions-block-happening">' +
        transaction.TransactionMessage +
        "</span></div>";

      $(".cryptotab-transactions-list").append(Element);
    });
  }
}

$(document).on("click", ".crypto-header-footer-item", function (e) {
  e.preventDefault();

  var CurrentTab = $(".crypto-header-footer").find(
    '[data-cryptotab="' + SelectedCryptoTab + '"]'
  );
  var SelectedTab = this;
  var HeaderTab = $(SelectedTab).data("cryptotab");

  if (HeaderTab !== SelectedCryptoTab) {
    $(CurrentTab).removeClass("crypto-header-footer-item-selected");
    $(SelectedTab).addClass("crypto-header-footer-item-selected");
    $(".cryptotab-" + SelectedCryptoTab).css({ display: "none" });
    $(".cryptotab-" + HeaderTab).css({ display: "block" });
    SelectedCryptoTab = $(SelectedTab).data("cryptotab");
  }
});

$(document).on("click", ".cryptotab-general-action", function (e) {
  e.preventDefault();

  var Tab = $(this).data("action");

  $(".crypto-action-page").css({ display: "block" });
  $(".crypto-action-page").animate(
    {
      left: 0,
    },
    300
  );
  $(".crypto-action-page-" + Tab).css({ display: "block" });
  QB.Phone.Functions.HeaderTextColor("black", 300);
  ActionTab = Tab;
});

$(document).on("click", "#cancel-crypto", function (e) {
  e.preventDefault();

  $(".crypto-action-page").animate(
    {
      left: -30 + "vh",
    },
    300,
    function () {
      $(".crypto-action-page-" + ActionTab).css({ display: "none" });
      $(".crypto-action-page").css({ display: "none" });
      ActionTab = null;
    }
  );
  QB.Phone.Functions.HeaderTextColor("white", 300);
});

function CloseCryptoPage() {
  $(".crypto-action-page").animate(
    {
      left: -30 + "vh",
    },
    300,
    function () {
      $(".crypto-action-page-" + ActionTab).css({ display: "none" });
      $(".crypto-action-page").css({ display: "none" });
      ActionTab = null;
    }
  );
  QB.Phone.Functions.HeaderTextColor("white", 300);
}

$(document).on("click", "#buy-crypto", function (e) {
  e.preventDefault();

  var Coins = $(".crypto-action-page-buy-crypto-input-coins").val();
  var Price = Math.ceil(Coins * CryptoData.Worth);

  if (Coins !== "" && Price !== "") {
    if (QB.Phone.Data.PlayerData.money.bank >= Price) {
      $.post(
        "https://qb-phone/BuyCrypto",
        JSON.stringify({
          Coins: Coins,
          Price: Price,
        }),
        function (CryptoData) {
          if (CryptoData !== false) {
            UpdateCryptoData(CryptoData);
            CloseCryptoPage();
            QB.Phone.Data.PlayerData.money.bank =
              parseInt(QB.Phone.Data.PlayerData.money.bank) - parseInt(Price);
            QB.Phone.Notifications.Add(
              "fas fa-university",
              "QBank",
              "&#36; " + Price + ",- has been withdrawn from your balance!",
              "#badc58",
              2500
            );
          } else {
            QB.Phone.Notifications.Add(
              "fas fa-chart-pie",
              "Crypto",
              "You don't have enough money..",
              "#badc58",
              1500
            );
          }
        }
      );
    } else {
      QB.Phone.Notifications.Add(
        "fas fa-chart-pie",
        "Crypto",
        "You don't have enough money..",
        "#badc58",
        1500
      );
    }
  } else {
    QB.Phone.Notifications.Add(
      "fas fa-chart-pie",
      "Crypto",
      "Fill out all fields!",
      "#badc58",
      1500
    );
  }
});

$(document).on("click", "#sell-crypto", function (e) {
  e.preventDefault();
  if (e.handled !== true) {
    e.handled = true;

    var Coins = $(".crypto-action-page-sell-crypto-input-coins").val();
    var Price = Math.ceil(Coins * CryptoData.Worth);

    if (Coins !== "" && Price !== "") {
      if (CryptoData.Portfolio >= parseInt(Coins)) {
        $.post(
          "https://qb-phone/SellCrypto",
          JSON.stringify({
            Coins: Coins,
            Price: Price,
          }),
          function (CryptoData) {
            if (CryptoData !== false) {
              UpdateCryptoData(CryptoData);
              CloseCryptoPage();
              QB.Phone.Data.PlayerData.money.bank =
                parseInt(QB.Phone.Data.PlayerData.money.bank) + parseInt(Price);
              QB.Phone.Notifications.Add(
                "fas fa-university",
                "QBank",
                "&#36; " + Price + ",- has been added to your balance!",
                "#badc58",
                2500
              );
            } else {
              QB.Phone.Notifications.Add(
                "fas fa-chart-pie",
                "Crypto",
                "You don't have enough Qbits..",
                "#badc58",
                1500
              );
            }
          }
        );
      } else {
        QB.Phone.Notifications.Add(
          "fas fa-chart-pie",
          "Crypto",
          "You don't have enough Qbits..",
          "#badc58",
          1500
        );
      }
    } else {
      QB.Phone.Notifications.Add(
        "fas fa-chart-pie",
        "Crypto",
        "Fill out all fields!",
        "#badc58",
        1500
      );
    }
    CloseCryptoPage();
    e.handled = false;
  }
});

$(document).on("click", "#transfer-crypto", function (e) {
  e.preventDefault();
  var Coins = $(".crypto-action-page-transfer-crypto-input-coins").val();
  var WalletId = $(".crypto-action-page-transfer-crypto-input-walletid").val();

  if (Coins !== "" && WalletId !== "") {
    if (CryptoData.Portfolio >= Coins) {
      if (WalletId !== CryptoData.WalletId) {
        // Ask server for recipient's on-chain wallet address. Server will return WalletAddress or error codes.
        $.post(
          "https://qb-phone/TransferCrypto",
          JSON.stringify({
            Coins: Coins,
            WalletId: WalletId,
          }),
          function (response) {
            if (response == "notenough") {
              QB.Phone.Notifications.Add(
                "fas fa-chart-pie",
                "Crypto",
                "You don't have enough Qbits..",
                "#badc58",
                1500
              );
              return;
            }
            if (response == "notvalid") {
              QB.Phone.Notifications.Add(
                "fas fa-university",
                "Crypto",
                "this Wallet-ID doesn't exist!",
                "#badc58",
                2500
              );
              return;
            }

            // If server returned an object with WalletAddress, use CDP SDK (cdp-core) to send an on-chain token transfer.
            if (response && response.WalletAddress) {
              (async function () {
                try {
                  const recipientAddress = response.WalletAddress;
                  const coinsStr = String(response.Coins || Coins);

                  // Require CDP functions
                  if (
                    typeof CDP === "undefined" ||
                    typeof CDP.getCurrentUser !== "function" ||
                    typeof CDP.sendEvmTransaction !== "function"
                  ) {
                    QB.Phone.Notifications.Add(
                      "fas fa-exclamation-circle",
                      "Crypto",
                      "CDP SDK not available in NUI.",
                      "#e74c3c",
                      3500
                    );
                    return;
                  }

                  // Get current user and EVM account
                  const user = await CDP.getCurrentUser();
                  const evmAccount = user?.evmAccounts?.[0];
                  if (!evmAccount) {
                    QB.Phone.Notifications.Add(
                      "fas fa-exclamation-circle",
                      "Crypto",
                      "No EVM account available on user.",
                      "#e74c3c",
                      3500
                    );
                    return;
                  }

                  // Build ERC20 transfer data (transfer(address,uint256))
                  const tokenContract =
                    window.QB_COINBASE_CONFIG?.TokenContractAddress;
                  if (!tokenContract) {
                    QB.Phone.Notifications.Add(
                      "fas fa-exclamation-circle",
                      "Crypto",
                      "Token contract address not configured.",
                      "#e74c3c",
                      3500
                    );
                    return;
                  }

                  // Helper: convert decimal string to BigInt with decimals (18)
                  function decimalsToBigInt(amountStr, decimals) {
                    const parts = String(amountStr).split(".");
                    const intPart = parts[0] || "0";
                    let fracPart = parts[1] || "";
                    if (fracPart.length > decimals)
                      fracPart = fracPart.slice(0, decimals);
                    while (fracPart.length < decimals) fracPart += "0";
                    const whole = BigInt(intPart || "0");
                    const fraction = BigInt(fracPart || "0");
                    return whole * 10n ** BigInt(decimals) + fraction;
                  }

                  // Helper: strip 0x
                  function strip0x(hex) {
                    return (hex || "").toString().replace(/^0x/, "");
                  }

                  // Helper: pad to 32 bytes
                  function pad32(hex) {
                    return hex.padStart(64, "0");
                  }

                  const decimals = 18;
                  const amountBigInt = decimalsToBigInt(coinsStr, decimals);

                  // encode transfer(address,uint256) selector + params
                  const selector = "a9059cbb"; // keccak256('transfer(address,uint256)') first 4 bytes
                  const toPadded = pad32(
                    strip0x(recipientAddress).toLowerCase()
                  );
                  const valuePadded = pad32(amountBigInt.toString(16));
                  const data = "0x" + selector + toPadded + valuePadded;

                  const txRequest = {
                    evmAccount: evmAccount,
                    transaction: {
                      to: tokenContract,
                      value: 0n,
                      data: data,
                      // gas/nonce/chainId may be added if necessary
                    },
                  };

                  const result = await CDP.sendEvmTransaction(txRequest);
                  const txHash =
                    (result && result.transactionHash) || result || null;

                  // Notify server that the tx was broadcast and reconcile in-game balances
                  $.post(
                    "https://qb-phone/ConfirmOnchainTransfer",
                    JSON.stringify({
                      targetWallet: recipientAddress,
                      coins: parseFloat(coinsStr),
                      txHash: txHash,
                    }),
                    function () {
                      QB.Phone.Notifications.Add(
                        "fas fa-university",
                        "Crypto",
                        "You transferred " +
                          coinsStr +
                          " to on-chain address " +
                          recipientAddress +
                          " (tx: " +
                          txHash +
                          ")",
                        "#badc58",
                        3500
                      );
                      // Update local UI optimistically
                      CryptoData.Portfolio = (
                        CryptoData.Portfolio - parseFloat(coinsStr)
                      ).toFixed(6);
                      UpdateCryptoData(CryptoData);
                      CloseCryptoPage();
                    }
                  );
                } catch (err) {
                  console.error("CDP transfer failed:", err);
                  QB.Phone.Notifications.Add(
                    "fas fa-exclamation-circle",
                    "Crypto",
                    "On-chain transfer failed.",
                    "#e74c3c",
                    3500
                  );
                }
              })();
            } else {
              // Legacy server response with updated CryptoData
              UpdateCryptoData(response);
              CloseCryptoPage();
              QB.Phone.Notifications.Add(
                "fas fa-university",
                "Crypto",
                "You transferred " + Coins + ",- to " + WalletId + "!",
                "#badc58",
                2500
              );
            }
          }
        );
      } else {
        QB.Phone.Notifications.Add(
          "fas fa-university",
          "Crypto",
          "You can't transfer to yourself..",
          "#badc58",
          2500
        );
      }
    } else {
      QB.Phone.Notifications.Add(
        "fas fa-chart-pie",
        "Crypto",
        "You don't have enough Qbits..",
        "#badc58",
        1500
      );
    }
  } else {
    QB.Phone.Notifications.Add(
      "fas fa-chart-pie",
      "Crypto",
      "Fill out all fields!!",
      "#badc58",
      1500
    );
  }
});

// Replace placeholder with Coinbase SDK integration
// CDP integration: use the functions in docs/cdp-core.md exclusively.
// This code expects the CDP global functions to be available in the NUI
// environment (e.g. signInWithEmail, verifyEmailOTP, getCurrentUser, sendEvmTransaction).
async function connectWallet() {
  if (
    typeof CDP === "undefined" ||
    typeof CDP.signInWithEmail !== "function" ||
    typeof CDP.verifyEmailOTP !== "function"
  ) {
    QB.Phone.Notifications.Add(
      "fas fa-exclamation-circle",
      "Crypto",
      "CDP SDK not available in NUI.",
      "#e74c3c",
      3500
    );
    return;
  }

  try {
    const email = prompt("Enter your email for wallet connection:");
    if (!email) return;

    // Start email OTP flow as documented in cdp-core.md
  const authResult = await CDP.signInWithEmail({ email: email });
    if (!authResult || !authResult.flowId) {
      QB.Phone.Notifications.Add(
        "fas fa-exclamation-circle",
        "Crypto",
        "Failed to start sign-in flow.",
        "#e74c3c",
        3500
      );
      return;
    }

    const otp = prompt("Enter the OTP sent to " + email + ":");
    if (!otp) {
      QB.Phone.Notifications.Add(
        "fas fa-exclamation-circle",
        "Crypto",
        "OTP not provided.",
        "#e74c3c",
        3500
      );
      return;
    }

    const verifyResult = await CDP.verifyEmailOTP({
      flowId: authResult.flowId,
      otp: otp,
    });
    const user = verifyResult && verifyResult.user;
    const evmAccount = user?.evmAccounts?.[0];
    const walletAddress = evmAccount?.address || user?.wallet?.address || null;

    if (walletAddress) {
      // Persist wallet to server side
      $.post(
        "https://qb-phone/SaveWalletAddress",
        JSON.stringify({ address: walletAddress }),
        function (response) {
          QB.Phone.Notifications.Add(
            "fas fa-wallet",
            "Crypto",
            "Wallet connected: " + walletAddress,
            "#badc58",
            2500
          );
        }
      );
    } else {
      QB.Phone.Notifications.Add(
        "fas fa-exclamation-circle",
        "Crypto",
        "Connected but no wallet address found.",
        "#e74c3c",
        3500
      );
    }
  } catch (err) {
    console.error("CDP connect failed:", err);
    QB.Phone.Notifications.Add(
      "fas fa-exclamation-circle",
      "Crypto",
      "Wallet connection failed.",
      "#e74c3c",
      3500
    );
  }
}

async function sendCrypto(recipientAddress, amount) {
  if (
    typeof CDP === "undefined" ||
    typeof CDP.getCurrentUser !== "function" ||
    typeof CDP.sendEvmTransaction !== "function"
  ) {
    QB.Phone.Notifications.Add(
      "fas fa-exclamation-circle",
      "Crypto",
      "CDP SDK or methods not available in NUI.",
      "#e74c3c",
      3500
    );
    return;
  }

  try {
  const user = await CDP.getCurrentUser();
    const evmAccount = user?.evmAccounts?.[0];
    if (!evmAccount) {
      QB.Phone.Notifications.Add(
        "fas fa-exclamation-circle",
        "Crypto",
        "No EVM account available on user.",
        "#e74c3c",
        3500
      );
      return;
    }

    // Convert amount (ETH-like) to wei as BigInt -- ensure no floating-point precision is used
    const wei = BigInt(Math.round(parseFloat(amount) * 1e18));

    const txRequest = {
      evmAccount: evmAccount,
      transaction: {
        to: recipientAddress,
        value: wei,
        // Optional fields like gas/nonce/chainId may be added if required
      },
    };

  const result = await CDP.sendEvmTransaction(txRequest);
    const txHash = (result && result.transactionHash) || result || null;

    // Notify server of successful transaction
    $.post(
      "https://qb-phone/ConfirmOnchainTransfer",
      JSON.stringify({
        targetWallet: recipientAddress,
        coins: amount,
        txHash: txHash,
      }),
      function () {
        QB.Phone.Notifications.Add(
          "fas fa-paper-plane",
          "Crypto",
          "Transaction sent: " + txHash,
          "#badc58",
          2500
        );
      }
    );
  } catch (err) {
    console.error("sendCrypto (CDP) failed:", err);
    QB.Phone.Notifications.Add(
      "fas fa-exclamation-circle",
      "Crypto",
      "Transaction failed.",
      "#e74c3c",
      3500
    );
  }
}

// Example usage
$(document).on("click", "#connect-wallet", function () {
  connectWallet();
});

$(document).on("click", "#send-crypto", function () {
  const recipientAddress = $("#recipient-address").val();
  const amount = parseFloat($("#crypto-amount").val());
  if (recipientAddress && amount) {
    sendCrypto(recipientAddress, amount);
  } else {
    QB.Phone.Notifications.Add(
      "fas fa-exclamation-circle",
      "Crypto",
      "Please fill in all fields.",
      "#e74c3c",
      2500
    );
  }
});
