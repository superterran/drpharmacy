

var drmario = Class.create({

    speed:.1, // loop speed
    step: 5, // how far the current pill fall each loop
    pillSize: 20, // pill bit size, in pixels
    width: 20, // bottle width, in pills
    height: 5, // bottle height, in pills
    grid: [],
    colors: ['red','green','blue','white','yellow'],
    pills: [],

    pause: false,

    nextPill: false,
    nextPillBox: false,

    nextColor1: 'red',
    nextColor2: 'blue',


    //defaults

    loop: false,
    actions: [],

    initialize: function() {

        this.createStage();
        this.loadActions();
        this.startGame();
    },

    startGame: function() {

        $$('p.pill').each(function(e) { e.remove() });
        this.createPill();
        this.startLoop();

    },

    startLoop: function() {
        this.loop = new PeriodicalExecuter(function(pe) {
            this.gravity();
        }.bind(this),this.speed);
    },

    pauseGame: function() {
        if(this.pause == true) {
            this.startLoop();
            this.pause = false;
        } else {
            this.loop.stop();
            this.pause = true;
        }

    },

    endGame: function() {
        this.loop.stop();
        this.startGame();
    },

    createStage: function() {

        // stage proper

        this.stage = new Element('div', {id: 'bottle'});
        this.stage.style.width = this.pillSize * this.width;
        this.stage.style.height = this.pillSize * this.height;
        $('container').insert(this.stage);


        // next box

        this.nextPillBox = new Element('div', { id: 'nextpill' });
        var p = new Element('p');
        p.addClassName('nextpill');
        p.insert(new Element('i', {id: 'nextPill1'}));
        p.insert(new Element('i', {id: 'nextPill2'}));
        p.style.height = this.pillSize * 2;
        p.style.width = this.pillSize;
        p.style.top = 0;
        p.style.left = (this.width/2)*this.pillSize;
        this.nextPillBox.insert(p);
        $('container').insert(this.nextPillBox);



    },

    getColor: function() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    },

    gravity: function() {
        var current = this.getCurrent();

        if(!this.isFalling(current)) {
            if(this.toInt(current.style.top) == 0) {
                this.endGame(); return;
            }
            this.createPill();
        } else {
            current.style.top = this.toInt(current.style.top)+this.step;
        }
    },

    isFalling: function(pill) {

        var bottom = (this.toInt(pill.style.top) + this.toInt(pill.style.height));
        var falling = true;

        $$('p.pill').each(function(pl) {
            if(!pl.hasClassName('current')) {
                if(bottom >= this.toInt(pl.style.top)) falling = false;
            }

        }.bind(this));

        if(falling == false) return false;
        if(this.toInt($('bottle').style.height) <= bottom) return false;
        return true;
    },

    getCurrent: function() {

      return $$('.current').first();
    },

    toInt: function(int) {

        return parseInt(int.sub('px',''));

    },

    createPill: function(color1, color2) {

        if(!color1) color1 = this.nextColor1;
        if(!color2) color2 = this.nextColor2;

        this.nextColor1 = this.getColor();
        this.nextColor2 = this.getColor();

        if(this.getCurrent()) this.getCurrent().removeClassName('current');
        var p = new Element('p');

        p.addClassName('pill');
        p.addClassName('current');
        p.insert(new Element('i', { style: "background-color:"+color1+" ;width: "+this.pillSize+"px; height: "+ this.pillSize+"px" }));
        p.insert(new Element('i', { style: "background-color:"+color2+" ;width: "+this.pillSize+"px; height: "+ this.pillSize+"px" }));
        p.style.height = this.pillSize * 2;
        p.style.width = this.pillSize;
        p.style.top = 0;
        p.style.left = (this.width/2)*this.pillSize;
        $('bottle').insert(p);
        $('nextPill1').style.backgroundColor = this.nextColor1;
        $('nextPill2').style.backgroundColor = this.nextColor2;

    },

    loadActions: function() {

        this.actions['stop']    = function(){ this.orient_x = 0; /* no action */ }.bind(this);
        this.actions['up']      = function(){ this.orient = 'up'; var y = this.y - this.speed; if(this.canMove(this.x, y)){ this.y = y }}.bind(this);
        this.actions['down']    = function(){ this.orient = 'down'; var y = this.y + this.speed; if(this.canMove(this.x, y)){ this.y = y }}.bind(this);
        this.actions['left']    = function(){ this.orient = 'left'; var x = this.x - this.speed; if(this.canMove(x, this.y)){ this.x = x }}.bind(this);
        this.actions['right']   = function(){ this.orient = 'right'; var x = this.x + this.speed; if(this.canMove(x, this.y)){ this.x = x }}.bind(this);
        this.actions['wasd']    = function(){
            this.action = 'stop';
            Event.observe(document, 'keydown', function(event){
                this.action = event.keyIdentifier.toLowerCase();
            }.bind(this));
            Event.observe(document, 'keyup', function(){
                this.action = 'stop';
            }.bind(this));
        }.bind(this);

    }

});

