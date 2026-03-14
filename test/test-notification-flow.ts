const API_URL = "http://localhost:3000";

let accessToken = "";
let refreshTokenCookie = "";
let currentUserId = "";
let notificationId = "";

const logInfo = (msg: string) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`);
const logSuccess = (msg: string) => console.log(`\x1b[32m[SUCCESS] ✔\x1b[0m ${msg}`);
const logError = (msg: string, err?: any) => {
    console.error(`\x1b[31m[ERROR] ✖\x1b[0m ${msg}`);
    if (err) console.error(err);
};

const extractCookie = (response: Response) => {
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
        refreshTokenCookie = setCookieHeader.split(";")[0];
    }
};

async function runNotificationFlow() {
    console.log("\n🔔 BẮT ĐẦU CHẠY AUTOMATION TEST - NOTIFICATION FLOW 🔔\n");

    try {
        // 1. LOGIN
        logInfo("1. Testing [POST /auth/login]...");
        let res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "admin123" }),
        });
        let json = await res.json();
        if (!json.success) throw new Error(json.message);
        accessToken = json.data.accessToken;
        currentUserId = json.data.user.id || json.data.user._id;
        extractCookie(res);
        logSuccess("Login thành công!");

        // 2. CREATE NOTIFICATION
        logInfo("\n2. Testing [POST /notifications]...");
        res = await fetch(`${API_URL}/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                userId: currentUserId,
                title: "Test Thông báo mới",
                message: "Đây là thông báo được tạo từ Auto Test script.",
                type: "SYSTEM",
            }),
        });
        json = await res.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors || json.message));
        notificationId = json.data.id || json.data._id;
        logSuccess(`Tạo thông báo thành công! ID: ${notificationId}`);

        // 3. GET UNREAD COUNT
        logInfo("\n3. Testing [GET /notifications/unread-count]...");
        res = await fetch(`${API_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        json = await res.json();
        if (!json.success) throw new Error(json.message);
        logSuccess(`Lấy số lượng chưa đọc thành công: ${json.data.unreadCount}`);

        // 4. GET ALL NOTIFICATIONS
        logInfo("\n4. Testing [GET /notifications?page=1&limit=5]...");
        res = await fetch(`${API_URL}/notifications?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        json = await res.json();
        if (!json.success) throw new Error(json.message);
        logSuccess(`Lấy danh sách thông báo thành công! Total: ${json.meta.total}`);

        // 5. MARK AS READ (1 item)
        logInfo(`\n5. Testing [PATCH /notifications/${notificationId}/read]...`);
        res = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        json = await res.json();
        if (!json.success) throw new Error(json.message);
        logSuccess("Đánh dấu 1 thông báo đã đọc thành công!");

        // 6. MARK ALL AS READ
        logInfo("\n6. Testing [PATCH /notifications/read-all]...");
        res = await fetch(`${API_URL}/notifications/read-all`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        json = await res.json();
        if (!json.success) throw new Error(json.message);
        logSuccess("Đánh dấu toàn bộ đã đọc thành công!");

        // 7. DELETE NOTIFICATION
        logInfo(`\n7. Testing[DELETE /notifications/${notificationId}]...`);
        res = await fetch(`${API_URL}/notifications/${notificationId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        json = await res.json();
        if (!json.success) throw new Error(json.message);
        logSuccess("Xóa thông báo thành công!");

        console.log("\n🎉 TOÀN BỘ NOTIFICATION FLOW ĐÃ CHẠY THÀNH CÔNG! 🎉\n");
    } catch (error: any) {
        console.log("\n");
        logError("Test Flow bị gián đoạn do lỗi!", error.message);
        console.log("\n");
    }
}

runNotificationFlow();
