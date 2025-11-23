local QBCore = exports['qb-core']:GetCoreObject()

-- NODE CONFIG
local NODE_API_URL = "http://127.0.0.1:3001/api/spin"

local Segments = {
    [1] = {label = "$100",   value = "money_100"},
    [2] = {label = "Sandwich", value = "item_sandwich"},
    [3] = {label = "$1000",  value = "money_1000"},
    [4] = {label = "Nothing", value = "none"},
    [5] = {label = "$500",   value = "money_500"},
    [6] = {label = "Water",  value = "item_water"},
    [7] = {label = "$5000",  value = "money_5000"},
    [8] = {label = "Phone",  value = "item_phone"},
}

RegisterNetEvent('qb-phone:server:FetchRandomness', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)

    -- DEBUG PRINT: If you don't see this in Server Console, Client isn't reaching Server
    print("^3[DEBUG] Server: FetchRandomness Event Triggered by ID: " .. src .. "^7")

    if notRN_Player then
        print("^1[DEBUG] Error: Player not found!^7")
        return
    end

    print("^3[DEBUG] Server: Sending HTTP Request to Node...^7")

    PerformHttpRequest(NODE_API_URL, function(err, text, headers)
        print("^3[DEBUG] Server: HTTP Response Code: " .. tostring(err) .. "^7")

        local randomDegree = 0
        local entropySource = "Offline"

        if err == 200 then
            local data = json.decode(text)
            if data and data.success then
                randomDegree = tonumber(data.degrees)
                entropySource = data.source
                print("^2[DEBUG] Server: Success! Degree: " .. randomDegree .. "^7")
            else
                randomDegree = math.random(0, 359)
                print("^1[DEBUG] Server: Backend Logic Error. Using Fallback.^7")
            end
        else
            randomDegree = math.random(0, 359)
            print("^1[DEBUG] Server: Connection Failed. Error: " .. tostring(err) .. "^7")
        end

        -- Calculate Winner
        local segmentIndex = (8 - math.ceil(randomDegree / 45)) % 8
        local winningIndex = segmentIndex + 1
        local wonPrize = Segments[winningIndex]

        -- Give Reward
        if wonPrize.value ~= "none" then
            if wonPrize.value:find("money") then
                local amount = tonumber(wonPrize.value:match("money_(%d+)"))
                Player.Functions.AddMoney('bank', amount, "wheel-prize")
            else
                local item = wonPrize.value:gsub("item_", "")
                Player.Functions.AddItem(item, 1)
                TriggerClientEvent('inventory:client:ItemBox', src, QBCore.Shared.Items[item], "add")
            end
            TriggerClientEvent('QBCore:Notify', src, "Pyth Verified: Won " .. wonPrize.label, "success")
        else
            TriggerClientEvent('QBCore:Notify', src, "Pyth Verified: No Luck", "error")
        end

        TriggerClientEvent('qb-phone:client:ReceiveSpinResult', src, randomDegree, wonPrize.label)

    end, 'GET', "", { ["Content-Type"] = "application/json" })
end)
