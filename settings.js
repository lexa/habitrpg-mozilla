var tabs = require('sdk/tabs');
var Self = require("sdk/self");
var Prefs = require("sdk/simple-prefs").prefs;
var _ = require("sdk/l10n").get;
var { on, once, off, emit } = require('sdk/event/core');
var api = require("API").API;

var Settings = {

// Open new tab with user settings
    open: function ()
    {
        if (Settings._tab) {
            Settings._tab.activate();
        } else {
        tabs.open({url: Self.data.url("settings.html"),
                   onOpen: Settings.onOpen,
                   onReady: Settings.onReady,
                   onClose: Settings.onClose
                  });
        }
    },

    onOpen: function (tab)
    {
        Settings._tab = tab;
    },

    onReady: function (tab)
    {
        api.request_task_update();
        let worker = tab.attach({
            contentScriptFile: Self.data.url("settings.js")
            //TODO add onError handler
        })
        worker.port.emit("set-default-settings",
                               { "userId" : Prefs.userId,
                                 "apiKey" : Prefs.apiKey,
                                 "taskId" : Prefs.taskId,
                                 "viceHosts" : Prefs.viceHosts,
                                 "benHosts" : Prefs.benHosts
                               });
        on(api, "user-tasks-updated", function (user_tasks) {
            worker.port.emit("updateTaskList", user_tasks);
        })
        worker.port.on("user-settings-updated", function(settings) {
            for (var k in settings) {
                Prefs[k] = settings[k];
            }
        })
    },

    onClose: function ()
    {
        Settings._tab = null;
    }
}

exports.Settings = Settings;
