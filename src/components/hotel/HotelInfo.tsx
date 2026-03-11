import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import type { Hotel } from "@/types";

interface HotelInfoProps {
  hotel: Hotel;
}

const AMENITY_ICONS: Record<string, string> = {
  "Wi-Fi": "wifi",
  "Hồ bơi": "pool",
  "Bãi đỗ xe": "parking",
  "Nhà hàng": "restaurant",
  "Phòng gym": "gym",
  "Spa": "spa",
  "Bar": "bar",
  "Phòng họp": "meeting",
  "Dịch vụ phòng": "room-service",
  "Lễ tân 24/7": "reception",
  "Điều hòa": "ac",
  "Máy giặt": "laundry",
  "Thang máy": "elevator",
  "Két sắt": "safe",
};

function getAmenityIcon(amenity: string) {
  const iconKey = AMENITY_ICONS[amenity];

  const iconMap: Record<string, React.ReactNode> = {
    wifi: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    pool: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h18v-3.75M3 17.25c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0M8 14V7m8 7V7m-8 0a2 2 0 114 0M12 7a2 2 0 114 0" />
      </svg>
    ),
    parking: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h4a4 4 0 010 8H8V7zm0 8v4" />
      </svg>
    ),
    restaurant: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  };

  if (iconKey && iconMap[iconKey]) {
    return iconMap[iconKey];
  }

  // Default checkmark icon
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function HotelInfo({ hotel }: HotelInfoProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Giới thiệu
            </h2>
            <p className="mt-5 text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {hotel.description}
            </p>

            {/* Long description */}
            {hotel.longDescription && (
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {hotel.longDescription}
              </p>
            )}

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tiện nghi
                </h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        {getAmenityIcon(amenity)}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {hotel.policies && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Chính sách
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {hotel.policies}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar info card */}
          <div>
            <div className="bg-primary-50 dark:bg-gray-800 rounded-2xl p-6 space-y-5 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Thông tin khách sạn
              </h3>

              {/* Check-in/out times */}
              {hotel.checkInTime && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Nhận phòng
                    </p>
                    <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                      {hotel.checkInTime}
                    </p>
                  </div>
                </div>
              )}

              {hotel.checkOutTime && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Trả phòng
                    </p>
                    <p className="mt-0.5 font-semibold text-gray-900 dark:text-white">
                      {hotel.checkOutTime}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact info */}
              {hotel.contact.phone && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Điện thoại
                    </p>
                    <a
                      href={`tel:${hotel.contact.phone}`}
                      className="mt-0.5 font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {hotel.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {hotel.contact.email && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Email
                    </p>
                    <a
                      href={`mailto:${hotel.contact.email}`}
                      className="mt-0.5 font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all"
                    >
                      {hotel.contact.email}
                    </a>
                  </div>
                </div>
              )}

              {hotel.contact.website && (
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                      Website
                    </p>
                    <a
                      href={hotel.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all"
                    >
                      {hotel.contact.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Price range */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Khoảng giá
                </p>
                <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(hotel.priceRange.min)}
                  {" - "}
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(hotel.priceRange.max)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">mỗi đêm</p>
              </div>

              {/* Tags / highlights */}
              {hotel.amenities.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities.slice(0, 6).map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
