const fs = require('fs');
const path = require('path');

// Helper to build a destination from compact data
let imgCounter = 1000;
function img() {
  imgCounter++;
  return `https://images.unsplash.com/photo-160059654${imgCounter}-${imgCounter}ab${imgCounter}cd?w=800&h=600&fit=crop&auto=format`;
}

function dest(slug, name, nameVi, provinceSlug, category, desc, longDesc, tips, address, lat, lng, hours, fee, bestTime, tags, featured, order) {
  return {
    id: slug, slug, name, nameVi, provinceSlug, category,
    description: desc, longDescription: longDesc,
    images: [
      { src: img(), alt: name, caption: `${name} – cảnh đẹp` },
      { src: img(), alt: `${name} góc khác`, caption: `Khung cảnh tại ${name}` }
    ],
    tips, address,
    coordinates: { lat, lng },
    openingHours: hours, entryFee: fee, bestTimeToVisit: bestTime,
    tags, featured, order
  };
}

const destinations = [
  // ========== HÀ NỘI (7) ==========
  dest("ho-guom","Hồ Gươm","Hồ Gươm (Hồ Hoàn Kiếm)","ha-noi","thien-nhien",
    "Trái tim của thủ đô Hà Nội, nơi lưu giữ truyền thuyết về vua Lê Thái Tổ trả kiếm thần.",
    "Hồ Gươm hay còn gọi là Hồ Hoàn Kiếm là hồ nước ngọt tự nhiên nằm giữa trung tâm thành phố Hà Nội. Hồ là biểu tượng của thủ đô với Tháp Rùa cổ kính nằm trên gò đất nhỏ giữa hồ và cầu Thê Húc sơn đỏ dẫn vào đền Ngọc Sơn. Mỗi buổi sáng, người dân Hà Nội tập thể dục quanh hồ, buổi tối thì không gian đi bộ trở nên sôi động. Hồ Gươm không chỉ là thắng cảnh đẹp mà còn lưu giữ nhiều giá trị lịch sử và văn hoá.",
    ["Nên đến vào buổi sáng sớm hoặc chiều muộn để tránh nắng","Cuối tuần có phố đi bộ quanh hồ","Nên đi bộ một vòng quanh hồ (~1,5km)"],
    "Phố Đinh Tiên Hoàng, Quận Hoàn Kiếm, Hà Nội",21.0285,105.8542,
    "Luôn mở cửa. Đền Ngọc Sơn: 7:00–18:00","Miễn phí (hồ). Đền Ngọc Sơn: 30.000đ","Sáng sớm hoặc chiều muộn",
    ["hồ","lịch-sử","biểu-tượng","phố-đi-bộ"],true,1),

  dest("hoang-thanh-thang-long","Hoàng Thành Thăng Long","Hoàng Thành Thăng Long","ha-noi","lich-su",
    "Di sản văn hoá thế giới UNESCO, chứng nhân lịch sử nghìn năm kinh thành Hà Nội.",
    "Hoàng Thành Thăng Long là di tích lịch sử quan trọng nhất của thủ đô, được UNESCO công nhận năm 2010. Khu di tích lưu giữ các tầng văn hoá từ thế kỷ 7 đến thế kỷ 19. Nổi bật là Cột Cờ Hà Nội, Đoan Môn, Điện Kính Thiên và khu khảo cổ 18 Hoàng Diệu. Nơi nhiều triều đại phong kiến chọn làm kinh đô suốt hơn 1000 năm.",
    ["Nên thuê hướng dẫn viên để hiểu rõ lịch sử","Mang nước và mũ nắng vì khu vực rộng","Dành ít nhất 2 giờ tham quan"],
    "19C Hoàng Diệu, Ba Đình, Hà Nội",21.0340,105.8400,
    "8:00–17:00","30.000đ","Sáng sớm",
    ["di-sản-unesco","lịch-sử","kiến-trúc"],false,2),

  dest("pho-co-ha-noi","Phố Cổ Hà Nội","Phố Cổ Hà Nội (36 Phố Phường)","ha-noi","van-hoa",
    "Khu phố cổ 36 phố phường, lưu giữ nét văn hoá truyền thống của người Hà Nội.",
    "Phố Cổ Hà Nội là khu vực lịch sử nằm ở trung tâm thành phố. Mỗi con phố mang tên nghề thủ công truyền thống như Hàng Bạc, Hàng Đào, Hàng Mã. Nơi đây hoà quyện kiến trúc cổ và cuộc sống hiện đại, với nhà ống đặc trưng, đền chùa linh thiêng và ẩm thực đường phố phong phú. Đi dạo phố cổ, du khách cảm nhận nhịp sống chân thực nhất của người Hà Nội.",
    ["Nên đi bộ để cảm nhận hết vẻ đẹp phố cổ","Thử bún chả, phở, cà phê trứng","Chiều cuối tuần có phố đi bộ Hàng Ngang–Hàng Đào"],
    "Quận Hoàn Kiếm, Hà Nội",21.0345,105.8510,
    "Luôn mở cửa","Miễn phí","Chiều và tối",
    ["phố-cổ","văn-hoá","ẩm-thực","mua-sắm"],true,3),

  dest("lang-bac","Lăng Chủ tịch Hồ Chí Minh","Lăng Chủ tịch Hồ Chí Minh","ha-noi","lich-su",
    "Nơi yên nghỉ của Chủ tịch Hồ Chí Minh, công trình kiến trúc trang nghiêm giữa lòng Hà Nội.",
    "Lăng Chủ tịch Hồ Chí Minh nằm tại Quảng trường Ba Đình, nơi Bác Hồ đọc Tuyên ngôn Độc lập ngày 2/9/1945. Lăng được xây dựng từ năm 1973 đến 1975, kiến trúc trang nghiêm kết hợp phong cách hiện đại và truyền thống. Khu di tích còn gồm Phủ Chủ tịch, nhà sàn Bác Hồ và ao cá. Đây là địa chỉ hành hương quan trọng của người Việt Nam.",
    ["Mặc trang phục lịch sự, không mặc áo ba lỗ, quần short","Không mang máy ảnh, điện thoại vào trong lăng","Lăng đóng cửa thứ Hai và thứ Sáu"],
    "Số 1 Hùng Vương, Ba Đình, Hà Nội",21.0369,105.8344,
    "7:30–10:30 (T3–T5), 7:30–11:00 (T7, CN)","Miễn phí","Sáng sớm",
    ["lịch-sử","lăng","tâm-linh","kiến-trúc"],false,4),

  dest("van-mieu-quoc-tu-giam","Văn Miếu – Quốc Tử Giám","Văn Miếu – Quốc Tử Giám","ha-noi","lich-su",
    "Trường đại học đầu tiên của Việt Nam, biểu tượng của truyền thống hiếu học ngàn năm.",
    "Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới triều Lý Thánh Tông, là trường đại học đầu tiên của Việt Nam. Quần thể gồm hồ Văn, vườn Giám, 82 bia Tiến sĩ trên lưng rùa đá – Di sản Tư liệu Thế giới UNESCO. Kiến trúc mang đậm phong cách cổ truyền với cổng Tam Quan, Khuê Văn Các và sân Thái Học. Đây là nơi sĩ tử đến cầu may trước mỗi kỳ thi.",
    ["Nên đến sáng sớm để tránh đông","Cầu may bằng cách xoa đầu rùa đá","Mua vé kết hợp tham quan nhà Thái Học"],
    "58 Quốc Tử Giám, Đống Đa, Hà Nội",21.0275,105.8355,
    "8:00–17:00","30.000đ","Sáng sớm",
    ["lịch-sử","giáo-dục","kiến-trúc","di-sản"],false,5),

  dest("chua-mot-cot","Chùa Một Cột","Chùa Một Cột (Diên Hựu Tự)","ha-noi","tam-linh",
    "Ngôi chùa có kiến trúc độc đáo nhất Việt Nam, xây trên một cột đá giữa hồ sen.",
    "Chùa Một Cột (Diên Hựu Tự) được vua Lý Thái Tông xây dựng năm 1049. Chùa có kiến trúc độc đáo với toàn bộ ngôi chùa đặt trên một cột đá duy nhất giữa hồ sen, tượng trưng cho bông sen mọc lên từ mặt nước. Đây là biểu tượng kiến trúc của Hà Nội, được in trên logo du lịch Việt Nam. Chùa nằm gần Lăng Bác và Bảo tàng Hồ Chí Minh.",
    ["Kết hợp tham quan Lăng Bác và Bảo tàng HCM","Nên đến vào mùa sen (tháng 6–7)","Tham quan nhanh trong 15–20 phút"],
    "Chùa Một Cột, Ba Đình, Hà Nội",21.0359,105.8339,
    "7:00–18:00","Miễn phí","Mùa sen (tháng 6–7)",
    ["chùa","kiến-trúc","tâm-linh","biểu-tượng"],false,6),

  dest("ho-tay","Hồ Tây","Hồ Tây","ha-noi","thien-nhien",
    "Hồ nước ngọt lớn nhất Hà Nội với diện tích hơn 500ha, thiên đường ẩm thực và giải trí.",
    "Hồ Tây là hồ nước ngọt tự nhiên lớn nhất Hà Nội với diện tích hơn 500ha. Xung quanh hồ có nhiều đền chùa cổ như Phủ Tây Hồ, chùa Trấn Quốc – ngôi chùa cổ nhất Hà Nội. Đường ven hồ là nơi lý tưởng để đạp xe, ngắm hoàng hôn. Khu vực Tây Hồ nổi tiếng với ẩm thực: bánh tôm Hồ Tây, kem Tràng Tiền và nhiều nhà hàng, café view hồ tuyệt đẹp.",
    ["Thuê xe đạp đi vòng quanh hồ (~17km)","Thử bánh tôm Hồ Tây và ốc","Ngắm hoàng hôn ở Phủ Tây Hồ"],
    "Quận Tây Hồ, Hà Nội",21.0583,105.8236,
    "Luôn mở cửa","Miễn phí","Chiều hoàng hôn",
    ["hồ","thiên-nhiên","ẩm-thực","đạp-xe"],false,7),

  // ========== HẢI PHÒNG (5) ==========
  dest("dao-cat-ba","Đảo Cát Bà","Đảo Cát Bà","hai-phong","thien-nhien",
    "Hòn đảo lớn nhất Vịnh Hạ Long, khu dự trữ sinh quyển thế giới với rừng nguyên sinh.",
    "Đảo Cát Bà là đảo lớn nhất trong quần đảo Cát Bà thuộc Hải Phòng, được UNESCO công nhận là Khu dự trữ Sinh quyển Thế giới. Đảo có Vườn quốc gia Cát Bà với rừng nguyên sinh phong phú, nơi sinh sống của loài voọc Cát Bà cực kỳ quý hiếm. Các bãi biển Cát Cò 1, 2, 3 có nước trong xanh. Đảo còn là điểm xuất phát khám phá vịnh Lan Hạ – phiên bản yên bình hơn của Hạ Long.",
    ["Nên ở lại 2–3 ngày để khám phá hết","Thuê xe máy để đi quanh đảo","Đừng bỏ lỡ vịnh Lan Hạ và chèo kayak"],
    "Đảo Cát Bà, Cát Hải, Hải Phòng",20.7275,107.0482,
    "Luôn mở cửa","Miễn phí (vé VQG: 40.000đ)","Tháng 4–Tháng 10",
    ["đảo","biển","rừng","sinh-quyển"],true,1),

  dest("bai-bien-do-son","Bãi biển Đồ Sơn","Bãi biển Đồ Sơn","hai-phong","thien-nhien",
    "Khu nghỉ mát biển lâu đời nhất miền Bắc với bãi cát dài và rừng thông ven biển.",
    "Đồ Sơn là bán đảo ở phía Đông Nam Hải Phòng, khu nghỉ mát biển nổi tiếng từ thời Pháp thuộc. Bãi biển chia thành 3 khu: khu 1, 2, 3 với đặc điểm riêng biệt. Rừng thông cổ thụ ven biển tạo không gian mát mẻ. Đồ Sơn còn có đền Bà Đế linh thiêng và lễ hội chọi trâu truyền thống vào tháng 8 âm lịch hàng năm.",
    ["Tránh đến vào cuối tuần mùa hè vì rất đông","Có nhiều khách sạn giá rẻ ven biển","Thử hải sản tươi ngay tại bãi biển"],
    "Đồ Sơn, Hải Phòng",20.7083,106.7880,
    "Luôn mở cửa","Miễn phí","Tháng 5–Tháng 9",
    ["biển","nghỉ-mát","thông","bán-đảo"],false,2),

  dest("vuon-quoc-gia-cat-ba","Vườn Quốc gia Cát Bà","Vườn Quốc gia Cát Bà","hai-phong","thien-nhien",
    "Khu rừng nguyên sinh trên đảo Cát Bà, nơi bảo tồn loài voọc Cát Bà quý hiếm nhất thế giới.",
    "Vườn quốc gia Cát Bà có diện tích hơn 15.200ha, bao gồm rừng nhiệt đới, rừng ngập mặn và hệ sinh thái biển. Nơi đây là nhà của loài voọc Cát Bà – một trong những loài linh trưởng quý hiếm nhất thế giới. Nhiều tuyến trekking xuyên rừng với đa dạng địa hình. Đỉnh Ngự Lâm cao 331m là điểm ngắm toàn cảnh đảo tuyệt đẹp.",
    ["Mang giày trekking và nước uống","Thuê hướng dẫn viên cho tuyến đường dài","Cẩn thận với vắt trong mùa mưa"],
    "Trung tâm đảo Cát Bà, Cát Hải, Hải Phòng",20.7950,107.0050,
    "7:00–17:00","40.000đ","Tháng 9–Tháng 11",
    ["rừng","trekking","động-vật","bảo-tồn"],false,3),

  dest("hon-dau","Hòn Dấu","Hòn Dấu","hai-phong","thien-nhien",
    "Hòn đảo nhỏ xinh đẹp với ngọn hải đăng cổ từ thời Pháp, điểm du lịch sinh thái yên bình.",
    "Hòn Dấu là hòn đảo nhỏ nằm ngoài khơi Đồ Sơn, nổi tiếng với ngọn hải đăng cổ xây từ thời Pháp thuộc năm 1892. Đảo có cảnh quan xanh mát với rừng cây tự nhiên, bãi đá hoang sơ và nước biển trong vắt. Nơi đây là điểm đặt trạm quan trắc thuỷ văn quan trọng. Hòn Dấu mang lại cảm giác yên bình, tách biệt khỏi nhịp sống thành phố.",
    ["Đi thuyền từ bến Đồ Sơn khoảng 15 phút","Mang theo đồ ăn nhẹ vì trên đảo ít dịch vụ","Chụp ảnh hải đăng lúc hoàng hôn rất đẹp"],
    "Hòn Dấu, Đồ Sơn, Hải Phòng",20.6667,106.8000,
    "7:00–17:00","30.000đ (gồm ca nô)","Tháng 5–Tháng 9",
    ["đảo","hải-đăng","biển","hoang-sơ"],false,4),

  dest("nha-hat-lon-hai-phong","Nhà hát Lớn Hải Phòng","Nhà hát Lớn Hải Phòng","hai-phong","lich-su",
    "Công trình kiến trúc Pháp tiêu biểu, biểu tượng của thành phố Hải Phòng.",
    "Nhà hát Lớn Hải Phòng được xây dựng năm 1912 theo phong cách kiến trúc tân cổ điển Pháp, là một trong ba nhà hát lớn tại Việt Nam. Công trình nằm ở trung tâm thành phố, mặt tiền uy nghi với những cột trụ và phù điêu tinh xảo. Nhà hát từng là nơi diễn ra nhiều sự kiện lịch sử quan trọng. Quảng trường trước nhà hát là nơi tổ chức các sự kiện văn hoá lớn.",
    ["Ngắm kiến trúc bên ngoài bất cứ lúc nào","Kết hợp dạo phố trung tâm Hải Phòng","Check lịch biểu diễn để xem show"],
    "Quảng trường Nhà hát, Hồng Bàng, Hải Phòng",20.8614,106.6836,
    "Theo lịch biểu diễn","Tuỳ chương trình","Quanh năm",
    ["kiến-trúc-pháp","nhà-hát","lịch-sử","biểu-tượng"],false,5),

  // ========== QUẢNG NINH (5) ==========
  dest("vinh-ha-long","Vịnh Hạ Long","Vịnh Hạ Long","quang-ninh","thien-nhien",
    "Di sản Thiên nhiên Thế giới UNESCO với hơn 1.600 đảo đá vôi kỳ vĩ.",
    "Vịnh Hạ Long là di sản thiên nhiên thế giới được UNESCO công nhận hai lần (1994, 2000), với hơn 1.600 đảo đá vôi và đảo phiến thạch. Cảnh quan vịnh hùng vĩ với đảo đá muôn hình vạn trạng nhô lên từ mặt nước xanh ngọc. Các hang động nổi tiếng như Sửng Sốt, Đầu Gỗ, Thiên Cung rất đẹp. Du thuyền qua đêm trên vịnh là trải nghiệm không thể bỏ qua.",
    ["Nên đi du thuyền ngủ đêm 2N1Đ","Mùa đông sương mù rất đẹp nhưng lạnh","Chèo kayak khám phá hang động và làng chài"],
    "TP. Hạ Long, Quảng Ninh",20.9101,107.1839,
    "Luôn mở cửa (theo tour)","Vé tham quan: 250.000đ/người","Tháng 3–5, Tháng 9–11",
    ["di-sản-unesco","vịnh","đá-vôi","du-thuyền"],true,1),

  dest("dao-tuan-chau","Đảo Tuần Châu","Đảo Tuần Châu","quang-ninh","giai-tri",
    "Hòn đảo du lịch giải trí sầm uất, cửa ngõ để khám phá Vịnh Hạ Long.",
    "Đảo Tuần Châu nối liền với đất liền qua con đường dài 2km, là khu du lịch giải trí lớn nhất Quảng Ninh. Đảo có bãi tắm nhân tạo dài 2km, công viên nước, sân golf, bến du thuyền quốc tế và nhiều resort cao cấp. Buổi tối có show nhạc nước và xiếc cá heo hấp dẫn. Đây cũng là điểm xuất phát cho các tour du thuyền Hạ Long.",
    ["Đặt phòng resort sớm vào mùa hè","Xem show nhạc nước buổi tối","Mua vé du thuyền Hạ Long tại bến Tuần Châu"],
    "Đảo Tuần Châu, TP. Hạ Long, Quảng Ninh",20.9428,107.0539,
    "Luôn mở cửa","Vé khu vui chơi: 200.000đ","Tháng 5–Tháng 9",
    ["đảo","giải-trí","resort","du-thuyền"],false,2),

  dest("yen-tu","Yên Tử","Yên Tử","quang-ninh","tam-linh",
    "Trung tâm Phật giáo Trúc Lâm, nơi vua Trần Nhân Tông tu hành và lập nên thiền phái Trúc Lâm.",
    "Yên Tử là ngọn núi cao 1.068m thuộc dãy Đông Triều, nơi Phật hoàng Trần Nhân Tông tu hành và sáng lập Thiền phái Trúc Lâm. Hệ thống chùa chiền trên núi gồm chùa Đồng (đỉnh), chùa Hoa Yên, chùa Một Mái, am Ngọa Vân. Con đường lên đỉnh xuyên qua rừng trúc và rừng mai cổ thụ rất đẹp, đặc biệt vào mùa hoa mai trắng tháng 2–3.",
    ["Đi cáp treo nếu không muốn leo núi (3–4 giờ)","Mùa lễ hội (tháng 1–3 âm lịch) rất đông","Mang giày thể thao và áo ấm"],
    "Thượng Yên Công, Uông Bí, Quảng Ninh",21.0700,106.7150,
    "6:00–18:00","Vé: 40.000đ, cáp treo: 200.000đ","Tháng 2–3 (mùa hoa mai)",
    ["núi","chùa","phật-giáo","trekking"],false,3),

  dest("dao-co-to","Đảo Cô Tô","Đảo Cô Tô","quang-ninh","thien-nhien",
    "Quần đảo hoang sơ với bãi biển cát trắng, nước biển trong vắt và hải đăng đẹp nhất miền Bắc.",
    "Cô Tô là quần đảo gồm hơn 50 đảo lớn nhỏ nằm ở phía Đông Bắc Quảng Ninh. Bãi biển Hồng Vàn, Vàn Chảy có cát trắng mịn, nước xanh trong vắt. Ngọn hải đăng Cô Tô trên đỉnh đồi là điểm ngắm hoàng hôn tuyệt đẹp. Đảo còn hoang sơ, ít thương mại hoá, phù hợp cho du lịch nghỉ dưỡng yên bình và trải nghiệm cuộc sống ngư dân.",
    ["Đặt vé tàu sớm vì mùa hè rất đông","Thuê xe máy để khám phá đảo","Ăn hải sản tươi tại chợ đêm Cô Tô"],
    "Huyện Cô Tô, Quảng Ninh",21.0518,107.7680,
    "Luôn mở cửa","Miễn phí","Tháng 5–Tháng 8",
    ["đảo","biển","hải-đăng","hoang-sơ"],false,4),

  dest("bai-chay","Bãi Cháy","Bãi Cháy","quang-ninh","giai-tri",
    "Khu du lịch biển sôi động bên bờ Vịnh Hạ Long với công viên Sun World và cáp treo nữ hoàng.",
    "Bãi Cháy là bãi biển nhân tạo sạch đẹp nằm ngay trung tâm TP. Hạ Long. Khu vực sầm uất với Sun World Hạ Long Complex gồm công viên nước, vòng quay Sun Wheel cao 215m và cáp treo Nữ Hoàng vượt vịnh. Chợ đêm Hạ Long bán đủ loại đặc sản và quà lưu niệm. Bãi Cháy là nơi lý tưởng để nghỉ ngơi kết hợp vui chơi giải trí.",
    ["Bãi tắm miễn phí, sạch sẽ","Đi cáp treo Nữ Hoàng ngắm vịnh từ trên cao","Chợ đêm mở từ 18:00"],
    "Bãi Cháy, TP. Hạ Long, Quảng Ninh",20.9553,107.0633,
    "Luôn mở cửa","Miễn phí (bãi tắm). Sun World: 500.000đ","Tháng 5–Tháng 9",
    ["biển","giải-trí","cáp-treo","chợ-đêm"],false,5),

  // ========== LÀO CAI (5) ==========
  dest("sa-pa","Sa Pa","Thị xã Sa Pa","lao-cai","thien-nhien",
    "Thị xã trên mây ở độ cao 1.600m với ruộng bậc thang vàng rực và bản làng dân tộc đầy màu sắc.",
    "Sa Pa nằm ở độ cao 1.600m so với mực nước biển, là điểm du lịch hàng đầu Việt Nam. Nổi tiếng với ruộng bậc thang vàng rực mùa lúa chín (tháng 9–10), bản làng dân tộc Mông, Dao, Tày đầy màu sắc và khí hậu mát mẻ quanh năm. Thị xã Sa Pa có kiến trúc kiểu Pháp, nhà thờ đá cổ và chợ phiên sôi động. Sa Pa là cửa ngõ chinh phục đỉnh Fansipan.",
    ["Mang áo ấm vì trời lạnh quanh năm","Đi chợ phiên vào sáng Chủ nhật","Ở homestay bản làng để trải nghiệm văn hoá"],
    "Thị xã Sa Pa, Lào Cai",22.3363,103.8438,
    "Luôn mở cửa","Miễn phí","Tháng 9–10 (lúa chín), Tháng 12–2 (tuyết)",
    ["núi","ruộng-bậc-thang","dân-tộc","sương-mù"],true,1),

  dest("dinh-fansipan","Đỉnh Fansipan","Đỉnh Fansipan","lao-cai","thien-nhien",
    "Nóc nhà Đông Dương cao 3.143m, nay có cáp treo 3 dây hiện đại nhất thế giới.",
    "Fansipan cao 3.143m là đỉnh núi cao nhất Đông Dương. Từ năm 2016, hệ thống cáp treo 3 dây dài 6.292m đưa du khách lên gần đỉnh trong 15 phút. Trên đỉnh có quần thể tâm linh gồm đại tượng Phật A Di Đà, chùa và đường hành hương. Du khách yêu thích mạo hiểm có thể trekking 2–3 ngày xuyên rừng nguyên sinh để chinh phục đỉnh.",
    ["Đi cáp treo sớm để tránh mây mù","Mang áo ấm, nhiệt độ trên đỉnh có thể dưới 0°C","Trekking cần chuẩn bị kỹ và thuê porter"],
    "Fansipan, Sa Pa, Lào Cai",22.3033,103.7750,
    "7:30–17:30","Cáp treo: 700.000đ (người lớn)","Tháng 10–3 (ít mưa)",
    ["đỉnh-núi","cáp-treo","trekking","chinh-phục"],false,2),

  dest("ban-cat-cat","Bản Cát Cát","Bản Cát Cát","lao-cai","van-hoa",
    "Bản làng người Mông cổ xưa nhất Sa Pa với nghề dệt vải thổ cẩm và thác nước đẹp.",
    "Bản Cát Cát là bản làng cổ của người Mông nằm trong thung lũng Mường Hoa, cách trung tâm Sa Pa 2km. Du khách đi bộ xuống bản qua những con đường lát đá, ngắm ruộng bậc thang, xưởng dệt thổ cẩm truyền thống và thác Cát Cát (thác Tiên Sa). Người dân bản địa hiếu khách, sẵn sàng chia sẻ về văn hoá và cuộc sống của mình.",
    ["Mang giày thoải mái vì phải đi bộ nhiều","Mua thổ cẩm trực tiếp từ người dệt","Leo ngược lên khá mệt, chuẩn bị sức khoẻ"],
    "Bản Cát Cát, San Sả Hồ, Sa Pa, Lào Cai",22.3200,103.8300,
    "7:00–18:00","70.000đ","Quanh năm",
    ["bản-làng","dân-tộc","thổ-cẩm","thác-nước"],false,3),

  dest("thac-bac-sa-pa","Thác Bạc","Thác Bạc Sa Pa","lao-cai","thien-nhien",
    "Thác nước cao hơn 100m đổ xuống như dải lụa bạc giữa rừng nguyên sinh Sa Pa.",
    "Thác Bạc nằm trên đỉnh đèo Ô Quy Hồ, cách trung tâm Sa Pa khoảng 12km. Thác có độ cao hơn 100m, nước đổ từ trên cao xuống vách đá tạo thành những dải nước trắng xoá như lụa bạc. Xung quanh là rừng nguyên sinh với không khí trong lành. Vào mùa đông lạnh, thác đóng băng một phần, tạo cảnh tượng kỳ vĩ.",
    ["Đường lên thác có bậc thang khá dốc","Mang áo mưa vì vùng đèo hay có mưa","Kết hợp tham quan đèo Ô Quy Hồ"],
    "Đèo Ô Quy Hồ, Sa Pa, Lào Cai",22.3581,103.7200,
    "7:00–17:00","20.000đ","Tháng 5–9 (nước lớn)",
    ["thác-nước","rừng","thiên-nhiên","đèo"],false,4),

  dest("cau-kinh-rong-may","Cầu kính Rồng Mây","Cầu kính Rồng Mây","lao-cai","giai-tri",
    "Cầu kính vượt thung lũng ở độ cao 2.200m, trải nghiệm đi trên mây tuyệt vời.",
    "Cầu kính Rồng Mây nằm trên đèo Ô Quy Hồ ở độ cao 2.200m, là một trong những cầu kính cao nhất Việt Nam. Cầu dài 60m bắc qua thung lũng sâu, sàn kính trong suốt tạo cảm giác đi trên mây. Từ đây du khách ngắm toàn cảnh thung lũng, núi non trùng điệp và biển mây tuyệt đẹp. Khu vực còn có cà phê trên mây và zipline mạo hiểm.",
    ["Đến sáng sớm để ngắm biển mây","Không phù hợp với người sợ độ cao","Mang áo khoác vì gió lạnh trên đèo"],
    "Đèo Ô Quy Hồ, Sa Pa, Lào Cai",22.3480,103.7100,
    "7:00–17:30","Cầu kính: 200.000đ","Tháng 10–3 (mùa mây)",
    ["cầu-kính","mạo-hiểm","check-in","biển-mây"],false,5),

  // ========== HÀ GIANG (5) ==========
  dest("cao-nguyen-da-dong-van","Cao nguyên đá Đồng Văn","Cao nguyên đá Đồng Văn","ha-giang","thien-nhien",
    "Công viên Địa chất Toàn cầu UNESCO với cảnh quan đá tai mèo kỳ vĩ, hoang sơ.",
    "Cao nguyên đá Đồng Văn được UNESCO công nhận là Công viên Địa chất Toàn cầu năm 2010, trải rộng trên 4 huyện vùng cao. Nơi đây có địa hình karst độc đáo với những khối đá tai mèo nhọn hoắt xen kẽ nương ngô, bản làng dân tộc Mông, Lô Lô, Dao. Mùa hoa tam giác mạch tháng 10–11 nhuộm tím cả cao nguyên. Đây là vùng đất khắc nghiệt nhưng đẹp nhất Việt Nam.",
    ["Thuê xe máy là cách tốt nhất khám phá","Cần ít nhất 3–4 ngày cho hành trình","Mang đủ áo ấm, trời lạnh quanh năm"],
    "Đồng Văn, Hà Giang",23.2833,105.3667,
    "Luôn mở cửa","Miễn phí","Tháng 9–11 (hoa tam giác mạch)",
    ["cao-nguyên","đá","địa-chất","phượt"],true,1),

  dest("deo-ma-pi-leng","Đèo Mã Pí Lèng","Đèo Mã Pí Lèng","ha-giang","thien-nhien",
    "Một trong tứ đại đỉnh đèo Việt Nam, ngoạn mục bên vực sâu sông Nho Quế.",
    "Đèo Mã Pí Lèng dài khoảng 20km nối Đồng Văn với Mèo Vạc, là một trong những cung đường đèo hùng vĩ nhất Việt Nam. Con đèo được mở bằng tay trong 6 năm (1959–1965) bởi thanh niên xung phong. Đỉnh đèo ở độ cao gần 2.000m, bên dưới là hẻm vực Tu Sản sâu hun hút với dòng sông Nho Quế xanh ngọc bích uốn lượn. Đây là điểm check-in huyền thoại của dân phượt.",
    ["Dừng tại đỉnh đèo để ngắm toàn cảnh","Đường đèo quanh co, lái xe cẩn thận","Ngắm sông Nho Quế từ skyway treo trên vách núi"],
    "Đèo Mã Pí Lèng, Mèo Vạc, Hà Giang",23.2530,105.4070,
    "Luôn mở cửa","Miễn phí","Tháng 9–11",
    ["đèo","phượt","hẻm-vực","sông"],false,2),

  dest("cot-co-lung-cu","Cột cờ Lũng Cú","Cột cờ Lũng Cú","ha-giang","lich-su",
    "Điểm cực Bắc Tổ quốc, nơi lá cờ đỏ sao vàng tung bay trên đỉnh núi Rồng.",
    "Cột cờ Lũng Cú nằm trên đỉnh núi Rồng (Long Sơn) ở độ cao 1.470m, là điểm cực Bắc của Việt Nam. Cột cờ cao 33m, trên đỉnh treo lá cờ Tổ quốc rộng 54m² – tượng trưng cho 54 dân tộc Việt Nam. Từ đây ngắm nhìn toàn cảnh biên giới Việt – Trung và ruộng bậc thang Lũng Cú tuyệt đẹp. Leo 839 bậc thang lên đỉnh là hành trình đầy ý nghĩa.",
    ["Leo 839 bậc, cần sức khoẻ tốt","Đến sáng sớm để tránh sương mù","Mang theo giấy tờ tuỳ thân (vùng biên giới)"],
    "Lũng Cú, Đồng Văn, Hà Giang",23.3633,105.3167,
    "7:00–17:00","Miễn phí","Tháng 9–11",
    ["cực-bắc","cột-cờ","biên-giới","lịch-sử"],false,3),

  dest("song-nho-que","Sông Nho Quế","Sông Nho Quế","ha-giang","thien-nhien",
    "Dòng sông xanh ngọc bích uốn lượn dưới hẻm vực Tu Sản sâu nhất Đông Nam Á.",
    "Sông Nho Quế bắt nguồn từ Trung Quốc, chảy qua hẻm vực Tu Sản – hẻm vực sâu nhất Đông Nam Á (khoảng 800m). Nước sông xanh ngọc bích quanh năm, uốn lượn giữa hai bờ vách đá dựng đứng tạo cảnh quan kỳ vĩ. Du khách có thể chèo thuyền kayak trên sông ngắm cảnh hoặc ngắm từ đèo Mã Pí Lèng phía trên.",
    ["Đi thuyền kayak trên sông từ bến thuyền dưới chân đèo","Nước sông lạnh, chuẩn bị áo phao","Kết hợp ngắm từ đèo Mã Pí Lèng"],
    "Hẻm vực Tu Sản, Mèo Vạc, Hà Giang",23.2400,105.4100,
    "7:00–16:00","Vé thuyền: 150.000đ/người","Tháng 9–4",
    ["sông","hẻm-vực","kayak","thiên-nhiên"],false,4),

  dest("pho-co-dong-van","Phố cổ Đồng Văn","Phố cổ Đồng Văn","ha-giang","van-hoa",
    "Khu phố cổ hơn 100 năm tuổi với kiến trúc đá xám đặc trưng giữa cao nguyên đá.",
    "Phố cổ Đồng Văn hình thành từ đầu thế kỷ 20, là khu phố cổ duy nhất còn sót lại trên cao nguyên đá. Những ngôi nhà xây bằng đá xám, trình tường đặc trưng tạo nên không gian cổ kính, trầm mặc. Chợ phiên Đồng Văn họp vào sáng Chủ nhật, nơi đồng bào dân tộc mang nông sản, thổ cẩm đến trao đổi, rất đặc sắc và rực rỡ sắc màu.",
    ["Đến vào sáng Chủ nhật để dự chợ phiên","Thử thắng cố và mèn mén","Ở lại đêm để cảm nhận không gian yên tĩnh"],
    "Thị trấn Đồng Văn, Hà Giang",23.2770,105.3600,
    "Luôn mở cửa","Miễn phí","Chủ nhật (chợ phiên)",
    ["phố-cổ","chợ-phiên","dân-tộc","kiến-trúc"],false,5),

  // ========== NINH BÌNH (5) ==========
  dest("trang-an","Tràng An","Quần thể Danh thắng Tràng An","ninh-binh","thien-nhien",
    "Di sản Văn hoá và Thiên nhiên Thế giới UNESCO kép, cảnh quan non nước kỳ vĩ.",
    "Quần thể danh thắng Tràng An là di sản hỗn hợp đầu tiên của Đông Nam Á được UNESCO công nhận (2014). Du khách ngồi thuyền lướt qua 12 hang động xuyên núi, giữa cảnh sông nước hữu tình và núi đá vôi phủ xanh. Nơi đây còn là bối cảnh quay phim Kong: Skull Island. Khu vực bao gồm cả khu Tràng An cổ và Tràng An du lịch với nhiều tuyến thuyền khác nhau.",
    ["Chọn tuyến 1 hoặc 2 để trải nghiệm đầy đủ","Mang mũ nón vì trời nắng trên thuyền","Mỗi thuyền 4–5 người, đi khoảng 2–3 giờ"],
    "Tràng An, Hoa Lư, Ninh Bình",20.2506,105.8969,
    "7:00–16:00","200.000đ (gồm vé thuyền)","Tháng 1–3 hoặc Tháng 5–6",
    ["di-sản-unesco","thuyền","hang-động","non-nước"],true,1),

  dest("tam-coc-bich-dong","Tam Cốc – Bích Động","Tam Cốc – Bích Động","ninh-binh","thien-nhien",
    "\"Hạ Long trên cạn\" với dòng sông Ngô Đồng uốn lượn giữa núi đá và ruộng lúa.",
    "Tam Cốc gồm 3 hang động (hang Cả, hang Hai, hang Ba) trên dòng sông Ngô Đồng. Du khách ngồi thuyền do người dân chèo bằng chân, lướt qua ruộng lúa vàng và xuyên qua hang đá tối – trải nghiệm độc đáo. Bích Động là ngôi chùa cổ nằm trong hang đá trên núi, được mệnh danh là 'Nam thiên đệ nhị động'. Mùa lúa chín tháng 5–6 cảnh đẹp nhất.",
    ["Mùa lúa chín tháng 5–6 đẹp nhất","Thuyền chèo bằng chân – rất đặc biệt","Kết hợp tham quan chùa Bích Động gần đó"],
    "Tam Cốc, Hoa Lư, Ninh Bình",20.2151,105.9222,
    "6:00–17:00","150.000đ (gồm vé thuyền)","Tháng 5–6 (mùa lúa chín)",
    ["thuyền","ruộng-lúa","hang-động","non-nước"],false,2),

  dest("co-do-hoa-lu","Cố đô Hoa Lư","Cố đô Hoa Lư","ninh-binh","lich-su",
    "Kinh đô đầu tiên của nhà nước phong kiến Đại Cồ Việt thời Đinh – Tiền Lê.",
    "Cố đô Hoa Lư từng là kinh đô của Việt Nam trong 42 năm (968–1010) dưới triều Đinh và Tiền Lê. Nơi đây có đền vua Đinh Tiên Hoàng và đền vua Lê Đại Hành với kiến trúc cổ kính giữa khung cảnh núi non hùng vĩ. Hoa Lư được chọn làm kinh đô nhờ địa thế núi đá bao bọc tự nhiên như thành luỹ. Di tích này là một phần của quần thể Tràng An.",
    ["Kết hợp tham quan Tràng An cùng ngày","Nên thuê hướng dẫn viên","Tham quan khoảng 1–2 giờ"],
    "Trường Yên, Hoa Lư, Ninh Bình",20.2708,105.8925,
    "7:00–17:00","Miễn phí","Quanh năm",
    ["cố-đô","lịch-sử","đền","kiến-trúc"],false,3),

  dest("chua-bai-dinh","Chùa Bái Đính","Chùa Bái Đính","ninh-binh","tam-linh",
    "Quần thể chùa lớn nhất Đông Nam Á với nhiều kỷ lục Việt Nam về kiến trúc Phật giáo.",
    "Chùa Bái Đính là quần thể chùa lớn nhất Đông Nam Á với diện tích 539ha. Chùa nắm giữ nhiều kỷ lục: tượng Phật bằng đồng lớn nhất, hành lang La Hán dài nhất (3km với 500 tượng), tháp chuông nặng 36 tấn. Chùa cũ trên núi có kiến trúc cổ kính giữa rừng cây. Chùa mới hoành tráng, uy nghi với điện thờ, tháp và quảng trường rộng lớn.",
    ["Đi xe điện vì khuôn viên rất rộng","Dành ít nhất 3 giờ tham quan","Mặc trang phục kín đáo khi vào chùa"],
    "Gia Sinh, Gia Viễn, Ninh Bình",20.2674,105.8531,
    "6:00–18:00","Xe điện: 30.000đ","Tháng 1–3 (mùa lễ hội)",
    ["chùa","phật-giáo","kỷ-lục","kiến-trúc"],false,4),

  dest("hang-mua","Hang Múa","Hang Múa","ninh-binh","thien-nhien",
    "Đỉnh núi với Vạn Lý Trường Thành thu nhỏ, điểm ngắm toàn cảnh Tam Cốc tuyệt đẹp.",
    "Hang Múa nổi tiếng với 500 bậc thang đá lên đỉnh núi, tựa như Vạn Lý Trường Thành thu nhỏ. Từ đỉnh núi, du khách ngắm toàn cảnh Tam Cốc – Bích Động, cánh đồng lúa vàng và dòng sông Ngô Đồng uốn lượn tuyệt đẹp. Cảnh quan đặc biệt đẹp vào lúc bình minh và hoàng hôn. Tên Hang Múa bắt nguồn từ truyền thuyết vua Trần cho múa hát trong hang.",
    ["Leo 500 bậc, cần sức khoẻ và giày tốt","Đến lúc bình minh hoặc hoàng hôn","Rất đông cuối tuần và dịp lễ"],
    "Khê Đầu Hạ, Hoa Lư, Ninh Bình",20.2161,105.9200,
    "6:00–18:00","100.000đ","Bình minh hoặc hoàng hôn",
    ["núi","check-in","toàn-cảnh","leo-núi"],false,5),
];

// Continue in the next part - write to temp file
const outputPath = path.join(__dirname, '../src/data/destinations-bac-1.json');
fs.writeFileSync(outputPath, JSON.stringify(destinations, null, 2), 'utf-8');
console.log(`Generated ${destinations.length} Miền Bắc (part 1) destinations`);
