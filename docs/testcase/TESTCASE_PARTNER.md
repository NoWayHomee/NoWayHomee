# TÀI LIỆU KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES) - WEB PARTNER (ĐỐI TÁC)

Tài liệu này chứa bộ kịch bản kiểm thử (Test Cases) hoàn chỉnh, bao quát toàn bộ các chức năng và luồng xử lý trên cổng **Web Partner (Đối tác)** của hệ thống Nowayhome. Các kết quả mong đợi và thông báo lỗi đã được ánh xạ chính xác tuyệt đối với mã nguồn hệ thống.

---

## 1. Đăng ký & Đăng nhập & Đăng xuất (Authentication)

Kiểm tra quá trình đăng ký tài khoản, đăng nhập qua Email/Mật khẩu truyền thống và bằng Google Login, xử lý trạng thái tài khoản chưa duyệt (Under Review), bị khóa, và đăng ký làm đối tác sau khi đăng nhập Google lần đầu.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_AUTH_01** | Đăng ký tài khoản đối tác mới thành công | 1. Truy cập trang đăng nhập đối tác, bấm nút "Sign up".<br>2. Nhập đầy đủ thông tin: Họ tên, Tên khách sạn, Số điện thoại, Email, Mật khẩu.<br>3. Bấm nút "Sign up". | - Họ tên: `Nguyễn Văn A`<br>- Khách sạn: `Sunlight Ocean View`<br>- SĐT: `0912345678`<br>- Email: `sunlight_ocean@example.com`<br>- Mật khẩu: `Partner@123` | - Đăng ký thành công.<br>- Chuyển sang màn hình thông báo "Under review" (Chờ phê duyệt từ quản trị viên).<br>- Trạng thái tài khoản trong DB là chờ duyệt. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_AUTH_02** | Đăng ký thất bại do trùng Email đã tồn tại | 1. Thực hiện các bước đăng ký với email đã được sử dụng trước đó. | - Email: `sunlight_ocean@example.com` (Đã tồn tại) | - Đăng ký thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Email or phone already exists`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `ConflictException` trong `auth.service.ts`. |
| **TC_PTN_AUTH_03** | Đăng nhập đối tác thành công bằng Email/Mật khẩu | 1. Sử dụng tài khoản đối tác đã được Admin phê duyệt.<br>2. Nhập đúng Email và Mật khẩu.<br>3. Bấm "Sign in". | - Email: `sunlight_ocean@example.com`<br>- Mật khẩu: `Partner@123` | - Đăng nhập thành công.<br>- Chuyển hướng tới trang Dashboard của đối tác. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_AUTH_04** | Đăng nhập thất bại do tài khoản chưa được duyệt | 1. Sử dụng tài khoản vừa đăng ký ở TC_PTN_AUTH_01 (chưa được duyệt).<br>2. Nhập thông tin đăng nhập và bấm "Sign in". | - Email: `sunlight_ocean@example.com`<br>- Mật khẩu: `Partner@123` | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Tài khoản đối tác đang chờ quản trị viên phê duyệt.`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `ForbiddenException` trong `auth.service.ts`. |
| **TC_PTN_AUTH_05** | Đăng nhập thất bại do tài khoản bị từ chối phê duyệt | 1. Sử dụng tài khoản đối tác đã bị Admin từ chối phê duyệt. | - Email: `sunlight_ocean_rejected@example.com`<br>- Mật khẩu: `Partner@123` | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Tài khoản đối tác đã bị từ chối phê duyệt.`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `ForbiddenException` trong `auth.service.ts`. |
| **TC_PTN_AUTH_06** | Đăng nhập bằng Google thành công với tài khoản đã có quyền Đối tác | 1. Bấm nút "Sign in with Google" ở trang Login.<br>2. Chọn tài khoản Google đã đăng ký quyền đối tác.<br>3. Xác nhận. | - Tài khoản Google đối tác hợp lệ. | - Đăng nhập thành công và chuyển hướng ngay tới Dashboard đối tác. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_AUTH_07** | Đăng nhập bằng Google thất bại do email là tài khoản Admin | 1. Bấm nút "Sign in with Google".<br>2. Chọn tài khoản Google có role `admin` trên hệ thống. | - Tài khoản Google có quyền admin. | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ frontend: `Tài khoản admin không thể đăng nhập vào trang đối tác.` | [ ] Pass<br>[ ] Fail | Chặn chéo vai trò đăng nhập (ở frontend `Login.tsx`). |
| **TC_PTN_AUTH_08** | Đăng nhập bằng Google lần đầu (role Customer) & Hoàn tất đăng ký Đối tác | 1. Bấm "Sign in with Google".<br>2. Chọn một tài khoản Google mới (mặc định nhận role `customer`).<br>3. Giao diện hiển thị form "Đăng ký trở thành đối tác" (Điền thêm thông tin).<br>4. Nhập Tên khách sạn và Số điện thoại.<br>5. Bấm "Gửi yêu cầu đăng ký đối tác". | - Tên khách sạn: `Bình Minh Hotel`<br>- SĐT: `0999111222` | - Gửi yêu cầu đăng ký thành công (qua api `/partner/apply`).<br>- Trạng thái tài khoản chuyển sang chờ duyệt.<br>- Hiển thị giao diện "Under review" (do frontend clear cookies và chuyển hướng). | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_AUTH_09** | Đăng xuất tài khoản đối tác thành công | 1. Bấm nút "Đăng xuất" hoặc biểu tượng Logout trên thanh Menu. | | - Đăng xuất thành công.<br>- Xóa sạch session/token trong trình duyệt (bao gồm cookies `session` và `session_partner`).<br>- Chuyển hướng người dùng về trang Đăng nhập đối tác. | [ ] Pass<br>[ ] Fail | |

---

## 2. Bảng điều khiển Đối tác (Dashboard)

Kiểm tra số liệu kinh doanh thực tế của riêng đối tác đang đăng nhập.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_DSH_01** | Hiển thị chính xác các chỉ số hiệu quả kinh doanh | 1. Đăng nhập đối tác và quan sát trang Dashboard. | | - Hiển thị: Doanh thu thực nhận (sau khi trừ phí nền tảng), Tổng số đơn đặt phòng, Tỷ lệ lấp đầy phòng.<br>- Các số liệu khớp với danh sách booking thực tế. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_DSH_02** | Tải biểu đồ doanh thu theo thời gian | 1. Quan sát phần biểu đồ doanh số trên Dashboard. | | - Biểu đồ tải thành công, hiển thị chính xác trực quan hóa doanh số thu được theo ngày/tháng. | [ ] Pass<br>[ ] Fail | |

---

## 3. Tạo mới Khách sạn (Biểu mẫu 7 Bước - RoomEditorForm)

Kiểm tra từng bước nhập liệu, tính năng tìm kiếm vị trí tự động bằng OpenStreetMap, tìm địa danh lân cận qua Overpass API, các ràng buộc hình ảnh, chính sách hoàn hủy, và hạng phòng.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_ROM_01** | **Bước 1: Thông tin cơ bản**<br>Nhập thông tin cơ bản và ràng buộc tiếp tục | 1. Nhấp "Thêm khách sạn" hoặc truy cập `/rooms/create`.<br>2. Nhập Tên khách sạn, Loại hình, Diện tích, Sức chứa, Mô tả.<br>3. Thêm các "Điểm nhấn nổi bật" (Highlights) bằng cách gõ từ khóa và bấm "Thêm".<br>4. Nhấp nút "Tiếp" (Next). | - Tên: `Sunlight Ocean Resort`<br>- Loại hình: `Resort`<br>- Diện tích: `60`<br>- Sức chứa: `4`<br>- Điểm nhấn: `Sát bãi biển, Hồ bơi ngoài trời` | - Hệ thống lưu tạm dữ liệu Bước 1 và cho phép đi tiếp sang Bước 2.<br>- Nút "Tiếp" bị vô hiệu hóa (disabled) nếu để trống Tên khách sạn hoặc không có Điểm nhấn nào. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_ROM_02** | **Bước 2: Vị trí & Bản đồ**<br>Tìm kiếm địa chỉ thực qua OpenStreetMap | 1. Nhập Thành phố.<br>2. Gõ địa chỉ vào ô tìm kiếm địa chỉ thực tế và bấm "Tìm".<br>3. Chọn một địa chỉ gợi ý từ kết quả tìm kiếm.<br>4. Thêm ít nhất một kết nối giao thông (Tên địa điểm, Khoảng cách, Ghi chú).<br>5. Bấm "Tiếp". | - Thành phố: `Nha Trang`<br>- Địa chỉ: `78 Trần Phú, Nha Trang`<br>- Kết nối: `Ga Nha Trang - 3 km` | - Ghim bản đồ hiển thị chính xác tọa độ Lat/Long dựa trên địa chỉ chọn.<br>- Thêm phương tiện giao thông liên kết thành công.<br>- Nút "Tiếp" chỉ hoạt động khi vị trí được ghim và có ít nhất 1 kết nối giao thông. | [ ] Pass<br>[ ] Fail | Bản đồ được tích hợp dựa trên dữ liệu OpenStreetMap công khai. |
| **TC_PTN_ROM_03** | **Bước 3: Tiện ích chung**<br>Lựa chọn tiện ích chung | 1. Click chọn các tiện ích chung có sẵn (Wifi, Điều hòa, Bể bơi...).<br>2. Nhập tiện ích tùy chỉnh mới và bấm "Thêm".<br>3. Bấm "Tiếp". | - Tiện ích: Wifi, Máy sưởi, `Ăn sáng tại phòng (Tự nhập)` | - Các tiện ích được chọn sẽ nổi bật màu sắc.<br>- Cho phép nhấn "Tiếp" sang Bước 4. | [ ] Pass<br>[ ] Fail | Không có validation bắt buộc. |
| **TC_PTN_ROM_04** | **Bước 4: Địa điểm lân cận**<br>Tìm kiếm xung quanh bằng Overpass API | 1. Lựa chọn Bán kính tìm kiếm (mặc định 1.5 km).<br>2. Tích chọn các danh mục muốn tìm kiếm (Du lịch, Nhà hàng, Cà phê, Siêu thị...).<br>3. Bấm "Tìm địa điểm gần đây".<br>4. Tích chọn các địa danh trong danh sách kết quả trả về từ Overpass API.<br>5. Bấm "Tiếp". | - Bán kính: `2 km`<br>- Danh mục: Du lịch, Nhà hàng | - Hệ thống truy vấn API Overpass thành công, hiển thị danh sách các địa điểm xung quanh kèm khoảng cách mét thực tế.<br>- Ghi nhận các địa điểm được đối tác chọn. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_ROM_05** | **Bước 5: Ảnh & Chính sách**<br>Ràng buộc 5 ảnh bắt buộc và thiết lập chính sách | 1. Nhập URL của 5 góc ảnh bắt buộc: Mặt tiền, Sảnh, Không gian nghỉ ngơi, Khu vực chung, Ngoại cảnh.<br>2. (Tùy chọn) Thêm ảnh bổ sung.<br>3. Thiết lập giờ checkin, checkout, độ tuổi trẻ em miễn phí.<br>4. Cấu hình chính sách hủy phòng (nếu cho phép hủy miễn phí, bắt buộc điền số giờ hủy trước).<br>5. Bấm "Tiếp". | - 5 URL ảnh mẫu hợp lệ.<br>- Check-in: `14:00`, Check-out: `12:00`<br>- Trẻ em free: `6` tuổi.<br>- Hoàn hủy: Có, trước `24` giờ. | - Ảnh preview nhỏ hiển thị ngay dưới các URL ảnh tương ứng.<br>- Nút "Tiếp" chỉ active khi 5 ảnh bắt buộc có đủ URL và thông tin giờ giấc, chính sách hợp lệ. | [ ] Pass<br>[ ] Fail | Thiết lập ảnh bắt buộc để đảm bảo chất lượng hiển thị khách sạn. |
| **TC_PTN_ROM_06** | **Bước 6: Hạng phòng & Giá**<br>Thiết lập giá và phòng | 1. Nhập thông tin hạng phòng đầu tiên: Tên hạng, Giá/đêm, Số phòng, Diện tích, Sức chứa, Giường, Tiện ích phòng, URL ảnh phòng.<br>2. Nhập tỷ lệ Phí nền tảng (%) và Khuyến mãi (%) nếu có.<br>3. Bấm "Tiếp". | - Tên hạng: `Deluxe Suite Sea View`<br>- Giá: `2.000.000`<br>- Số lượng: `10`<br>- Phí nền tảng: `10`%, Khuyến mãi: `5`% | - Ghi nhận danh sách hạng phòng.<br>- Hệ thống tự động tính toán giá hiển thị cho khách đúng công thức.<br>- Nút "Tiếp" chỉ hoạt động khi có ít nhất 1 hạng phòng hợp lệ (Tên, Giá > 0, Số lượng > 0). | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_ROM_07** | **Bước 7: Xác nhận & Gửi duyệt thành công** | 1. Xem lại toàn bộ thông tin tổng hợp hiển thị trên trang Xác nhận.<br>2. Bấm nút "Xác nhận tạo". | Dữ liệu hợp lệ từ bước 1-6. | - Gửi yêu cầu thành công.<br>- Điều hướng về trang danh sách phòng `/rooms` kèm thông báo thành công.<br>- Khách sạn hiển thị nhãn màu vàng "Chờ duyệt" (Pending). | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_ROM_08** | **Validation lỗi tạo phòng từ Backend (Bypass Frontend)** | 1. Gửi request tạo phòng trực tiếp với thông tin bị thiếu hoặc sai lệch kiểu dữ liệu. | - Trống tên khách sạn hoặc trống giá phòng. | - API trả về lỗi tương ứng: `Ten khach san la bat buoc` hoặc `Can it nhat mot hang phong hop le` hoặc `Gia hang phong #1 khong hop le`. | [ ] Pass<br>[ ] Fail | Khớp các lỗi `BadRequestException` trong `compat.service.ts`. |

---

## 4. Chỉnh sửa & Yêu cầu thay đổi (Edit/Change Request)

Kiểm tra luồng chỉnh sửa thông tin khách sạn đang hoạt động. Do tính bảo mật, các sửa đổi của đối tác không được áp dụng ngay lập tức mà phải tạo một yêu cầu chỉnh sửa gửi lên Admin duyệt.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_EDT_01** | Gửi yêu cầu chỉnh sửa thông tin khách sạn | 1. Tìm khách sạn đang hoạt động (Đã duyệt), bấm nút "Sửa" (Edit).<br>2. Thực hiện thay đổi thông tin (VD: Sửa giá phòng ở bước 6).<br>3. Click Tiếp qua các bước đến bước 7 và bấm "Gửi yêu cầu". | - Đổi giá Deluxe Suite sang `2.500.000` | - Gửi yêu cầu thành công.<br>- Trạng thái khách sạn hiển thị nhãn "(Yêu cầu thay đổi)" ở dạng chờ duyệt.<br>- Thông tin cũ vẫn hiển thị trên ứng dụng khách hàng cho tới khi Admin duyệt. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_EDT_02** | Gửi yêu cầu xóa khách sạn | 1. Tại danh sách khách sạn, bấm biểu tượng "Xóa" (Xóa khách sạn).<br>2. Xác nhận tại modal. | | - Yêu cầu xóa được gửi lên hệ thống Admin ở trạng thái chờ duyệt.<br>- Khách sạn vẫn hoạt động bình thường cho tới khi được duyệt xóa. | [ ] Pass<br>[ ] Fail | |

---

## 5. Quản lý Đơn đặt phòng (Bookings Management)

Kiểm tra tiếp nhận và cập nhật tiến độ lưu trú của khách đặt phòng.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_BKG_01** | Xem danh sách đơn đặt phòng | 1. Truy cập tab "Đơn đặt phòng" (Bookings). | | - Hiển thị đúng danh sách đơn đặt phòng thuộc khách sạn của đối tác.<br>- Đầy đủ thông tin: Mã đơn, Khách hàng, Ngày đặt, Tổng tiền, Trạng thái đơn. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_BKG_02** | Xác nhận đơn đặt phòng (Confirm) | 1. Tìm đơn hàng ở trạng thái "Chờ xác nhận" (Pending).<br>2. Bấm nút "Xác nhận đặt phòng". | | - Trạng thái đơn đặt phòng chuyển thành "Đã xác nhận". | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_BKG_03** | Thực hiện Check-in cho khách hàng | 1. Vào ngày nhận phòng, tìm đơn hàng "Đã xác nhận".<br>2. Nhấp chọn "Check-in" và xác nhận. | | - Trạng thái đơn chuyển sang "Đã check-in" (Đang lưu trú). | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_BKG_04** | Thực hiện Check-out cho khách hàng và cập nhật ví | 1. Vào ngày trả phòng, tìm đơn hàng "Đã check-in".<br>2. Nhấp chọn "Check-out" và xác nhận. | | - Trạng thái đơn chuyển sang "Đã check-out" (Hoàn thành).<br>- Tiền phòng thực nhận (Net payout) tự động cộng vào số dư ví NowayhomePay của đối tác. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_BKG_05** | Hủy đơn đặt phòng chủ động kèm lý do | 1. Chọn một đơn đặt phòng đang chờ/đã xác nhận.<br>2. Bấm "Hủy đơn", nhập lý do hủy phòng và xác nhận. | Lý do: `Phòng gặp sự cố vỡ đường ống nước.` | - Đơn hàng chuyển trạng thái sang "Đã hủy".<br>- Gửi thông báo hủy phòng kèm lý do tới khách hàng. | [ ] Pass<br>[ ] Fail | |

---

## 6. Ví tiền & Giao dịch (NowayhomePay Wallet)

Kiểm tra đăng ký ví đối tác, các phương thức thanh toán Online vs CASH (tiền mặt), nạp/rút tiền hệ thống, và xem chi tiết hóa đơn (Invoice).

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_TRN_01** | Kích hoạt ví NowayhomePay lần đầu | 1. Truy cập tab "Giao dịch" (Transactions).<br>2. Form "Kích hoạt NowayhomePay" hiển thị.<br>3. Nhập Ngân hàng, Số tài khoản, Họ tên chủ tài khoản.<br>4. Bấm "Kích hoạt ví". | - Ngân hàng: `Vietinbank`<br>- Số TK: `101000555999`<br>- Chủ TK: `NGUYEN VAN A` | - Kích hoạt thành công ví đối tác.<br>- Giao diện chuyển sang màn hình quản lý số dư và lịch sử giao dịch. | [ ] Pass<br>[ ] Fail | Bắt buộc để nhận chuyển khoản. |
| **TC_PTN_TRN_02** | Xem số dư ví và Virtual Account | 1. Quan sát phần thông tin ví trên trang Giao dịch. | | - Hiển thị đúng số dư ví hiện tại.<br>- Hiển thị mã Virtual Account dành cho khách thanh toán.<br>- Hiển thị đúng thông tin ngân hàng đã liên kết. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_TRN_03** | Khấu trừ hoa hồng khi check-out đơn thanh toán tại chỗ (CASH) | 1. Thực hiện Check-out một đơn hàng thanh toán bằng tiền mặt (CASH).<br>2. Kiểm tra số dư ví đối tác. | - Đơn hàng CASH: `1.000.000 VNĐ`<br>- Hoa hồng: `10` % | - Số dư ví đối tác bị trừ đi số tiền hoa hồng (`COMMISSION_DEDUCTION`) tương ứng (Ví dụ: Trừ `-100.000 VNĐ`).<br>- Nếu số dư ví nhỏ hơn số tiền hoa hồng cần khấu trừ, số dư ví sẽ chuyển sang giá trị âm và hiển thị cảnh báo đỏ nhắc nhở đối tác cần nạp thêm tiền. | [ ] Pass<br>[ ] Fail | Đặc trưng dòng tiền thanh toán trực tiếp. |
| **TC_PTN_TRN_04** | Yêu cầu Nạp tiền vào ví (DEPOSIT) | 1. Nhấp "Nạp tiền" (Deposit).<br>2. Nhập số tiền nạp.<br>3. Bấm xác nhận nạp. | - Số tiền: `500.000` | - Hiển thị thông tin tài khoản thụ hưởng của hệ thống và mã nội dung chuyển khoản.<br>- Sau khi chuyển khoản và hệ thống phê duyệt, số dư ví tăng lên đúng số tiền nạp. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_TRN_05** | Yêu cầu Rút tiền về ngân hàng (WITHDRAW) thành công | 1. Nhấp "Rút tiền" (Withdraw).<br>2. Nhập số tiền rút (hợp lệ).<br>3. Bấm xác nhận rút. | - Số tiền: `2.000.000` (Số dư ví hiện tại: `5.000.000`) | - Tạo thành công yêu cầu rút tiền ở trạng thái "SUCCESS".<br>- Khấu trừ trực tiếp số tiền rút khỏi số dư khả dụng. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_TRN_06** | Rút tiền thất bại do vượt quá số dư khả dụng | 1. Nhập số tiền rút lớn hơn số dư ví hiện tại.<br>2. Bấm xác nhận. | - Số tiền rút: `10.000.000` (Số dư ví: `5.000.000`) | - Hệ thống chặn giao dịch và báo lỗi chính xác từ API: `So du vi khong du de rut tien`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `BadRequestException` trong `compat.service.ts`. |
| **TC_PTN_TRN_07** | Xem chi tiết hóa đơn (Invoice Modal) cho đơn đặt phòng ONLINE | 1. Tìm giao dịch cộng tiền từ đơn ONLINE.<br>2. Click nút "Chi tiết hóa đơn" (Invoice). | | - Hiển thị chi tiết dòng tiền: Doanh thu phòng (Gross), Phí nền tảng khấu trừ (Platform Fee), Số tiền thực nhận vào ví (Net). | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_TRN_08** | Xem chi tiết hóa đơn cho đơn đặt phòng CASH | 1. Tìm giao dịch trừ tiền hoa hồng đơn CASH.<br>2. Click nút "Chi tiết hóa đơn" (Invoice). | | - Hiển thị chi tiết dòng tiền: Doanh thu phòng thu từ khách (Gross), Hoa hồng admin khấu trừ từ ví đối tác (Commission Deducted). | [ ] Pass<br>[ ] Fail | |

---

## 7. Quản lý Thông báo (Notifications)

Kiểm tra nhận thông báo theo thời gian thực từ hoạt động của hệ thống.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_NTF_01** | Nhận thông báo thời gian thực | 1. Admin duyệt khách sạn hoặc Khách đặt đơn mới.<br>2. Đối tác kiểm tra danh sách thông báo. | | - Xuất hiện chấm đỏ báo hiệu ở icon chuông báo.<br>- Nội dung thông báo hiển thị đầy đủ thông tin sự kiện. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_NTF_02** | Đánh dấu thông báo đã đọc | 1. Click chọn một thông báo chưa đọc. | | - Trạng thái thông báo chuyển sang "Đã đọc" (mờ đi và mất dấu chấm đỏ). | [ ] Pass<br>[ ] Fail | |

---

## 8. Cấu hình Tài khoản (Account Settings)

Kiểm tra cập nhật hồ sơ cá nhân và mật khẩu đối tác.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_PTN_SET_01** | Cập nhật hồ sơ đối tác thành công | 1. Vào trang "Cấu hình tài khoản" `/account`.<br>2. Thay đổi số điện thoại và tên hiển thị đại diện.<br>3. Bấm "Lưu". | - Họ tên: `Nguyễn Văn A (Manager)`<br>- SĐT: `0988777666` | - Cập nhật thành công và lưu lại thông tin mới. | [ ] Pass<br>[ ] Fail | |
| **TC_PTN_SET_02** | Thay đổi mật khẩu đối tác thành công | 1. Điền mật khẩu hiện tại.<br>2. Điền mật khẩu mới và Nhập lại mật khẩu mới.<br>3. Bấm "Cập nhật mật khẩu". | - Mật khẩu mới: `NewPartner@123` | - Mật khẩu được cập nhật thành công.<br>- Cho phép dùng mật khẩu mới này ở lần đăng nhập tiếp theo. | [ ] Pass<br>[ ] Fail | |
