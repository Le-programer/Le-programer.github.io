console.log("What are you doing here?!\n Do not steal my code you stealer! >:O")

var isPhone = /Mobi|Android/i.test(navigator.userAgent);

function blinkEnd(whereTo, blinkChar = '█', times = 3, speed = 450){
    if(blinkChar == '') return
    if(times <= 0){
        whereTo.innerHTML = whereTo.innerHTML.slice(0, -blinkChar.length)
        whereTo.innerHTML += '\u00A0'.repeat(blinkChar.length)
        return
    }
    times = times * 2 - 1
    let hop = true
    whereTo.innerHTML = whereTo.innerHTML.slice(0, -blinkChar.length)
    whereTo.innerHTML += '\u00A0'.repeat(blinkChar.length)
    let inter = setInterval(() => { 
        if(hop){
            whereTo.innerHTML = whereTo.innerHTML.slice(0, -(6*blinkChar.length))
            whereTo.innerHTML += blinkChar
        }else{
            whereTo.innerHTML = whereTo.innerHTML.slice(0, -blinkChar.length)
            whereTo.innerHTML += '\u00A0'.repeat(blinkChar.length)
        }
        hop = !hop
        if(times <= 0) {
            clearInterval(inter)
            return
        }
        times -= 1
    }, speed)
}

function retroWrite(whereTo, index = 0, doBlink = 2, speed = 65, blinkTimes = 3, blinkSpeed = 650){
    let text = whereTo.innerHTML.replace(/\n\s+/g, '');
    if(text == '') return
    let timeout = eval(whereTo.getAttribute('timeout'))
    whereTo.innerHTML = ''
    timeout = !timeout || timeout == '' ? 0 : parseInt(timeout) 
    if(timeout != 0){
        whereTo.innerHTML = ''
        whereTo.setAttribute('timeout', '0')
    }

    

    if(doBlink == 2){
        var leng = text.length + 1
    }else{ 
        var leng = text.length
        const matches = text.match(/\[[^\]]+\]/g);
        if(matches){
            var blinkChar = matches[matches.length - 1].substring(1,matches[matches.length - 1].length-1);
            text = text.replace(`[${blinkChar}]`,'')
        }else{
            var blinkChar = '_';

        }
    }

    function skipElement(){
        if(text[index] == '<'){
            const textAdd = text.substring(index, text.indexOf('>', index)+1)
            whereTo.innerHTML += textAdd
            index += textAdd.length 
        }
        if(text[index] == '<') skipElement()
        return
    }

    setTimeout(() => { 
        let inter = setInterval(()=>{
            if(index+1 <= leng){
                index += 1
            }else{ 
                //whereTo.style.height = "auto"
                //whereTo.style.width = "auto"
                if(doBlink == 1){
                    blinkEnd(whereTo, blinkChar, blinkTimes, blinkSpeed)
                }
                clearInterval(inter)
                return
            }

            skipElement()

            if(doBlink == 2){
                whereTo.innerHTML = text.substring(0,index)
            }else{
                whereTo.innerHTML = text.substring(0,index) + blinkChar
            }
        },speed)
    }, timeout)
}
/*
function retroWrite(text, whereTo, index = 0, doBlink = 2, speed = 65, blinkTimes = 4, blinkSpeed = 450){
    text = text.slice
    setInterval(() => {

    }, speed)
}*/

function onScrollInView(element, callback, interspace = 75) {
    const threshold = 1 - interspace / 100;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: threshold,
    });

    observer.observe(element);
}



class Eye{
    object = document.createElement('img');
    degre = 0;
    fixedDegre = 0;

    followMouse = true;
    rotate = false;
    rotateInterval = null;

    constructor(x = 0, y = 0, width = 32, height = 32, degre = 0, fixedDegre = 0, imgUrl = 'eyeball.svg', flipImg = false){
        this.x = x;
        this.y = y;

        this.size = height;

        this.width = width;
        this.height = height;

        this.degre = degre;
        this.fixedDegre = fixedDegre;

        this.object.src = imgUrl;
        if(imgUrl == '') this.object.src = 'eyeball.svg'
        this.flipImg = flipImg
        if(this.flipImg){
            this.object.style.transform = "scale(-1)"
            this.fixedDegre += 180
        }

        this.object.style.position = 'absolute';

        this.object.style.width = this.width;
        this.object.style.height = this.height;
        
        this.startAutoRotate(10, 4)
        if(!isPhone){
            document.body.addEventListener('mouseout', (event) => {
                this.startAutoRotate(10, 4)
            });
    
            document.body.addEventListener('mouseover', (event) => {
                this.stopAutoRotate()
                this.startFollowMouse()
            });
    
            document.body.addEventListener('mousemove', (event) => {
                if(!this.followMouse) return;
                    this.rotateToXY(event.clientX, event.clientY)
            })
        }
    }

    setRotation(deg){
        this.degre = deg;   
        this.object.style.transform = `${this.flipImg ? 'scale(-1)' : ''} rotate(${this.degre - this.fixedDegre}deg)`;
    }

    rotateToXY(x, y){

        let svgRect = this.object.getBoundingClientRect();

        let centerX = svgRect.left + svgRect.width / 2;
        let centerY = svgRect.top + svgRect.height / 2;

        let angle = Math.atan2(y - centerY, x- centerX) * (180 / Math.PI);
        
        this.setRotation(angle)
    }

    startFollowMouse(){
        this.rotate = false;
        this.followMouse = true;
    }

    stopFollowMouse(){
        this.followMouse = false;
    }

    startAutoRotate(speed = 1, degreSpeed = 1){
        if (this.rotateInterval != null) return
        this.followMouse = false;
        this.rotateInterval = setInterval(() => {
            this.setRotation(this.degre + degreSpeed)
        }, speed)
    }

    stopAutoRotate(){
        clearInterval(this.rotateInterval)
        this.rotateInterval = null
    }
}

class EyeBaller{
    object;
    eyeArray = []

    constructor(whereTo, eyeArray = [new Eye(), new Eye()]){
        if(whereTo.localName == "img"){
            console.error("class EyeBaller: whereTo object cannot be img, cannot append other objects to it, best just do div and put img to the div and set whereTo to be div.")
            return null
        }
        this.object = whereTo;
        this.object.EyeBaller = this;
        this.eyeArray = eyeArray;
        for(let eye of this.eyeArray){
            whereTo.append(eye.object)
            eye.object.style.left = `calc(${eye.x} - ${eye.width} / 2)`;
            eye.object.style.top = `calc(${eye.y} - ${eye.height} / 2)`;
            console
        }

        this.object.style.position = 'relative'

        //this.repositionEyes()
        //window.addEventListener("resize", () => this.repositionEyes())
    }

    repositionEyes(){
        for(let eye of this.eyeArray){
            eye.object.style.left = eye.x;
            eye.object.style.top = eye.y;
        }
        
    }
}

document.fonts.ready.then( () => {
    document.body.style.visibility = 'visible';

    document.querySelectorAll('#yrsOld').forEach(ele => {
        ele.textContent = parseInt((Date.now() - parseInt(ele.textContent) * 1000) / 1000 / 60 / 60 / 24 / 365);
    })

    document.querySelectorAll("[retro]").forEach(element => {
        element.style.position = 'relative'
        element.style.visibility = 'hidden';
        onScrollInView(element, () => {
            //element.style.width = element.offsetWidth + "px"
            //element.style.height = element.offsetHeight + "px" 
            let overText = document.createElement(element.localName)
                overText.style.position = 'absolute'
                overText.style.top = '0';
                overText.style.left = '0';
                overText.style.width = '100%';
                overText.style.height = '100%';
                overText.style.visibility = 'visible';
                overText.innerHTML = element.innerHTML
            element.append(overText)
           // element.style.opacity = '1'
            args = element.getAttribute('retro')
            if(args != ''){
                args = args.split(",")
                for(let i in args){
                    if(args[i] == ''){
                        args[i] = undefined
                    }else if(i != 0 && typeof args[i] != undefined){
                        args[i] = parseInt(args[i])
                    }
                }
                retroWrite(overText, undefined, args[0], args[1], args[2], args[3], args[4])
            }else{
                retroWrite(overText)
            }
        })
    }); 

    document.querySelectorAll("hr").forEach(element => {
        onScrollInView(element, () => {
            element.style.animation = "opening 1s forwards"
        });
    }); 
})