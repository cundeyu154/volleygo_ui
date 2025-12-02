// 從 .env 讀取後端 API 資訊
const BASE_URL = import.meta.env.VITE_AI_API_URL;
const ENDPOINT = import.meta.env.VITE_NOTIFICATION_API_ENDPOINT; // 預期值為 /api/send-match-invite

/**
 * 呼叫後端 API，發送指定比賽的揪團通知。
 * @param {string} matchId - 要發送通知的比賽 ID
 * @returns {boolean} - 發送是否成功
 */
export async function sendMatchNotification(matchId) {
    // 檢查環境變數是否已設定
    if (!BASE_URL || !ENDPOINT || BASE_URL.includes("undefined")) { 
        console.error("錯誤：請檢查 volleyMatch-main/.env 檔案中 VITE_AI_API_URL 是否已設定為 http://localhost:3001。");
        alert("無法連接後端服務，請檢查 API 設定。");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 如果您專案需要，可以在這裡加入認證 Token
            },
            // 將比賽 ID 放入請求體中，傳給後端
            body: JSON.stringify({ matchId: matchId }) 
        });

        if (!response.ok) {
            // 處理後端返回的錯誤（例如：404 找不到收件人，或 500 寄信失敗）
            const errorData = await response.json();
            throw new Error(errorData.message || '發送通知 API 請求失敗');
        }

        // 成功發送
        return true;

    } catch (error) {
        console.error('發送通知 API 請求錯誤:', error.message);
        alert(`發送通知失敗: ${error.message}`);
        return false;
    }
}