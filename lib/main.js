//This is a addon for habbitRPG.com
//every time when you visit vice website it report to habbitRPG and you loose HP.


var Widget = require("widget").Widget;
var tabs = require('sdk/tabs');
var notifications = require("sdk/notifications");
var Url = require("sdk/url");
var Prefs = require("sdk/simple-prefs").prefs;
var Request = require("sdk/request").Request;
var Panel = require("sdk/panel").Panel;
var Self = require("sdk/self");
var API = require("API").API;
var _ = require("sdk/l10n").get;
var { on, once, off, emit } = require('sdk/event/core');

var pentime = new Array;

var is_vice_host = function (host)
{
    let viceList = Prefs.viceHosts.split(",");

    return (viceList.some(function(v) {
        let patt = new RegExp(v);
        return (patt.test(host));
    }));
}
function is_benefical_host (host){
    let benList = Prefs.benHost.split(",");
    return (benList.some(function(v){
        let patt = new RegExp(v);
        return (patt.test(host));
    }));
}
var is_penalty_time = function (){
    var current_time = new Date();
    var time = current_time.getHours();
    if(Prefs.penaltystart>Prefs.penaltyend||Prefs.penaltyend>24){
        notifications.notify({
            title: _("HabitRPG"),
            text:  _("time_format_wrong")

        })
    }
    return (parseInt(Prefs.penaltystart)<=time&&time<=parseInt(Prefs.penaltyend));

};

exports.main = function()
{
    let api = new API;


    //mini panel, contain health and XP bars, opens on click on widget
    let info_panel = Panel({
        focus: false,
        width:240,
        height:90,
        contentURL: Self.data.url("panel-content.html"),
        contentScriptFile: Self.data.url("panel-content.js")
    });
    //on click open new tab and hide panel
    info_panel.port.on("clicked", function() {tabs.open("http://habitrpg.com"); info_panel.hide();});
    //update info every time when user open panel
    info_panel.on("show", function() {api.update_info();});

    on(api, "updated", function() {
        if (api.ok)
            info_panel.port.emit("update_html", api.user.stats);
    });


    new Widget({
        id: "habit-rpg-widget",
        label: "My HabitRPG Status",
        contentURL: Self.data.url("favicon.png"),
        panel: info_panel
    });


    //add event listener on every tab
    tabs.on('open', function(tab){
        tab.on('ready', function(tab){
            let host = (new Url.URL(tab.url)).host;
            if (is_vice_host(host)&&is_penalty_time()) {
                //punish user
                notifications.notify({
                    title: _("HabitRPG"),
                    text:  _("notification_punish")
                })
                api.change_task_rate("productivity", "down");
            }
            if(is_benefical_host(host)&&is_penalty_time()){
                notifications.notify({
                    title: _("HabitRPG"),
                    //@todo: show gained exp
                    text:  _("notification_reward")
                })
                api.change_task_rate("productivity", "up");
            }
        });
    });
};
