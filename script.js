// 🚨 GASのCode.gsの内容をこのJSファイルに移植します。
// 認証情報とロジックをクライアント側で実行します。
const credentials = {
    // ユーザー名: { password: 'パスワード', url: '表示するサイトのURL', title: 'メインコンテンツのタイトル' }
    'suki': { 
      password: 'syakai', 
      url: 'https://docs.google.com/document/d/10FwxsHyKLmKakykquBkWvPuDOIY4wK4-7pztO-ASGXU/edit?tab=t.0',
      title: '社会好き'
    },
    'toku': { 
      password: 'taisaku', 
      url: 'https://docs.google.com/document/d/12tB1gPONtisDKg104fT7prA_Hrsr8okFoRJwn5SLYtc/edit?tab=t.0', 
      title: '特殊対策本部'
    },
    'user3': { 
      password: 'pass3', 
      url: 'https://google.com', 
      title: 'まだできないよ'
    },
};

/**
 * ログイン処理をシミュレートし、結果を返します。（GAS processLoginの代替）
 * @param {string} username 
 * @param {string} password 
 * @returns {object} 認証結果を含むオブジェクト
 */
function processLogin(username, password) {
    const user = credentials[username];

    if (user && user.password === password) { 
        return { 
            success: true, 
            message: 'ログイン成功', 
            targetUrl: user.url, 
            targetTitle: user.title 
        };
    } else {
        return { success: false, message: 'ユーザー名またはパスワードが違います' };
    }
}


// 🚨 1. メッセージの表示・非表示を切り替える関数
function toggleMessage() {
    const container = document.getElementById('message-content');
    const button = document.getElementById('toggle-button');
    
    if (!container || !button) return; 

    if (container.style.display === 'none') {
        container.style.display = 'block'; 
        button.textContent = 'メッセージを非表示にする';
    } else {
        container.style.display = 'none'; 
        button.textContent = 'メッセージを表示する';
    }
    
    // メッセージの表示/非表示でiframeのサイズが変わるため、強制リフローを呼び出す
    forceReflow();
}

// 🚨 2. 強制リフロー関数
function forceReflow() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
         mainContent.style.display = 'none';
         mainContent.offsetHeight; // 強制リフロー
         mainContent.style.display = 'flex';
    }
}

// 🚨 3. ログイン成功時の処理 (メインロジック)
function onLoginSuccess(result) {
    const mainContent = document.getElementById('main-content');
    const toggleButton = document.getElementById('toggle-button');

    if (result.success) {
        const targetUrl = result.targetUrl;
        
        // 1. ログインフォームを確実に隠す
        document.getElementById('login-container').style.display = 'none';

        // 2. iframeのURLを更新
        document.getElementById('target-iframe').src = targetUrl;
        
        // 3. メインコンテンツを表示する
        mainContent.style.display = 'flex'; 

        // 4. 強制リセット（リフロー）
        forceReflow(); 
        
        // 5. ボタンにイベントリスナーを設定する
        if (toggleButton) {
            const messageContent = document.getElementById('message-content');
            if(messageContent) {
                 // メッセージコンテナを初期表示
                 messageContent.style.display = 'block'; 
                 toggleButton.textContent = 'メッセージを非表示にする';
            }
            toggleButton.addEventListener('click', toggleMessage);
        }

    } else {
        // 認証失敗
        document.getElementById('message').textContent = result.message;
        document.getElementById('login-container').style.display = 'block'; 
        document.getElementById('main-content').style.display = 'none'; 
    }
}

// フォーム送信時の処理 (onLoginSuccessを直接呼び出すように変更)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    document.getElementById('login-container').style.display = 'none'; // 一時的に隠す

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // 🚨 修正: サーバー関数(google.script.run)の代わりに、
    // 移植した processLogin 関数を直接呼び出し、結果を onLoginSuccess に渡す
    const result = processLogin(username, password);
    onLoginSuccess(result);
});


// 🚨 右クリック・キーボード禁止処理 (変更なし)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    alert('禁止されています。');
});

document.addEventListener('keydown', function(event) {
    var isForbiddenShortcut = false;

    if ((event.ctrlKey && event.shiftKey && (event.key === 'C' || event.key === 'c')) ||
        (event.ctrlKey && event.shiftKey && (event.key === 'L' || event.key === 'l')) ||
        (event.key === 'F12')) {
        isForbiddenShortcut = true;
    }

    if (isForbiddenShortcut) {
        event.preventDefault();
        alert('禁止されています。');
    }
});