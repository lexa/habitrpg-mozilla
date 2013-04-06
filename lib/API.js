//API for habitRPG
var _ = require("sdk/l10n").get;
var Request = require("sdk/request").Request;
var Prefs = require("sdk/simple-prefs").prefs;
var { on, once, off, emit } = require('sdk/event/core');

//emit updated
function API()
{
    this.ok = false;//this mean content from remote server is not loaded yet
    this.error_msg = _("not_loaded_yet");
};

API.prototype.update_info = function ()
{
    console.log("update_info");
    let r = Request({
        url: "https://habitrpg.com" + "/api/v1/user",
        contentType: "application/json",
        headers: {"x-api-user": "39aba88d-f244-40a7-b941-2ebd66b9193e", "x-api-key": "1c656ad2-b163-4295-8db9-c4a038d7f934"}
    });

    var api = this;//don't delete,required for proper working of closure below
    r.on("complete", function(response) {
        if (200 != response.status) {
            api.ok = false;
            api.error_msg = _("notifications_title_error") + _("notifications_text_error_p1") + response.status + _("notifications_text_error_p2");
            notifications.notify({
                title: _("notifications_title_error"),
                text: _("notifications_text_error_p1") + response.status + _("notifications_text_error_p2"),
                iconURL: habitRPGicon
            })
        } else {
            api.user = response.json;
            api.ok = true;
        }
        emit (api, "updated", api.ok);
        console.log("event sended");
    });
    r.get();
    //del from here
    console.log("event sended3333");
    api.user = {};
    api.user.stats = {hp:1, maxHealth:10, exp:90, toNextLevel:99};
    emit (api, "updated", api.ok);
    //to there
}

exports.API = API;
