enchant('draw');

/*
Core : ゲーム本体
- rootScene
-- Sprite(pandaオブジェクト)


*/
window.onload = function(){

	GAMEN_WIDTH = 720;
	GAMEN_HEIGHT = 960;
	PANDA_GRAV = 5;		//パンダの重力
	PANDA_JUMP = 30;	//パンダのジャンプ力
	TAKE_FLG = true;	//竹を出すフラグ
	TAKE_FREQ = 60;		//竹の出現頻度
	TAKE_MOVE = 10;		//竹の早さ
	TAKE_PATT = 32;		//竹のパターン数
	TAKE_HOLE = 250;	//竹の隙間
	TAKE_PRAC = 2;		//竹のチュートリアル数
	SCORE_FREQ = 1;		//スコア加点量

	game = new Game(GAMEN_WIDTH,GAMEN_HEIGHT);
	game.preload(['panda1.png','take1.png','take2.png','yuka.png']);
	game.fps = 24;
	game.score = -1;
	
	game.onload = function(){
		//背景
		var scene = game.rootScene;
		scene.backgroundColor = '#7CC28E';
		
		//現在のスコア表示
		txtNowScr = new MutableText(GAMEN_WIDTH/2 + 50,200,game.width,"0");
		txtNowScr.scale(4,4);
		
		//ゲームオーバーシーン
		createGameoverScene = function () {
			var scene = new Scene();
			var txtRestart = new Text(GAMEN_WIDTH/2 - 120,GAMEN_HEIGHT/2 - 30,"TOUCH TO RESTART");
			txtRestart.scale(2,2);
			var txtScore = new Text(GAMEN_WIDTH/2 - 50,GAMEN_HEIGHT/2 - 90, "SCORE:" + game.score);
			txtScore.scale(3,3);
			
			scene.addChild(txtRestart);
			scene.addChild(txtScore);
			txtRestart.addEventListener(Event.TOUCH_START,function(e){
				//ページのリロード
				window.location.reload();
			});
			
			return scene;
		};
		
		//パンダ表示		
		panda = new Sprite(68,68);
		panda.image = game.assets['panda1.png'];
		panda.x = 0;
		panda.y = 100;
		panda.frame = 1;
		panda.vy = 0;
		panda.jumping = false;
		
		panda.addEventListener('enterframe',function(){	
			//加速度計算
			this.vy += PANDA_GRAV;
			
			//パンダ位置
			this.x = 100;
			this.y += this.vy; 	

			//画面外制御
			if(this.x > GAMEN_WIDTH) this.x = 0;
			if(this.y < - 200) this.y = - 200;
			if(this.y > GAMEN_HEIGHT) this.y = GAMEN_HEIGHT - 75;
		});
		
		game.rootScene.addEventListener('enterframe',function(){		
            // フレームごとに竹を増やす関数を実行
			if(game.frame % TAKE_FREQ == 0){
					//最初は簡単
				if (game.score < TAKE_PRAC) {
					if (game.score == 0) {addTake(rand(TAKE_PATT),70);}
					else if (game.score == 1) {addTake(rand(TAKE_PATT),50);}
					else if (game.score == 2) {addTake(rand(TAKE_PATT),30);}
					else {addTake(rand(TAKE_PATT),100);}
				}else{
					//3回目以降完全ランダム
					if (TAKE_FLG) addTake(rand(TAKE_PATT),0);
				}
            }
            //点数追加
            if(game.frame % TAKE_FREQ == 0){
				game.score += SCORE_FREQ;
				txtNowScr.text = "" + game.score;
			}
		});
		
		//パンダジャンプ
		game.rootScene.addEventListener('touchstart',function(){		
			panda.vy = -PANDA_JUMP;
			panda.jumping = true;
		});
		
		//原基本クラス
		var Hara = Class.create(Sprite,{
			initialize: function(x,y,f) {
				Sprite.call(this, 2000, 100);		//継承元クラスの初期化
				this.x = x;
				this.y = y;
				this.frame = f;
				this.image = game.assets['yuka.png'];
				game.rootScene.addChild(this);
			},
			onenterframe:function(){				//enterframe時のイベントリスナー
				this.x -= 10;
				if (this.x < -1000) this.x = GAMEN_WIDTH;
				if (this.within(panda,100)){
					//lblStatus.text = 'HIT';	
				}
			}
		});
		
		var hara
		hara = new Hara(0,950,0);
		hara = new Hara(1000,950,0);

		//rootSceneに追加。
		game.rootScene.addChild(txtNowScr);
		game.rootScene.addChild(panda);

	}
	game.start();
	//game.debug();

};

//引数num番目に高さslit分開け、竹を生成する関数
function addTake(num,slit){
	num += 1;

	var takeOver = new Sprite(220, 1000);
	takeOver.x = 1000;
	takeOver.y = slit + 200 + (GAMEN_HEIGHT - (TAKE_HOLE)) * num / TAKE_PATT;
	takeOver.image = game.assets['take1.png'];
	
	takeOver.addEventListener('enterframe', function(e){
		this.x -= TAKE_MOVE;
		if(this.intersect(panda)){
			gameEnd();
		}
	});
	
	var takeUnder = new Sprite(220, 1000);
	takeUnder.x = 1000;
	takeUnder.y = -slit -1000 + (GAMEN_HEIGHT - (TAKE_HOLE)) * num / TAKE_PATT ;
	takeUnder.image = game.assets['take2.png'];
	
	takeUnder.addEventListener('enterframe', function(e){
		this.x -= TAKE_MOVE;
		if (this.intersect(panda)){
			gameEnd();
		}
	});
	
	game.rootScene.addChild(takeOver);
	game.rootScene.addChild(takeUnder);

}

function gameEnd(){
	TAKE_MOVE = 0;
	SCORE_FREQ = 0;
	//PANDA_GRAV = 0;
	PANDA_JUMP = 0;
	TAKE_FLG = false;
	txtNowScr.text = "";
	game.pushScene(createGameoverScene());
}

// 引数 num を受け取って、0 から (num - 1) までの乱数を返す関数
function rand(num){
    return Math.floor(Math.random() * num);
}