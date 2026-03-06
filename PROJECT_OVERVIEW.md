# Du Lịch Việt Nam - Tổng Quan Dự Án

> **Full-stack Travel Tourism Platform** — Nền tảng du lịch Việt Nam với khám phá địa danh, blog, câu chuyện cộng đồng, lộ trình du lịch, và quản trị nội dung.

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 16.1.6, React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | Express 4, TypeScript, Mongoose 8 (MongoDB) |
| Auth | JWT (jsonwebtoken) + Bcryptjs |
| Upload | Cloudinary + Multer |
| Maps | Leaflet + React Leaflet |
| Blog | React Markdown |
| Charts | Recharts (admin dashboard) |
| Animation | Motion |
| Email | Nodemailer |
| Security | Helmet, CORS |

---

## Cấu Trúc Thư Mục

```
DuLichVietNam/
├── src/                          # Frontend (Next.js)
│   ├── app/
│   │   ├── (public)/             # Trang công khai
│   │   │   ├── page.tsx          # Trang chủ
│   │   │   ├── kham-pha/         # Khám phá & tìm kiếm
│   │   │   ├── dia-danh/[slug]/  # Chi tiết địa danh
│   │   │   ├── tinh/[slug]/      # Chi tiết tỉnh thành
│   │   │   ├── bai-viet/         # Blog
│   │   │   ├── cau-chuyen/       # Câu chuyện cộng đồng
│   │   │   ├── lo-trinh/         # Lộ trình du lịch
│   │   │   ├── ban-do/           # Bản đồ tương tác
│   │   │   ├── dang-nhap/        # Đăng nhập
│   │   │   ├── dang-ky/          # Đăng ký
│   │   │   ├── tai-khoan/        # Tài khoản
│   │   │   ├── yeu-thich/        # Yêu thích
│   │   │   ├── lien-he/          # Liên hệ
│   │   │   └── ve-chung-toi/     # Về chúng tôi
│   │   └── admin/                # Trang quản trị
│   │       ├── page.tsx          # Dashboard
│   │       ├── destinations/     # Quản lý địa danh
│   │       ├── provinces/        # Quản lý tỉnh thành
│   │       ├── posts/            # Quản lý bài viết
│   │       ├── stories/          # Duyệt câu chuyện
│   │       ├── users/            # Quản lý người dùng
│   │       ├── comments/         # Quản lý bình luận
│   │       ├── reviews/          # Quản lý đánh giá
│   │       ├── contacts/         # Quản lý liên hệ
│   │       ├── newsletter/       # Newsletter
│   │       ├── site-config/      # Cấu hình site
│   │       └── login/            # Đăng nhập admin
│   ├── components/
│   │   ├── admin/                # Component admin (Form, Sidebar, Charts...)
│   │   ├── home/                 # Component trang chủ (Hero, Stats, Featured...)
│   │   ├── destination/          # Component địa danh (Hero, Info, Map, Reviews...)
│   │   ├── blog/                 # Component blog (PostCard, Comments, Navigation...)
│   │   ├── story/                # Component câu chuyện (StoryCard, StoryForm)
│   │   ├── search/               # Component tìm kiếm (Filters, Results)
│   │   ├── shared/               # Component dùng chung (ShareButtons, StarRating...)
│   │   ├── layout/               # Layout (Header, Footer, MobileNav)
│   │   ├── skeletons/            # Loading skeletons
│   │   └── ui/                   # UI primitives (Button, Card, Toast, Theme...)
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities & API clients
│   └── types/                    # TypeScript type definitions
├── backend/                      # Backend (Express)
│   └── src/
│       ├── app.ts                # Express app setup
│       ├── config/               # DB, CORS, Cloudinary, ENV
│       ├── controllers/          # Route handlers (17 controllers)
│       ├── middleware/            # Auth, Admin, Error, Upload
│       ├── models/               # Mongoose schemas (12 models)
│       ├── routes/               # Express routes (14 route files)
│       └── utils/                # Slugify, Distance, Mailer
└── public/                       # Static assets
```

---

## Tính Năng Chi Tiết

### 1. Trang Chủ (`/`)
- Hero section với CTA và thống kê (số tỉnh, địa danh, bài viết)
- Grid tỉnh thành nổi bật
- Carousel địa danh nổi bật
- Bài viết mới nhất
- Form đăng ký newsletter

### 2. Khám Phá & Tìm Kiếm (`/kham-pha`)
- **Tìm kiếm full-text** theo tên địa danh
- **Lọc theo danh mục:** Thiên nhiên, Lịch sử, Văn hoá, Ẩm thực, Giải trí, Tâm linh
- **Lọc theo vùng miền:** Miền Bắc, Miền Trung, Miền Nam
- **Lọc theo tỉnh thành**
- **Lọc theo đánh giá:** từ 1-5 sao
- **Lọc theo giá vé:** Miễn phí, Dưới 100k, 100k-500k, Trên 500k
- **Lọc theo khoảng cách:** Tìm địa danh gần vị trí hiện tại (Haversine formula)
- **Sắp xếp:** Mặc định, Tên A-Z, Mới nhất, Nổi bật, Đánh giá cao, Gần nhất
- **Infinite scroll** tự động tải thêm kết quả
- **Quick search** autocomplete trên Header

### 3. Chi Tiết Địa Danh (`/dia-danh/[slug]`)
- Gallery ảnh với lightbox
- Mô tả chi tiết (longDescription)
- Thông tin: giờ mở cửa, phí vào cửa, thời gian tốt nhất
- Mẹo du lịch (tips)
- Bản đồ vị trí (Leaflet)
- Đánh giá & xếp hạng sao (ReviewSection)
- Địa danh liên quan
- Nút yêu thích & thêm vào lộ trình
- Nút chia sẻ mạng xã hội
- JSON-LD structured data (SEO)

### 4. Tỉnh Thành (`/tinh/[slug]`)
- Ảnh hero, mô tả, thông tin dân số/diện tích
- Điểm nổi bật (highlights)
- Danh sách địa danh thuộc tỉnh
- Thời gian tốt nhất để ghé thăm
- SSG với `generateStaticParams`

### 5. Blog / Bài Viết (`/bai-viet`)
- Danh sách bài viết phân trang (12/trang)
- Lọc theo 6 danh mục: Du lịch, Ẩm thực, Văn hoá, Mẹo hay, Trải nghiệm, Tin tức
- Chi tiết bài viết với Markdown rendering
- Đếm lượt xem (view counter)
- Bình luận công khai (tên + email + nội dung)
- Bài viết liên quan
- Điều hướng bài trước/sau
- Thời gian đọc ước tính
- Reading progress bar

### 6. Câu Chuyện Cộng Đồng (`/cau-chuyen`)
- Danh sách câu chuyện đã duyệt
- **Tạo câu chuyện** (yêu cầu đăng nhập):
  - Tiêu đề, nội dung (hỗ trợ Markdown)
  - Chọn địa danh liên quan
  - Upload ảnh (nhiều ảnh, qua Cloudinary)
  - Ngày đi, đánh giá sao
- **Chỉnh sửa** câu chuyện của mình (reset về pending)
- **Xoá** câu chuyện của mình
- **Like** câu chuyện (toggle)
- **Thư viện ảnh cộng đồng** (`/cau-chuyen/thu-vien`) — gallery tổng hợp ảnh từ các câu chuyện
- Workflow duyệt: Pending → Approved / Rejected

### 7. Lộ Trình Du Lịch (`/lo-trinh`)
- Tạo lộ trình nhiều ngày
- Thêm địa danh vào từng ngày
- Ghi chú cho từng ngày
- Chuyển đổi công khai / riêng tư
- Xem, sửa, xoá lộ trình
- Chia sẻ lộ trình công khai

### 8. Bản Đồ (`/ban-do`)
- Bản đồ tương tác Leaflet hiển thị tất cả địa danh
- Marker với popup thông tin
- Click vào marker → xem chi tiết

### 9. Xác Thực & Người Dùng
- **Đăng ký** (`/dang-ky`): username, email, password
- **Đăng nhập** (`/dang-nhap`): email + password → JWT token (7 ngày)
- **Tài khoản** (`/tai-khoan`): xem/sửa profile, displayName
- **Phân quyền:** Admin và User
- **Yêu thích** (`/yeu-thich`): lưu & đồng bộ danh sách địa danh yêu thích

### 10. Đánh Giá & Xếp Hạng
- Đánh giá sao 1-5 cho mỗi địa danh
- Nội dung đánh giá (tuỳ chọn)
- Tính trung bình rating tự động
- Đếm số lượt đánh giá
- Ràng buộc: 1 email chỉ đánh giá 1 lần/địa danh

### 11. Bình Luận
- Bình luận trên bài viết blog
- Không cần đăng nhập (nhập tên + email)
- Admin quản lý: xem tất cả, xoá đơn lẻ, xoá hàng loạt

### 12. Liên Hệ (`/lien-he`)
- Form liên hệ: tên, email, chủ đề, tin nhắn
- Admin: xem, đánh dấu đã đọc/chưa đọc, xoá

### 13. Newsletter
- Form đăng ký nhận bản tin
- Huỷ đăng ký
- Admin: xem danh sách, gửi newsletter qua Nodemailer

### 14. Thông Báo
- Hệ thống thông báo cho user (chuông trên Header)
- Loại: bài viết mới, reply bình luận, reply đánh giá, hệ thống
- Đánh dấu đã đọc (đơn lẻ / tất cả)
- Đếm số thông báo chưa đọc

---

## Trang Quản Trị (Admin)

### Dashboard (`/admin`)
- Thống kê tổng quan: số tỉnh, địa danh, bài viết, liên hệ, bình luận, đánh giá
- Biểu đồ phân tích (Recharts)
- Hoạt động gần đây

### Quản lý Nội Dung
| Trang | Chức năng |
|-------|-----------|
| `/admin/destinations` | CRUD địa danh, upload ảnh, toạ độ, giá vé, tags |
| `/admin/provinces` | CRUD tỉnh thành, vùng miền, highlights |
| `/admin/posts` | CRUD bài viết, draft/published, bulk actions |
| `/admin/stories` | Duyệt câu chuyện: Approve / Reject |
| `/admin/comments` | Xem & xoá bình luận (đơn lẻ / hàng loạt) |
| `/admin/reviews` | Xem & xoá đánh giá |
| `/admin/users` | Danh sách user, đổi role, xoá user |
| `/admin/contacts` | Inbox liên hệ, đánh dấu đọc/chưa đọc |
| `/admin/newsletter` | Danh sách subscriber, gửi newsletter |
| `/admin/site-config` | Cấu hình tên site, mô tả, OG image |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/login` | Đăng nhập → JWT |
| POST | `/register` | Đăng ký user |
| POST | `/admin/register` | Tạo admin (admin only) |
| GET | `/me` | Thông tin user hiện tại |

### Destinations (`/api/destinations`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Tất cả địa danh |
| GET | `/featured` | Địa danh nổi bật |
| GET | `/search` | Tìm kiếm nâng cao (full-text, filters, sort, pagination) |
| GET | `/quick-search` | Autocomplete search |
| GET | `/map` | Dữ liệu cho bản đồ |
| GET | `/by-province/:slug` | Địa danh theo tỉnh |
| GET | `/:slug` | Chi tiết địa danh |
| GET | `/:slug/related` | Địa danh liên quan |
| POST | `/` | Tạo mới (admin) |
| PUT | `/:slug` | Cập nhật (admin) |
| DELETE | `/:slug` | Xoá (admin) |

### Provinces (`/api/provinces`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Tất cả tỉnh |
| GET | `/featured` | Tỉnh nổi bật |
| GET | `/:slug` | Chi tiết tỉnh |
| POST | `/` | Tạo mới (admin) |
| PUT | `/:slug` | Cập nhật (admin) |
| DELETE | `/:slug` | Xoá (admin) |

### Posts (`/api/posts`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Bài viết đã publish (phân trang) |
| GET | `/latest` | 4 bài mới nhất |
| GET | `/admin/all` | Tất cả bài viết (admin) |
| PATCH | `/admin/bulk` | Bulk update (admin) |
| GET | `/:slug` | Chi tiết bài viết (+1 view) |
| GET | `/:slug/related` | Bài liên quan |
| GET | `/:slug/adjacent` | Bài trước/sau |
| POST | `/` | Tạo mới (admin) |
| PUT | `/:slug` | Cập nhật (admin) |
| DELETE | `/:slug` | Xoá (admin) |

### Stories (`/api/stories`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Câu chuyện đã duyệt (phân trang) |
| GET | `/gallery` | Ảnh từ câu chuyện (gallery) |
| GET | `/my` | Câu chuyện của tôi (auth) |
| GET | `/:slug` | Chi tiết câu chuyện |
| POST | `/` | Tạo mới (auth) |
| PUT | `/:slug` | Cập nhật (owner) |
| DELETE | `/:slug` | Xoá (owner/admin) |
| POST | `/:slug/like` | Toggle like (auth) |

### Admin Stories (`/api/admin/stories`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Tất cả câu chuyện (admin) |
| PATCH | `/:id/status` | Duyệt/từ chối (admin) |

### Reviews (`/api/reviews`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/destination/:slug` | Đánh giá của địa danh |
| POST | `/` | Gửi đánh giá |
| GET | `/admin/all` | Tất cả đánh giá (admin) |
| DELETE | `/:id` | Xoá (admin) |

### Comments (`/api/comments`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/post/:postSlug` | Bình luận của bài viết |
| POST | `/` | Gửi bình luận |
| GET | `/admin/all` | Tất cả bình luận (admin) |
| DELETE | `/admin/bulk` | Xoá hàng loạt (admin) |
| DELETE | `/:id` | Xoá đơn lẻ (admin) |

### Itineraries (`/api/itineraries`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Lộ trình của tôi (auth) |
| POST | `/` | Tạo mới (auth) |
| GET | `/:slug` | Chi tiết lộ trình |
| PUT | `/:slug` | Cập nhật (owner) |
| DELETE | `/:slug` | Xoá (owner) |
| PATCH | `/:slug/toggle-public` | Chuyển public/private |

### Users (`/api/users`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/me/profile` | Profile của tôi |
| PUT | `/me/profile` | Cập nhật profile |
| GET | `/me/favorites` | Danh sách yêu thích |
| POST | `/me/favorites/sync` | Đồng bộ favorites |
| POST | `/me/favorites/:slug` | Toggle yêu thích |

### Upload (`/api/upload`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/single` | Upload 1 ảnh (admin) |
| POST | `/multiple` | Upload nhiều ảnh (admin) |
| POST | `/user/multiple` | Upload ảnh user (auth) |

### Notifications (`/api/notifications`)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Thông báo của tôi |
| GET | `/unread-count` | Số chưa đọc |
| PATCH | `/read-all` | Đánh dấu tất cả đã đọc |
| PATCH | `/:id/read` | Đánh dấu 1 thông báo đã đọc |

### Khác
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/newsletter/subscribe` | Đăng ký newsletter |
| POST | `/api/newsletter/unsubscribe` | Huỷ đăng ký |
| GET | `/api/newsletter/admin/all` | DS subscriber (admin) |
| POST | `/api/newsletter/admin/send` | Gửi newsletter (admin) |
| POST | `/api/contacts` | Gửi liên hệ |
| GET | `/api/contacts/admin/all` | DS liên hệ (admin) |
| GET | `/api/stats` | Thống kê công khai |
| GET | `/api/stats/detailed` | Thống kê chi tiết (admin) |
| GET | `/api/site-config` | Cấu hình site |
| PUT | `/api/site-config` | Cập nhật cấu hình (admin) |
| GET | `/api/admin/users` | DS users (admin) |
| PATCH | `/api/admin/users/:id/role` | Đổi role (admin) |
| DELETE | `/api/admin/users/:id` | Xoá user (admin) |
| GET | `/api/health` | Health check |

---

## Data Models

### User
| Field | Type | Ghi chú |
|-------|------|---------|
| username | String (unique) | Tên đăng nhập |
| email | String (unique) | Email |
| password | String | Bcrypt hash, ẩn khi trả về |
| role | "admin" \| "user" | Phân quyền |
| displayName | String | Tên hiển thị |
| favorites | String[] | Danh sách slug yêu thích |

### Province
| Field | Type | Ghi chú |
|-------|------|---------|
| slug | String (unique) | URL slug |
| name, nameVi | String | Tên tiếng Anh & Việt |
| region | "mien-bac" \| "mien-trung" \| "mien-nam" | Vùng miền |
| description, longDescription | String | Mô tả |
| heroImage, thumbnail | String | Ảnh |
| population, area | Number | Dân số, diện tích |
| highlights | String[] | Điểm nổi bật |
| destinationSlugs | String[] | Địa danh thuộc tỉnh |
| featured | Boolean | Nổi bật |
| order | Number | Thứ tự hiển thị |

### Destination
| Field | Type | Ghi chú |
|-------|------|---------|
| slug | String (unique) | URL slug |
| name, nameVi | String | Tên |
| provinceSlug | String | Thuộc tỉnh nào |
| category | Enum 6 loại | Danh mục |
| description, longDescription | String | Mô tả |
| images | [{src, alt, caption?}] | Ảnh (Cloudinary) |
| coordinates | {lat, lng} | Toạ độ |
| openingHours | String | Giờ mở cửa |
| entryFee | String | Phí vào cửa (text) |
| entryFeeValue | Number | Giá vé (VNĐ, dùng cho filter) |
| bestTimeToVisit | String | Thời gian tốt nhất |
| tips | String[] | Mẹo du lịch |
| tags | String[] | Tags |
| featured | Boolean | Nổi bật |
| order | Number | Thứ tự |
| averageRating | Number | Trung bình sao |
| reviewCount | Number | Số lượt đánh giá |

### Post
| Field | Type | Ghi chú |
|-------|------|---------|
| title, slug | String | Tiêu đề & slug |
| excerpt | String | Mô tả ngắn |
| content | String | Nội dung Markdown |
| coverImage | String | Ảnh bìa |
| author | String | Tác giả |
| category | String | Danh mục |
| tags | String[] | Tags |
| published | Boolean | Đã xuất bản |
| publishedAt | Date | Ngày xuất bản |
| views | Number | Lượt xem |

### Story
| Field | Type | Ghi chú |
|-------|------|---------|
| userId | ObjectId (ref User) | Tác giả |
| authorName | String | Tên hiển thị |
| title, slug | String | Tiêu đề & slug |
| content | String | Nội dung |
| destinationSlug | String | Địa danh liên quan |
| photos | [{src, caption?}] | Ảnh |
| visitDate | Date | Ngày đi |
| rating | Number (1-5) | Đánh giá |
| status | "pending" \| "approved" \| "rejected" | Trạng thái duyệt |
| likes | String[] | User IDs đã like |
| likeCount | Number | Số like |

### Itinerary
| Field | Type | Ghi chú |
|-------|------|---------|
| userId | ObjectId (ref User) | Chủ sở hữu |
| title, slug | String | Tiêu đề & slug |
| description | String | Mô tả |
| days | [{dayNumber, destinationSlugs, notes?}] | Lịch trình theo ngày |
| isPublic | Boolean | Công khai |

### Review
| Field | Type | Ghi chú |
|-------|------|---------|
| destinationSlug | String | Địa danh |
| name, email | String | Người đánh giá |
| rating | Number (1-5) | Sao |
| content | String | Nội dung (tuỳ chọn) |
| Unique index | (destinationSlug, email) | 1 email/1 địa danh |

### Comment
| Field | Type | Ghi chú |
|-------|------|---------|
| postSlug | String | Bài viết |
| name, email | String | Người bình luận |
| content | String | Nội dung |

### Notification
| Field | Type | Ghi chú |
|-------|------|---------|
| userId | ObjectId (ref User) | Người nhận |
| type | "new_post" \| "comment_reply" \| "review_reply" \| "system" | Loại |
| title, message | String | Nội dung |
| link | String | Link liên quan |
| read | Boolean | Đã đọc |

### Các Model Khác
- **Contact**: name, email, subject, message, read
- **Subscriber**: email, isActive, subscribedAt, unsubscribedAt
- **SiteConfig**: name, description, url, ogImage, links

---

## UX / UI Features

| Tính năng | Mô tả |
|-----------|-------|
| Dark Mode | Toggle sáng/tối, lưu preference |
| Toast Notifications | Thông báo popup (success, error, warning) |
| Scroll to Top | Nút cuộn lên đầu trang |
| Reading Progress | Thanh tiến trình đọc bài viết |
| Loading Skeletons | Placeholder loading cho cards |
| Page Transitions | Animation chuyển trang (Motion) |
| Infinite Scroll | Tải thêm kết quả tự động (Khám phá) |
| Responsive Design | Mobile-first, breakpoints sm/md/lg/xl |
| Image Fallback | Ảnh lỗi → hiện placeholder |
| Share Buttons | Chia sẻ Facebook, Twitter, copy link |
| 404 Page | Trang lỗi thiết kế riêng |
| Breadcrumb | Điều hướng phân cấp |

---

## SEO & Performance

- **Dynamic Metadata**: generateMetadata cho mỗi trang
- **Open Graph & Twitter Cards**: ảnh, title, description
- **JSON-LD Structured Data**: cho địa danh
- **Sitemap** (`/sitemap.xml`) tự động
- **Robots.txt** (`/robots.txt`)
- **ISR Revalidation**: on-demand sau admin actions + timed (60s cho story)
- **Image Optimization**: Next.js Image, Cloudinary CDN, blur placeholder
- **SSG**: tỉnh thành với `generateStaticParams`

---

## Middleware & Security

| Middleware | Chức năng |
|-----------|----------|
| `auth` | Xác thực JWT token |
| `optionalAuth` | Auth không bắt buộc (lấy user nếu có) |
| `requireAdmin` | Kiểm tra role admin |
| `errorHandler` | Xử lý lỗi global |
| `upload` | Multer + Cloudinary upload |
| `helmet` | HTTP security headers |
| `cors` | Cross-Origin Resource Sharing |
| `morgan` | Request logging |

---

## Lịch Sử Phát Triển (Git Commits)

| Commit | Nội dung |
|--------|----------|
| `056a644` | Initial commit: website Du Lịch Việt Nam |
| `999901c` | Thêm ảnh thật cho tỉnh và địa danh |
| `17f717c` | Backend API (Express + MongoDB) + admin panel |
| `fc41bdd` | Fix dependencies cho Render build |
| `db8084c` | Tách backend khỏi root tsconfig |
| `d239cc7` | Chuyển upload ảnh sang Cloudinary |
| `c14ad52` | Cho phép Cloudinary images trong Next.js Image |
| `9440028` | On-demand revalidation sau admin CRUD |
| `237208c` | Tìm kiếm/lọc + blog features |
| `0442094` | UX: dark mode, toast, scroll-to-top, skeletons, 404, transitions |
| `dd501e6` | Story feature, advanced search filters, UX fixes |
