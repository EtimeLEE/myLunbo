;(function(window, document){
    var Lunbo = function(elem,opts){
        var defaults = {
            buttons: true,
            arrows: true,
            autoPlay: true,
            times: 3000,
            speeds: 20,
            interval: 10 // 位移间隔时间
        };
        opts = opts || {};

        for (var i in defaults) {
            if (typeof opts[i] == "undefined") {
                opts[i] = defaults[i];
            }
        }

        this.params = opts;
        this.container = document.querySelector(elem);
        this.list = document.getElementById('list');
        this.listItem = this.list.getElementsByTagName('li');
        this.len = this.listItem.length;
        this.liWidth = this.listItem[0].offsetWidth;
        this.index = 1;
        this.buttons = document.getElementById('buttons');
        this.isMove = false;
        this.timer = null;

        this.init();
    };

    Lunbo.prototype = {
        init: function() {
            this.clone();
            if (this.params.arrows) {
                this.showArrows();
            }
            if (this.params.buttons) {
                this.showButton();
            }
            if (this.params.autoPlay) {
                this.autoPlay();
            }

        },
        showButton: function(){
            var buttons = document.createElement('div');
            buttons.setAttribute('id','buttons');
            for(var i = 0; i < this.len; i++){
                var btnSpan = document.createElement("span");
                buttons.appendChild(btnSpan);
            }
            this.container.appendChild(buttons);
            buttons.getElementsByTagName('span')[0].className = 'on';

            this.buttons = document.getElementById('buttons');
            this.buttonSpan = buttons.getElementsByTagName('span');
            for(var j = 0; j < this.len; j++){
                if(this.buttonSpan[j].className == 'on'){
                    this.buttonSpan[j].className = '';
                    break;
                }
            }
            this.buttonSpan[this.index - 1].className = 'on';

            this.buttonCtrl();
        },
        buttonCtrl: function(){
            var self = this;
            for(var i = 0; i < this.len; i++){
                this.buttonSpan[i].index = i;
                this.buttonSpan[i].onclick = function(){
                    var myIndex = this.index + 1;
                    if(self.className == 'on'){
                        return;
                    }
                    var offset = -600 * (myIndex - self.index);
                    self.animate(offset);
                    if(!self.isMove){
                        self.animate(offset);
                    }
                    self.index = myIndex;
                    self.showButton();
                };
            }
        },
        showArrows: function() {
            var self = this;
            var prev = document.createElement('div');
            prev.innerHTML = '&lt';
            prev.setAttribute('id','prev');
            prev.setAttribute('class','arrow');

            var next = document.createElement('div');
            next.innerHTML = '&gt';
            next.setAttribute('id','next');
            next.setAttribute('class','arrow');

            this.container.appendChild(prev);
            this.container.appendChild(next);
            this.prev = document.getElementById('prev');
            this.next = document.getElementById('next');

            this.prev.onclick = function(){
                if(!self.isMove){
                    self.animate(self.liWidth);
                }

            };

            this.next.onclick = function(){
                if(!self.isMove){
                    self.animate(-self.liWidth);
                }
            };
        },
        clone: function(){
            var firstLi = document.createElement('li');
            var lastLi = document.createElement('li');

            firstLi.innerHTML = this.listItem[0].innerHTML;
            lastLi.innerHTML = this.listItem[this.len - 1].innerHTML;

            this.list.appendChild(firstLi);
            this.list.insertBefore(lastLi,this.listItem[0]);
        },
        animate: function(offset){
            var self = this;
            var newLeft = parseInt(this.list.style.left) + offset;

            this.isMove = true;

            if(offset < 0){
                this.params.speeds = -Math.abs(this.params.speeds);
                if(this.index == this.len ){
                    this.index = 1;
                }else{
                    this.index += 1;
                }
            }else{
                this.params.speeds = Math.abs(this.params.speeds);
                if(this.index == 1 ){
                    this.index = this.len;
                }else{
                    this.index -= 1;
                }
            }

            function move(){

                if((offset < 0 && parseInt(self.list.style.left) > newLeft) || (offset > 0 && parseInt(self.list.style.left) < newLeft)){
                    self.list.style.left = parseInt(self.list.style.left) + self.params.speeds + 'px';
                    setTimeout(move,self.params.interval);

                }
                else{
                    self.isMove = false;
                    self.list.style.left = newLeft + 'px';
                    if(newLeft > -self.liWidth){
                        self.list.style.left = -self.liWidth * self.len + 'px';
                    }
                    if(newLeft < -self.liWidth * self.len){
                        self.list.style.left = -self.liWidth + 'px';
                    }
                }
            }
            move();
            self.showButton();
        },
        autoPlay: function(){
            var self = this;
            function play(){
                self.timer = setInterval(self.next.onclick,self.params.times);
            }
            function stop(){
                clearInterval(self.timer);
            }
            play();
            self.container.onmouseover = stop;
            self.container.onmouseout = play;
        }
    };

    window.lunbo = Lunbo;
})(window, document);