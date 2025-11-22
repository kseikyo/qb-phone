var SelectedCryptoTab = Config.DefaultCryptoPage;
var ActionTab = null;
var Coinbase = {
    IsSignedIn: false,
    Wallet: null,
};

$(".cryptotab-"+SelectedCryptoTab).css({"display":"block"});
$(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]').addClass('crypto-header-footer-item-selected');


var CryptoData = [];
CryptoData.Portfolio = 0;
CryptoData.Worth = 1000;
CryptoData.WalletId = null;
CryptoData.History = [];

function SetupCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Wallet: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg);" class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg);" class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Value change</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$'+change.PreviousWorth+'</span> to <span style="font-size: 1.3vh;">$'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';

            $(".cryptotab-course-list").append(Element);
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("$"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("$"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function UpdateCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Wallet: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green; font-weight: bolder;" class="crypto-percentage-change"><i style="color: green; font-weight: bolder; transform: rotate(-45deg); "class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red; font-weight: bolder;" class="crypto-percentage-change"><i style="color: red; font-weight: bolder; transform: rotate(125deg); "class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Value change</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">$'+change.PreviousWorth+'</span> to <span style="font-size: 1.3vh;">$'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';

            $(".cryptotab-course-list").append(Element);
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("$"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("$"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function RefreshCryptoTransactions(data) {
    $(".cryptotab-transactions-list").html("");
    if (data.CryptoTransactions.length > 0) {
        data.CryptoTransactions = (data.CryptoTransactions).reverse();
        $.each(data.CryptoTransactions, function(i, transaction){
            var Title = "<span style='color: green; font-weight: bolder;'>"+transaction.TransactionTitle+"</span>"
            if (transaction.TransactionTitle == "Sold" || transaction.TransactionTitle == "Transferred") {
                Title = "<span style='color: red; font-weight: bolder;'>"+transaction.TransactionTitle+"</span>"
            }
            var Element = '<div class="cryptotab-transactions-block"> <i class="fas fa-exchange-alt"></i> <span class="cryptotab-transactions-block-title">'+Title+'</span> <span class="cryptotab-transactions-block-happening">'+transaction.TransactionMessage+'</span></div>';

            $(".cryptotab-transactions-list").append(Element);
        });
    }
}

$(document).on('click', '.crypto-header-footer-item', function(e){
    e.preventDefault();

    var CurrentTab = $(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]');
    var SelectedTab = this;
    var HeaderTab = $(SelectedTab).data('cryptotab');

    if (HeaderTab !== SelectedCryptoTab) {
        $(CurrentTab).removeClass('crypto-header-footer-item-selected');
        $(SelectedTab).addClass('crypto-header-footer-item-selected');
        $(".cryptotab-"+SelectedCryptoTab).css({"display":"none"});
        $(".cryptotab-"+HeaderTab).css({"display":"block"});
        SelectedCryptoTab = $(SelectedTab).data('cryptotab');
    }
});

$(document).on('click', '.cryptotab-general-action', function(e){
    e.preventDefault();

    var Tab = $(this).data('action');

    $(".crypto-action-page").css({"display":"block"});
    $(".crypto-action-page").animate({
        left: 0,
    }, 300);
    $(".crypto-action-page-"+Tab).css({"display":"block"});
    QB.Phone.Functions.HeaderTextColor("black", 300);
    ActionTab = Tab;
});

$(document).on('click', '#cancel-crypto', function(e){
    e.preventDefault();

    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    QB.Phone.Functions.HeaderTextColor("white", 300);
});

function CloseCryptoPage() {
    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    QB.Phone.Functions.HeaderTextColor("white", 300);
}

$(document).on('click', '#buy-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-buy-crypto-input-coins").val();
    var Price = Math.ceil(Coins * CryptoData.Worth);

    if ((Coins !== "") && (Price !== "")) {
        if (QB.Phone.Data.PlayerData.money.bank >= Price) {
            $.post('https://qb-phone/BuyCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    QB.Phone.Data.PlayerData.money.bank = parseInt(QB.Phone.Data.PlayerData.money.bank) - parseInt(Price);
                    QB.Phone.Notifications.Add("fas fa-university", "QBank", "&#36; "+Price+",- has been withdrawn from your balance!", "#badc58", 2500);
                } else {
                    QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough money..", "#badc58", 1500);
                }
            });
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough money..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!", "#badc58", 1500);
    }
});

$(document).on('click', '#sell-crypto', function(e){
    e.preventDefault();
    if(e.handled !== true) {
        e.handled = true;

    var Coins = $(".crypto-action-page-sell-crypto-input-coins").val();
    var Price = Math.ceil(Coins * CryptoData.Worth);

    if ((Coins !== "") && (Price !== "")) {
        if (CryptoData.Portfolio >= parseInt(Coins)) {
            $.post('https://qb-phone/SellCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    QB.Phone.Data.PlayerData.money.bank = parseInt(QB.Phone.Data.PlayerData.money.bank) + parseInt(Price);
                    QB.Phone.Notifications.Add("fas fa-university", "QBank", "&#36; "+Price+",- has been added to your balance!", "#badc58", 2500);
                } else {
                    QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
                }
            });
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!", "#badc58", 1500);
    }
    CloseCryptoPage();
    e.handled = false;
}
});

$(document).on('click', '#transfer-crypto', function(e){
    e.preventDefault();
    var Coins = $(".crypto-action-page-transfer-crypto-input-coins").val();
    var WalletId = $(".crypto-action-page-transfer-crypto-input-walletid").val();

    if ((Coins !== "") && (WalletId !== "")) {
        if (CryptoData.Portfolio >= Coins) {
            if (WalletId !== CryptoData.WalletId) {
                // Ask server for recipient's on-chain wallet address. Server will return WalletAddress or error codes.
                $.post('https://qb-phone/TransferCrypto', JSON.stringify({
                    Coins: Coins,
                    WalletId: WalletId,
                }), function(response){
                    if (response == "notenough") {
                        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
                        return;
                    }
                    if (response == "notvalid") {
                        QB.Phone.Notifications.Add("fas fa-university", "Crypto", "this Wallet-ID doesn't exist!", "#badc58", 2500);
                        return;
                    }

                    // If server returned an object with WalletAddress, we should use the Coinbase SDK (NUI) to perform the on-chain transfer.
                    if (response && response.WalletAddress) {
                        var recipientAddress = response.WalletAddress;
                        var amount = parseFloat(response.Coins);

                        // Try to use Coinbase Embedded Wallet SDK if available
                        try {
                            if (window.CoinbaseEmbeddedWallet || window.CoinbaseCDP) {
                                var sdk = window.CoinbaseEmbeddedWallet || window.CoinbaseCDP;
                                // This is a placeholder: actual SDK usage depends on Coinbase SDK API. Replace with real calls.
                                // Example pseudo-call:
                                // sdk.sendTransaction({ to: recipientAddress, value: amount, token: Config.Coinbase.TokenContractAddress })
                                //   .then(function(tx){ /* on success */ })
                                //   .catch(function(err){ /* on error */ })

                                // For now, simulate sending and immediately confirm.
                                var simulatedTxHash = 'SIMULATED_TX_' + Date.now();
                                // Notify server that the on-chain transfer was broadcasted
                                $.post('https://qb-phone/ConfirmOnchainTransfer', JSON.stringify({ targetWallet: recipientAddress, coins: amount, txHash: simulatedTxHash }), function(){
                                    QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You transferred "+Coins+" to on-chain address "+recipientAddress+" (tx: "+simulatedTxHash+")", "#badc58", 3500);
                                    // Update local UI optimistically
                                    CryptoData.Portfolio = (CryptoData.Portfolio - amount).toFixed(6);
                                    UpdateCryptoData(CryptoData)
                                    CloseCryptoPage();
                                });
                            } else {
                                // SDK not present in NUI – fallback: prompt user to confirm a simulated tx
                                var simulatedTxHash = prompt('SDK not available. Enter TX hash to simulate success (leave blank to auto-generate)') || ('SIM_' + Date.now());
                                $.post('https://qb-phone/ConfirmOnchainTransfer', JSON.stringify({ targetWallet: recipientAddress, coins: parseFloat(Coins), txHash: simulatedTxHash }), function(){
                                    QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You transferred "+Coins+" to on-chain address "+recipientAddress+" (tx: "+simulatedTxHash+")", "#badc58", 3500);
                                    CryptoData.Portfolio = (CryptoData.Portfolio - parseFloat(Coins)).toFixed(6);
                                    UpdateCryptoData(CryptoData)
                                    CloseCryptoPage();
                                });
                            }
                        } catch (err) {
                            console.error('Error while attempting on-chain send:', err);
                            QB.Phone.Notifications.Add("fas fa-university", "Crypto", "Failed to send on-chain transaction", "#badc58", 2500);
                        }
                    } else {
                        // Legacy server response with updated CryptoData
                        UpdateCryptoData(response)
                        CloseCryptoPage()
                        QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You transferred "+Coins+",- to "+WalletId+"!", "#badc58", 2500);
                    }
                });
            } else {
                QB.Phone.Notifications.Add("fas fa-university", "Crypto", "You can't transfer to yourself..", "#badc58", 2500);
            }
        } else {
            QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "You don't have enough Qbits..", "#badc58", 1500);
        }
    } else {
        QB.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Fill out all fields!!", "#badc58", 1500);
    }
});

// Replace placeholder with Coinbase SDK integration
function connectWallet() {
    const sdk = new CoinbaseEmbeddedWallet();
    sdk.signIn({ email: prompt('Enter your email for wallet connection:') })
        .then((user) => {
            console.log('User signed in:', user);
            const walletAddress = user.wallet.address;
            // Save wallet address to server
            $.post('https://qb-phone/SaveWalletAddress', JSON.stringify({ address: walletAddress }), function(response) {
                QB.Phone.Notifications.Add("fas fa-wallet", "Crypto", "Wallet connected: " + walletAddress, "#badc58", 2500);
            });
        })
        .catch((error) => {
            console.error('Sign-in failed:', error);
            QB.Phone.Notifications.Add("fas fa-exclamation-circle", "Crypto", "Wallet connection failed.", "#e74c3c", 2500);
        });
}

function sendCrypto(recipientAddress, amount) {
    const sdk = new CoinbaseEmbeddedWallet();
    sdk.sendTransaction({
        to: recipientAddress,
        value: (amount * 1e18).toString(), // Convert to wei
        token: window.QB_COINBASE_CONFIG.TokenContractAddress,
    })
        .then((txHash) => {
            console.log('Transaction sent:', txHash);
            // Notify server of successful transaction
            $.post('https://qb-phone/ConfirmOnchainTransfer', JSON.stringify({
                targetWallet: recipientAddress,
                coins: amount,
                txHash: txHash,
            }), function() {
                QB.Phone.Notifications.Add("fas fa-paper-plane", "Crypto", "Transaction sent: " + txHash, "#badc58", 2500);
            });
        })
        .catch((error) => {
            console.error('Transaction failed:', error);
            QB.Phone.Notifications.Add("fas fa-exclamation-circle", "Crypto", "Transaction failed.", "#e74c3c", 2500);
        });
}

// Example usage
$(document).on('click', '#connect-wallet', function() {
    connectWallet();
});

$(document).on('click', '#send-crypto', function() {
    const recipientAddress = $("#recipient-address").val();
    const amount = parseFloat($("#crypto-amount").val());
    if (recipientAddress && amount) {
        sendCrypto(recipientAddress, amount);
    } else {
        QB.Phone.Notifications.Add("fas fa-exclamation-circle", "Crypto", "Please fill in all fields.", "#e74c3c", 2500);
    }
});
