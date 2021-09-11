
function getServerInfo(){
    $.get("./serverinfo.php", function(data){
        $('#serverinfo').html('<pre>'+ data +'</pre>')
    });
}

function saveProfile(initialFlag){
// save profile settings
$.ajax({
    type: 'post',
    url: `./saveprofile.php`,
    data: {
        'name'  : $("form[name='profile'] #usernameinput").val(),
        'icon'  : $("form[name='profile'] select").val(),
        'color' : $("form[name='profile'] #colorpicker").val()
    }
})
.then(
    function(result){
        if(!initialFlag){
        updateProfile();
        }
    },
    function(){
        window.alert("Error saving the profile.");
    }
);
}

function updateProfile(initialFlag) {
// update profile appearance
var username, myip;
$.getJSON('profile.json', (data) => {
    username = `${data.name} <br />`;
    // replace icon img
    inlineSvg("div[name='usericon'] img, div[name='usericon'] svg", data.color,`./media/icons/${data.icon}.svg`);
    $("form[name='profile'] select").val(data.icon);
    $("form[name='profile'] #colorpicker").val(data.color);
    // fill input field of username
    if($("#usernameinput").val() == ''){
    // when the page is initially loaded, fill the input form with your profile.json
    $("form[name='profile'] #usernameinput").val(data.name);
    }
})
.then(
    function(){
        $.getJSON('serverinfo.php', (data) => {
        var loc = location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/')) + '/';
        myip = `${data.SERVER_ADDR} <br /> ${dir}`;
        // overwrite myname, myip
        $("div[name='username'] span[name='myname']").html(username);
        $("div[name='username'] span[name='myip']").html(myip);
        if(initialFlag){
            saveProfile(initialFlag);
        }
        });
    },
    function(){
        window.alert("Error saving the profile.");
    }
);
}

$(document).ready(function() {
    // load server info
    getServerInfo();

    // load profile
    updateProfile(initialFlag=true);

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
    // Volume toggle
    $("div[name='volume']").click(function() {
        // Toggle the "is-active" class on the volume icon.
        $("div[name='volume'] img").fadeToggle(0);
        $("div[name='volume'] img").toggleClass("volume-active");            
    });
    // Modal controller for setting window
    $("#open_setting").on("click", function() {
        $("div.modal[name='setting']").addClass("is-active");
    })
    // Modal controller for mesasge log
    $("#open_msglog").on("click", function() {
        $('#iframe_id')[0].contentDocument.location.reload(true);
        $("div.modal[name='msglog']").addClass("is-active");
    })
    $("#update").on("click", function() {
        $('#iframe_id')[0].contentDocument.location.reload(true);
    })
    // Modal controller for server info
    $("#open_serverinfo").on("click", function() {
        $("div.modal[name='serverinfo']").addClass("is-active");
    })
    // Close modal windows
    $("button[name='cancel'], button[name='close'], div.modal-background").on("click", function() {
        $("div.modal").removeClass("is-active");
    })
    // when profile setting chenges:
    $("form[name='profile']").change(function() {
        // save profile.json
        saveProfile(initialFlag=false);
    })
});