enchant();

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
	SCORE_FREQ = 1;		//スコア加点量

	game = new Game(GAMEN_WIDTH,GAMEN_HEIGHT);
	game.preload(['panda1.png','take1.png','take2.png','yuka.png']);
	game.fps = 24;
	game.score = -1;
	
	game.onload = function(){
		//背景
		var scene = game.rootScene;
		scene.backgroundColor = '#7CC28E';
		
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
			if(this.y > GAMEN_HEIGHT) this.y = GAMEN_HEIGHT - 75;
		});
		
		game.rootScene.addEventListener('enterframe',function(){		
            // フレームごとに竹を増やす関数を実行
			if(game.frame % TAKE_FREQ == 0){
				if (TAKE_FLG) addTake(rand(TAKE_PATT));
            }
            //点数追加
            if(game.frame % TAKE_FREQ == 0){
				game.score += SCORE_FREQ;
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
					lblStatus.text = 'HIT';	
				}
			}
		});
		
		var hara
		hara = new Hara(0,950,0);
		hara = new Hara(1000,950,0);
		
		//ラベルの操作。
		var lblScore = new Label();
		lblScore.x = GAMEN_WIDTH - 100;
		lblScore.y = 5;
		lblScore.color = 'red';
		lblScore.font = '24px "Arial"';
		lblScore.text = '0'
		lblScore.addEventListener('enterframe',function(){
			lblScore.text = game.score;
		});
		
		lblStatus = new Label();
		lblStatus.x = GAMEN_WIDTH - 100;
		lblStatus.y = 30;
		lblStatus.color = 'red';
		lblStatus.font = '24px "Arial"';
		lblStatus.text = '';

		//rootSceneに追加。
		game.rootScene.addChild(lblScore);
		game.rootScene.addChild(lblStatus);
		game.rootScene.addChild(panda);

	}
	game.start();
	//game.debug();

};

//引数num番目を開け、竹を生成する関数
function addTake(num){
	num += 1;

	var takeOver = new Sprite(220, 1000);
	takeOver.x = 1000;
	takeOver.y = 200 + (GAMEN_HEIGHT - (TAKE_HOLE)) * num / TAKE_PATT;
	takeOver.image = game.assets['take1.png'];
	
	takeOver.addEventListener('enterframe', function(e){
		this.x -= TAKE_MOVE;
		if(this.intersect(panda)){
			gameEnd();
		}
	});
	
	var takeUnder = new Sprite(220, 1000);
	takeUnder.x = 1000;
	takeUnder.y = -1000 + (GAMEN_HEIGHT - (TAKE_HOLE)) * num / TAKE_PATT ;
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
}

// 引数 num を受け取って、0 から (num - 1) までの乱数を返す関数
function rand(num){
    return Math.floor(Math.random() * num);
}