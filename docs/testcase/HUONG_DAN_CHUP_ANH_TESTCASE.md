# HƯỚNG DẪN CHỤP ẢNH MINH HỌA KIỂM THỬ (TESTCASE SCREENSHOT GUIDE)

Tài liệu này hướng dẫn chi tiết cách chụp ảnh màn hình (Test Evidence) để làm bằng chứng xác minh hệ thống hoạt động chính xác theo kịch bản kiểm thử (Test Case) cho cả **Web Admin** và **Web Partner (Đối tác)**.

---

## 1. Quy chuẩn chung về Ảnh chụp Minh chứng (Evidence Rules)

- **Độ phân giải & Chất lượng**: Ảnh chụp phải rõ ràng, hiển thị toàn bộ cửa sổ trình duyệt (bao gồm thanh địa chỉ URL để xác minh môi trường chạy, ví dụ: `localhost:5173`).
- **Khoanh vùng tiêu điểm (Annotations)**: Sử dụng các công cụ vẽ để khoanh đỏ, vẽ mũi tên chỉ vào các vùng thay đổi quan trọng như:
  - Thông báo thành công (Toast notification).
  - Trạng thái thay đổi (VD: `Chờ duyệt` -> `Đã duyệt`).
  - Dữ liệu mới được thêm vào bảng.
- **Quy tắc đặt tên file ảnh**: Đặt tên file theo cấu trúc sau để dễ quản lý:
  ```text
  evidence_[Mã_Test_Case]_[Tên_Mô_Tả]_[Ngày_Thực_Hiện].png
  ```
  *Ví dụ:* `evidence_TC_ADM_ROM_03_ApproveHotelSuccess_20260601.png`

---

## 2. Hướng dẫn chụp ảnh đối với Web Admin

QAs cần chụp lại các màn hình/khoảnh khắc chính sau đây để chứng minh luồng Admin chạy đúng:

### 2.1. Luồng Đăng nhập & Đăng xuất
1. **Trang Đăng nhập (Trước đăng nhập)**: Ảnh chụp màn hình form đăng nhập đã điền sẵn Email & Password mẫu.
   - *Tên file gợi ý:* `evidence_TC_ADM_AUTH_01_LoginScreen.png`
2. **Dashboard (Sau đăng nhập thành công)**: Ảnh chụp toàn bộ màn hình Dashboard hiển thị các ô chỉ số thống kê (Doanh thu, Booking, Đối tác...) và tên Admin xuất hiện trên thanh Header.
   - *Tên file gợi ý:* `evidence_TC_ADM_AUTH_01_DashboardSuccess.png`

### 2.2. Luồng Phê duyệt Đối tác (Partners)
1. **Màn hình Chờ duyệt**: Chụp danh sách đối tác đang ở tab "Đối tác" (Partners) với bộ lọc trạng thái "Chờ duyệt", hiển thị đối tác cần test.
   - *Tên file gợi ý:* `evidence_TC_ADM_PTN_03_PartnerPendingList.png`
2. **Modal Chi tiết Đối tác**: Chụp modal hiển thị toàn bộ thông tin đăng ký của đối tác đó.
   - *Tên file gợi ý:* `evidence_TC_ADM_PTN_03_PartnerDetails.png`
3. **Phê duyệt thành công**: Chụp màn hình sau khi bấm nút "Duyệt" (Approve) và xác nhận, xuất hiện thông báo thành công (toast/alert) và đối tác đó chuyển sang trạng thái "Đã duyệt" với nhãn xanh lá.
   - *Tên file gợi ý:* `evidence_TC_ADM_PTN_04_ApproveSuccess.png`

### 2.3. Luồng Phê duyệt Khách sạn & Phòng nghỉ (Rooms)
1. **Yêu cầu Chờ duyệt**: Chụp danh sách Khách sạn ở bộ lọc "Chờ duyệt", khoanh đỏ khách sạn mới gửi từ đối tác.
   - *Tên file gợi ý:* `evidence_TC_ADM_ROM_01_RoomPending.png`
2. **Modal So sánh Thay đổi (Nếu sửa đổi)**: Chụp modal so sánh thông tin cũ (Current) và thông tin mới (Request Payload Preview) mà đối tác gửi duyệt.
   - *Tên file gợi ý:* `evidence_TC_ADM_ROM_05_PayloadPreview.png`
3. **Từ chối kèm Lý do**: Chụp modal nhập lý do từ chối trước khi xác nhận.
   - *Tên file gợi ý:* `evidence_TC_ADM_ROM_04_RejectReasonModal.png`

### 2.4. Luồng Tạo Khuyến mãi & Vouchers (Promotions)
1. **Form tạo Khuyến mãi**: Ảnh chụp Modal điền đầy đủ thông tin chương trình khuyến mãi (Tên, % giảm giá, hạn sử dụng...).
   - *Tên file gợi ý:* `evidence_TC_ADM_PRM_01_PromoForm.png`
2. **Modal thêm Voucher**: Ảnh chụp khi tạo mã code (VD: `AUTUMN15`) kèm số lượt dùng cho chương trình khuyến mãi đó.
   - *Tên file gợi ý:* `evidence_TC_ADM_PRM_03_VoucherModal.png`

---

## 3. Hướng dẫn chụp ảnh đối với Web Partner (Đối tác)

Đối tác có quy trình nghiệp vụ phức tạp liên quan đến tạo phòng 7 bước và cập nhật đặt phòng, do đó cần chụp các bằng chứng sau:

### 3.1. Luồng Đăng ký & Chờ duyệt
1. **Màn hình Đăng ký**: Form đăng ký đối tác đã điền đầy đủ thông tin cơ bản.
   - *Tên file gợi ý:* `evidence_TC_PTN_AUTH_01_RegisterForm.png`
2. **Màn hình Chờ duyệt (Under Review)**: Chụp màn hình thông báo tài khoản đang được Admin xem xét sau khi bấm đăng ký.
   - *Tên file gợi ý:* `evidence_TC_PTN_AUTH_01_UnderReview.png`

### 3.2. Luồng Tạo Khách sạn Mới (Biểu mẫu 7 Bước)

Tester cần chụp lại từng bước điền thông tin để làm tư liệu kiểm thử giao diện & tính hợp lệ:

- **Ảnh 1 (Bước 1 - Thông tin cơ bản)**: Điền xong tên khách sạn, chọn loại hình, sức chứa và danh sách điểm nhấn (Highlights) đã thêm thành công.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_01_Step1_BasicInfo.png`
- **Ảnh 2 (Bước 2 - Vị trí)**: Kết quả tìm kiếm địa chỉ OpenStreetMap hiển thị, bản đồ đã ghim tọa độ Lat/Long và danh sách các phương tiện giao thông liên kết.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_02_Step2_Location.png`
- **Ảnh 3 (Bước 3 - Tiện ích chung)**: Các ô tiện ích đã được chọn (nổi màu xanh/đậm) và các tiện ích tự nhập thủ công (nếu có).
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_03_Step3_Amenities.png`
- **Ảnh 4 (Bước 4 - Địa điểm lân cận)**: Kết quả tìm kiếm địa điểm xung quanh từ OpenStreetMap Overpass API hiển thị kèm khoảng cách thực tế (ví dụ: Nhà hàng 300m, Siêu thị 500m...) và các ô tích chọn địa điểm.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_04_Step4_NearbyPlaces.png`
- **Ảnh 5 (Bước 5 - Ảnh & Chính sách)**: Các ô nhập URL ảnh đã hiển thị ảnh preview nhỏ ở bên dưới (đủ 5 ảnh bắt buộc) và các giờ check-in, check-out, chính sách hủy phòng đã chọn.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_05_Step5_ImagesPolicy.png`
- **Ảnh 6 (Bước 6 - Hạng phòng & Giá)**: Điền xong ít nhất 1 hạng phòng (Tên phòng, giá 1 đêm, số lượng phòng có sẵn) và mức phí dịch vụ.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_06_Step6_RoomClasses.png`
- **Ảnh 7 (Bước 7 - Xác nhận tổng thể)**: Màn hình hiển thị đầy đủ tóm tắt thông tin của 6 bước trước đó để đối tác rà soát lại trước khi bấm gửi.
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_07_Step7_ConfirmView.png`
- **Ảnh 8 (Kết quả sau khi Gửi)**: Danh sách khách sạn sau khi gửi xuất hiện khách sạn mới với nhãn trạng thái màu vàng `Chờ duyệt` (Pending).
  - *Tên file gợi ý:* `evidence_TC_PTN_ROM_07_RoomListPendingStatus.png`

### 3.3. Luồng Thay đổi Trạng thái Đặt phòng (Booking Flow)
1. **Nhận đơn (Chờ xác nhận)**: Chụp dòng đơn đặt phòng mới hiển thị trạng thái `Chờ xác nhận`.
   - *Tên file gợi ý:* `evidence_TC_PTN_BKG_01_PendingConfirm.png`
2. **Xác nhận thành công**: Chụp dòng đơn đó sau khi đối tác bấm "Xác nhận đặt phòng", trạng thái chuyển sang `Đã xác nhận` màu xanh.
   - *Tên file gợi ý:* `evidence_TC_PTN_BKG_02_Confirmed.png`
3. **Khách Check-in**: Chụp trạng thái đơn chuyển sang `Đã check-in` khi khách đến nhận phòng.
   - *Tên file gợi ý:* `evidence_TC_PTN_BKG_03_CheckedIn.png`
4. **Khách Check-out & Doanh thu ví**: Chụp trạng thái đơn chuyển thành `Đã check-out` (Hoàn thành) và số dư tài khoản của đối tác tăng lên tương ứng với giá trị đơn phòng.
   - *Tên file gợi ý:* `evidence_TC_PTN_BKG_04_CheckedOutAndWalletUpdated.png`

---

## 4. Gợi ý Công cụ hỗ trợ Chụp ảnh nhanh chóng

Để chụp ảnh nhanh và dễ dàng vẽ chú thích (khoanh đỏ/mũi tên), bạn có thể cài đặt các công cụ sau:
- **Lightshot**: Nhấn phím `PrntScrn` để quét vùng màn hình, cho phép viết text và vẽ trực tiếp trước khi copy hoặc lưu.
- **Snipping Tool (Mặc định Windows)**: Sử dụng tổ hợp phím `Windows + Shift + S`.
- **Awesome Screenshot (Chrome Extension)**: Tiện ích mở rộng trên Chrome giúp chụp toàn bộ trang web dài từ đầu đến cuối (Full page screenshot) rất thích hợp cho Bước 7 màn hình Xác nhận và danh sách giao dịch dài.
- **Snagit**: Công cụ chuyên nghiệp cho phép chụp và quay màn hình chất lượng cao.
