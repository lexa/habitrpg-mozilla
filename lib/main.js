//This is a addon for habbitRPG.com
//every time when you visit vice website it report to habbitRPG and you loose HP.


var Widget = require("widget").Widget;
var tabs = require('sdk/tabs');
var notifications = require("sdk/notifications");
var Url = require("sdk/url");
var Prefs = require("sdk/simple-prefs").prefs;
var Request = require("sdk/request").Request;
var L10n = require("sdk/l10n").get;

///v1/users/:userId/tasks/:taskId/:direction
var baseUrl = "http://habitrpg.com:3000";
var taskId = "productivity";
var habitRPGicon = "https://habitrpg.com/favicon.ico";
var change_user_rate = function (taskId, direction)
{
    let r = Request({
        url: baseUrl + "/v1/users/" + Prefs.userId + "/tasks/" + taskId + "/" + direction,
        contentType: "application/json",
        content: "{\"apiToken\":\"" + Prefs.apiKey + "\"}"
    });

    r.on("complete", function(response) {
        if (200 != response.status) {
            notifications.notify({
                title: L10n(notifications_title_error),
                text: L10n(notifications_text_error_p1) + response.status + L10n(notifications_text_error_p2),
                iconURL: habitRPGicon
            })
        }
    });
    r.post();
}


var punish_user = function(host)
{
    notifications.notify({
        title: L10n("notification_title"),
        text:  L10n("notification_text")
    })
    change_user_rate(taskId, "down");
}

var is_vice_host = function (host)
{
    let viceList = Prefs.viceHosts.split(",");

    return (viceList.some(function(v) {
        let patt = new RegExp(v);
        return (patt.test(host));
    }));
}


exports.main = function()
{
    //change_user_rate("TEST", "up");

    new Widget({
        id: "habit-rpg-widget",
        label: "My HabitRPG Status",
        contentURL: habitRPGicon ,

        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {
            notifications.notify({
                title: "HabitRPG",
                onClick: function (data) {
                    tabs.open("https://habitrpg.com");
                }
            })

        }
    });

    //add event listener on every tab
    tabs.on('open', function(tab){
        tab.on('ready', function(tab){
            let host = (new Url.URL(tab.url)).host;
            if (is_vice_host(host)) {
                punish_user(host);
            }

        });
    });
};
