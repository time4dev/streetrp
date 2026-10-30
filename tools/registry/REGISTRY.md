# Реестр RPC и событий StreetRP

Сгенерирован: 2026-10-30T12:57:54.227Z

| Метрика | Кол-во |
|---|---:|
| Просканировано файлов | 680 |
| Всего записей | 771 |
| RPC-обработчиков на сервере | 216 |
| RPC-обработчиков на клиенте | 141 |
| RPC-обработчиков в UI | 31 |
| Сырых событий на сервере | 20 |
| Сырых событий на клиенте | 16 |
| UI → сервер | 119 |
| UI → клиент | 66 |
| Клиент → сервер | 72 |
| Клиент → сервер (raw) | 9 |
| Клиент → UI | 16 |
| Сервер → клиент | 12 |
| Сервер → клиент (raw) | 11 |

## Покрытие обработчиками

S/C handler учитывает и raw-события (`mp.events.add` / `subscribeToDefault`), не только RPC.

| RPC | UI→S | UI→C | C→S | C→UI | S→C | S handler | C handler | UI handler |
|---|---|---|---|---|---|---|---|---|
| `3Dsound-Play` | — | — | — | — | — | — | — | ✅ |
| `3Dsound-SetVolume` | — | — | — | — | — | — | — | ✅ |
| `3Dsound-Stop` | — | — | — | — | — | — | — | ✅ |
| `Admin-AcceptReport` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-Ban` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-ChangeMoney` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-ChangeSkin` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-CreateHouse` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-CreateVehicle` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-DeleteHouse` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-DespawnVehicle` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-GetJournal` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-GetPlayerLicenses` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-GetPlayers` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-GetReports` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-GiveLicense` | — | — | — | — | — | ✅ | — | — |
| `Admin-Kick` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-ReleaseDemorgan` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-SendReport` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-SendToChat` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-SetFactionLeader` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-SetGM` | — | — | — | — | — | — | ✅ | — |
| `Admin-SetZoneOwner` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-Spectate` | ✅ | — | — | — | — | ✅ | ✅ | — |
| `Admin-StartFortWar` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-Teleport` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-ToDemorgan` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-ToggleESP` | — | — | — | — | — | — | ✅ | — |
| `Admin-Unban` | ✅ | — | — | — | — | ✅ | — | — |
| `Admin-WithdrawLicense` | — | — | — | — | — | ✅ | — | — |
| `AntiCheat-Pause` | — | — | — | — | — | — | ✅ | — |
| `AntiCheat-SendReport` | — | — | ✅ | — | — | ✅ | — | — |
| `App-SetDate` | — | — | — | — | — | — | — | ✅ |
| `App-SetOnline` | — | — | — | ✅ | — | — | — | ✅ |
| `ArmyTicket-Give` | — | — | ✅ | — | — | ✅ | — | — |
| `attachObject` | — | — | — | — | — | ✅ | — | — |
| `Auth-GetRegisterCode` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-GetResetCode` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-ResetPassword` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Auth-SignIn` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-SignInWithCode` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-SignUp` | ✅ | — | — | — | — | ✅ | — | — |
| `Auth-SuccessLogin` | — | ✅ | — | — | — | — | ✅ | — |
| `Auth-SuccessRegister` | — | ✅ | — | — | — | — | ✅ | — |
| `BagActions-PutOn` | — | — | ✅ | — | — | ✅ | — | — |
| `BagActions-TakeOff` | — | — | ✅ | — | — | ✅ | — | — |
| `Bank-CashOut` | ✅ | — | — | — | — | ✅ | — | — |
| `Bank-CreateAccount` | ✅ | — | — | — | — | ✅ | — | — |
| `Bank-PayBusiness` | ✅ | — | — | — | — | ✅ | — | — |
| `Bank-PayHouse` | ✅ | — | — | — | — | ✅ | — | — |
| `Bank-Replenish` | ✅ | — | — | — | — | ✅ | — | — |
| `Bank-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Bank-Transfer` | ✅ | — | — | — | — | ✅ | — | — |
| `Barbershop-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Barbershop-CloseMenu` | — | ✅ | — | — | — | — | ✅ | — |
| `Barbershop-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `Barbershop-GetData` | — | ✅ | — | — | — | — | ✅ | — |
| `Barbershop-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Binder-Rebind` | — | ✅ | — | — | — | — | ✅ | — |
| `Blips-CreateItem` | — | — | — | — | — | — | ✅ | — |
| `Blips-CreatePoint` | — | — | — | — | — | — | ✅ | — |
| `Blips-Delete` | — | — | — | — | — | — | ✅ | — |
| `Blips-GetNames` | ✅ | — | — | — | — | ✅ | — | — |
| `Blips-MarkNearest` | ✅ | — | — | — | — | ✅ | — | — |
| `Browser-HidePage` | — | ✅ | — | — | — | — | ✅ | — |
| `Browser-ShowPage` | — | — | — | ✅ | — | — | — | ✅ |
| `Building-AddCargoToVehicle` | — | — | — | — | — | ✅ | — | — |
| `Business-Finish` | ✅ | — | — | — | — | ✅ | — | — |
| `Business-GetTax` | ✅ | — | — | — | — | ✅ | — | — |
| `Business-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Business-Start` | ✅ | — | — | — | — | ✅ | — | — |
| `Business-Trade` | ✅ | — | — | — | — | ✅ | — | — |
| `BusinessTrade-ConfirmOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `BusinessTrade-GetData` | ✅ | — | — | — | — | ✅ | — | — |
| `BusinessTrade-RefuseOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `BusinessTrade-SendOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `BusinessTrade-ShowMenu` | — | — | ✅ | — | — | ✅ | ✅ | — |
| `BusinessTrade-ShowOffer` | — | — | ✅ | — | — | ✅ | — | — |
| `Cargo-ShowVehiclePoint` | — | — | — | — | — | — | ✅ | — |
| `Character-ChangeGender` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-Create` | — | — | ✅ | — | — | ✅ | — | — |
| `Character-SetClothes` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-SetEyeColor` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-ShowCreator` | — | — | ✅ | — | — | ✅ | — | — |
| `Character-UpdateFaceOptions` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-UpdateHair` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-UpdateHeadOverlay` | — | ✅ | — | — | — | — | ✅ | — |
| `Character-UpdateParents` | — | ✅ | — | — | — | — | ✅ | — |
| `CharCreator-ChangeCamera` | — | ✅ | — | — | — | — | ✅ | — |
| `CharCreator-GetState` | — | ✅ | — | — | — | — | ✅ | — |
| `CharCreator-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `CharCreator-Submit` | — | ✅ | — | — | — | — | ✅ | — |
| `ClothingShop-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `ClothingShop-ChangeItem` | — | ✅ | — | — | — | — | ✅ | — |
| `ClothingShop-ChangeType` | — | ✅ | — | — | — | — | ✅ | — |
| `ClothingShop-CloseMenu` | — | — | — | — | — | — | ✅ | — |
| `ClothingShop-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `ClothingShop-GetClothes` | — | — | ✅ | — | — | ✅ | — | — |
| `ClothingShop-SetData` | — | — | — | ✅ | — | — | — | ✅ |
| `ClothingShop-SetItem` | — | — | ✅ | — | — | ✅ | — | — |
| `ClothingShop-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `createWaypoint` | — | — | — | — | ✅ | — | ✅ | — |
| `CuffsActions-Uncuff` | — | — | ✅ | — | — | ✅ | — | — |
| `CuffsActions-Untie` | — | — | ✅ | — | — | ✅ | — | — |
| `CuffsActions-UseCableTie` | — | — | ✅ | — | — | ✅ | — | — |
| `CuffsActions-UseHandcuffs` | — | — | ✅ | — | — | ✅ | — | — |
| `Daily-GetAward` | ✅ | — | — | — | — | ✅ | — | — |
| `Daily-GetData` | ✅ | — | — | — | — | ✅ | — | — |
| `detachObject` | — | — | — | — | — | ✅ | — | — |
| `Dialog-SendAnswer` | — | ✅ | — | — | — | — | ✅ | — |
| `Donation-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Donation-GetPrices` | ✅ | — | — | — | — | ✅ | — | — |
| `doorChangeState` | — | — | — | — | ✅ | — | ✅ | — |
| `Doors-GetState` | — | — | — | — | — | ✅ | — | — |
| `Doors-Toggle` | — | — | ✅ | — | — | ✅ | — | — |
| `Effects-StartDrunkEffect` | — | — | — | — | — | — | ✅ | — |
| `EmsCalls-Accept` | ✅ | — | — | — | — | ✅ | — | — |
| `EmsCalls-Create` | ✅ | — | — | — | — | ✅ | — | — |
| `EmsCalls-GetList` | ✅ | — | — | — | — | ✅ | — | — |
| `EmsHealth-OfferHeal` | — | — | ✅ | — | — | ✅ | — | — |
| `EmsHealth-Reanimate` | — | — | ✅ | — | — | ✅ | — | — |
| `EmsLicenses-OfferLicense` | — | — | ✅ | — | — | ✅ | — | — |
| `entityStreamIn` | — | — | — | — | — | — | ✅ | — |
| `entityStreamOut` | — | — | — | — | — | — | ✅ | — |
| `Faction-GetMaterials` | ✅ | — | — | — | — | ✅ | — | — |
| `Faction-GetMembers` | ✅ | — | — | — | — | ✅ | — | — |
| `Faction-GetMoney` | ✅ | — | — | — | — | ✅ | — | — |
| `Faction-GetPlayerRank` | — | — | ✅ | — | — | ✅ | — | — |
| `Faction-GetRankData` | ✅ | — | — | — | — | ✅ | — | — |
| `Faction-GetRanks` | ✅ | — | — | — | — | ✅ | — | — |
| `Faction-GetVehicles` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionActions-Call` | — | ✅ | — | — | — | — | ✅ | — |
| `FactionActions-Frisk` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionActions-GetItems` | — | ✅ | — | — | — | — | ✅ | — |
| `FactionActions-ToVehicle` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionActions-Unmask` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionJournal-GetList` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionLeader-ChangeMoney` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionLeader-EditRank` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionLeader-Invite` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionLeader-Kick` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionLeader-SetRank` | ✅ | — | — | — | — | ✅ | — | — |
| `Factions-DespawnVehicle` | ✅ | — | — | — | — | ✅ | — | — |
| `Factions-FinishWork` | ✅ | — | — | — | — | ✅ | — | — |
| `Factions-OrderMaterials` | ✅ | — | — | — | — | ✅ | — | — |
| `Factions-ShowDocs` | — | — | — | — | — | — | ✅ | — |
| `Factions-ShowGarage` | — | — | — | — | — | ✅ | ✅ | — |
| `Factions-SpawnVehicle` | ✅ | — | — | — | — | ✅ | — | — |
| `Factions-StartWork` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionWardrobe-ChangeItem` | — | ✅ | — | — | — | — | ✅ | — |
| `FactionWardrobe-ChangeType` | — | ✅ | — | — | — | — | ✅ | — |
| `FactionWardrobe-CloseMenu` | — | — | — | — | — | — | ✅ | — |
| `FactionWardrobe-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionWardrobe-GetClothes` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionWardrobe-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `FactionWardrobe-WearItem` | — | — | ✅ | — | — | ✅ | — | — |
| `FactionWorkshop-CraftItem` | ✅ | — | — | — | — | ✅ | — | — |
| `FactionWorkshop-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Fishing-Drop` | — | — | ✅ | — | — | ✅ | — | — |
| `Fishing-HideMinigame` | — | — | — | — | — | — | ✅ | — |
| `Fishing-ShowMinigame` | — | — | — | — | — | — | ✅ | — |
| `Fishing-Success` | — | — | ✅ | — | — | ✅ | — | — |
| `FollowActions-Reset` | — | — | ✅ | — | — | ✅ | — | — |
| `FollowActions-Start` | — | — | ✅ | — | — | ✅ | — | — |
| `FollowActions-Stop` | — | — | ✅ | — | — | ✅ | — | — |
| `GangCapture-Start` | — | — | — | — | — | — | ✅ | — |
| `GangCapture-Stop` | — | — | — | — | — | — | ✅ | — |
| `GangCapture-UpdateMembers` | — | — | — | — | — | — | ✅ | — |
| `GangZones-GetInfo` | ✅ | — | — | — | — | ✅ | — | — |
| `GangZones-GetList` | — | — | ✅ | — | — | ✅ | — | — |
| `GangZones-UpdateZone` | — | — | — | — | — | — | ✅ | — |
| `Gas-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Gas-CloseMenu` | — | — | — | — | — | — | ✅ | — |
| `Gas-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `getCamCoords` | — | — | — | — | ✅ | — | ✅ | — |
| `getCurrentAmmo` | — | ✅ | — | — | — | — | ✅ | — |
| `getPlayerLocation` | — | ✅ | — | — | — | — | ✅ | — |
| `GovInfo-GetUser` | ✅ | — | — | — | — | ✅ | — | — |
| `GovInfo-GetVehicle` | ✅ | — | — | — | — | ✅ | — | — |
| `House-GetTax` | ✅ | — | — | — | — | ✅ | — | — |
| `House-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `House-ToEnter` | ✅ | — | — | — | — | ✅ | — | — |
| `House-ToggleLock` | ✅ | — | — | — | — | ✅ | — | — |
| `House-Trade` | ✅ | — | — | — | — | ✅ | — | — |
| `HouseTrade-ConfirmOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `HouseTrade-GetData` | ✅ | — | — | — | — | ✅ | — | — |
| `HouseTrade-RefuseOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `HouseTrade-SendOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `HouseTrade-ShowMenu` | — | — | ✅ | — | — | ✅ | ✅ | — |
| `HouseTrade-ShowOffer` | — | — | ✅ | — | — | ✅ | — | — |
| `HUD-GetBinds` | — | ✅ | — | — | — | — | ✅ | — |
| `HUD-GetMinimapAnchor` | — | ✅ | — | — | — | — | ✅ | — |
| `HUD-SetAmmo` | — | — | — | — | — | — | — | ✅ |
| `HUD-SetCapture` | — | — | — | ✅ | — | — | — | ✅ |
| `HUD-SetLocation` | — | — | — | — | — | — | — | ✅ |
| `HUD-SetMicStatus` | — | — | — | — | — | — | — | ✅ |
| `HUD-SetVisible` | — | — | — | ✅ | — | — | — | ✅ |
| `HUD-ShowInteract` | — | — | — | — | — | — | ✅ | ✅ |
| `HUD-ShowLevel` | — | — | — | — | — | — | ✅ | ✅ |
| `HUD-ShowOffer` | — | — | — | — | — | — | — | ✅ |
| `Inventory-Drop` | ✅ | — | — | — | — | ✅ | — | — |
| `Inventory-FactionMove` | — | — | — | — | — | ✅ | — | — |
| `Inventory-FactionSeparate` | — | — | — | — | — | ✅ | — | — |
| `Inventory-FactionTransfer` | — | — | — | — | — | ✅ | — | — |
| `Inventory-HouseMove` | — | — | — | — | — | ✅ | — | — |
| `Inventory-HouseSeparate` | — | — | — | — | — | ✅ | — | — |
| `Inventory-HouseTransfer` | — | — | — | — | — | ✅ | — | — |
| `Inventory-PlayerTransfer` | — | — | — | — | — | ✅ | — | — |
| `Inventory-SelfMove` | — | — | — | — | — | ✅ | — | — |
| `Inventory-SelfSeparate` | — | — | — | — | — | ✅ | — | — |
| `Inventory-SetCapacity` | — | — | — | ✅ | — | — | ✅ | ✅ |
| `Inventory-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Inventory-ShowPlayerMenu` | — | — | ✅ | — | — | ✅ | — | — |
| `Inventory-ShowVehicleMenu` | — | — | ✅ | — | — | ✅ | — | — |
| `Inventory-ToQuick` | ✅ | — | — | — | — | ✅ | — | — |
| `Inventory-UnequipItem` | ✅ | — | ✅ | — | — | ✅ | — | — |
| `Inventory-Use` | ✅ | — | — | — | — | ✅ | — | — |
| `Inventory-UseQuick` | — | — | ✅ | — | — | ✅ | — | — |
| `Inventory-VehicleMove` | — | — | — | — | — | ✅ | — | — |
| `Inventory-VehicleSeparate` | — | — | — | — | — | ✅ | — | — |
| `Inventory-VehicleTransfer` | — | — | — | — | — | ✅ | — | — |
| `Job-FinishWork` | — | ✅ | — | — | — | — | ✅ | — |
| `Job-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Jobs-FinishWork` | — | — | ✅ | — | — | ✅ | — | — |
| `Jobs-ShowMenu` | — | — | — | — | — | ✅ | — | — |
| `Jobs-StartWork` | ✅ | — | — | — | — | ✅ | — | — |
| `Licenses-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Licenses-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `locked` | — | — | — | — | — | — | ✅ | — |
| `Lockpick-Cancel` | — | — | — | — | — | — | ✅ | — |
| `Lockpick-Error` | — | ✅ | — | — | — | — | ✅ | — |
| `Lockpick-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Lockpick-Success` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `LSC-CloseMenu` | — | — | — | — | — | — | ✅ | — |
| `LSC-GetInstalledItem` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-GetModAmount` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-SetCategory` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-SetColor` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-SetItem` | — | ✅ | — | — | — | — | ✅ | — |
| `LSC-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Notifications-Help` | — | — | — | — | — | — | ✅ | — |
| `Notifications-Show` | — | — | — | — | — | — | ✅ | — |
| `Notifications-ShowItem` | — | — | — | ✅ | — | — | — | ✅ |
| `Offer-Create` | — | — | — | — | — | — | ✅ | — |
| `Offer-Show` | — | — | — | — | — | — | ✅ | — |
| `Offers-Accept` | — | — | ✅ | — | — | ✅ | — | — |
| `Offers-Refuse` | — | — | ✅ | — | — | ✅ | — | — |
| `Particles-ShowSmoke` | — | — | — | — | ✅ | — | ✅ | — |
| `Passport-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Passport-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Phone-AcceptCall` | ✅ | — | — | ✅ | — | ✅ | — | ✅ |
| `Phone-AddContact` | — | — | — | — | — | ✅ | — | — |
| `Phone-BlockContact` | — | — | — | — | — | ✅ | — | — |
| `Phone-BuyNumber` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-Call` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-CanClose` | — | — | — | ✅ | — | — | — | ✅ |
| `Phone-CanOpen` | — | — | — | — | — | — | ✅ | — |
| `Phone-DeclineCall` | ✅ | — | — | ✅ | — | ✅ | — | ✅ |
| `Phone-DeleteContact` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-EditContact` | — | — | — | — | — | ✅ | — | — |
| `Phone-GetContactByNumber` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-GetContactsData` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-GetNumberData` | ✅ | — | — | — | — | ✅ | — | — |
| `Phone-IncomingCall` | — | — | — | — | — | — | — | ✅ |
| `Phone-SetWallpaper` | — | ✅ | — | ✅ | — | — | ✅ | ✅ |
| `Phone-StartCall` | — | — | — | — | — | — | ✅ | — |
| `Phone-StopCall` | — | — | — | — | — | — | ✅ | — |
| `Phone-UnblockContact` | — | — | — | — | — | ✅ | — | — |
| `Player-ClientDie` | — | ✅ | — | — | — | — | ✅ | — |
| `Player-Die` | — | — | ✅ | — | — | ✅ | — | — |
| `Player-FriendOffer` | — | — | ✅ | — | — | ✅ | — | — |
| `Player-GiveCash` | ✅ | — | — | — | — | ✅ | — | — |
| `Player-KickAfk` | — | — | ✅ | — | — | ✅ | — | — |
| `Player-OfferDocs` | — | — | ✅ | — | — | ✅ | — | — |
| `Player-SetBonus` | — | — | — | — | — | — | — | ✅ |
| `Player-SetId` | — | — | — | ✅ | — | — | — | ✅ |
| `Player-SetMoney` | — | — | — | — | — | — | — | ✅ |
| `Player-SetSatiety` | — | — | — | — | — | — | — | ✅ |
| `Player-SetTasks` | — | — | — | — | — | — | — | ✅ |
| `Player-ShowCashMenu` | — | — | — | ✅ | — | — | — | ✅ |
| `Player-ShowDeathMenu` | — | — | — | — | — | — | ✅ | — |
| `Player-ShowDocs` | — | — | ✅ | — | — | ✅ | — | — |
| `Player-ShowDocsMenu` | — | — | — | — | — | — | ✅ | — |
| `PlayerAnims-GetList` | — | ✅ | — | — | — | — | ✅ | — |
| `PlayerAnims-SetAnim` | — | ✅ | — | — | — | — | ✅ | — |
| `playerChat` | — | — | — | — | — | ✅ | — | — |
| `playerCreateWaypoint` | — | — | ✅ | — | — | ✅ | ✅ | — |
| `playerDeath` | — | — | — | — | — | ✅ | — | — |
| `playerEnterColshape` | — | — | — | — | — | ✅ | ✅ | — |
| `playerEnterVehicle` | — | — | — | — | — | ✅ | ✅ | — |
| `playerExitColshape` | — | — | — | — | — | ✅ | ✅ | — |
| `playerExitVehicle` | — | — | — | — | — | ✅ | — | — |
| `PlayerFriends-Add` | — | — | — | — | — | — | ✅ | — |
| `PlayerFriends-IsFriend` | — | — | — | — | — | — | ✅ | — |
| `PlayerFriends-PrepareString` | — | ✅ | — | — | — | — | ✅ | — |
| `playerJoin` | — | — | — | — | — | ✅ | — | — |
| `playerKeyPress` | — | — | — | — | — | ✅ | — | — |
| `playerLeaveVehicle` | — | — | — | — | — | — | ✅ | — |
| `playerQuit` | — | — | — | — | — | ✅ | ✅ | — |
| `playerReady` | — | — | — | — | — | ✅ | — | — |
| `playerRotation` | — | ✅ | — | — | — | — | ✅ | — |
| `playerSelectSpawn` | — | — | — | — | ✅ | — | ✅ | — |
| `playerSelectTarget` | — | — | ✅ | — | — | ✅ | — | — |
| `playerStartTalking` | — | — | — | — | — | — | ✅ | — |
| `playerStopRotation` | — | ✅ | — | — | — | — | ✅ | — |
| `playerStopTalking` | — | — | — | — | — | — | ✅ | — |
| `playerUnlockVehicle` | — | — | — | — | — | ✅ | — | — |
| `playerWeaponShot` | — | — | ✅ | — | — | — | ✅ | — |
| `Police-WriteTicket` | ✅ | — | — | — | — | ✅ | — | — |
| `PoliceCalls-GetList` | ✅ | — | — | — | — | ✅ | — | — |
| `PoliceCalls-MarkPosition` | ✅ | — | — | — | — | ✅ | — | — |
| `Postal-AddCargoToVehicle` | — | — | — | — | — | ✅ | — | — |
| `Postal-GetVehicleCargo` | — | — | — | — | — | ✅ | — | — |
| `Referral-GetInfo` | ✅ | — | — | — | — | ✅ | — | — |
| `Referral-UseCode` | ✅ | — | — | — | — | ✅ | — | — |
| `render` | — | — | — | — | — | — | ✅ | — |
| `Scenarios-Play` | — | — | — | — | ✅ | — | ✅ | — |
| `Services-ShowMenu` | — | — | — | — | — | ✅ | — | — |
| `setAnimation` | — | — | — | — | — | ✅ | — | — |
| `setMood` | — | — | — | — | — | ✅ | — | — |
| `setScenario` | — | — | — | — | — | ✅ | — | — |
| `setWalkingStyle` | — | — | — | — | — | ✅ | — | — |
| `Spawn-SelectType` | ✅ | — | — | — | — | ✅ | — | — |
| `Spawn-ShowMenu` | — | — | — | — | — | ✅ | ✅ | — |
| `Spawn-ToStart` | — | — | ✅ | — | — | ✅ | — | — |
| `Speedometer-UpdateState` | — | — | — | ✅ | — | — | — | ✅ |
| `stopScenario` | — | — | — | — | — | ✅ | — | — |
| `Supermarket-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Supermarket-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Surgeon-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Surgeon-CloseMenu` | — | ✅ | — | — | — | — | ✅ | — |
| `Surgeon-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `Surgeon-GetData` | — | ✅ | — | — | — | — | ✅ | — |
| `Surgeon-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Target-CloseMenu` | — | ✅ | — | — | — | — | ✅ | — |
| `Target-Reset` | — | — | — | ✅ | — | — | — | ✅ |
| `Target-SelectItem` | — | ✅ | — | — | — | — | ✅ | — |
| `Target-ShowMenu` | — | — | — | ✅ | — | — | — | ✅ |
| `TattooShop-Buy` | — | ✅ | ✅ | — | — | ✅ | ✅ | — |
| `TattooShop-ChangeType` | — | ✅ | — | — | — | — | ✅ | — |
| `TattooShop-CloseMenu` | — | — | — | — | — | — | ✅ | — |
| `TattooShop-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `TattooShop-Remove` | — | ✅ | — | — | — | — | ✅ | — |
| `TattooShop-SetItem` | — | ✅ | — | — | — | — | ✅ | — |
| `TattooShop-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Vehicle-DeliverForPlayer` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-DespawnItem` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-GetFreeSeat` | — | — | — | — | — | — | ✅ | — |
| `Vehicle-GetInfo` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-GetPassengers` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-GetPlayerList` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-GetSpawnCoords` | — | ✅ | — | — | — | — | ✅ | — |
| `Vehicle-GetSpec` | — | ✅ | — | — | — | — | ✅ | — |
| `Vehicle-KickPassenger` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-MarkPosition` | ✅ | — | — | — | — | ✅ | — | — |
| `Vehicle-OpenLock` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-Refuel` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-Repair` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-ToggleDoor` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-ToggleEngine` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-ToggleIndicator` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-ToggleLock` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-ToggleTrunk` | — | — | ✅ | — | — | ✅ | — | — |
| `Vehicle-TriggerAlarm` | — | — | ✅ | — | — | ✅ | — | — |
| `VehicleDump-Recycle` | ✅ | — | — | — | — | ✅ | — | — |
| `VehicleDump-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `VehicleShop-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `VehicleShop-ChangeColor` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleShop-Exit` | — | — | ✅ | — | — | ✅ | — | — |
| `VehicleShop-SetVehicle` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleShop-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `VehicleShop-StartTestDrive` | — | — | ✅ | — | — | ✅ | — | — |
| `VehicleShop-StopTestDrive` | — | — | ✅ | — | — | ✅ | — | — |
| `VehicleShop-TestDrive` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleSync-SetDirtLevel` | — | — | — | — | ✅ | — | — | — |
| `VehicleSync-SetDoorsState` | — | — | — | — | ✅ | — | ✅ | — |
| `VehicleSync-SetHealth` | — | — | — | — | ✅ | — | ✅ | — |
| `VehicleSync-SetIndicators` | — | — | — | — | ✅ | — | ✅ | — |
| `VehicleSync-SetLockStatus` | — | — | — | — | ✅ | — | ✅ | — |
| `VehicleSync-SetRadioStation` | — | — | ✅ | — | — | ✅ | — | — |
| `VehicleTrade-ConfirmOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleTrade-GetData` | ✅ | — | — | — | — | ✅ | — | — |
| `VehicleTrade-RefuseOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleTrade-SendOffer` | — | ✅ | — | — | — | — | ✅ | — |
| `VehicleTrade-ShowMenu` | — | — | ✅ | — | — | ✅ | ✅ | — |
| `VehicleTrade-ShowOffer` | — | — | ✅ | — | — | ✅ | — | — |
| `Voice-AddListener` | — | — | — | — | — | ✅ | — | — |
| `Voice-Reload` | — | ✅ | — | — | — | — | ✅ | — |
| `Voice-RemoveListener` | — | — | — | — | — | ✅ | — | — |
| `WantedList-AddItem` | ✅ | — | — | — | — | ✅ | — | — |
| `WantedList-Arrest` | ✅ | — | — | — | — | ✅ | — | — |
| `WantedList-FindById` | ✅ | — | — | — | — | ✅ | — | — |
| `WantedList-GetItems` | ✅ | — | — | — | — | ✅ | — | — |
| `WantedList-RemoveItem` | ✅ | — | — | — | — | ✅ | — | — |
| `Weapons-Buy` | ✅ | — | — | — | — | ✅ | — | — |
| `Weapons-BuyAmmo` | ✅ | — | — | — | — | ✅ | — | — |
| `Weapons-GetClipSize` | — | ✅ | — | — | — | — | ✅ | — |
| `Weapons-GiveAmmo` | — | — | — | — | — | — | ✅ | — |
| `Weapons-GiveWeapon` | — | — | — | — | — | — | ✅ | — |
| `Weapons-RemoveWeapon` | — | — | — | — | — | — | ✅ | — |
| `Weapons-SaveAmmo` | — | — | ✅ | — | — | ✅ | — | — |
| `Weapons-ShowMenu` | — | — | — | — | — | — | ✅ | — |
| `Weather-Change` | — | — | — | — | ✅ | — | ✅ | — |
| `ZoneCapture-StartWar` | ✅ | — | — | — | — | ✅ | — | — |
| `ZoneCapture-ToDimension` | — | — | — | — | — | ✅ | — | — |

## Вызовы без обработчиков

### UI → сервер

Нет.

### UI → клиент

Нет.

### клиент → сервер

- `playerWeaponShot`

### клиент → UI

Нет.

### сервер → клиент

- `VehicleSync-SetDirtLevel`

## Сырые события (RAGE:MP → FiveM)

| Сторона | Событие |
|---|---|
| client | `createWaypoint` |
| client | `doorChangeState` |
| client | `entityStreamIn` |
| client | `entityStreamOut` |
| client | `locked` |
| client | `playerCreateWaypoint` |
| client | `playerEnterColshape` |
| client | `playerEnterVehicle` |
| client | `playerExitColshape` |
| client | `playerLeaveVehicle` |
| client | `playerQuit` |
| client | `playerSelectSpawn` |
| client | `playerStartTalking` |
| client | `playerStopTalking` |
| client | `playerWeaponShot` |
| client | `render` |
| server | `attachObject` |
| server | `detachObject` |
| server | `playerChat` |
| server | `playerDeath` |
| server | `playerEnterColshape` |
| server | `playerEnterVehicle` |
| server | `playerExitColshape` |
| server | `playerExitVehicle` |
| server | `playerJoin` |
| server | `playerKeyPress` |
| server | `playerQuit` |
| server | `playerReady` |
| server | `playerUnlockVehicle` |
| server | `setAnimation` |
| server | `setMood` |
| server | `setScenario` |
| server | `setWalkingStyle` |
| server | `stopScenario` |
| server | `Voice-AddListener` |
| server | `Voice-RemoveListener` |

