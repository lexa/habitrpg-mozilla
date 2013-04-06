//API for habitRPG
var _ = require("sdk/l10n").get;
var Request = require("sdk/request").Request;
var Prefs = require("sdk/simple-prefs").prefs;
var Notifications = require("sdk/notifications");
var { on, once, off, emit } = require('sdk/event/core');

//TODO include file with habitRPGicon

//emit updated
function API()
{
    this.ok = false;//this mean content from remote server is not loaded yet
    this.error_msg = _("not_loaded_yet");
};

//make a http-object for request to habitrpg.com
//after accomplishing request calling callback with two arguments: api and response
function make_request(api, path, success_callback, unsuccess_callback)
{
    let r = Request({
        url: "https://habitrpg.com" + path,
        contentType: "application/json",
        headers: {"x-api-user": Prefs.userId, "x-api-key": Prefs.apiKey}
    });

    r.on("complete", function(response) {
        if (200 != response.status) {
            api.ok = false;
            api.error_msg = _("notifications_title_error") + _("notifications_text_error_p1") + response.status + _("notifications_text_error_p2");
            Notifications.notify({
                title: _("notifications_title_error"),
                text: _("notifications_text_error_p1") + response.status + _("notifications_text_error_p2"),
                iconURL: habitRPGicon
            })
        } else {
            api.ok = true;
            callback(api, response);
        }
    });
    return r;
}

API.prototype.update_info = function ()
{
    console.log("update_info");

    let r = make_request(this, "/api/v1/user", function (api, response) {api.user = response.json; emit (api, "updated")});

    r.get();
}

API.prototype.change_task_rate = function(taskId, direction)
{
//        /api/v1/user/tasks/:task/:direction
    console.log("change_task_rate");

    let r = make_request(this, "/api/v1/user/tasks/" + taskId + "/" + direction, function (api, response) {api.update_info()});
    r.post();
}

exports.API = API;
