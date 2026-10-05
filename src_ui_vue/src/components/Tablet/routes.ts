import { Component, markRaw } from 'vue';
import Members from './pages/members/index.vue';
import Member from './pages/members/member.vue';
import RankSelect from './pages/members/rank-select.vue';
import Ranks from './pages/ranks/index.vue';
import Rank from './pages/ranks/rank.vue';
import Money from './pages/money/index.vue';
import Materials from './pages/materials/index.vue';
import MedicCalls from './pages/medic-calls/index.vue';
import PoliceCalls from './pages/police-calls/index.vue';
import Database from './pages/database/index.vue';
import DatabaseUsers from './pages/database/users/index.vue';
import DatabaseUser from './pages/database/users/user.vue';
import DatabaseVehicles from './pages/database/vehicles/index.vue';
import DatabaseVehicle from './pages/database/vehicles/vehicle.vue';
import Fine from './pages/database/users/fine.vue';
import Arrest from './pages/database/users/arrest.vue';
import Wanted from './pages/wanted/index.vue';
import WantedForm from './pages/wanted/form.vue';
import WantedItem from './pages/wanted/item.vue';
import Journal from './pages/journal/index.vue';
import Vehicles from './pages/vehicles/index.vue';
import Settings from './pages/settings/index.vue';
import GangZones from './pages/gang-zones/index.vue';

const routes: { [path: string]: Component } = {
	'/members/': markRaw(Members),
	'/members/member/': markRaw(Member),
	'/members/member/rank/': markRaw(RankSelect),
	'/settings/': markRaw(Settings),
	'/journal/': markRaw(Journal),
	'/ranks/': markRaw(Ranks),
	'/ranks/rank/': markRaw(Rank),
	'/money/': markRaw(Money),
	'/materials/': markRaw(Materials),
	'/med_calls/': markRaw(MedicCalls),
	'/pol_calls/': markRaw(PoliceCalls),
	'/database/': markRaw(Database),
	'/database/users/': markRaw(DatabaseUsers),
	'/database/user/': markRaw(DatabaseUser),
	'/database/vehicles/': markRaw(DatabaseVehicles),
	'/database/vehicle/': markRaw(DatabaseVehicle),
	'/wanted/': markRaw(Wanted),
	'/wanted/form/': markRaw(WantedForm),
	'/wanted/item/': markRaw(WantedItem),
	'/fine/': markRaw(Fine),
	'/arrest/': markRaw(Arrest),
	'/vehicles/': markRaw(Vehicles),
	'/gang_zones/': markRaw(GangZones)
};

export default routes;
