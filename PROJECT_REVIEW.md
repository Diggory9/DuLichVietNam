# Du Lịch Việt Nam - Tổng Hợp Chức Năng Chi Tiết

> **Ngày review:** 2026-03-13
> **Branch:** main
> **Commit mới nhất:** 2dd4920 - Improve performance: replace motion/react with CSS animations on homepage

---

## 1. Tổng Quan Project

### Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend Framework | Next.js 16.1.6 (App Router) |
| UI Library | React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | Leaflet + react-leaflet 5.0.0 |
| Charts | Recharts 3.7.0 |
| Animations | CSS @keyframes (đã tối ưu từ motion/react) |
| Markdown | react-markdown 10.1.0 |
| Image Upload | Cloudinary CDN + Multer |
| Backend Framework | Express 4.21.2 |
| Database | MongoDB + Mongoose 8.10.1 |
| Authentication | JWT + bcryptjs |
| Email | Nodemailer 8.0.1 |
| Payment | VNPay gateway |
| Security | Helmet, CORS |
| Logging | Morgan |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

### Cấu Trúc Thư Mục

```
DuLichVietNam/
├── src/                          # Next.js frontend
│   ├── app/(public)/             # Public routes
│   ├── app/admin/                # Admin dashboard
│   ├── components/               # React components
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # API clients, utilities
│   ├── data/                     # Static JSON data
│   └── types/                    # TypeScript types
├── backend/                      # Express API server
│   └── src/
│       ├── config/               # DB, CORS, Cloudinary, env
│       ├── controllers/          # 21 route handlers
│       ├── models/               # 16 Mongoose schemas
│       ├── routes/               # 22 route files
│       ├── middleware/            # Auth, admin, error, upload
│       ├── seed/                 # Database seeding
│       ├── data/                 # Seed JSON files
│       └── utils/                # Mailer, slugify, distance
├── public/                       # Static assets
└── scripts/                      # Utility scripts
```

### Deployment

- **Frontend:** Vercel — `https://dulichvietnam.vercel.app`
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Image CDN:** Cloudinary
- **Payment:** VNPay sandbox

---

## 2. Tổng Hợp 24 Chức Năng Frontend

### 1. Trang Chủ (Homepage)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/page.tsx` |
| **Components** | `HeroSection.tsx`, `StatsSection.tsx`, `ProvinceGrid.tsx`, `FeaturedDestinations.tsx`, `LatestPosts.tsx` |
| **Tính năng** | Hero banner với search form, thống kê động từ API (tỉnh/địa danh/bài viết), grid tỉnh thành nổi bật, địa danh featured, bài viết mới nhất, gợi ý thông minh |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/home/*` |

### 2. Tỉnh Thành (Provinces)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/tinh/[slug]/page.tsx` (64 URLs) |
| **Components** | `ProvinceCard.tsx` |
| **Tính năng** | Trang chi tiết tỉnh, danh sách địa danh theo tỉnh, thông tin dân số/diện tích, highlights, hình ảnh hero, phân vùng (Bắc/Trung/Nam) |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/app/(public)/tinh/[slug]/page.tsx`, `src/components/shared/ProvinceCard.tsx` |

### 3. Địa Danh (Destinations) + Search/Filter

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/kham-pha/page.tsx`, `src/app/(public)/dia-danh/[slug]/page.tsx` (233 URLs) |
| **Components** | `SearchPageContent.tsx`, `SearchFilters.tsx`, `DestinationCardClient.tsx`, `DestinationHero.tsx`, `DestinationInfo.tsx`, `RelatedDestinations.tsx`, `ViewTracker.tsx` |
| **Tính năng** | Trang explore với bộ lọc đa tiêu chí (danh mục, vùng miền, tỉnh, rating), trang chi tiết với ảnh/bản đồ/tips, địa danh liên quan, pagination, sorting, lazy loading cards |
| **Danh mục** | Thiên nhiên, Lịch sử, Văn hóa, Ẩm thực, Giải trí, Tâm linh |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/search/*`, `src/components/destination/*` |

### 4. Khách Sạn (Hotels) + Booking

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/khach-san/page.tsx`, `src/app/(public)/khach-san/[slug]/page.tsx` |
| **Components** | `HotelSearchContent.tsx`, `HotelSearchFilters.tsx`, `HotelCard.tsx`, `HotelHero.tsx`, `HotelInfo.tsx`, `HotelBookingForm.tsx`, `RoomList.tsx`, `RelatedHotels.tsx` |
| **Tính năng** | Danh sách khách sạn với filter (sao, giá, tiện nghi), trang chi tiết khách sạn, form đặt phòng (check-in/out, số khách), danh sách phòng trống, khách sạn tương tự |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/hotel/*`, `src/lib/booking-api.ts` |

### 5. Tour Du Lịch + Booking

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/tour/page.tsx`, `src/app/(public)/tour/[slug]/page.tsx` |
| **Components** | `TourSearchContent.tsx`, `TourSearchFilters.tsx`, `TourCard.tsx`, `TourHero.tsx`, `TourInfo.tsx`, `TourBookingForm.tsx`, `TourSchedule.tsx`, `RelatedTours.tsx` |
| **Tính năng** | Danh sách tour với filter (độ khó, thời gian, giá, danh mục), trang chi tiết tour, lịch trình từng ngày, form đặt tour, tour tương tự |
| **Danh mục tour** | Văn hóa, Thiên nhiên, Phiêu lưu, Ẩm thực, Lịch sử, Kết hợp |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/tour/*`, `src/lib/booking-api.ts` |

### 6. Đặt Phòng (Bookings)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/dat-phong/page.tsx`, `src/app/(public)/dat-phong/[code]/page.tsx` |
| **Components** | `BookingCard.tsx`, `BookingDetailView.tsx`, `BookingStatusBadge.tsx`, `CancelBookingModal.tsx` |
| **Tính năng** | Danh sách booking của user, chi tiết booking theo mã (BK-YYYYMMDD-XXXX), trạng thái (pending/confirmed/cancelled), hủy booking, thông tin liên hệ |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/booking/*`, `src/lib/booking-api.ts` |

### 7. Thanh Toán VNPay

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/thanh-toan/ket-qua/page.tsx` |
| **Tính năng** | Tạo URL thanh toán VNPay, redirect đến cổng thanh toán, trang kết quả thanh toán, cập nhật trạng thái booking |
| **Flow** | Tạo booking → Yêu cầu payment URL → Redirect VNPay → IPN callback → Cập nhật trạng thái |
| **Trạng thái** | ⚠️ Một phần — Frontend integration hoàn chỉnh, đang dùng VNPay sandbox |
| **Files chính** | `src/lib/payment-api.ts` |

### 8. Đánh Giá (Reviews)

| Mục | Chi tiết |
|-----|----------|
| **Components** | `ReviewSection.tsx`, `StarRating.tsx`, `StarRatingInput.tsx` |
| **Tính năng** | Đánh giá sao (1-5), viết review cho địa danh/khách sạn/tour, hiển thị rating trung bình, hỗ trợ cả guest và authenticated user |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/review/*`, `src/lib/review-api.ts` |

### 9. Blog / Bài Viết

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/bai-viet/page.tsx`, `src/app/(public)/bai-viet/[slug]/page.tsx` |
| **Components** | `PostContent.tsx`, `CommentSection.tsx`, `RelatedPosts.tsx`, `PostNavigation.tsx`, `CategoryFilter.tsx`, `ReadingProgress.tsx` |
| **Tính năng** | Danh sách bài viết với filter danh mục, nội dung Markdown, hệ thống comment, bài viết liên quan, navigation trước/sau, thời gian đọc, view count, reading progress bar |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/blog/*` |

### 10. Câu Chuyện (Stories / UGC)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/cau-chuyen/page.tsx`, `/tao-moi`, `/[slug]`, `/[slug]/chinh-sua`, `/thu-vien` |
| **Components** | `StoryForm.tsx`, `StoryCard.tsx`, `StoryDetailClient.tsx`, `GalleryClient.tsx` |
| **Tính năng** | User tạo câu chuyện du lịch với ảnh, admin duyệt (pending/approved/rejected), thư viện ảnh cộng đồng, like, chỉnh sửa/xóa bởi owner, liên kết với địa danh |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/story/*`, `src/app/(public)/cau-chuyen/*` |

### 11. Lộ Trình (Itineraries)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/lo-trinh/page.tsx`, `/tao-moi`, `/[slug]`, `/[slug]/chinh-sua` |
| **Components** | `ItineraryDayEditor.tsx`, `ItineraryMapPreview.tsx`, `CostInput.tsx`, `CostSummary.tsx`, `AddToItineraryButton.tsx` |
| **Tính năng** | Tạo lộ trình nhiều ngày, thêm địa danh theo ngày, theo dõi chi phí (lưu trú/di chuyển/ăn uống/khác), xem trước bản đồ, public/private, tính tổng ngân sách |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/itinerary/*` |

### 12. Bản Đồ (Map)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/ban-do/page.tsx` |
| **Components** | `MapView.tsx`, `MapViewLazy.tsx`, `LocationMap.tsx` |
| **Tính năng** | Bản đồ tương tác Leaflet.js toàn Việt Nam, markers cho từng địa danh, popups với thông tin, zoom/pan, lazy-loaded, bản đồ cho từng location trên trang chi tiết |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/shared/MapView.tsx`, `src/components/shared/MapViewLazy.tsx` |

### 13. Auth (Login / Register / Profile)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/dang-nhap/page.tsx`, `src/app/(public)/dang-ky/page.tsx`, `src/app/(public)/tai-khoan/page.tsx`, `src/app/(public)/nguoi-dung/[username]/page.tsx` |
| **Components** | `AuthProvider.tsx` (public + admin) |
| **Tính năng** | JWT token trong localStorage, đăng nhập/đăng ký, session persistence, auto-logout khi token invalid, profile editing (displayName, bio, avatar), public profile, badges display |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/auth/AuthProvider.tsx` |

### 14. Admin Dashboard (15 Admin Pages)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | 15 route groups |
| **Components** | `AdminSidebar.tsx`, `AuthProvider.tsx` (admin), `StatsCharts.tsx`, các Form components |
| **Trạng thái** | ✅ Hoàn thành |

**Danh sách Admin Pages:**

| Route | Chức năng |
|-------|-----------|
| `/admin` | Dashboard — thống kê, biểu đồ, quick links |
| `/admin/login` | Đăng nhập admin |
| `/admin/provinces` | CRUD tỉnh thành |
| `/admin/destinations` | CRUD địa danh |
| `/admin/hotels` | CRUD khách sạn |
| `/admin/tours` | CRUD tour |
| `/admin/posts` | CRUD bài viết blog |
| `/admin/users` | Quản lý user & roles |
| `/admin/stories` | Duyệt câu chuyện (approve/reject) |
| `/admin/reviews` | Quản lý đánh giá |
| `/admin/comments` | Quản lý bình luận |
| `/admin/contacts` | Hộp thư liên hệ |
| `/admin/bookings` | Quản lý đặt phòng/tour |
| `/admin/newsletter` | Danh sách subscribers & gửi email |
| `/admin/site-config` | Cấu hình website |

**Files chính:** `src/app/admin/*`, `src/components/admin/*`

### 15. Yêu Thích (Favorites)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/yeu-thich/page.tsx` |
| **Components** | `FavoritesProvider.tsx`, `FavoriteButton.tsx` |
| **Tính năng** | Nút trái tim trên mọi card, hybrid storage (localStorage cho guest, server sync cho user đã đăng nhập), trang danh sách yêu thích, sync khi login |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/favorites/*` |

### 16. So Sánh (Compare)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/so-sanh/page.tsx` |
| **Components** | `CompareProvider.tsx`, `CompareButton.tsx`, `CompareToolbar.tsx`, `ComparisonTable.tsx` |
| **Tính năng** | So sánh tối đa 3 địa danh side-by-side, floating toolbar, localStorage persistence, bảng so sánh chi tiết |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/compare/*` |

### 17. Tìm Kiếm (Search)

| Mục | Chi tiết |
|-----|----------|
| **Components** | `SearchBar.tsx`, `SearchPageContent.tsx`, `SearchFilters.tsx` |
| **Tính năng** | Quick search ở header (AJAX, kết quả tức thì cho địa danh + tỉnh), trang search đầy đủ, bộ lọc đa tầng, fallback sang local data nếu API không available |
| **Bộ lọc** | Keyword, danh mục (6 loại), vùng miền (3), tỉnh, rating, giá (hotels/tours), tiện nghi, độ khó, thời gian |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/search/*`, `src/components/layout/SearchBar.tsx` |

### 18. SEO

| Mục | Chi tiết |
|-----|----------|
| **Files** | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/shared/JsonLd.tsx`, `src/lib/metadata.ts` |
| **Tính năng** | XML sitemap động (tất cả tỉnh/địa danh/bài viết), robots.txt, JSON-LD structured data (Schema.org), Open Graph meta tags (vi_VN), Twitter cards, canonical URLs, metadata trên mọi page |
| **Trạng thái** | ✅ Hoàn thành |

### 19. Dark Mode & Responsive

| Mục | Chi tiết |
|-----|----------|
| **Components** | `ThemeProvider.tsx`, `ThemeToggle.tsx`, `MobileNav.tsx` |
| **Dark Mode** | 3 chế độ: light/dark/system, lưu localStorage, non-blocking script chống flash, Tailwind `dark:` prefix |
| **Responsive** | Mobile-first, breakpoints sm/md/lg/xl/2xl, hamburger menu mobile, touch-friendly, flexible grids |
| **Trạng thái** | ✅ Hoàn thành |

### 20. Liên Hệ (Contact)

| Mục | Chi tiết |
|-----|----------|
| **Pages** | `src/app/(public)/lien-he/page.tsx` |
| **Components** | `ContactForm.tsx` |
| **Tính năng** | Form liên hệ (tên, email, chủ đề, nội dung), validation client-side, lưu database, gửi email thông báo cho admin, admin quản lý (đọc/chưa đọc/xóa) |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/shared/ContactForm.tsx` |

### 21. Newsletter

| Mục | Chi tiết |
|-----|----------|
| **Components** | `NewsletterForm.tsx` |
| **Tính năng** | Form đăng ký email ở footer, admin quản lý danh sách subscribers, admin gửi newsletter, theo dõi subscriber active/inactive |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/shared/NewsletterForm.tsx` |

### 22. Notifications

| Mục | Chi tiết |
|-----|----------|
| **Components** | `NotificationBell.tsx` |
| **Tính năng** | Chuông thông báo ở header, polling mỗi 30s, dropdown danh sách thông báo, mark as read, badge số chưa đọc |
| **Loại thông báo** | `new_post`, `comment_reply`, `review_reply`, `system` |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/layout/NotificationBell.tsx` |

### 23. Upload Ảnh (Cloudinary)

| Mục | Chi tiết |
|-----|----------|
| **Components** | `ImageUploader.tsx` (admin) |
| **Tính năng** | Upload single/multiple files, preview trước khi upload, hỗ trợ JPEG/PNG/WebP/AVIF, URL input thay thế, auto convert WebP, auto quality optimization |
| **Endpoints** | `/api/upload/single`, `/api/upload/multiple`, `/api/upload/user/multiple` |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/admin/ImageUploader.tsx`, `backend/src/controllers/upload.controller.ts` |

### 24. Gợi Ý Thông Minh (Smart Recommendations)

| Mục | Chi tiết |
|-----|----------|
| **Components** | `SmartRecommendations.tsx` |
| **Hook** | `useViewHistory.ts` |
| **Tính năng** | Track lịch sử xem (localStorage, tối đa 50 items), phân tích top danh mục & tỉnh, fetch gợi ý từ API, loại trừ đã xem/yêu thích, hiển thị tag lý do ("Vì bạn thích..."), lazy-loaded |
| **Trạng thái** | ✅ Hoàn thành |
| **Files chính** | `src/components/recommendations/SmartRecommendations.tsx`, `src/hooks/useViewHistory.ts` |

---

## 3. Tổng Hợp Backend API (22 Nhóm Endpoints)

### 3.1 Authentication (`/api/auth`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/login` | Đăng nhập | Public |
| POST | `/register` | Đăng ký | Public |
| POST | `/admin/register` | Tạo admin | Admin |
| GET | `/me` | Thông tin user hiện tại | Auth |

**Model:** User — `username, email, password (bcrypt, 12 rounds), role (admin|user), displayName, bio, avatar, isPublicProfile, badges[], favorites[]`
**Trạng thái:** ✅ Hoàn thành

### 3.2 Provinces (`/api/provinces`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách tỉnh | Public |
| GET | `/featured` | Tỉnh nổi bật | Public |
| GET | `/:slug` | Chi tiết tỉnh | Public |
| POST | `/` | Tạo tỉnh | Admin |
| PUT | `/:slug` | Cập nhật tỉnh | Admin |
| DELETE | `/:slug` | Xóa tỉnh | Admin |

**Model:** Province — `slug, name, nameVi, region, description, longDescription, heroImage, thumbnail, population, area, bestTimeToVisit, highlights[], destinationSlugs[], featured, order`
**Trạng thái:** ✅ Hoàn thành

### 3.3 Destinations (`/api/destinations`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách địa danh | Public |
| GET | `/featured` | Địa danh nổi bật | Public |
| GET | `/search` | Tìm kiếm | Public |
| GET | `/quick-search` | Tìm kiếm nhanh | Public |
| GET | `/map` | Dữ liệu bản đồ | Public |
| GET | `/recommendations` | Gợi ý | Public |
| POST | `/batch` | Batch get | Public |
| GET | `/by-province/:slug` | Theo tỉnh | Public |
| GET | `/:slug` | Chi tiết | Public |
| GET | `/:slug/related` | Liên quan | Public |
| POST | `/` | Tạo | Admin |
| PUT | `/:slug` | Cập nhật | Admin |
| DELETE | `/:slug` | Xóa | Admin |

**Model:** Destination — `slug, name, nameVi, provinceSlug, category, description, longDescription, images[], tips[], address, coordinates{lat,lng}, openingHours, entryFee, entryFeeValue, bestTimeToVisit, tags[], featured, order, averageRating, reviewCount`
**Trạng thái:** ✅ Hoàn thành

### 3.4 Hotels (`/api/hotels`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách khách sạn | Public |
| GET | `/featured` | Nổi bật | Public |
| GET | `/search` | Tìm kiếm | Public |
| GET | `/by-province/:slug` | Theo tỉnh | Public |
| GET | `/by-destination/:slug` | Theo địa danh | Public |
| GET | `/:slug` | Chi tiết | Public |
| POST | `/` | Tạo | Admin |
| PUT | `/:slug` | Cập nhật | Admin |
| DELETE | `/:slug` | Xóa | Admin |

**Model:** Hotel — `slug, name, nameVi, destinationSlug, provinceSlug, address, coordinates, stars (1-5), description, longDescription, images[], priceRange{min,max}, amenities[], rooms[{name, type, price, maxGuests, totalRooms, amenities[], images[], available}], contact{phone, email, website}, checkInTime, checkOutTime, policies, featured, order, averageRating, reviewCount, active`
**Trạng thái:** ✅ Hoàn thành

### 3.5 Tours (`/api/tours`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách tour | Public |
| GET | `/featured` | Nổi bật | Public |
| GET | `/search` | Tìm kiếm | Public |
| GET | `/by-province/:slug` | Theo tỉnh | Public |
| GET | `/by-destination/:slug` | Theo địa danh | Public |
| GET | `/:slug` | Chi tiết | Public |
| POST | `/` | Tạo | Admin |
| PUT | `/:slug` | Cập nhật | Admin |
| DELETE | `/:slug` | Xóa | Admin |

**Model:** Tour — `slug, name, nameVi, destinationSlugs[], provinceSlug, category, description, longDescription, images[], duration{days, nights}, price, discountPrice, maxGroupSize, schedule[{dayNumber, title, description, destinationSlugs[]}], includes[], excludes[], highlights[], departureLocation, difficulty, featured, order, averageRating, reviewCount, active`
**Trạng thái:** ✅ Hoàn thành

### 3.6 Bookings (`/api/bookings`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/` | Tạo booking | Auth |
| GET | `/my` | Booking của tôi | Auth |
| GET | `/my/:code` | Chi tiết theo mã | Auth |
| PATCH | `/my/:code/cancel` | Hủy booking | Auth |
| GET | `/admin/all` | Tất cả booking | Admin |
| PATCH | `/admin/:id/status` | Cập nhật trạng thái | Admin |
| GET | `/admin/stats` | Thống kê booking | Admin |

**Model:** Booking — `bookingCode (auto: BK-YYYYMMDD-XXXX), userId, type (hotel|tour), hotelSlug, roomName, tourSlug, checkIn, checkOut, tourDate, guests, contactInfo{fullName, email, phone}, notes, totalPrice, paymentStatus (unpaid|pending|paid|refunded), paymentMethod (vnpay|bank_transfer|cash), paymentTransactionId, paymentDate, status (pending|confirmed|cancelled), cancellationReason`
**Trạng thái:** ✅ Hoàn thành

### 3.7 Payments (`/api/payments`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/create-url` | Tạo URL thanh toán VNPay | Auth |
| GET | `/vnpay-return` | VNPay return callback | Public |
| GET | `/vnpay-ipn` | VNPay IPN callback | Public |

**Trạng thái:** ✅ Hoàn thành (sandbox mode)

### 3.8 Reviews (`/api/reviews`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/destination/:destinationSlug` | Reviews theo địa danh | Public |
| GET | `/:targetType/:targetSlug` | Reviews theo target | Public |
| POST | `/` | Tạo review (guest) | Public |
| POST | `/authenticated` | Tạo review (auth) | Auth |
| GET | `/admin/all` | Tất cả reviews | Admin |
| DELETE | `/:id` | Xóa review | Admin |

**Model:** Review — `destinationSlug, targetType (destination|hotel|tour), targetSlug, userId, name, email, rating (1-5), content`
**Trạng thái:** ✅ Hoàn thành

### 3.9 Posts (`/api/posts`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách bài viết | Public |
| GET | `/latest` | Bài viết mới nhất | Public |
| GET | `/admin/all` | Tất cả (admin view) | Admin |
| PATCH | `/admin/bulk` | Bulk update | Admin |
| GET | `/:slug` | Chi tiết | Public |
| GET | `/:slug/related` | Liên quan | Public |
| GET | `/:slug/adjacent` | Bài trước/sau | Public |
| POST | `/` | Tạo | Admin |
| PUT | `/:slug` | Cập nhật | Admin |
| DELETE | `/:slug` | Xóa | Admin |

**Model:** Post — `title, slug, excerpt, content, coverImage, author, category, tags[], published, publishedAt, views`
**Trạng thái:** ✅ Hoàn thành

### 3.10 Comments (`/api/comments`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/post/:postSlug` | Comments theo bài viết | Public |
| POST | `/` | Tạo comment | Public |
| GET | `/admin/all` | Tất cả comments | Admin |
| DELETE | `/admin/bulk` | Xóa hàng loạt | Admin |
| DELETE | `/:id` | Xóa comment | Admin |

**Model:** Comment — `postSlug, name, email, content`
**Trạng thái:** ✅ Hoàn thành

### 3.11 Stories (`/api/stories`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Câu chuyện đã duyệt | Public |
| GET | `/gallery` | Thư viện ảnh cộng đồng | Public |
| POST | `/` | Tạo câu chuyện | Auth |
| GET | `/my` | Câu chuyện của tôi | Auth |
| GET | `/:slug` | Chi tiết | Public |
| PUT | `/:slug` | Cập nhật | Auth (owner) |
| DELETE | `/:slug` | Xóa | Auth (owner) |
| POST | `/:slug/like` | Like | Auth |

**Model:** Story — `userId, authorName, destinationSlug, title, slug, content, photos[{src, caption}], visitDate, rating, status (pending|approved|rejected), likes[], likeCount`
**Trạng thái:** ✅ Hoàn thành

### 3.12 Admin Stories (`/api/admin/stories`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách stories (admin) | Admin |
| PATCH | `/:id/status` | Cập nhật trạng thái | Admin |

**Trạng thái:** ✅ Hoàn thành

### 3.13 Itineraries (`/api/itineraries`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Lộ trình của tôi | Auth |
| POST | `/` | Tạo lộ trình | Auth |
| GET | `/:slug` | Chi tiết lộ trình | Public/Auth |
| PUT | `/:slug` | Cập nhật | Auth (owner) |
| DELETE | `/:slug` | Xóa | Auth (owner) |
| PATCH | `/:slug/toggle-public` | Toggle public/private | Auth (owner) |

**Model:** Itinerary — `userId, title, slug, description, days[{dayNumber, destinationSlugs[], notes, accommodationCost, transportCost, mealCost, otherCost}], isPublic, totalBudget`
**Trạng thái:** ✅ Hoàn thành

### 3.14 Users (`/api/users`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/:username/public` | Profile công khai | Public |
| GET | `/me/profile` | Profile của tôi | Auth |
| PUT | `/me/profile` | Cập nhật profile | Auth |
| GET | `/me/favorites` | Danh sách yêu thích | Auth |
| GET | `/me/badges` | Huy hiệu | Auth |
| POST | `/me/favorites/sync` | Sync favorites | Auth |
| POST | `/me/favorites/:slug` | Toggle yêu thích | Auth |

**Trạng thái:** ✅ Hoàn thành

### 3.15 Admin Users (`/api/admin/users`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Danh sách users | Admin |
| PATCH | `/:id/role` | Cập nhật role | Admin |
| DELETE | `/:id` | Xóa user | Admin |

**Trạng thái:** ✅ Hoàn thành

### 3.16 Notifications (`/api/notifications`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/` | Thông báo của tôi | Auth |
| GET | `/unread-count` | Số chưa đọc | Auth |
| PATCH | `/read-all` | Đánh dấu tất cả đã đọc | Auth |
| PATCH | `/:id/read` | Đánh dấu đã đọc | Auth |

**Model:** Notification — `userId, type (new_post|comment_reply|review_reply|system), title, message, link, read`
**Trạng thái:** ✅ Hoàn thành

### 3.17 Newsletter (`/api/newsletter`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/subscribe` | Đăng ký | Public |
| POST | `/unsubscribe` | Hủy đăng ký | Public |
| GET | `/admin/all` | Danh sách subscribers | Admin |
| POST | `/admin/send` | Gửi newsletter | Admin |

**Model:** Subscriber — `email, isActive, subscribedAt, unsubscribedAt`
**Trạng thái:** ✅ Hoàn thành

### 3.18 Contacts (`/api/contacts`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/` | Gửi liên hệ | Public |
| GET | `/admin/all` | Danh sách liên hệ | Admin |
| PATCH | `/:id/read` | Đánh dấu đã đọc | Admin |
| PATCH | `/:id/unread` | Đánh dấu chưa đọc | Admin |
| DELETE | `/:id` | Xóa | Admin |

**Model:** Contact — `name, email, subject, message, read`
**Trạng thái:** ✅ Hoàn thành

### 3.19 Upload (`/api/upload`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/single` | Upload 1 ảnh | Admin |
| POST | `/multiple` | Upload nhiều ảnh | Admin |
| POST | `/user/multiple` | Upload (user) | Auth |

**Config:** Cloudinary CDN, auto WebP, max 5MB, memory storage (Multer)
**Trạng thái:** ✅ Hoàn thành

### 3.20 Room Inventory (`/api/room-inventory`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/check` | Kiểm tra phòng trống | Public |
| PUT | `/set` | Thiết lập inventory | Admin |
| GET | `/calendar` | Lịch phòng | Admin |

**Model:** RoomInventory — `hotelSlug, roomName, date, totalRooms, bookedRooms`
**Trạng thái:** ✅ Hoàn thành

### 3.21 Stats & Site Config

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| GET | `/api/stats` | Thống kê chung | Public |
| GET | `/api/stats/detailed` | Thống kê chi tiết | Admin |
| GET | `/api/site-config` | Cấu hình site | Public |
| PUT | `/api/site-config` | Cập nhật cấu hình | Admin |

**Model:** SiteConfig — `name, description, url, ogImage, links{github}`
**Trạng thái:** ✅ Hoàn thành

### 3.22 Seed & Health

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| POST | `/api/admin/seed` | Re-seed database | Admin |
| GET | `/api/health` | Health check | Public |

**Trạng thái:** ✅ Hoàn thành

---

## 4. Data & Seed

### Dữ Liệu Đã Seed

| Loại | Số lượng | Nguồn | File |
|------|----------|-------|------|
| Tỉnh thành | 63 | `provinces.json` (1,710 dòng) | `src/data/provinces.json`, `backend/src/data/provinces.json` |
| Địa danh | 233 | `destinations.json` (10,012 dòng) | `src/data/destinations.json`, `backend/src/data/destinations.json` |
| Cấu hình site | 1 | `site.json` (9 dòng) | `src/data/site.json`, `backend/src/data/site.json` |
| Bài viết blog | Nhiều | `seedPosts.ts` (15,810 dòng) | `backend/src/seed/seedPosts.ts` |
| Khách sạn | 100+ | `seed-hotels-tours.ts` (27,419 dòng) | `backend/src/seed-hotels-tours.ts` |
| Tour | Nhiều | `seed-hotels-tours.ts` | `backend/src/seed-hotels-tours.ts` |
| Admin user | 1 | `seedAdmin.ts` | `backend/src/seed/seedAdmin.ts` |

### Chi Tiết Dữ Liệu

- **63 tỉnh thành** — đầy đủ 63 tỉnh/thành phố, phân 3 vùng (Bắc/Trung/Nam), kèm dân số, diện tích, highlights
- **233 địa danh** — phủ tất cả 63 tỉnh, 6 danh mục, có tọa độ GPS, hình ảnh Unsplash, giá vé, thời gian tham quan
- **100+ khách sạn** — rooms, amenities, pricing (VND), star ratings
- **Nhiều tour** — lịch trình nhiều ngày, giá, độ khó
- **Blog posts** — bài viết du lịch tiếng Việt
- **Admin mặc định** — username: `admin`, email: `admin@dulichvietnam.com`

### Seed Scripts

```bash
# Seed provinces, destinations, site config
npm run seed          # backend/src/seed/seed.ts

# Seed admin user
npm run seed:admin    # backend/src/seed/seedAdmin.ts

# Seed via API (requires admin auth)
POST /api/admin/seed
```

---

## 5. Vấn Đề Tồn Đọng & Đã Fix

### Đã Fix Gần Đây

| Commit | Vấn đề | Giải pháp |
|--------|--------|-----------|
| `2dd4920` | Homepage load chậm do motion/react (~50KB) | Thay bằng CSS @keyframes + IntersectionObserver, lazy-load SmartRecommendations |
| `6975fda` | HeroSection hiển thị số cứng (3/9/3) thay vì data thật | Fetch từ `/api/stats` endpoint |
| `7f8f3a6` | API URL rải rác khắp codebase, CORS lỗi production | Centralize `api-config.ts`, fix CORS callback-based validation |
| `af965d7` | Build lỗi trên Render do thiếu `@types/nodemailer` | Move từ devDependencies sang dependencies |
| `71145f9` | Chưa có booking/payment/room availability/review | Thêm toàn bộ hệ thống e-commerce |

### Vấn Đề Còn Tồn Đọng

| # | Vấn đề | Mức độ | Ghi chú |
|---|--------|--------|---------|
| 1 | VNPay đang dùng sandbox | Thấp | Cần đăng ký production credentials khi go-live |
| 2 | Không có CI/CD | Trung bình | Không có GitHub Actions, test automation |
| 3 | Không có test suite | Trung bình | Không có unit test / integration test |
| 4 | Không có Dockerfile | Thấp | Deploy thủ công qua Vercel/Render |
| 5 | Badges chỉ display, chưa auto-generate đầy đủ | Thấp | Backend có logic badges nhưng chưa đầy đủ trigger |
| 6 | Không có rate limiting | Trung bình | API có thể bị abuse |
| 7 | Không có forgot password / reset password | Trung bình | Auth flow chưa có recovery |
| 8 | Không có OAuth (Google, Facebook) | Thấp | Chỉ có email/password login |
| 9 | README.md là template Next.js mặc định | Thấp | Cần viết lại cho project |

---

## 6. Đề Xuất Tiếp Theo

### Ưu Tiên Cao

1. **Thêm Test Suite** — Unit tests (Jest/Vitest) cho backend controllers, integration tests cho API endpoints, component tests cho frontend
2. **Rate Limiting** — Thêm express-rate-limit để bảo vệ API khỏi abuse
3. **Forgot Password Flow** — Thêm endpoint reset password qua email
4. **CI/CD Pipeline** — GitHub Actions cho lint, test, build, deploy tự động

### Ưu Tiên Trung Bình

5. **OAuth Integration** — Đăng nhập bằng Google/Facebook
6. **Real-time Notifications** — WebSocket thay vì polling 30s
7. **Image Optimization Pipeline** — Auto resize, compress trước khi upload Cloudinary
8. **Caching Layer** — Redis cho API responses phổ biến (provinces, destinations)
9. **VNPay Production** — Đăng ký và chuyển sang production credentials

### Ưu Tiên Thấp

10. **Docker Setup** — Dockerfile + docker-compose cho development & production
11. **Monitoring & Logging** — Sentry cho error tracking, structured logging
12. **PWA Support** — Service worker, offline mode, push notifications
13. **Multi-language** — i18n cho English/Vietnamese
14. **Advanced Analytics** — Dashboard chi tiết hơn (user behavior, conversion)
15. **Badge System Enhancement** — Auto-trigger badges dựa trên activities

---

## Tổng Kết

| Metric | Giá trị |
|--------|---------|
| **Tổng chức năng Frontend** | 24 |
| **Hoàn thành** | 23 (95.8%) |
| **Một phần** | 1 (VNPay sandbox) |
| **Tổng nhóm API** | 22 |
| **Tổng endpoints** | 90+ |
| **Database models** | 16 |
| **Admin pages** | 15 |
| **Dữ liệu seed** | 63 tỉnh, 233 địa danh, 100+ khách sạn, nhiều tour & bài viết |

> **Kết luận:** Project Du Lịch Việt Nam là một nền tảng du lịch full-stack hoàn chỉnh với hầu hết các tính năng đã được implement đầy đủ. Các vấn đề tồn đọng chủ yếu liên quan đến DevOps (CI/CD, testing, monitoring) và một số tính năng bổ sung (OAuth, rate limiting, forgot password).
