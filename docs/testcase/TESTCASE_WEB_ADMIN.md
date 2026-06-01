# TÀI LIỆU KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES) - WEB ADMIN

Tài liệu này chứa bộ kịch bản kiểm thử (Test Cases) hoàn chỉnh, bao quát toàn bộ các chức năng và luồng xử lý trên cổng **Web Admin** của hệ thống Nowayhome. Các kết quả mong đợi và thông báo lỗi đã được ánh xạ chính xác tuyệt đối với mã nguồn hệ thống.

---

## 1. Quản lý Đăng nhập & Đăng xuất (Authentication)

Bộ phận này kiểm tra quá trình xác thực người dùng bằng Email/Mật khẩu truyền thống và tích hợp Google Login qua SDK, đồng thời kiểm soát phân quyền (chỉ cho phép các tài khoản có role `admin` truy cập).

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_AUTH_01** | Đăng nhập thành công với tài khoản Admin truyền thống | 1. Truy cập trang đăng nhập `/login`.<br>2. Nhập Email và Mật khẩu admin hợp lệ.<br>3. Nhấp chọn nút "Sign in". | - Email: `admin@nowayhome.vn`<br>- Mật khẩu: `Admin@123` | - Đăng nhập thành công.<br>- Chuyển hướng về trang Dashboard `/dashboard`.<br>- Hiển thị đúng thông tin admin trên thanh điều hướng. | [ ] Pass<br>[ ] Fail | Tài khoản được cấu hình sẵn trong cơ sở dữ liệu. |
| **TC_ADM_AUTH_02** | Đăng nhập thất bại do nhập sai mật khẩu | 1. Nhập Email admin đúng.<br>2. Nhập Mật khẩu sai.<br>3. Bấm "Sign in". | - Email: `admin@nowayhome.vn`<br>- Mật khẩu: `WrongPassword123` | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Invalid email or password`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `UnauthorizedException` từ `auth.service.ts`. |
| **TC_ADM_AUTH_03** | Đăng nhập thất bại do email không tồn tại trên hệ thống | 1. Nhập Email chưa đăng ký.<br>2. Nhập mật khẩu bất kỳ.<br>3. Bấm "Sign in". | - Email: `unknown_admin@nowayhome.vn`<br>- Mật khẩu: `Admin@123` | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Invalid email or password`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `UnauthorizedException` từ `auth.service.ts`. |
| **TC_ADM_AUTH_04** | Đăng nhập thất bại do email có role khác không phải admin | 1. Nhập email của khách hàng hoặc đối tác.<br>2. Nhập mật khẩu đúng.<br>3. Bấm "Sign in". | - Email: `partner_sample@gmail.com`<br>- Mật khẩu: `Partner@123` | - Hệ thống từ chối đăng nhập.<br>- Hiển thị thông báo lỗi chính xác từ frontend: `Tai khoan nay khong phai admin`. | [ ] Pass<br>[ ] Fail | Chặn đối tác/khách hàng xâm nhập trang quản trị. |
| **TC_ADM_AUTH_05** | Bắt buộc nhập các trường thông tin | 1. Để trống trường Email hoặc Mật khẩu.<br>2. Bấm "Sign in". | - Email: trống hoặc sai định dạng<br>- Mật khẩu: trống | - Trình duyệt báo lỗi validation của HTML5 (VD: "Please fill in this field") hoặc nút "Sign in" bị vô hiệu hóa, không kích hoạt gửi request. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_AUTH_06** | Đăng nhập Google thành công với email nằm trong danh sách Whitelist Admin | 1. Click nút "Sign in with Google".<br>2. Chọn tài khoản Google đã được Super Admin thêm vào danh sách quản trị viên hoặc có sẵn trong ENV `ADMIN_EMAILS`/`SUPER_ADMIN_EMAILS`.<br>3. Xác nhận đăng nhập. | - Tài khoản Google: `admin_google@gmail.com` (Đã được cấp quyền) | - Đăng nhập thành công.<br>- Nhận đúng role `admin` và chuyển hướng tới Dashboard. | [ ] Pass<br>[ ] Fail | Cấu hình qua biến môi trường hoặc db. |
| **TC_ADM_AUTH_07** | Đăng nhập Google thất bại do email không nằm trong danh sách Whitelist Admin | 1. Click nút "Sign in with Google".<br>2. Chọn một tài khoản Google cá nhân chưa được khai báo trên hệ thống Admin.<br>3. Xác nhận. | - Tài khoản Google: `random_user@gmail.com` | - Đăng nhập thất bại.<br>- Hiển thị thông báo lỗi chính xác từ frontend: `Tài khoản này không phải admin. Chỉ email admin mới được đăng nhập tại đây.` | [ ] Pass<br>[ ] Fail | Chặn các tài khoản Google vãng lai. |
| **TC_ADM_AUTH_08** | Đăng xuất khỏi hệ thống thành công | 1. Bấm nút "Đăng xuất" hoặc biểu tượng Logout trên thanh Menu điều hướng. | | - Đăng xuất thành công.<br>- Xóa sạch session/token lưu trữ trong trình duyệt (bao gồm cookies `session` và `session_admin`).<br>- Chuyển hướng người dùng về trang Đăng nhập `/login`. | [ ] Pass<br>[ ] Fail | |

---

## 2. Bảng điều khiển (Dashboard)

Kiểm tra hiển thị dữ liệu tổng hợp trực quan và khả năng tải tài nguyên biểu đồ.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_DSH_01** | Tải và hiển thị chính xác các chỉ số tổng quan (Metrics Card) | 1. Đăng nhập hệ thống Admin.<br>2. Quan sát các ô thống kê tại trang chủ Dashboard. | | - Hiển thị đầy đủ thông tin: Tổng doanh thu, Tổng đơn đặt phòng, Số lượng khách hàng, Số lượng đối tác.<br>- Định dạng số tiền tệ VNĐ rõ ràng (VD: `100.000.000 đ` hoặc `100.000.000 VNĐ`). | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_DSH_02** | Hiển thị biểu đồ doanh thu & đặt phòng | 1. Quan sát vùng hiển thị biểu đồ trên trang Dashboard. | | - Biểu đồ tải thành công, trực quan hóa xu hướng doanh thu và số lượng booking. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_DSH_03** | Thống kê danh sách đơn đặt phòng mới nhất | 1. Kéo xuống phần danh sách "Booking gần đây" tại trang Dashboard. | | - Hiển thị đúng danh sách booking mới cập nhật trong hệ thống.<br>- Hiển thị đầy đủ cột: Khách hàng, Khách sạn, Ngày đặt, Số tiền, Trạng thái đơn. | [ ] Pass<br>[ ] Fail | |

---

## 3. Quản lý Đối tác (Partners Management)

Kiểm tra quy trình duyệt hồ sơ đăng ký của đối tác và khóa/mở khóa tài khoản khi có vi phạm.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_PTN_01** | Tìm kiếm đối tác theo Tên / Email / SĐT / Khách sạn | 1. Truy cập tab "Đối tác" (Partners).<br>2. Nhập từ khóa vào ô tìm kiếm.<br>3. Quan sát danh sách hiển thị. | Từ khóa: `Ocean View` hoặc `nhatrangsun@example.com` | - Danh sách lọc động, chỉ hiển thị đối tác khớp thông tin từ khóa tìm kiếm. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PTN_02** | Lọc đối tác theo Trạng thái | 1. Sử dụng dropdown bộ lọc trạng thái (Tất cả, Chờ duyệt, Đã duyệt, Đã khóa). | | - Danh sách hiển thị chính xác đối tác có trạng thái tương ứng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PTN_03** | Xem chi tiết thông tin đối tác chờ duyệt | 1. Lọc trạng thái "Chờ duyệt" (Pending).<br>2. Click chọn đối tác cần duyệt, nhấn "Chi tiết". | | - Mở modal/màn hình hiển thị chi tiết: Họ tên đối tác, email, số điện thoại, tên khách sạn đăng ký đại diện. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PTN_04** | Phê duyệt yêu cầu đăng ký đối tác thành công | 1. Tại chi tiết đối tác đang Chờ duyệt, nhấn nút "Duyệt" (Approve).<br>2. Xác nhận tại hộp thoại popup. | | - Trạng thái đối tác chuyển thành "Đã duyệt" (Active).<br>- Hệ thống gửi thông báo và cho phép đối tác này đăng nhập vào cổng Partner Portal. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PTN_05** | Từ chối yêu cầu đăng ký đối tác kèm lý do từ chối | 1. Tại chi tiết đối tác đang Chờ duyệt, nhấn nút "Từ chối" (Reject).<br>2. Hệ thống bắt buộc nhập Lý do từ chối.<br>3. Nhập lý do và xác nhận. | Lý do: `Số điện thoại liên hệ không hoạt động.` | - Yêu cầu đăng ký bị từ chối.<br>- Trạng thái đối tác chuyển sang "Từ chối" (Rejected).<br>- Lưu trữ đúng lý do từ chối trong DB để thông báo đối tác. | [ ] Pass<br>[ ] Fail | Bắt buộc phải có lý do từ chối. |
| **TC_ADM_PTN_06** | Khóa tài khoản đối tác đang hoạt động | 1. Tìm đối tác ở trạng thái "Đã duyệt".<br>2. Nhấn nút "Khóa" (Lock/Suspend) và xác nhận. | | - Trạng thái đối tác chuyển sang "Đã khóa" (Locked).<br>- Đối tác bị chặn đăng nhập và ngừng hiển thị khách sạn trên app. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PTN_07** | Mở khóa tài khoản đối tác đang bị khóa | 1. Tìm đối tác ở trạng thái "Đã khóa" (Locked).<br>2. Nhấn nút "Mở khóa" (Unlock) và xác nhận. | | - Trạng thái đối tác phục hồi về "Đã duyệt" (Active). | [ ] Pass<br>[ ] Fail | |

---

## 4. Quản lý Khách hàng (Customers Management)

Kiểm tra danh sách và chức năng quản lý khách hàng từ hệ thống.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_CUS_01** | Tìm kiếm khách hàng theo từ khóa | 1. Truy cập tab "Khách hàng" (Customers).<br>2. Nhập từ khóa tìm kiếm (Tên/Email/SĐT). | Từ khóa: `Nguyen Van A` | - Bảng danh sách lọc động và hiển thị chính xác các kết quả khớp từ khóa. | [ ] Pass<br>[ ] Fail | Trình duyệt thực hiện gọi API với debounce 250ms. |
| **TC_ADM_CUS_02** | Hiển thị thông tin khách hàng chi tiết | 1. Quan sát các cột thông tin trong bảng khách hàng. | | - Hiển thị đầy đủ: Tên khách hàng, Email, Số điện thoại, Trạng thái (active/inactive), Ngày tạo, Ngày đăng nhập cuối (Last login). | [ ] Pass<br>[ ] Fail | Hiện tại giao diện admin hỗ trợ hiển thị/tìm kiếm danh sách khách hàng. |

---

## 5. Phê duyệt Khách sạn & Phòng nghỉ (Rooms/Hotels Approval)

Kiểm tra quy trình kiểm duyệt, phê duyệt các yêu cầu tạo mới, cập nhật thông tin và xóa phòng từ phía đối tác.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_ROM_01** | Tìm kiếm và Lọc khách sạn chờ duyệt | 1. Truy cập tab "Khách sạn" (Rooms).<br>2. Nhập từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái "Chờ duyệt" (Pending). | | - Hiển thị danh sách khách sạn đang chờ duyệt với thẻ trạng thái tương ứng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_02** | Xem thông tin chi tiết yêu cầu tạo mới khách sạn | 1. Chọn khách sạn chờ duyệt, bấm xem chi tiết.<br>2. Rà soát thông tin trên giao diện. | | - Hiển thị đầy đủ tên, loại hình, địa chỉ ghim bản đồ, mô tả, các tiện ích, 5 ảnh bắt buộc, danh sách hạng phòng và giá, chính sách hoàn hủy. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_03** | Phê duyệt yêu cầu tạo mới khách sạn | 1. Bấm nút "Duyệt" (Approve) khách sạn chờ duyệt.<br>2. Xác nhận phê duyệt. | | - Trạng thái khách sạn chuyển sang "Đã duyệt" (Approved/Active).<br>- Khách sạn hiển thị trên cổng ứng dụng đặt phòng của khách hàng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_04** | Từ chối yêu cầu tạo mới khách sạn kèm lý do | 1. Bấm nút "Từ chối" (Reject) trên khách sạn đang chờ duyệt.<br>2. Nhập lý do từ chối và xác nhận. | Lý do: `Hình ảnh sảnh lễ tân bị mờ và không thực tế.` | - Trạng thái khách sạn chuyển sang "Từ chối" (Rejected).<br>- Lưu lại lý do từ chối để hiển thị cho đối tác thực hiện sửa đổi. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_05** | Xem so sánh chi tiết yêu cầu chỉnh sửa (Update Request) | 1. Click vào khách sạn đang chờ duyệt có nhãn "Yêu cầu thay đổi" (Update Request). | | - Mở modal so sánh hiển thị trực quan thông tin hiện tại (Current) và thông tin đề xuất thay đổi (Request Payload Preview). | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_06** | Phê duyệt yêu cầu chỉnh sửa khách sạn | 1. Mở xem chi tiết so sánh của khách sạn chờ cập nhật.<br>2. Bấm "Duyệt" (Approve) và xác nhận. | | - Các thông tin thay đổi chính thức được áp dụng vào thông tin gốc của khách sạn.<br>- Trạng thái yêu cầu chuyển sang hoàn thành, nhãn chờ cập nhật biến mất. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_07** | Từ chối yêu cầu chỉnh sửa khách sạn | 1. Mở xem chi tiết so sánh.<br>2. Bấm "Từ chối" (Reject), nhập lý do và xác nhận. | Lý do: `Giá hạng phòng Standard tăng quá cao không phù hợp.` | - Yêu cầu thay đổi bị hủy bỏ, giữ nguyên thông tin hiện tại của khách sạn.<br>- Trạng thái yêu cầu chuyển sang từ chối. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_08** | Phê duyệt yêu cầu xóa khách sạn (Delete Request) | 1. Click vào khách sạn có yêu cầu xóa (Delete Request).<br>2. Xem chi tiết và bấm duyệt xóa. | | - Trạng thái khách sạn chuyển sang "Ngừng hoạt động" (Archived/Suspended).<br>- Khách sạn bị ẩn hoàn toàn trên app đặt phòng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_ROM_09** | Chủ động khóa/ngừng hoạt động khách sạn từ phía Admin | 1. Chọn một khách sạn bất kỳ đang ở trạng thái hoạt động.<br>2. Bấm nút "Ngừng hoạt động" (Archive) và xác nhận. | | - Trạng thái khách sạn chuyển thành "Ngừng hoạt động" (Archived/Suspended).<br>- Ẩn khách sạn khỏi hệ thống đặt phòng. | [ ] Pass<br>[ ] Fail | |

---

## 6. Quản lý Đơn đặt phòng (Bookings Management)

Kiểm tra quản lý đơn đặt phòng từ khách hàng, xác thực thanh toán tại chỗ, và xử lý hủy phòng.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_BKG_01** | Tìm kiếm và Lọc đơn đặt phòng | 1. Truy cập tab "Đơn đặt phòng" (Bookings).<br>2. Thử nghiệm tìm kiếm và lọc theo thời gian (Hôm nay, Tuần này, Tháng này, Tùy chọn ngày), trạng thái (Chờ thanh toán, Đang lưu trú, Chưa đến, Đã hoàn thành, Đã hủy). | | - Bộ lọc hoạt động chính xác.<br>- Thống kê (Stat Cards) tổng quan ở trên đầu cập nhật tương ứng theo các đơn đặt phòng hiển thị trong bảng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_BKG_02** | Xem modal danh sách đặt phòng của khách sạn | 1. Click chọn một khách sạn trong danh sách.<br>2. Quan sát Modal chi tiết đặt phòng của khách sạn đó hiển thị. | | - Hiển thị đúng danh sách booking của khách sạn phân nhóm theo Tab: Chưa đến, Đang ở, Đã xong, Đã hủy.<br>- Có nút điều hướng "Chi tiết phòng" để chuyển hướng nhanh. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_BKG_03** | Xem chi tiết một đơn đặt phòng cụ thể | 1. Click chọn một đơn đặt phòng trong danh sách booking của khách sạn. | | - Hiển thị chi tiết: Họ tên, email, phone khách hàng, loại phòng, số đêm, ngày nhận/trả phòng, yêu cầu đặc biệt, tổng tiền khách trả, hoa hồng admin, số tiền trả đối tác, phương thức thanh toán, trạng thái thanh toán. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_BKG_04** | Xác nhận thanh toán thủ công đối với đơn đặt phòng tại khách sạn (CASH) | 1. Chọn một đơn đặt phòng tại chỗ có trạng thái thanh toán là "Chờ thanh toán".<br>2. Bấm nút "Xác nhận thanh toán" (Confirm Payment).<br>3. Xác nhận hộp thoại popup. | | - Trạng thái thanh toán cập nhật thành "Da thanh toan" (CASH).<br>- Ghi nhận hoa hồng admin. | [ ] Pass<br>[ ] Fail | Chỉ áp dụng với đơn thanh toán bằng tiền mặt/quẹt thẻ trực tiếp tại chỗ. |
| **TC_ADM_BKG_05** | Chủ động hủy đơn đặt phòng | 1. Mở chi tiết đơn hàng đang ở trạng thái hoạt động (Chờ thanh toán / Đã xác nhận).<br>2. Bấm nút "Hủy đơn hàng" (Cancel).<br>3. Xác nhận. | | - Trạng thái đơn đặt phòng chuyển thành "Đã hủy" (Cancelled).<br>- Kích hoạt hoàn tiền tự động nếu là đơn online đã trả tiền. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_BKG_06** | Phê duyệt yêu cầu hủy phòng từ khách hàng (Duyệt hủy) | 1. Tìm đơn đặt phòng có cảnh báo màu cam "Khách hàng yêu cầu hủy đặt phòng" kèm lý do.<br>2. Bấm nút "Duyệt hủy".<br>3. Xác nhận. | | - Trạng thái đơn chuyển sang "Đã hủy".<br>- Thực hiện hoàn tiền tự động (nếu thanh toán online). | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_BKG_07** | Từ chối yêu cầu hủy phòng của khách hàng | 1. Tìm đơn đặt phòng có yêu cầu hủy.<br>2. Bấm nút "Từ chối hủy".<br>3. Xác nhận. | | - Yêu cầu hủy bị bác bỏ, đơn hàng giữ nguyên trạng thái hoạt động hiện tại (Đã xác nhận / Đang lưu trú). | [ ] Pass<br>[ ] Fail | |

---

## 7. Quản lý Quản trị viên (Admins Management)

> [!NOTE]
> Tính năng đăng ký whitelist Google và quản lý các admin cấp dưới chỉ khả dụng đối với tài khoản **Super Admin** (`isSuperAdmin: true`).

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_MNG_01** | Tạo tài khoản quản trị viên mới bằng Email/Mật khẩu thành công | 1. Truy cập tab "Quản trị viên" (Admins).<br>2. Nhập họ tên, email đăng nhập, mật khẩu vào form "Thêm Quản Trị Viên".<br>3. Nhấn "Tạo tài khoản". | - Họ tên: `Nguyễn Văn A`<br>- Email: `admin_a@nowayhome.vn`<br>- Mật khẩu: `Admin@123` | - Tài khoản admin mới được tạo thành công và hiển thị trong danh sách.<br>- Tài khoản này có thể dùng đăng nhập bình thường. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_MNG_02** | Tạo tài khoản thất bại do thiếu thông tin bắt buộc | 1. Để trống Email hoặc Họ tên.<br>2. Bấm "Tạo tài khoản". | - Họ tên: trống<br>- Email: `admin_error@nowayhome.vn` | - Form không submit (HTML5 block) hoặc API trả về lỗi chính xác: `Thieu thong tin`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `BadRequestException` trong `compat.service.ts`. |
| **TC_ADM_MNG_03** | Thêm email admin được phép đăng nhập bằng Google (Super Admin thực hiện) | 1. Điền họ tên và email Google của admin tại form "Email admin đăng nhập Google".<br>2. Bấm "Thêm email Google". | - Họ tên: `Trần Thị B`<br>- Email Google: `tranthib_admin@gmail.com` | - Email được thêm thành công vào whitelist.<br>- Admin này có thể đăng nhập tức thì bằng cách bấm nút "Sign in with Google" ở trang đăng nhập. | [ ] Pass<br>[ ] Fail | Biểu tượng phương thức đăng nhập hiển thị là "Google". |
| **TC_ADM_MNG_04** | Thêm email Google thất bại do thiếu email | 1. Để trống email Google tại form đăng ký Google Admin và bấm "Thêm email Google". | - Họ tên: `Trần Thị B`<br>- Email: trống | - Form không cho submit hoặc API trả về lỗi chính xác: `Thieu email`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `BadRequestException` trong `compat.service.ts`. |
| **TC_ADM_MNG_05** | Chỉnh sửa thông tin quản trị viên | 1. Bấm biểu tượng "Sửa" (Edit icon) trên dòng của admin cần cập nhật.<br>2. Sửa họ tên, email, hoặc mật khẩu mới (nếu muốn).<br>3. Bấm "Cập nhật". | - Họ tên mới: `Nguyễn Văn A (Updated)` | - Thông tin được cập nhật thành công và lưu vào DB. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_MNG_06** | Xóa tài khoản quản trị viên cấp dưới | 1. Bấm biểu tượng "Xóa" (Trash icon) trên dòng của admin đó.<br>2. Xác nhận xóa. | | - Tài khoản bị xóa khỏi danh sách và mất quyền truy cập hệ thống. | [ ] Pass<br>[ ] Fail | Super Admin không được phép tự xóa tài khoản của chính mình (Nút xóa bị ẩn). |

---

## 8. Quản lý Khuyến mãi & Vouchers (Promotions Management)

Kiểm tra tạo lập các chương trình khuyến mãi toàn hệ thống và mã coupon giảm giá.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_PRM_01** | Tạo chương trình khuyến mãi giảm giá mới thành công | 1. Truy cập tab "Khuyến mãi" (Promotions).<br>2. Bấm "Tạo khuyến mãi".<br>3. Điền đầy đủ thông tin chương trình.<br>4. Bấm "Tạo ngay". | - Tên: `Khuyến mãi Mùa Thu 2026`<br>- Giảm giá: `15%`<br>- Ngày: `2026-09-01` đến `2026-09-30` | - Khuyến mãi được lưu thành công.<br>- Trạng thái hoạt động hiển thị tự động theo thời gian hiện tại. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PRM_02** | Tạo khuyến mãi thất bại do ngày kết thúc trước ngày bắt đầu | 1. Điền ngày kết thúc nhỏ hơn hoặc bằng ngày bắt đầu.<br>2. Bấm "Tạo ngay". | - Ngày bắt đầu: `2026-09-30`<br>- Ngày kết thúc: `2026-09-01` | - Giao dịch tạo thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Ngày kết thúc phải sau ngày bắt đầu`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `BadRequestException` trong `promotions.service.ts`. |
| **TC_ADM_PRM_03** | Thêm mã Voucher giảm giá vào chương trình thành công | 1. Click vào biểu tượng Ticket trên dòng khuyến mãi.<br>2. Nhập mã code và giới hạn số lượt dùng.<br>3. Bấm thêm "+". | - Mã Voucher: `AUTUMN15`<br>- Giới hạn/User: `1` | - Mã voucher được thêm thành công và chuyển trạng thái "Hoạt động". | [ ] Pass<br>[ ] Fail | Khách hàng có thể áp dụng mã này khi book phòng. |
| **TC_ADM_PRM_04** | Thêm mã Voucher thất bại do trùng mã đã tồn tại | 1. Nhập mã voucher đã tồn tại trong hệ thống.<br>2. Bấm thêm "+". | - Mã Voucher: `AUTUMN15` (Trùng lặp) | - Tạo thất bại.<br>- Hiển thị thông báo lỗi chính xác từ API: `Mã voucher "AUTUMN15" đã tồn tại`. | [ ] Pass<br>[ ] Fail | Khớp lỗi `BadRequestException` trong `promotions.service.ts`. |
| **TC_ADM_PRM_05** | Bật / Tắt nhanh chương trình khuyến mãi | 1. Click Toggle tại cột "Bật/Tắt" của chương trình khuyến mãi. | | - Trạng thái chương trình lập tức chuyển từ Hoạt động sang Tắt hoặc ngược lại. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_PRM_06** | Xóa chương trình khuyến mãi | 1. Click biểu tượng thùng rác trên dòng khuyến mãi.<br>2. Xác nhận xóa. | | - Chương trình khuyến mãi và các voucher đi kèm bị xóa khỏi danh sách, không thể áp dụng cho các đơn đặt phòng mới. | [ ] Pass<br>[ ] Fail | |

---

## 9. Quản lý Giao dịch & Dòng tiền (Transactions Management)

Kiểm tra theo dõi dòng tiền, số dư ví đối tác, giao dịch hệ thống và thanh toán thuế.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_TRN_01** | Xem và Lọc lịch sử giao dịch toàn hệ thống | 1. Truy cập tab "Giao dịch" (Transactions).<br>2. Lọc danh sách giao dịch theo Loại (Khách thanh toán - `CUSTOMER_PAY`, Chuyển tiền cho đối tác - `SYSTEM_PAY_TO_PARTNER`, Khấu trừ hoa hồng - `COMMISSION_DEDUCTION`) và Phương thức (ONLINE, CASH). | | - Bảng hiển thị chính xác các giao dịch dòng tiền kèm mã đặt phòng, số tiền, ngày tạo, trạng thái thành công. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_TRN_02** | Quản lý Số dư Đối tác | 1. Chuyển sang tiểu mục "Số dư Đối tác".<br>2. Tìm kiếm đối tác.<br>3. Click chọn đối tác bất kỳ. | Từ khóa: `Sunlight Resort` | - Hiển thị đầy đủ thông tin tài khoản ngân hàng kết nối (Ngân hàng, số tài khoản, tên chủ tài khoản).<br>- Hiển thị mã tài khoản thanh toán ngẫu nhiên của khách (Virtual account number).<br>- Hiển thị số dư ví đối tác hiện tại. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_TRN_03** | Xem lịch sử nạp/rút của đối tác cụ thể | 1. Chọn đối tác trong phần số dư.<br>2. Quan sát bảng lịch sử nạp/rút bên cạnh. | | - Hiển thị chi tiết danh sách giao dịch nạp tiền (`DEPOSIT`) hoặc rút tiền (`WITHDRAW`) của đối tác đó kèm trạng thái. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_TRN_04** | Tạo giao dịch hệ thống nạp/rút từ ví Premium (Super Admin thực hiện) | 1. Chuyển sang tiểu mục "Tài khoản Hệ thống & Thuế".<br>2. Tại thẻ "Premium System Card", bấm "Tạo giao dịch hệ thống".<br>3. Chọn loại (Nạp/Rút), nhập số tiền và thông tin tài khoản đích.<br>4. Bấm xác nhận gửi. | - Loại: `WITHDRAW`<br>- Số tiền: `10.000.000`<br>- Tài khoản nhận: `Vietcombank - 0987654321` | - Giao dịch hệ thống được tạo thành công.<br>- Số dư ví hệ thống tăng/giảm tương ứng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_TRN_05** | Xem báo cáo thuế hàng tháng | 1. Kéo xuống phần danh sách báo cáo thuế.<br>2. Xem danh sách các tháng. | | - Hiển thị đúng số thuế cần nộp dựa trên doanh thu hoa hồng của tháng, trạng thái nộp thuế (Đã nộp/Chưa nộp). | [ ] Pass<br>[ ] Fail | Thuế suất và hoa hồng được hệ thống tự động tính toán. |
| **TC_ADM_TRN_06** | Thực hiện nộp thuế hệ thống | 1. Tìm bản ghi thuế tháng có trạng thái "Chưa nộp".<br>2. Nhấn nút "Nộp thuế" (Pay Tax) và xác nhận. | | - Trạng thái thuế chuyển sang "Đã nộp".<br>- Ghi nhận thời gian nộp thuế thực tế. | [ ] Pass<br>[ ] Fail | |

---

## 10. Thông báo hệ thống (Notifications Tab)

Kiểm tra hoạt động gửi nhận thông báo thời gian thực và tự động điều hướng xử lý nghiệp vụ khi nhấp chọn thông báo.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_NTF_01** | Nhận thông báo khi có hoạt động từ đối tác | 1. Quan sát số lượng thông báo chưa đọc trên icon chuông báo tại header.<br>2. Truy cập tab "Thông báo" (Notifications). | | - Hiển thị đầy đủ thông tin: Đăng ký đối tác mới, đối tác gửi yêu cầu duyệt phòng, đối tác gửi yêu cầu chỉnh sửa/xóa phòng. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_NTF_02** | Đánh dấu đã đọc và Tự động điều hướng xử lý theo loại thông báo | 1. Click vào một dòng thông báo chưa đọc.<br>2. Quan sát hành vi hệ thống. | - Thông báo: "Đối tác yêu cầu duyệt khách sạn mới" | - Trạng thái thông báo chuyển sang "Đã đọc" (mờ đi).<br>- Số lượng thông báo chưa đọc ở Header giảm xuống.<br>- Hệ thống tự động chuyển hướng đúng sang tab cần xử lý (ví dụ: Tab Rooms) đồng thời highlight thực thể cần duyệt. | [ ] Pass<br>[ ] Fail | Luồng tối ưu trải nghiệm cho Admin. |
| **TC_ADM_NTF_03** | Đánh dấu tất cả thông báo đã đọc | 1. Nhấp nút "Đánh dấu đã đọc tất cả". | | - Toàn bộ thông báo trong danh sách chuyển sang trạng thái đã đọc. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_NTF_04** | Xóa thông báo khỏi danh sách | 1. Bấm nút "x" (Xóa) trên dòng thông báo.<br>2. Xác nhận xóa. | | - Thông báo bị gỡ bỏ vĩnh viễn khỏi danh sách hiển thị. | [ ] Pass<br>[ ] Fail | |

---

## 11. Cấu hình Tài khoản (Account Settings)

Kiểm tra cập nhật thông tin tài khoản cá nhân của admin đang đăng nhập.

| Mã Test Case | Chức năng / Scenario | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_ADM_SET_01** | Thay đổi Họ và tên tài khoản thành công | 1. Truy cập trang "Cấu hình tài khoản" `/account`.<br>2. Thay đổi nội dung ô Họ và tên.<br>3. Bấm "Cập nhật thông tin". | - Họ tên mới: `Admin Cao Cấp` | - Cập nhật thành công.<br>- Họ tên mới hiển thị tức thì trên thanh Header góc trên bên phải. | [ ] Pass<br>[ ] Fail | |
| **TC_ADM_SET_02** | Thay đổi Mật khẩu tài khoản thành công | 1. Điền Mật khẩu mới và Nhập lại mật khẩu mới.<br>2. Bấm "Đổi mật khẩu". | - Mật khẩu mới: `NewAdmin@1234` | - Mật khẩu được cập nhật thành công.<br>- Cho phép dùng mật khẩu mới này ở lượt đăng nhập sau. | [ ] Pass<br>[ ] Fail | |
