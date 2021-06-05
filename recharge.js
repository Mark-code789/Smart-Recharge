const srcs = [
    "menu.png",
    "edit.png",
    "tick.png",
    "contact.png",
    "recharge icon (512x512).png", 
    "rescan.png",
    "flashlight on.png",
    "flashlight off.png",
    "safaricom.png",
    "airtel.png",
    "telkom.png"
];

const imageProps = [
    "--menu-icon", 
    "--edit-icon", 
    "--tick-icon", 
    "--contact-icon",
    "--recharge-icon", 
    "--rescan-icon", 
    "--flashlight-on-icon",
    "--flashlight-off-icon",
    "--safaricom-icon", 
    "--airtel-icon", 
    "--telkom-icon"
] 

load();

async function load (i = 0) {
    let src = srcs[i];
    let response = await fetch(src);
    if(response.status == 200) {
        let arrBuff = await response.arrayBuffer();
        if(arrBuff.byteLength > 0) {
            src = await URL.createObjectURL(new Blob([arrBuff], {type: "image/png"}));
            document.documentElement.style.setProperty(imageProps[i], `url(${src})`);
            
            if(i < srcs.length-2)
                load(i+1);
            /*else
                LoadingDone();*/
        } 
        else {
            console.log(response);
            alert("BUFFERING ERROR!\nFailed to buffer fetched data to an array data.");
        } 
    } 
    else {
        console.log(response);
        alert("LOADING ERROR!\nFailed to load AppShellFiles - " + src + ". Either you have bad network or you have lost internet connection.");
    } 
}

async function LoadingDone() {
    $(".main").style.display = "grid";
    $(".about").addEventListener("click", About, false);
    $(".contact_picker").addEventListener("click", PickContact, false);
    $("input[type=text]").addEventListener("keyup", Edit.text, false);
    $("input[type=tel]").addEventListener("keyup", Edit.tel, false);
    $$(".main .footer button")[0].addEventListener("click", () => Scan(false), false);
    $$(".main .footer button")[1].addEventListener("click", () => Scan(true), false);
    $$(".other_number .footer button")[0].addEventListener("click", () => Scan(true), false);
    $$(".other_number .footer button")[1].addEventListener("click", () => Scan(true, true), false);
    $$(".visible_footer button")[0].addEventListener("click", Flashlight, false);
    $$(".visible_footer button")[1].addEventListener("click", Home, false);
    $$(".hidden_footer .footer button")[0].addEventListener("click", () => Edit.makeEditable(true), false);
    $$(".hidden_footer .footer button")[1].addEventListener("click", Call, false);
    $$(".hidden_footer .footer button")[2].addEventListener("click", Rescan, false);
    $$(".options button")[0].addEventListener("click", Options.share, false);
    $$(".options button")[1].addEventListener("click", Options.feedback, false);
    $$(".options button")[2].addEventListener("click", Options.contact, false);
    $$(".options button")[3].addEventListener("click", Options.contact, false);
    $(".about_window .footer button").addEventListener("click", Options.back, false);
    
    
    for(let sim of $$("input[type=radio]")) {
        sim.addEventListener("change", ChangeSim, false);
    } 
    Stream.video = $("video");
    Stream.laser = $(".laser");
    Stream.canvas = $$$("canvas");
    CONSTRAINTS.video.width.exact = parseInt(_$($(".scan"), "grid-template-rows").split(" ")[1]);
    
    if('contacts' in navigator && navigator.contacts.select) {
        $(".contact_picker").classList.remove("disable", "enable");
        $(".contact_picker").classList.add("enable");
    } 
    if(deferredEvent) {
        setTimeout(() => {
            $(".install_prompt").style.display = "block";
            $(".install_prompt").classList.add("show_install_prompt");
        }, 2000);
    } 
} 

const About = () => {
    $(".about_window").style.display = "block";
    $(".main").style.display = "none";
} 

class Options {
    static share = () => {
        if(navigator.canShare) {
            navigator.share({
                title: "Smart Recharge", 
                text: "Hey, i use Smart Recharge to recharge my phone. Try it put\n\n", 
                url: "https://mark-code789.github.io/Smart Recharge/index.html"
            }).catch( (error) => { 
            	let message = error.toString().split(":");
                alert(`There was an error while sharing.\n***Description***\n${message[0]}: ${message[1]}`);
            });
        } 
        else {
            alert("This browser doesn't support this function.");
        } 
    } 
    static feedback = () => {
        window.location.href = "mailto:marxeto8@gmail.com? &subject=Smart%20Recharge%20Feedback";
    } 
    static contact = e => {
        switch(e.target.innerHTML) {
            case "WhatsApp":
            window.location.href = "https://api.whatsapp.com/send?phone=+254798916984";
            break;
            
            case "SoloLearn":
            window.location.href = "https://www.sololearn.com/Profile/14044895/?ref=app";
            break;
        } 
    } 
    static back = () => {
        $(".about_window").style.display = "none";
        $(".main").style.display = "grid";
    } 
} 

const PickContact = async () => {
    try {
        let contact = await navigator.contacts.select(['tel']);
        
        if(contact.length > 0) {
            contact = contact[0].tel[0].replace(" ", "");
            Edit.tel(contact);
        } 
        else {
            $("input[type=tel]").focus();
        } 
    } catch (error) {
        $(".contact_picker").classList.remove("enable", "disable");
        $(".contact_picker").classList.add("disable");
        $("input[type=tel]").focus();
    } 
} 

const ChangeSim = e => {
    let elem = e.target;
    $(".main .header h2").innerHTML = elem.value;
    SIM.carrier = elem.value;
    switch(elem.value) {
        case "Safaricom":
        SIM.code = "*141*";
        SIM.group = 4;
        $$(".main .footer button")[1].classList.add("enable");
        break;
        
        case "Airtel":
        SIM.code = "*130*";
        SIM.group = 5;
        $$(".main .footer button")[1].classList.add("disable");
        break;
        
        case "Telkom":
        SIM.code = "*130*";
        SIM.group = 4;
        $$(".main .footer button")[1].classList.add("disable");
        break;
    } 
} 

const Flashlight = e => {
    if(typeof e != "object") {
        e = {target: $(".flashlight")}
        e.target.classList.remove("flashlight_on", "flashlight_off");
        if(e == true) {
            e.target.classList.add("flashlight_off");
        } 
        else {
            e.target.classList.add("flashlight_on");
        } 
    } 
    
    if(e.target.classList.contains("flashlight_on")) {
        e.target.classList.remove("flashlight_on");
        e.target.classList.add("flashlight_off");
        Stream.flashlight(false);
    }
    else {
        e.target.classList.remove("flashlight_off");
        e.target.classList.add("flashlight_on");
        Stream.flashlight(true);
    } 
} 

const Home = () => {
    $(".main").style.display = "grid";
    $(".scan").style.display = "none";
    if(Stream.started)
        Stream.pause();
} 

const Scan = async (anotherNo, cancel) => {
    if(anotherNo) {
        if(_$($(".other_number"), "display") == "grid") {
            if(cancel) {
                $("input[type=tel]").value = "";
                $(".main").style.display = "grid";
                $(".other_number").style.display = "none";
                return;
            } 
            else {
                let num = $("input[type=tel]").value.trim().replace("+254", "0");
                SIM.anotherNo = num;
                $(".other_number").style.display = "none";
            } 
        } 
        else {
            $(".main").style.display = "none";
            $(".other_number").style.display = "grid";
            $("input[type=tel]").focus();
            return;
        } 
    } 
    let res = await Stream.start();
    if(!res.res) {
        alert(res.error.message);
        return;
    } 
    $(".scan .header h3").innerHTML = "Align the digital code within the frame to scan";
    $(".main").style.display = "none";
    $(".scan").style.display = "grid";
}

class Edit {
    static initialText = "";
    static makeEditable = (editable) => {
        if(editable == true) {
            $("input[type=text]").disabled = false;
            $("input[type=text]").setAttribute("onblur", "Edit.makeEditable(false)");
            $("input[type=text]").focus();
        } 
        else if(editable == false) {
            $("input[type=text]").disabled = true;
        } 
    } 
    static text = (e) => {
        let text = typeof e == "string"? e: e.target.value;
        text = text.trim();
        if(this.initialText.length <= text.length) {
            this.initialText = text.trim();
            text = text.replace(/\s+/g, "");
            let value = "";
            
            for(let i = 0; i < text.length; i++) {
                value += text.charAt(i);
                if((i+1) % SIM.group == 0) {
                    value += " ";
                } 
            } 
            value = value.trim();
            $("input[type=text]").value = value;
            return;
        } 
        this.initialText = text.trim();
        $("input[type=text]").value = text;
    } 
    static tel = e => {
        let contact = typeof e == "string"? e: e.target.value;
        contact = contact.replace(/\s+/g, "");
        let length = contact.replace("+254", "0").length;
        e = typeof e == "string"? {target: $("input[type=tel]")}: e;
        console.log(e);
        contact = contact.includes("+254") && contact.length > 4? contact.slice(0,4) + " " + contact.slice(4,7) + (contact.replace(" ", "").length > 7? " " + contact.replace(" ", "").slice(7,): ""): 
                  !contact.includes("+254") && contact.length > 4? contact.slice(0,4) + " " + contact.slice(4,): contact;
        e.target.value = contact.includes("+254")? contact.slice(0,15): contact.slice(0,11);
        if(length >= 10) {
            $$(".other_number .footer button")[0].classList.remove("enable", "disable");
            $$(".other_number .footer button")[0].classList.add("enable");
        } 
        else {
            $$(".other_number .footer button")[0].classList.remove("enable", "disable");
            $$(".other_number .footer button")[0].classList.add("disable");
        } 
    } 
} 

const Call = () => {
    let value = $("input[type=text]").value;
    let hash = encodeURIComponent("#");
    if(SIM.anotherNo == null)
        window.location.href = "tel:" + SIM.code + value.replace(" ", "") + hash;
    else
        window.location.href = "tel:" + SIM.code + value.replace(" ", "") + "*" + SIM.anotherNo + hash;
    Edit.initialText = "";
    $("input[type=text]").value = "";
    $(".hidden_footer").classList.remove("show", "hide");
    $(".hidden_footer").classList.add("hide");
}

const Rescan = async () => {
    let res = await Stream.start();
    if(!res.res) {
        alert(res.error.message);
        return;
    } 
    Flashlight(this.torch);
    $(".scan .header h3").innerHTML = "Align the digital code within the frame to scan";
    $(".hidden_footer").classList.remove("show", "hide");
    $(".hidden_footer").classList.add("hide");
} 

const SIM = {
    carrier: "Safaricom", 
    code: "*141*", 
    group: 4,
    anotherNo: null
}

const CONSTRAINTS = {
    video: {
        width: {
            exact: window.innerHeight
        }, 
        height: {
            exact: window.innerWidth
        },
        facingMode: 'environment', 
        focusMode: 'continuous'
    } 
}

class Stream {
    static stream;
    static video;
    static laser;
    static canvas;
    static snapshot;
    static track;
    static capabilities;
    static worker;
    static timeout;
    static torch = false;
    static started = false;
    static start = async () => {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS);
            this.laser.style.animationPlayState = "running";
            this.started = true;
            this.video.srcObject = this.stream;
            this.track = await this.stream.getVideoTracks()[0];
            this.video.setAttribute("onloadedmetadata", "Stream.getCapabilities()");
            $(".flashlight").classList.add("disable");
            this.timeout = setTimeout(this.takeSnapshot, 5000);
            return {res: true};
        } catch (error) {
            return {error: new Error("Can't compete action. Access to camera denied."), res: false};
        } 
    } 
    static pause = () => {
        this.started = false;
        this.video.pause();
        this.track.stop();
        this.laser.style.animationPlayState = "paused";
        clearTimeout(this.timeout);
        $(".flashlight").classList.remove("flashlight_on");
        $(".flashlight").classList.add("flashlight_off");
    } 
    static getCapabilities = async () => {
        await setTimeout(_ => {}, 500);
        this.capabilities = await this.track.getCapabilities();
        if(this.capabilities.torch) {
            $(".flashlight").classList.remove("disable");
            $(".flashlight").classList.add("enable");
        } 
    } 
    static takeSnapshot = async () => {
        $(".scan .header h3").innerHTML = "scanning";
        let scannerFrame = $(".scanner_frame");
        let width = parseInt(_$(scannerFrame, "width"));
        let height = parseInt(_$(scannerFrame, "height"));
        let left = _$$(scannerFrame, scannerFrame.parentNode).left;
        let top = _$$(scannerFrame, scannerFrame.parentNode).top
        this.canvas.width = width;
        this.canvas.height = height;
        let ctx = this.canvas.getContext("2d");
        //ctx.filter = 'contrast(0.5) brightness(0.5)';
        ctx.drawImage(this.video,left, top, width, height, 0, 0, width, height);
        this.snapshot = this.canvas.toDataURL("image/png");
        $(".sims").style.backgroundImage = `url(${this.snapshot})`;
        console.log(width);
        await this.recognize(this.snapshot);
    } 
    static initTesseract = async () => {
        try {
            this.worker = Tesseract.createWorker();
            await this.worker.load();
            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            LoadingDone();
        } catch (error) {
            console.log(error);
        } 
    } 
    static recognize = async (img) => {
        let res = await this.worker.recognize(img);
        let texts = res.data.text.split("\n");
        let text = "";
        for(let t of texts) {
            if(t.length > text.length)
                text = t;
        }
        
        text = text.replace(/\D+/g, "");
        if(text.length > 7) {
            this.pause();
            $(".scan .header h3").innerHTML = "Please confirm the top up code.";
            $("input[type=text]").value = text;
            Edit.text(text);
            $(".hidden_footer").classList.remove("show", "hide");
            $(".hidden_footer").classList.add("show");
        } 
        else {
            this.takeSnapshot();
        } 
    } 
    static flashlight = async (on) => {
        this.torch = on;
        if(on) {
            this.track.applyConstraints({
                advanced: [{torch: true}]
            }).catch(error => {console.log(error);});
        } else {
            await this.pause();
            await this.start();
        } 
    } 
} 