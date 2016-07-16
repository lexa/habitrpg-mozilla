window.addEventListener("click", function (event) {self.port.emit("clicked")});
self.port.on("update_html", function (user_data)
{
    stats = user_data.stats;
    document.getElementById("$2x").style.width = (stats.hp*100)/stats.maxHealth + "%";
    document.getElementById("$2z").style.width = (stats.exp*100)/stats.toNextLevel + "%";

    document.getElementById("$2y").textContent = Math.round(stats.hp) + "/" + Math.round(stats.maxHealth);
    document.getElementById("$2v").textContent = Math.round(stats.exp) + "/" + Math.round(stats.toNextLevel);

    document.getElementById("$au").textContent = Math.floor(stats.gp);
    document.getElementById("$av").textContent = Math.round((stats.gp - Math.floor(stats.gp))*100);

    document.getElementById("avatar-level").textContent = "Lvl " + stats.lvl;

    document.getElementById("splash_screen").style.display = "none";
    document.getElementById("message").style.display = "none";
    document.getElementById("message").textContent = "";
});

self.port.on("show_error_message", function (message)
{
    document.getElementById("message").style.display = "block";
    document.getElementById("message").textContent = message;
    document.getElementById("splash_screen").style.display = "none";
});

self.port.on("show_splash_screen", function ()
{
    document.getElementById("splash_screen").style.display = "block";
})
