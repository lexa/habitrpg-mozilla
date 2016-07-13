//API for habitRPG
var _ = require("sdk/l10n").get;
var Request = require("sdk/request").Request;
var Prefs = require("sdk/simple-prefs").prefs;
var Self = require("sdk/self");
var { on, once, off, emit } = require('sdk/event/core');


//emit updated
function API()
{
};

//make a http-object for request to habitrpg.com
//after accomplishing request run callback with two arguments: api and json from response
function make_request(arg)
{
    let r = Request({
        url: "https://habitica.com" + arg.path,
        contentType: "application/json",
        headers: {"x-api-user": Prefs.userId, "x-api-key": Prefs.apiKey},
        content: arg.content
    });

    r.on("complete", function(response) {
        if (200 != response.status) {
            if (401 == response.status) {
                emit(arg.api, "invalid_credentials", _("invalid_credentials"));
            } else {
                emit(arg.api, "error", _("notification_title_error") + " " +_("notification_text_error_p1") + response.status + " " +_("notification_text_error_p2"));
            }
        } else if (! response.json){
            emit (arg.api, "error", _("server_return_not_json:") + response.text);
        } else {
            arg.callback(arg.api, response.json);
        }
    });
    return r;
}

API.prototype.update_info = function ()
{
    let r = make_request({api:this,
                          path:"/api/v3/user",
                          callback:function (api, response) {emit (api, "updated", response)}});

    r.get();
}

API.prototype.change_task_rate = function(taskId, direction)
{
    //FIXME: wait for bug https://github.com/lefnire/habitrpg/issues/786
    //as workaround sent '{}' in POST body.
    let r = make_request({api:this,
                          path:"/api/v1/user/task/" + taskId + "/" + direction,
                          callback:function (api, response) {api.update_info();},
                          content: "{}"});
    r.post();
}

exports.API = API;
