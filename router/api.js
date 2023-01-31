const { getcontacts_api , get_not_contact_users_api, getmessages_api, getmyinfo_api, addcontact_put, get_room_info_api, updatemyphoto_put, updatemyname_put} = require('../controllers/apicontroller');
const { requireAuth, requireRoomAccess} = require('../middlewhare/authmiddlewhare');

const router = require('express').Router();

router.get('/getmessages/:roomid/:page', requireAuth ,requireRoomAccess,getmessages_api)
router.get("/getcontacts", getcontacts_api)
router.get("/get_not_contact_users_api", get_not_contact_users_api)
router.get("/myinfo", requireAuth,getmyinfo_api)
router.get("/room_info/:roomid", requireAuth, requireRoomAccess, get_room_info_api)
router.put("/addcontact", requireAuth, addcontact_put)
router.put("/updatemyphoto", requireAuth, updatemyphoto_put)
router.put("/updatemyname", requireAuth, updatemyname_put)



module.exports = router;
