const API_URL = "http://localhost:3000";

let accessToken = "";
let refreshTokenCookie = "";

const logInfo = (msg: string) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`);
const logSuccess = (msg: string) => console.log(`\x1b[32m[SUCCESS] ✔\x1b[0m ${msg}`);
const logError = (msg: string, err?: any) => {
    console.error(`\x1b[31m[ERROR] ✖\x1b[0m ${msg}`);
    if (err) console.error(err);
};

const extractCookie = (response: Response) => {
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) refreshTokenCookie = setCookieHeader.split(";")[0];
};

async function runProfileFlow() {
    console.log("\n👤 BẮT ĐẦU CHẠY AUTOMATION TEST - USER PROFILE FLOW 👤\n");

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
        extractCookie(res);
        logSuccess("Login thành công!");

        // 2. UPDATE PROFILE
        logInfo("\n2. Testing [PUT /user/me]...");
        res = await fetch(`${API_URL}/user/me`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                displayName: "Test User Updated",
                firstName: "Test",
                lastName: "Updated"
            }),
        });
        json = await res.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors || json.message));
        logSuccess(`Cập nhật Profile thành công! Tên mới: ${json.data.displayName}`);

        // 3. CHANGE PHONE
        logInfo("\n3. Testing [PATCH /user/me/phone]...");
        res = await fetch(`${API_URL}/user/me/phone`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({ phoneNumber: "0999888777" }),
        });
        json = await res.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors || json.message));
        logSuccess(`Cập nhật SĐT thành công! SĐT mới: ${json.data.phoneNumber}`);

        // 4. CHANGE PASSWORD
        logInfo("\n4. Testing [PATCH /user/me/password]...");
        res = await fetch(`${API_URL}/user/me/password`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({ oldPassword: "admin123", newPassword: "new_admin123" }),
        });
        json = await res.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors || json.message));
        logSuccess("Đổi mật khẩu thành công!");

        // 5. REVERT PASSWORD
        logInfo("\n5. Đang khôi phục lại mật khẩu gốc [PATCH /user/me/password]...");
        res = await fetch(`${API_URL}/user/me/password`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` // Vẫn dùng token cũ vì chưa logout
            },
            body: JSON.stringify({ oldPassword: "new_admin123", newPassword: "admin123" }),
        });
        json = await res.json();
        if (!json.success) throw new Error(JSON.stringify(json.errors || json.message));
        logSuccess("Khôi phục mật khẩu gốc thành công!");

        console.log("\n🎉 TOÀN BỘ USER PROFILE FLOW ĐÃ CHẠY THÀNH CÔNG! 🎉\n");
    } catch (error: any) {
        console.log("\n");
        logError("Test Flow bị gián đoạn do lỗi!", error.message);
        console.log("\n");
    }
}

runProfileFlow();