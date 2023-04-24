export default class SpeedLevelScene extends Phaser.Scene{
    private width : number = 0
    private height : number = 0
    private centerX : number = 0
    private centerY : number = 0
    private static level : string = "normal";
    private static count : number = 3;
    constructor() {
        // super(key:'menuScene')で渡す値はゲームの切り替えやスタートなどに使う
        // Phaser.Scene.start('menuScene')やPhaser.Scene.switch('menuScene')など
        super({ key: 'SpeedLevelScene'});
    }
    public static getLevel() : string{
        return this.level
    }

    public static setLevel(newLevel: string): void {
        this.level = newLevel;
    }
    public static getCount() : number{
        return this.count
    }

    public static setCount(newCount: number): void {
        this.count = newCount;
    }
    //preload()はリソースの読み込み処理
    //トランプの画像読み込みとかで使う
    preload() {
        //this.load.image();など
    }
    // 状態管理のためのオブジェクト
    create(){
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        // タイトルの表示
        this.createTitleText()

        // レベル選択用のテキスト
        //this.createLevelButtons() 

        // 敵の数のテキストとボタン
        //this.createEnemyButtons()

        //ルール追加
        this.createRulesText() 

        //3つのボタン追加
        this.createControlButtons() 
    }
    //タイトルの追加
    createTitleText() {
        const titleText = this.add.text(this.centerX, this.heightPosition(0.1), 'スピード -Speed-', { fontSize: '32px', color: '#fff' });
        titleText.setOrigin(0.5, 0.5);
    }

    //難易度選択
    //ルールを追加するためのメソッド
    createRulesText() {
        const ruleFrameX = this.widthPosition(0.15)
        const ruleFrameY = this.heightPosition(0.2)
        const ruleWidth = this.widthPosition(0.70)
        const ruleHight = this.heightPosition(0.60)
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRect(ruleFrameX, ruleFrameY, ruleWidth, ruleHight);
        const speedRuleText = [
            "Speed（スピード）は、2人でプレイするトランプゲームの一種です。プレイヤーは手札を持ち、",
            "場に出されたカードに対して同じ数字または連続する数字のカードを出すことができます。",
            "同時に場に出せるカードがあれば、先に出した方が勝ちとなり、場に出されたカードを",
            "獲得できます。手札がなくなったプレイヤーの勝利となります。手札が残った場合は、",
            "場に出せるカードがなくなった時点で、手札をシャッフルして続けます。"
          ].join("\n");
        const fontSize = Math.min(20, Math.max(8, Math.floor(this.cameras.main.width / 60)));
        const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, speedRuleText, { fontSize: `${fontSize}px`, color: '#fff',align: 'left', wordWrap: { width: ruleWidth - 20 } });
        //const rulesText = this.add.text(ruleFrameX + 10, ruleFrameY + 10, blackjackRuleText, { fontSize: '16px', color: '#fff', wordWrap: { width: ruleWidth - 20 } });
    }

    //start, quit, tutorialボタン追加
    createControlButtons() {
        const buttonSpacing = this.widthPosition(0.1);
        const buttonY = this.centerY + 250;

        const startButton = this.add.text(this.centerX - buttonSpacing, buttonY, 'START', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        startButton.setOrigin(0.5, 0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('SpeedGameScene');
            this.scene.stop('SpeedLevelScene');
        })

        const quitButton = this.add.text(this.centerX + buttonSpacing, buttonY, 'QUIT', { fontSize: '20px', color: '#fff', backgroundColor: '#1a1a1a'});
        quitButton.setOrigin(0.5, 0.5);
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
            this.scene.stop('SpeedLevelScene');
        })
    }

    //引数にnumをとることで, 画面の幅に対する割合をかけてその数字を利用することができる.
    widthPosition(num : number) : number{
        if(num <= 1 && num >= 0){
            return this.width * num
        }
        return 0;
    }
    heightPosition(num : number, height = this.height) : number{
        if(num <= 1 && num >= 0){
            return this.height * num
        }
        return 0;
    }

}