saveSettings = document.getElementById("saveSettings");

saveSettings.onclick = function () {
    self.port.emit("user-settings-updated",
        { "userId" : document.getElementById("userId").value,
          "apiKey" : document.getElementById("apiKey").value,
          "taskId" : document.getElementById("taskId").value,
          "viceHosts" : document.getElementById("viceHosts").value,
          "benHosts" : document.getElementById("benHosts").value,
          "penaltystart" : Number(document.getElementById("penaltystart").value),
          "penaltyend" : Number(document.getElementById("penaltyend").value),
        })};

self.port.on("set-default-settings", function (settings)
             {
                 for (var k in settings) {
                     var object = document.getElementById(k);
                     object.value = settings[k]
                 }
             });

self.port.on("updateTaskList", function (taskList)
             {
                 var taskIdCombobox = document.getElementById("taskId");
                 taskIdCombobox.innerHTML = "";
                 for (var i = 0; i < taskList.length; i++) {
                     var option = document.createElement("option")
                     option.value = taskList[i].id;
                     option.text = taskList[i].text;
                     taskIdCombobox.appendChild(option)
                 }
             }
            )
