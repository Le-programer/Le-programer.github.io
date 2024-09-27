
document.fonts.ready.then(() =>{
    document.body.style.visibility = 'visible';

    document.querySelectorAll('#yrsOld').forEach(ele => {
        ele.textContent = parseInt((Date.now() - parseInt(ele.textContent) * 1000) / 1000 / 60 / 60 / 24 / 365);
    })
    
    function blinkEnd(whereTo, blinkChar = '█', times = 4, speed = 450){
        if(blinkChar == '') return
        if(times != 0)
            setTimeout(() => { 
                whereTo.innerText = whereTo.innerText.slice(0, -blinkChar.length)
                whereTo.innerText += '\u00A0'
                setTimeout(() => {
                        whereTo.innerText = whereTo.innerText.slice(0, -blinkChar.length)
                        whereTo.innerText += blinkChar
                        blinkEnd(whereTo, blinkChar, times < 0 ? times : times - 1, speed)
                },speed)
            },speed)
        else{
            whereTo.innerText = whereTo.innerText.slice(0, -blinkChar.length)
            whereTo.innerText += '\u00A0'
            whereTo.style.height = "auto"
            whereTo.style.width = "auto"
        }
    }

    function retroWrite(text, whereTo, index = 0, doBlink = 2, speed = 65, blinkTimes = 4, blinkSpeed = 450){
        timeout = eval(whereTo.getAttribute('timeout'))
        timeout = !timeout || timeout == '' ? 0 : parseInt(timeout) 
        if(timeout != 0){
            whereTo.innerText = ''
            whereTo.setAttribute('timeout', '0')
        }
        setTimeout(() => {
            if(text == '') return
            blinkChar = text[text.length - 1]

            if(doBlink == 2){
                whereTo.innerText = text.substring(0,index)
                leng = text.length
            }else{
                whereTo.innerText = text.substring(0,index) + blinkChar
                leng = text.length - 1
            }

            if(index < leng){
                setTimeout(() => {
                    retroWrite(text, whereTo, index+1, doBlink, speed, blinkTimes, blinkSpeed)
                }, speed)
            }else{
                if(doBlink == 1){
                    blinkEnd(whereTo, blinkChar, blinkTimes, blinkSpeed)
                }else{
                    whereTo.style.height = "auto"
                    whereTo.style.width = "auto"
                }
            }
        }, timeout)
    }

    //retroWrite("hi maj name is james and i dont know what to say so i say this.", document.getElementById('in2'))
    document.querySelectorAll("[retro]").forEach(element => {
        element.style.width = element.offsetWidth + "px"
        element.style.height = element.offsetHeight + "px" 
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
            retroWrite(element.innerText, element, undefined, args[0], args[1], args[2], args[3], args[4])
        }else{
            retroWrite(element.innerText, element)
        }
    }); 
})


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

        //this.object.style.width = `${size}px`;
        this.object.style.height = `${this.size}px`;

        document.body.append(this.object)

        window.addEventListener('mouseout', (event) => {
            if (!event.relatedTarget || event.relatedTarget.nodeName === "HTML")
            this.startAutoRotate(10, 4)
        });

        this.startAutoRotate(10, 4)

        window.addEventListener('mouseover', (event) => {
            if (!event.relatedTarget || event.relatedTarget.nodeName === "HTML")
            this.stopAutoRotate()
            this.startFollowMouse()
        });

        window.addEventListener('mousemove', (event) => {
            if(!this.followMouse) return;
                this.rotateToXY(event.clientX, event.clientY)
        })
    }

    setRotation(deg){
        this.degre = deg;   
        this.object.style.transform = `${this.flipImg ? 'scale(-1)' : ''} rotate(${this.degre - this.fixedDegre % 360}deg)`;
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
        console.log(whereTo.getBoundingClientRect())
        this.object = whereTo;
        this.eyeArray = eyeArray;

        this.repositionEyes()
        window.addEventListener("resize", () => this.repositionEyes())
    }

    repositionEyes(){
        let posTo = this.object.getBoundingClientRect()
        
        for(let eye of this.eyeArray){
            eye.object.style.left = `${posTo.left + (posTo.width * (eye.x / 100)) - eye.size / 2}px`;
            eye.object.style.top = `${posTo.top + (posTo.height * (eye.y / 100)) - eye.size / 2}px`;
        }
    }
}
