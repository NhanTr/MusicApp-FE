# Use-case: Các chức năng đã thiết kế và triển khai

Tài liệu này mô tả các use-case chính đã được thiết kế và triển khai trong dự án MusicApp.

---

**Use Case 1 — Thêm bài hát vào playlist cá nhân**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Người dùng đã đăng nhập; bài hát đang phát hoặc có thể chọn bài hát; người dùng có ít nhất một playlist
- **Luồng chính:**
  1. Người dùng bật player và chọn nút "Thêm vào playlist".
  2. Hiển thị modal chọn playlist trong `MusicPlay`.
  3. Người dùng chọn playlist và xác nhận.
  4. Frontend gọi API: `POST /api/playlists/{playlistId}/songs` với body `{ "songId": "<UUID>" }` (thông qua `playlistsApi.addSongIntoPlaylist`).
  5. Backend thêm bản ghi liên kết bài hát vào playlist và trả kết quả thành công.
  6. UI hiển thị thông báo thành công.
- **API request:** `POST /api/playlists/{playlistId}/songs`
- **Request body mẫu:** `{ "songId": "7f9a3d2e-..." }`
- **Giao diện người dùng:** [frontend_MussicApp/src/components/MusicPlay.jsx](../src/components/MusicPlay.jsx)

---

**Use Case 2 — Ban (khóa) người dùng**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập và có quyền
- **Luồng chính:**
  1. Admin gửi lệnh khoá tài khoản tới endpoint `PUT /api/admin/users/{id}/ban` (body có thể chứa `reason`).
  2. Backend đặt `user.status = BANNED` cho user tương ứng và lưu.
  3. Hệ thống trả về kết quả xác nhận.
  4. Hậu quả: user bị `BANNED` sẽ không thể đăng nhập nữa; nếu có token cũ, filter `JwtAuthenticationFilter` sẽ ngăn xác thực.
- **API request:** `PUT /api/admin/users/{id}/ban`
- **Ghi chú liên quan:** Áp dụng enum `UserStatus` với giá trị `BANNED`.
- **Liên quan code:** [backend_MusicApp/src/main/java/nhantr/musicapp/service/AdminServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AdminServiceImpl.java)

---

**Use Case 3 — Unban (mở khoá) người dùng**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập và có quyền
- **Luồng chính:**
  1. Admin gửi `PUT /api/admin/users/{id}/unban`.
  2. Backend đặt `user.status = ACTIVE` và lưu.
  3. Hệ thống trả về xác nhận, user có thể đăng nhập trở lại.
- **API request:** `PUT /api/admin/users/{id}/unban`

---

**Use Case 4 — Đổi mật khẩu (update-password)**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Người dùng đã xác thực (có JWT hợp lệ)
- **Luồng chính:**
  1. Người dùng vào trang Profile và mở chức năng đổi mật khẩu.
  2. Người dùng nhập `newPassword` và `confirmNewPassword` (không cần `currentPassword`).
  3. Frontend gửi `PUT /api/auth/update-password` với body `{ "newPassword":"...","confirmNewPassword":"..." }`.
  4. Backend kiểm tra `newPassword == confirmNewPassword`, mã hoá và cập nhật mật khẩu.
  5. Hệ thống trả về kết quả thành công.
- **API request:** `PUT /api/auth/update-password`
- **Request body mẫu:** `{ "newPassword": "P@ssw0rd", "confirmNewPassword": "P@ssw0rd" }`
- **Giao diện người dùng:** [frontend_MussicApp/src/features/profile/Profile.jsx](../src/features/profile/Profile.jsx)
- **Ghi chú bảo mật:** Việc loại bỏ `currentPassword` làm cho luồng đổi mật khẩu đơn giản hơn nhưng có thể giảm một lớp xác thực — cân nhắc yêu cầu currentPassword nếu môi trường yêu cầu an toàn cao.

---

**Use Case 5 — Đăng nhập bị chặn khi tài khoản bị BANNED**
- **Actor:** Người dùng
- **Tiền điều kiện:** Người dùng có tài khoản (có thể đang thử đăng nhập hoặc có token cũ)
- **Luồng chính:**
  1. Người dùng gửi `POST /api/auth/login`.
  2. Backend kiểm tra `user.status`. Nếu `BANNED` trả lỗi ứng dụng `USER_BANNED` (mã lỗi phù hợp).
  3. Nếu user cố dùng token cũ, `JwtAuthenticationFilter` khi tải user sẽ từ chối thiết lập `SecurityContext` nếu `status == BANNED`.
- **API request:** `POST /api/auth/login`

---

**Ghi chú chung & Kiểu dữ liệu liên quan**
- Các endpoint trả theo cấu trúc chung `APIResponse { code, message, data }`.
- Enum `UserStatus` (nằm ở `backend_MusicApp/src/main/java/nhantr/musicapp/enums/UserStatus.java`) có giá trị tối thiểu `ACTIVE`, `BANNED`.
- Entity `User` đã bổ sung trường `status` với mặc định `ACTIVE` và kèm `UserStatusInitializer` (CommandLineRunner) để cập nhật các bản ghi cũ có `null` thành `ACTIVE`.
- File liên quan chính:
  - [frontend_MussicApp/src/components/MusicPlay.jsx](../src/components/MusicPlay.jsx)
  - [frontend_MussicApp/src/features/profile/Profile.jsx](../src/features/profile/Profile.jsx)
  - [backend_MusicApp/src/main/java/nhantr/musicapp/entity/User.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/entity/User.java)
  - [backend_MusicApp/src/main/java/nhantr/musicapp/enums/UserStatus.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/enums/UserStatus.java)
  - [backend_MusicApp/src/main/java/nhantr/musicapp/configuration/UserStatusInitializer.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/UserStatusInitializer.java)
  - [backend_MusicApp/src/main/java/nhantr/musicapp/service/AuthServiceImpl.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/service/AuthServiceImpl.java)
  - [backend_MusicApp/src/main/java/nhantr/musicapp/configuration/JwtAuthenticationFilter.java](https://github.com/NhanTr/MusicApp-BE-/blob/daf6083bb2361f44bb7f5eb1277fe2696b76162f/src/main/java/nhantr/musicapp/configuration/JwtAuthenticationFilter.java)

**Khuyến nghị triển khai**
- Đối với môi trường production, thay vì dựa vào `spring.jpa.hibernate.ddl-auto=update` và runner để vá dữ liệu, nên tạo migration có kiểm soát (Flyway hoặc Liquibase) để ghi rõ thay đổi schema và cập nhật dữ liệu.
- Xem xét yêu cầu `currentPassword` khi đổi mật khẩu nếu cần bảo mật cao hơn.

---

Tôi có thể xuất file này sang định dạng khác (PDF, DOCX) hoặc tạo một bản tách cho từng use-case nếu bạn muốn. Bạn muốn xuất tiếp theo định dạng nào?

---

**Các use-case bổ sung (được yêu cầu)**

**Use Case — Đăng ký (Register)**
- **Actor:** Người dùng chưa có tài khoản
- **Tiền điều kiện:** Người chưa có tài khoản
- **Luồng chính:**
  1. Người dùng nhập email/số điện thoại và yêu cầu OTP tại `POST /api/auth/register/send-otp`.
  2. Backend tạo OTP, lưu tạm trong Redis và gửi qua email.
  3. Người dùng nhập thông tin đăng ký và OTP, frontend gửi `POST /api/auth/register`.
  4. Backend kiểm tra OTP, tạo tài khoản mới và trả về `UserResponse`.
- **API request:** `POST /api/auth/register/send-otp`, `POST /api/auth/register`

---

**Use Case — Đăng nhập bằng mật khẩu (Login with password)**
- **Actor:** Người dùng
- **Tiền điều kiện:** Người dùng đã có tài khoản
- **Luồng chính:**
  1. Người dùng nhập `username/email` và `password` ở form đăng nhập.
  2. Frontend gửi `POST /api/auth/login`.
  3. Backend xác thực, phát `access token` và `refresh token`, trả về.
  4. Frontend lưu token và dùng để gọi API bảo mật.
- **API request:** `POST /api/auth/login`

---

**Use Case — Đăng nhập bằng OTP (Login with OTP)**
- **Actor:** Người dùng
- **Tiền điều kiện:** Người dùng có số điện thoại hoặc email đã đăng ký
- **Luồng chính:**
  1. Người dùng yêu cầu OTP đăng nhập tại `POST /api/auth/login/send-otp`.
  2. Backend tạo OTP, lưu tạm trong Redis và gửi qua email.
  3. Người dùng gửi OTP xác thực qua `POST /api/auth/login/verify-otp`.
  4. Nếu OTP hợp lệ, backend phát `access token` và `refresh token`.
- **API requests:** `POST /api/auth/login/send-otp`, `POST /api/auth/login/verify-otp`

---

**Use Case — Đăng xuất (Logout)**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Người dùng có token đang hoạt động
- **Luồng chính:**
  1. Người dùng chọn Logout.
  2. Frontend gọi `POST /api/auth/logout` với header `Authorization: Bearer <token>`.
  3. Backend thu hồi token và trả xác nhận.
- **API request:** `POST /api/auth/logout`

---

**Use Case — Làm mới token**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có refresh token hợp lệ
- **Luồng chính:**
  1. Frontend gửi `POST /api/auth/refresh-token` kèm header `Authorization`.
  2. Backend kiểm tra token và cấp token mới.
  3. Frontend lưu token mới để tiếp tục gọi API.
- **API request:** `POST /api/auth/refresh-token`

---

**Use Case — Xem thông tin tài khoản hiện tại**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có JWT hợp lệ
- **Luồng chính:**
  1. Frontend gọi `GET /api/auth/me`.
  2. Backend trả `UserResponse` của người dùng hiện tại.
- **API request:** `GET /api/auth/me`

---

**Use Case — Nghe nhạc (Play/Stream song)**
- **Actor:** Người dùng
- **Tiền điều kiện:** Bài hát có sẵn trên server/ứng dụng; người dùng có quyền truy cập (nếu cần)
- **Luồng chính:**
  1. Người dùng chọn bài hát từ danh sách `GET /api/songs`, `GET /api/songs/{id}`, `GET /api/songs/trending` hoặc tìm kiếm qua `GET /api/songs/search`.
  2. Frontend phát file âm thanh từ dữ liệu bài hát trả về hoặc từ URL media tương ứng.
  3. Hệ thống có thể ghi lịch sử nghe vào `POST /api/history`.
- **API request:** `GET /api/songs`, `GET /api/songs/{id}`, `GET /api/songs/search`, `GET /api/songs/trending`, `POST /api/history`

---

**Use Case — Tải lên nhạc (Upload song)**
- **Actor:** Người dùng (uploader) hoặc Artist
- **Tiền điều kiện:** Người dùng đã đăng nhập; có quyền upload
- **Luồng chính:**
  1. Người dùng mở form upload và điền metadata (title, artist, album, thumbnail) và chọn file audio.
  2. Frontend gửi `POST /api/songs` với `multipart/form-data` (`fileSound`, `fileImage`, `title`, `artistId`, `albumId`, `duration`).
  3. Backend lưu file, tạo bài hát mới và sinh một bản ghi upload chờ duyệt.
  4. Admin duyệt ở `GET /api/uploads` và thao tác `PUT /api/uploads/{id}/approve` hoặc `PUT /api/uploads/{id}/reject`.
- **API request:** `POST /api/songs` (JSON), `POST /api/songs` (multipart), `GET /api/uploads`, `GET /api/uploads/me`, `PUT /api/uploads/{id}/approve`, `PUT /api/uploads/{id}/reject`

---

**Use Case — Admin: Tạo Artist**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập
- **Luồng chính:**
  1. Admin gửi `POST /api/artists` với thông tin artist (name, bio, image).
  2. Backend tạo record Artist và trả về `201 Created`.
- **API request:** `POST /api/artists`, `GET /api/artists`, `GET /api/artists/{id}`, `PUT /api/artists/{id}`, `DELETE /api/artists/{id}`

---

**Use Case — Admin: Tạo Album cho Artist**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập; Artist đã tồn tại
- **Luồng chính:**
  1. Admin tạo album qua `POST /api/albums` với metadata album (title, releaseDate, cover, artistId).
  2. Backend tạo Album liên kết tới Artist và trả về `201 Created`.
- **API request:** `POST /api/albums`, `GET /api/albums`, `GET /api/albums/{id}`, `PUT /api/albums/{id}`, `DELETE /api/albums/{id}`

---

**Use Case — Admin: Thêm bài hát vào Album**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập; Album và Song đã tồn tại
- **Luồng chính:**
  1. Admin tạo hoặc cập nhật bài hát với `artistId` và `albumId` qua `POST /api/songs` hoặc `PUT /api/songs/{id}`.
  2. Backend liên kết Song với Album trong entity `Song`.
- **API request:** `POST /api/songs`, `POST /api/songs` (multipart), `PUT /api/songs/{id}`

---

**Use Case — Quản lý playlist cá nhân**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có tài khoản và có quyền truy cập playlist
- **Luồng chính:**
  1. Người dùng xem danh sách playlist riêng tại `GET /api/playlists` hoặc playlist công khai tại `GET /api/playlists/public`.
  2. Người dùng tạo playlist mới qua `POST /api/playlists`.
  3. Người dùng cập nhật playlist qua `PUT /api/playlists/{id}` hoặc xoá playlist qua `DELETE /api/playlists/{id}`.
  4. Người dùng thêm bài hát vào playlist qua `POST /api/playlists/{id}/songs` và xoá bài hát qua `DELETE /api/playlists/{id}/songs/{songId}`.
- **API request:** `GET /api/playlists`, `GET /api/playlists/public`, `GET /api/playlists/{id}`, `POST /api/playlists`, `PUT /api/playlists/{id}`, `DELETE /api/playlists/{id}`, `POST /api/playlists/{id}/songs`, `DELETE /api/playlists/{id}/songs/{songId}`

---

**Use Case — Yêu thích bài hát**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có bài hát hợp lệ
- **Luồng chính:**
  1. Người dùng đánh dấu yêu thích qua `POST /api/favorites/{songId}`.
  2. Người dùng xoá yêu thích qua `DELETE /api/favorites/{songId}`.
  3. Hệ thống trả danh sách yêu thích bằng `GET /api/favorites`.
  4. Có thể kiểm tra trạng thái bằng `GET /api/favorites/{songId}/status`.
- **API request:** `GET /api/favorites`, `POST /api/favorites/{songId}`, `DELETE /api/favorites/{songId}`, `GET /api/favorites/{songId}/status`

---

**Use Case — Theo dõi nghệ sĩ**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có nghệ sĩ hợp lệ
- **Luồng chính:**
  1. Người dùng follow nghệ sĩ qua `POST /api/follow/artists/{artistId}`.
  2. Người dùng unfollow qua `DELETE /api/follow/artists/{artistId}`.
  3. Hệ thống trả danh sách nghệ sĩ đang follow qua `GET /api/follow/artists`.
  4. Kiểm tra trạng thái follow qua `GET /api/follow/artists/{artistId}/status`.
- **API request:** `POST /api/follow/artists/{artistId}`, `DELETE /api/follow/artists/{artistId}`, `GET /api/follow/artists`, `GET /api/follow/artists/{artistId}/status`

---

**Use Case — Tìm kiếm**
- **Actor:** Người dùng
- **Tiền điều kiện:** Không bắt buộc đăng nhập
- **Luồng chính:**
  1. Người dùng nhập từ khoá tìm kiếm.
  2. Frontend gọi `GET /api/search?q=...` hoặc `GET /api/songs/search?q=...`.
  3. Backend trả kết quả phù hợp theo từ khoá.
- **API request:** `GET /api/search`, `GET /api/songs/search`

---

**Use Case — Lịch sử nghe nhạc**
- **Actor:** Người dùng đã đăng nhập
- **Tiền điều kiện:** Có hoạt động nghe nhạc
- **Luồng chính:**
  1. Khi người dùng nghe bài hát, frontend ghi nhận lịch sử bằng `POST /api/history`.
  2. Người dùng xem lịch sử qua `GET /api/history`.
  3. Người dùng xoá toàn bộ lịch sử qua `DELETE /api/history` hoặc xoá từng mục qua `DELETE /api/history/{id}`.
- **API request:** `GET /api/history`, `POST /api/history`, `DELETE /api/history`, `DELETE /api/history/{id}`

---

**Use Case — Admin thống kê và quản trị**
- **Actor:** Admin
- **Tiền điều kiện:** Admin đã đăng nhập
- **Luồng chính:**
  1. Admin xem danh sách user tại `GET /api/admin/users` hoặc chi tiết user tại `GET /api/admin/users/{id}`.
  2. Admin ban/unban user qua `PUT /api/admin/users/{id}/ban` và `PUT /api/admin/users/{id}/unban`.
  3. Admin xoá bài hát qua `DELETE /api/admin/songs/{id}`.
  4. Admin xem dashboard thống kê qua `GET /api/admin/stats`.
- **API request:** `GET /api/admin/users`, `GET /api/admin/users/{id}`, `PUT /api/admin/users/{id}/ban`, `PUT /api/admin/users/{id}/unban`, `DELETE /api/admin/songs/{id}`, `GET /api/admin/stats`
