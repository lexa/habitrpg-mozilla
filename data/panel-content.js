window.addEventListener('click', function (event) {self.port.emit('clicked')});
self.port.on("update_html", function (stats)
{
    document.getElementById("$2x").style.width = (stats.hp*100)/stats.maxHealth + "%";
    document.getElementById("$2z").style.width = (stats.exp*100)/stats.toNextLevel + "%";

    document.getElementById("$2y").innerHTML = Math.round(stats.hp) + "/" + Math.round(stats.maxHealth);
    document.getElementById("$2v").innerHTML = Math.round(stats.exp) + "/" + Math.round(stats.toNextLevel);

    document.getElementById("$au").innerHTML = Math.floor(stats.gp);
    document.getElementById("$av").innerHTML = Math.round((stats.gp - Math.floor(stats.gp))*100);

    document.getElementById("avatar-level").innerHTML = "Lvl " + stats.lvl;
    
    document.getElementById("splash_screen").style.display = 'none';
    document.getElementById("message").style.display = 'none';
    document.getElementById("message").innerHTML = '';
});

self.port.on("show_error_message", function (message)
{
    document.getElementById("message").style.display = 'block';
    document.getElementById("message").innerHTML = message;
    document.getElementById("splash_screen").style.display = 'none';
});

self.port.on("show_splash_screen", function ()
{
    document.getElementById("splash_screen").style.display = 'block';
})
