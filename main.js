enchant();

/*
Core : ゲーム本体
- rootScene
-- Sprite(pandaオブジェクト)


*/

window.onload = function(){

	var GAMEN_WIDTH = 720;
	var GAMEN_HEIGHT = 960;
	var j_flag = false; //ジャンプフラグ
	var j_frame = 0;	//ジャンプ処理フレーム数
	var j_frameMax = 6;	//ジャンプ処理フレーム最大
	var j_pix = 0;		//ジャンプ実移動量
	
	var jumpForce = 1;//ジャンプ力
	var downForce = 10;	//重力

	var core = new Core(GAMEN_WIDTH,GAMEN_HEIGHT);
	core.preload('panda1.png');
	core.preload('take1.png');
	core.preload('take2.png');
	core.fps = 15;
	core.onload = function(){
				
	var scene = core.rootScene;
	scene.backgroundColor = '#7CC28E';
				
		var panda = new Sprite(68,68);
		panda.image = core.assets['panda1.png'];
		panda.x = 0;
		panda.y = 100;
		panda.frame = 1;
		
		panda.addEventListener('enterframe',function(){	
			//加速度計算
			if (j_flag == true) {
				if (j_frame == j_frameMax){
					j_flag = false;
					j_pix = 0;
				}else{
					j_pix -= jumpForce * (j_frameMax - j_frame) * (j_frameMax - j_frame);
				}
				j_frame += 1;
				this.y += j_pix;
			};
			
			//パンダ位置
			this.x = 100;
			this.y += downForce; 	

			//画面外制御
			if(this.x > GAMEN_WIDTH) this.x = 0;
			if(this.y > GAMEN_HEIGHT) this.y = 0;
		});
		
		//竹基本クラス
		var Take = Class.create(Sprite,{
			initialize: function(x,y,f) {
				Sprite.call(this, 250, 125);		//継承元クラスの初期化
				this.x = x;
				this.y = y;
				this.frame = f;
				this.image = core.assets['take1.png'];
				core.rootScene.addChild(this);
			},
			onenterframe:function(){				//enterframe時のイベントリスナー
				this.x -= 10;
				if (this.x < -250) this.x = GAMEN_WIDTH;
				if (this.within(panda,100)){
					lblStatus.text = 'HIT';	
				}
			}
		});
		
				//竹基本クラス
		var Take2 = Class.create(Sprite,{
			initialize: function(x,y,f) {
				Sprite.call(this, 250, 125);		//継承元クラスの初期化
				this.x = x;
				this.y = y;
				this.frame = f;
				this.image = core.assets['take2.png'];
				core.rootScene.addChild(this);
			},
			onenterframe:function(){				//enterframe時のイベントリスナー
				this.x -= 10;
				if (this.x < -250) this.x = GAMEN_WIDTH;
				if (this.within(panda,100)){
					lblStatus.text = 'HIT';	
				}
			}
		});
		
		//竹表示
		var takes = [];
		var iMax = 0
		
		for (var i = 0; i <= iMax; i++){
			takes[i] = new Take(500, GAMEN_HEIGHT - (i * 125),3);
			
			if (i == iMax){
				takes[iMax + 1] = new Take(500, GAMEN_HEIGHT - (i * 125) -125,2);
				takes[iMax + 2] = new Take(500, GAMEN_HEIGHT - (i * 125) -250,1);
				takes[iMax + 3] = new Take(500, GAMEN_HEIGHT - (i * 125) -375,0);
			}
		}

		iMax = 0
		var takes2 = [];	
		for (var i = 0; i <= iMax; i++){
			takes2[i] = new Take2(650,(i * 125),0);
			
			if (i == iMax){
				takes2[iMax + 1] = new Take2(650, (i * 125),1);
				takes2[iMax + 2] = new Take2(650, (i * 125) +125,2);
				takes2[iMax + 3] = new Take2(650, (i * 125) +250,3);
			}
		}
		
		//パンダジャンプ
		core.rootScene.addEventListener('touchstart',function(){		
			j_flag = true;
			j_frame = 0;
		});
		
		//ラベルの操作。
		var lblScore = new Label();
		lblScore.x = GAMEN_WIDTH - 100;
		lblScore.y = 5;
		lblScore.color = 'red';
		lblScore.font = '24px "Arial"';
		lblScore.text = '0'
		lblScore.addEventListener('enterframe',function(){
			lblScore.text = (core.frame / core.fps).toFixed(2);
		});
		
		var lblStatus = new Label();
		lblStatus.x = GAMEN_WIDTH - 100;
		lblStatus.y = 30;
		lblStatus.color = 'red';
		lblStatus.font = '24px "Arial"';
		lblStatus.text = '';

		//rootSceneに追加。
		core.rootScene.addChild(lblScore);
		core.rootScene.addChild(lblStatus);
		core.rootScene.addChild(panda);
		core.rootScene.addChild(take);

	}
	//core.start();
	core.debug();

};

//function作成
function rand(n) {
	return Math.floor(Math.random() * (n + 1));
}