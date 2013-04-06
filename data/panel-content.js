window.addEventListener('click', function (event) {self.port.emit('clicked')});
self.port.on("update_html", function (stats)
{
    document.getElementById("$2x").style.width = (stats.hp*100)/stats.maxHealth + "%";
    document.getElementById("$2z").style.width = (stats.exp*100)/stats.toNextLevel + "%";

    document.getElementById("$2y").innerHTML = Math.round(stats.hp) + "/" + Math.round(stats.maxHealth);
    document.getElementById("$2v").innerHTML = Math.round(stats.exp) + "/" + Math.round(stats.toNextLevel);
});
