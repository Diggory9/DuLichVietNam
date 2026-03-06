const fs = require('fs');
const path = require('path');

// Compact province definitions: [slug, name, nameVi, region, description, longDescription, population, area, bestTimeToVisit, highlights[], destinationSlugs[], featured, order]
const provincesRaw = [
  // ============ MIỀN BẮC (25) ============
  {
    slug: "ha-noi", name: "Hà Nội", nameVi: "Hà Nội", region: "mien-bac",
    desc: "Thủ đô nghìn năm văn hiến, nơi giao thoa giữa nét cổ kính và nhịp sống hiện đại.",
    longDesc: "Hà Nội – thủ đô của Việt Nam, là thành phố có lịch sử hơn 1000 năm. Nơi đây nổi tiếng với những con phố cổ, đền chùa cổ kính, hồ nước thanh bình và ẩm thực đường phố phong phú. Từ Hồ Gươm thanh bình đến Hoàng Thành Thăng Long hùng vĩ, từ Văn Miếu cổ kính đến phố cổ 36 phố phường sôi động, Hà Nội luôn để lại ấn tượng sâu đậm. Thủ đô còn là trung tâm chính trị, văn hoá và giáo dục hàng đầu cả nước.",
    pop: "8,4 triệu", area: "3.358,6", best: "Tháng 9 – Tháng 11 (mùa thu)",
    highlights: ["Phố cổ Hà Nội", "Ẩm thực đường phố", "Đền chùa cổ kính", "Hồ Gươm và Tháp Rùa"],
    dests: ["ho-guom","hoang-thanh-thang-long","pho-co-ha-noi","lang-bac","van-mieu-quoc-tu-giam","chua-mot-cot","ho-tay"],
    featured: true, order: 1, imgId: "1583531579927-24eb1e2a0b3c"
  },
  {
    slug: "hai-phong", name: "Hải Phòng", nameVi: "Hải Phòng", region: "mien-bac",
    desc: "Thành phố cảng lớn nhất miền Bắc với đảo Cát Bà hoang sơ và ẩm thực hải sản tươi ngon.",
    longDesc: "Hải Phòng là thành phố cảng lớn nhất miền Bắc Việt Nam, cửa ngõ ra biển quan trọng. Thành phố nổi tiếng với quần đảo Cát Bà – khu dự trữ sinh quyển thế giới, bãi biển Đồ Sơn thơ mộng và nhiều công trình kiến trúc Pháp cổ điển. Ẩm thực Hải Phòng đặc sắc với bánh mì cay, bún cá và nem cua bể nổi tiếng khắp cả nước. Hải Phòng còn được biết đến là thành phố hoa phượng đỏ với những hàng cây rực rỡ mỗi dịp hè về.",
    pop: "2,03 triệu", area: "1.561,8", best: "Tháng 4 – Tháng 10",
    highlights: ["Đảo Cát Bà", "Bãi biển Đồ Sơn", "Ẩm thực hải sản", "Thành phố hoa phượng đỏ"],
    dests: ["dao-cat-ba","bai-bien-do-son","vuon-quoc-gia-cat-ba","hon-dau","nha-hat-lon-hai-phong"],
    featured: true, order: 2, imgId: "1559592413-7cec4d0cae2b"
  },
  {
    slug: "quang-ninh", name: "Quảng Ninh", nameVi: "Quảng Ninh", region: "mien-bac",
    desc: "Quê hương của Vịnh Hạ Long – di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi kỳ vĩ.",
    longDesc: "Quảng Ninh là tỉnh địa đầu Đông Bắc Việt Nam, nổi tiếng nhất với Vịnh Hạ Long – di sản thiên nhiên thế giới được UNESCO công nhận. Vịnh có hơn 1.600 đảo đá vôi lớn nhỏ tạo nên cảnh quan kỳ vĩ. Ngoài Hạ Long, Quảng Ninh còn có núi Yên Tử – trung tâm Phật giáo Trúc Lâm, đảo Cô Tô hoang sơ và bãi biển Trà Cổ dài nhất Việt Nam. Tỉnh này cũng là vùng khai thác than lớn nhất cả nước.",
    pop: "1,32 triệu", area: "6.102,4", best: "Tháng 3 – Tháng 5 hoặc Tháng 9 – Tháng 11",
    highlights: ["Vịnh Hạ Long", "Núi Yên Tử", "Đảo Cô Tô", "Bãi Cháy"],
    dests: ["vinh-ha-long","dao-tuan-chau","yen-tu","dao-co-to","bai-chay"],
    featured: true, order: 3, imgId: "1528127269322-539152af8e65"
  },
  {
    slug: "lao-cai", name: "Lào Cai", nameVi: "Lào Cai", region: "mien-bac",
    desc: "Vùng đất biên cương Tây Bắc với Sa Pa mộng mơ và đỉnh Fansipan – nóc nhà Đông Dương.",
    longDesc: "Lào Cai là tỉnh biên giới phía Tây Bắc Việt Nam, nổi tiếng với thị xã Sa Pa – điểm du lịch hàng đầu cả nước. Sa Pa quyến rũ du khách bởi ruộng bậc thang vàng rực mùa lúa chín, bản làng dân tộc đầy màu sắc và khí hậu mát mẻ quanh năm. Đỉnh Fansipan cao 3.143m được mệnh danh là Nóc nhà Đông Dương, nay đã có cáp treo hiện đại. Lào Cai còn có nhiều suối nước nóng, thác nước và cảnh quan thiên nhiên hùng vĩ.",
    pop: "0,73 triệu", area: "6.383,9", best: "Tháng 3 – Tháng 5 hoặc Tháng 9 – Tháng 11",
    highlights: ["Sa Pa", "Đỉnh Fansipan", "Ruộng bậc thang", "Bản làng dân tộc"],
    dests: ["sa-pa","dinh-fansipan","ban-cat-cat","thac-bac-sa-pa","cau-kinh-rong-may"],
    featured: true, order: 4, imgId: "1540424617781-2fe7be838edc"
  },
  {
    slug: "ha-giang", name: "Hà Giang", nameVi: "Hà Giang", region: "mien-bac",
    desc: "Cực Bắc Tổ quốc với cao nguyên đá Đồng Văn hùng vĩ và đèo Mã Pí Lèng ngoạn mục.",
    longDesc: "Hà Giang là tỉnh cực Bắc của Việt Nam, nổi tiếng với Công viên Địa chất Toàn cầu UNESCO Cao nguyên đá Đồng Văn. Nơi đây có những cung đường đèo ngoạn mục nhất Đông Nam Á, đặc biệt là đèo Mã Pí Lèng bên dòng sông Nho Quế xanh ngắt. Hà Giang còn có cột cờ Lũng Cú – điểm cực Bắc thiêng liêng, phố cổ Đồng Văn trầm mặc và mùa hoa tam giác mạch tím hồng mỗi tháng 10-11. Đây là thiên đường cho dân phượt và nhiếp ảnh.",
    pop: "0,85 triệu", area: "7.929,5", best: "Tháng 9 – Tháng 11 (mùa hoa tam giác mạch)",
    highlights: ["Cao nguyên đá Đồng Văn", "Đèo Mã Pí Lèng", "Cột cờ Lũng Cú", "Hoa tam giác mạch"],
    dests: ["cao-nguyen-da-dong-van","deo-ma-pi-leng","cot-co-lung-cu","song-nho-que","pho-co-dong-van"],
    featured: true, order: 5, imgId: "1555921015-35b65ab0d91f"
  },
  {
    slug: "ninh-binh", name: "Ninh Bình", nameVi: "Ninh Bình", region: "mien-bac",
    desc: "Vùng đất cố đô với Tràng An – di sản thế giới kép, được mệnh danh là \"Hạ Long trên cạn\".",
    longDesc: "Ninh Bình là tỉnh phía Nam đồng bằng Bắc Bộ, nổi tiếng với quần thể danh thắng Tràng An – di sản văn hoá và thiên nhiên thế giới UNESCO. Ninh Bình được mệnh danh là 'Hạ Long trên cạn' với những dãy núi đá vôi soi bóng trên mặt nước. Cố đô Hoa Lư từng là kinh đô của Việt Nam thời Đinh – Tiền Lê. Nơi đây còn có chùa Bái Đính – quần thể chùa lớn nhất Đông Nam Á, Tam Cốc – Bích Động và Hang Múa nổi tiếng.",
    pop: "0,98 triệu", area: "1.386,8", best: "Tháng 1 – Tháng 3 hoặc Tháng 5 – Tháng 6",
    highlights: ["Tràng An", "Tam Cốc – Bích Động", "Chùa Bái Đính", "Cố đô Hoa Lư"],
    dests: ["trang-an","tam-coc-bich-dong","co-do-hoa-lu","chua-bai-dinh","hang-mua"],
    featured: true, order: 6, imgId: "1569263979104-865ab7cd8d13"
  },
  {
    slug: "bac-ninh", name: "Bắc Ninh", nameVi: "Bắc Ninh", region: "mien-bac",
    desc: "Quê hương quan họ, vùng đất Kinh Bắc ngàn năm văn hiến với nhiều đình chùa cổ kính.",
    longDesc: "Bắc Ninh là tỉnh nhỏ nhất Việt Nam về diện tích nhưng giàu có về di sản văn hoá. Đây là quê hương của dân ca quan họ – di sản văn hoá phi vật thể thế giới UNESCO. Bắc Ninh có nhiều đình, chùa, đền cổ như chùa Bút Tháp, đền Đô và làng tranh Đông Hồ nổi tiếng. Vùng đất Kinh Bắc xưa là cái nôi của nền văn minh Đại Việt, nơi sản sinh nhiều nhân tài cho đất nước.",
    pop: "1,37 triệu", area: "822,7", best: "Tháng 1 – Tháng 3 (mùa lễ hội)",
    highlights: ["Dân ca quan họ", "Chùa Bút Tháp", "Đền Đô", "Làng tranh Đông Hồ"],
    dests: ["chua-but-thap","den-do","lang-tranh-dong-ho"],
    featured: false, order: 7, imgId: "1583417319070-4a69db38a482"
  },
  {
    slug: "ha-nam", name: "Hà Nam", nameVi: "Hà Nam", region: "mien-bac",
    desc: "Vùng đất chiêm trũng với ngôi chùa lớn nhất thế giới Tam Chúc và di tích lịch sử phong phú.",
    longDesc: "Hà Nam là tỉnh nằm ở phía Nam đồng bằng sông Hồng, nổi bật với quần thể chùa Tam Chúc – ngôi chùa lớn nhất thế giới nằm giữa khung cảnh núi non hùng vĩ. Ngoài ra còn có Ngũ Động Thi Sơn với hệ thống hang động kỳ vĩ và đền Trần Thương thờ Hưng Đạo Vương. Hà Nam là vùng đất chiêm trũng trù phú, có truyền thống văn hoá lâu đời và nhiều làng nghề truyền thống.",
    pop: "0,85 triệu", area: "860,5", best: "Tháng 1 – Tháng 4",
    highlights: ["Chùa Tam Chúc", "Ngũ Động Thi Sơn", "Đền Trần Thương"],
    dests: ["chua-tam-chuc","ngu-dong-thi-son","den-tran-thuong"],
    featured: false, order: 8, imgId: "1600596542815-611e32e77b20"
  },
  {
    slug: "hai-duong", name: "Hải Dương", nameVi: "Hải Dương", region: "mien-bac",
    desc: "Xứ Đông với di tích Côn Sơn – Kiếp Bạc gắn liền với Nguyễn Trãi và Trần Hưng Đạo.",
    longDesc: "Hải Dương nằm ở trung tâm đồng bằng sông Hồng, nổi tiếng với khu di tích Côn Sơn – Kiếp Bạc – nơi thờ anh hùng dân tộc Trần Hưng Đạo và danh nhân Nguyễn Trãi. Tỉnh còn có Văn miếu Mao Điền – một trong những văn miếu cổ nhất Việt Nam và đảo cò Chi Lăng Nam. Hải Dương cũng nổi tiếng với đặc sản bánh đậu xanh, vải thiều Thanh Hà và nhiều làng nghề truyền thống lâu đời.",
    pop: "1,90 triệu", area: "1.668,2", best: "Tháng 1 – Tháng 4",
    highlights: ["Côn Sơn – Kiếp Bạc", "Văn miếu Mao Điền", "Bánh đậu xanh"],
    dests: ["con-son-kiep-bac","dao-co-chi-lang-nam","van-mieu-mao-dien"],
    featured: false, order: 9, imgId: "1600596542815-611e32e77b21"
  },
  {
    slug: "hung-yen", name: "Hưng Yên", nameVi: "Hưng Yên", region: "mien-bac",
    desc: "Vùng đất Phố Hiến xưa \"thứ nhất Kinh Kỳ, thứ nhì Phố Hiến\" với nhãn lồng nổi tiếng.",
    longDesc: "Hưng Yên là tỉnh nằm ở trung tâm đồng bằng Bắc Bộ, nổi tiếng với Phố Hiến – thương cảng sầm uất bậc nhất Đàng Ngoài thế kỷ 16-17 với câu ca 'Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến'. Đền Mẫu Hưng Yên là di tích quốc gia đặc biệt, kiến trúc đẹp và linh thiêng. Hưng Yên còn nổi tiếng với nhãn lồng – đặc sản ngọt thơm nức tiếng cả nước, được trồng từ hàng trăm năm nay.",
    pop: "1,25 triệu", area: "923,5", best: "Tháng 7 – Tháng 8 (mùa nhãn)",
    highlights: ["Phố Hiến", "Đền Mẫu", "Nhãn lồng Hưng Yên"],
    dests: ["pho-hien","den-mau-hung-yen","lang-nhan-hung-yen"],
    featured: false, order: 10, imgId: "1600596542815-611e32e77b22"
  },
  {
    slug: "nam-dinh", name: "Nam Định", nameVi: "Nam Định", region: "mien-bac",
    desc: "Quê hương nhà Trần, vùng đất địa linh nhân kiệt với Phủ Dầy và Vườn quốc gia Xuân Thuỷ.",
    longDesc: "Nam Định là tỉnh ven biển phía Nam đồng bằng sông Hồng, gắn liền với triều đại nhà Trần – một trong những triều đại huy hoàng nhất lịch sử Việt Nam. Phủ Dầy là quần thể di tích quốc gia thờ Thánh Mẫu Liễu Hạnh, nơi tổ chức lễ hội lớn nhất về tín ngưỡng thờ Mẫu. Vườn Quốc gia Xuân Thuỷ là khu Ramsar đầu tiên của Đông Nam Á, thiên đường của các loài chim di cư. Nhà thờ lớn Nam Định mang kiến trúc Gothic ấn tượng.",
    pop: "1,83 triệu", area: "1.652,6", best: "Tháng 3 – Tháng 4 (mùa lễ hội Phủ Dầy)",
    highlights: ["Phủ Dầy", "Vườn quốc gia Xuân Thuỷ", "Di tích nhà Trần"],
    dests: ["phu-day","nha-tho-lon-nam-dinh","vuon-quoc-gia-xuan-thuy"],
    featured: false, order: 11, imgId: "1600596542815-611e32e77b23"
  },
  {
    slug: "thai-binh", name: "Thái Bình", nameVi: "Thái Bình", region: "mien-bac",
    desc: "Quê lúa Thái Bình với chùa Keo – kiệt tác kiến trúc gỗ cổ nhất Việt Nam.",
    longDesc: "Thái Bình là tỉnh ven biển thuộc đồng bằng sông Hồng, được mệnh danh là 'quê lúa' với những cánh đồng lúa mênh mông. Chùa Keo (Thần Quang Tự) là kiệt tác kiến trúc gỗ cổ hơn 400 năm tuổi, được coi là ngôi chùa đẹp nhất Việt Nam. Bãi biển Đồng Châu là điểm nghỉ mát phổ biến của người dân địa phương. Thái Bình còn có nhiều lễ hội truyền thống đặc sắc và ẩm thực dân dã hấp dẫn.",
    pop: "1,86 triệu", area: "1.570,0", best: "Tháng 4 – Tháng 10",
    highlights: ["Chùa Keo", "Bãi biển Đồng Châu", "Đền Trần"],
    dests: ["chua-keo","bai-bien-dong-chau","den-tran-thai-binh"],
    featured: false, order: 12, imgId: "1600596542815-611e32e77b24"
  },
  {
    slug: "vinh-phuc", name: "Vĩnh Phúc", nameVi: "Vĩnh Phúc", region: "mien-bac",
    desc: "Xứ sở Tam Đảo mát mẻ – \"Đà Lạt của miền Bắc\" cùng thiền viện Trúc Lâm Tây Thiên.",
    longDesc: "Vĩnh Phúc là tỉnh nằm ở vùng chuyển tiếp giữa đồng bằng và miền núi phía Bắc. Tam Đảo là khu nghỉ mát nổi tiếng ở độ cao 900m với khí hậu mát mẻ quanh năm, được mệnh danh là 'Đà Lạt của miền Bắc'. Thiền viện Trúc Lâm Tây Thiên nằm trên sườn núi Tam Đảo, là trung tâm Phật giáo lớn. Hồ Đại Lải là điểm du lịch sinh thái, nghỉ dưỡng cuối tuần lý tưởng cho người Hà Nội.",
    pop: "1,15 triệu", area: "1.235,2", best: "Tháng 4 – Tháng 10",
    highlights: ["Tam Đảo", "Thiền viện Trúc Lâm Tây Thiên", "Hồ Đại Lải"],
    dests: ["tam-dao","thien-vien-truc-lam-tay-thien","ho-dai-lai"],
    featured: false, order: 13, imgId: "1600596542815-611e32e77b25"
  },
  {
    slug: "bac-giang", name: "Bắc Giang", nameVi: "Bắc Giang", region: "mien-bac",
    desc: "Xứ vải thiều với chùa Vĩnh Nghiêm cổ kính và khu du lịch sinh thái Suối Mỡ.",
    longDesc: "Bắc Giang là tỉnh trung du miền núi phía Đông Bắc, nổi tiếng với vải thiều Lục Ngạn – đặc sản xuất khẩu giá trị. Chùa Vĩnh Nghiêm (chùa Đức La) là trung tâm Phật giáo Trúc Lâm Yên Tử quan trọng với kiến trúc cổ kính. Khu du lịch Suối Mỡ nằm trong rừng nguyên sinh, có nhiều thác nước đẹp. Tây Yên Tử là phần mở rộng của hệ thống Yên Tử với nhiều chùa chiền và cảnh quan hoang sơ.",
    pop: "1,84 triệu", area: "3.895,5", best: "Tháng 6 – Tháng 7 (mùa vải thiều)",
    highlights: ["Vải thiều Lục Ngạn", "Chùa Vĩnh Nghiêm", "Suối Mỡ"],
    dests: ["chua-vinh-nghiem","khu-du-lich-suoi-mo","tay-yen-tu"],
    featured: false, order: 14, imgId: "1600596542815-611e32e77b26"
  },
  {
    slug: "bac-kan", name: "Bắc Kạn", nameVi: "Bắc Kạn", region: "mien-bac",
    desc: "Nơi có Hồ Ba Bể – hồ nước ngọt tự nhiên lớn nhất Việt Nam giữa rừng nguyên sinh.",
    longDesc: "Bắc Kạn là tỉnh miền núi phía Đông Bắc, ít dân nhất cả nước nhưng sở hữu cảnh quan thiên nhiên tuyệt đẹp. Hồ Ba Bể là hồ nước ngọt tự nhiên trên núi lớn nhất Việt Nam, nằm trong Vườn quốc gia Ba Bể với rừng nguyên sinh bao phủ. Động Hua Mạ và thác Đầu Đẳng là những điểm tham quan nổi bật. Bắc Kạn phù hợp cho du lịch sinh thái, khám phá thiên nhiên hoang sơ.",
    pop: "0,32 triệu", area: "4.868,4", best: "Tháng 4 – Tháng 10",
    highlights: ["Hồ Ba Bể", "Động Hua Mạ", "Thác Đầu Đẳng"],
    dests: ["ho-ba-be","dong-hua-ma","thac-dau-dang"],
    featured: false, order: 15, imgId: "1600596542815-611e32e77b27"
  },
  {
    slug: "cao-bang", name: "Cao Bằng", nameVi: "Cao Bằng", region: "mien-bac",
    desc: "Biên giới phía Bắc với thác Bản Giốc hùng vĩ – thác nước lớn nhất Đông Nam Á.",
    longDesc: "Cao Bằng là tỉnh biên giới phía Đông Bắc, được UNESCO công nhận là Công viên Địa chất Toàn cầu Non Nước Cao Bằng. Thác Bản Giốc là thác nước tự nhiên lớn nhất Đông Nam Á nằm trên biên giới Việt – Trung, với dòng nước trắng xoá đổ xuống từ độ cao 53m. Động Ngườm Ngao gần thác có hệ thống nhũ đá lung linh. Hồ Thang Hen là cụm hồ trên núi đẹp bí ẩn. Cao Bằng còn gắn liền với Pác Bó – nơi Bác Hồ sống và hoạt động cách mạng.",
    pop: "0,53 triệu", area: "6.700,3", best: "Tháng 9 – Tháng 11",
    highlights: ["Thác Bản Giốc", "Động Ngườm Ngao", "Hồ Thang Hen", "Pác Bó"],
    dests: ["thac-ban-gioc","dong-nguom-ngao","ho-thang-hen","vuon-quoc-gia-phia-oac"],
    featured: false, order: 16, imgId: "1600596542815-611e32e77b28"
  },
  {
    slug: "lang-son", name: "Lạng Sơn", nameVi: "Lạng Sơn", region: "mien-bac",
    desc: "Xứ Lạng biên giới với động Tam Thanh cổ kính và đỉnh Mẫu Sơn mây mù bao phủ.",
    longDesc: "Lạng Sơn là tỉnh biên giới phía Đông Bắc, nổi tiếng với cửa khẩu quốc tế Hữu Nghị và nhiều danh lam thắng cảnh. Động Tam Thanh là hang động đẹp trong lòng núi Tam Thanh với nhiều bài thơ cổ khắc trên vách đá. Thành Nhà Mạc là di tích lịch sử quan trọng thời phong kiến. Núi Mẫu Sơn ở độ cao 1.541m có khí hậu lạnh, mùa đông thỉnh thoảng có băng giá. Lạng Sơn còn nổi tiếng với vịt quay, lợn quay và rượu Mẫu Sơn.",
    pop: "0,78 triệu", area: "8.310,2", best: "Tháng 9 – Tháng 11",
    highlights: ["Động Tam Thanh", "Núi Mẫu Sơn", "Thành Nhà Mạc"],
    dests: ["dong-tam-thanh","thanh-nha-mac-lang-son","nui-mau-son"],
    featured: false, order: 17, imgId: "1600596542815-611e32e77b29"
  },
  {
    slug: "phu-tho", name: "Phú Thọ", nameVi: "Phú Thọ", region: "mien-bac",
    desc: "Đất Tổ Vua Hùng, nơi bắt nguồn của dân tộc Việt Nam với Đền Hùng linh thiêng.",
    longDesc: "Phú Thọ là tỉnh trung du miền núi phía Bắc, được biết đến là Đất Tổ của dân tộc Việt Nam. Đền Hùng – nơi thờ các vua Hùng, tổ tiên của người Việt – là di tích quốc gia đặc biệt, nơi tổ chức Giỗ Tổ Hùng Vương 10/3 âm lịch hàng năm. Hát Xoan Phú Thọ được UNESCO công nhận là di sản văn hoá phi vật thể thế giới. Vườn quốc gia Xuân Sơn có rừng nguyên sinh đẹp và hệ thống hang động đá vôi kỳ thú.",
    pop: "1,46 triệu", area: "3.519,6", best: "Tháng 3 (Giỗ Tổ Hùng Vương)",
    highlights: ["Đền Hùng", "Hát Xoan", "Vườn quốc gia Xuân Sơn"],
    dests: ["den-hung","vuon-quoc-gia-xuan-son","dam-ao-chau"],
    featured: false, order: 18, imgId: "1600596542815-611e32e77b30"
  },
  {
    slug: "thai-nguyen", name: "Thái Nguyên", nameVi: "Thái Nguyên", region: "mien-bac",
    desc: "Thủ phủ trà Việt Nam với Hồ Núi Cốc thơ mộng và Bảo tàng Văn hoá các dân tộc.",
    longDesc: "Thái Nguyên là tỉnh trung du miền núi phía Bắc, nổi tiếng là thủ phủ trà Việt Nam với vùng chè Tân Cương thơm ngon bậc nhất. Hồ Núi Cốc là hồ nhân tạo lớn rộng 25km², gắn với truyền thuyết tình yêu, là điểm du lịch sinh thái hấp dẫn. Bảo tàng Văn hoá các dân tộc Việt Nam trưng bày văn hoá 54 dân tộc. Hang Phượng Hoàng – Suối Mỏ Gà là khu du lịch sinh thái với hang động và suối nước đẹp.",
    pop: "1,29 triệu", area: "3.526,2", best: "Tháng 3 – Tháng 5 hoặc Tháng 9 – Tháng 11",
    highlights: ["Trà Tân Cương", "Hồ Núi Cốc", "Bảo tàng các dân tộc"],
    dests: ["ho-nui-coc","bao-tang-van-hoa-cac-dan-toc","hang-phuong-hoang"],
    featured: false, order: 19, imgId: "1600596542815-611e32e77b31"
  },
  {
    slug: "tuyen-quang", name: "Tuyên Quang", nameVi: "Tuyên Quang", region: "mien-bac",
    desc: "Thủ đô khu giải phóng xưa với hồ Na Hang xanh biếc giữa núi rừng Đông Bắc.",
    longDesc: "Tuyên Quang là tỉnh miền núi phía Bắc, từng là thủ đô khu giải phóng trong kháng chiến chống Pháp. Khu di tích Tân Trào là nơi diễn ra Quốc dân đại hội, quyết định Tổng khởi nghĩa tháng 8/1945. Hồ Na Hang (lòng hồ thuỷ điện Tuyên Quang) là vùng hồ xanh biếc nằm giữa núi non trùng điệp, rất đẹp. Thành cổ Tuyên Quang là di tích gắn liền với cuộc kháng chiến chống Pháp. Tuyên Quang còn nổi tiếng với lễ hội Thành Tuyên rực rỡ sắc màu.",
    pop: "0,78 triệu", area: "5.867,9", best: "Tháng 9 – Tháng 11",
    highlights: ["Hồ Na Hang", "Khu di tích Tân Trào", "Lễ hội Thành Tuyên"],
    dests: ["tan-trao","ho-na-hang","thanh-co-tuyen-quang"],
    featured: false, order: 20, imgId: "1600596542815-611e32e77b32"
  },
  {
    slug: "yen-bai", name: "Yên Bái", nameVi: "Yên Bái", region: "mien-bac",
    desc: "Ruộng bậc thang Mù Cang Chải – kiệt tác thiên nhiên lọt Top đẹp nhất thế giới.",
    longDesc: "Yên Bái là tỉnh miền núi phía Tây Bắc, nổi tiếng nhất với ruộng bậc thang Mù Cang Chải – một trong những cảnh quan nông nghiệp đẹp nhất thế giới, đã được công nhận là Di tích Quốc gia đặc biệt. Mùa lúa chín tháng 9-10, những thửa ruộng vàng óng uốn lượn trên sườn đồi tạo nên bức tranh thiên nhiên kỳ vĩ. Suối Giàng là vùng chè Shan Tuyết cổ thụ hàng trăm năm tuổi. Hồ Thác Bà là hồ nhân tạo lớn nhất miền Bắc.",
    pop: "0,82 triệu", area: "6.887,7", best: "Tháng 9 – Tháng 10 (mùa lúa chín)",
    highlights: ["Ruộng bậc thang Mù Cang Chải", "Suối Giàng", "Hồ Thác Bà"],
    dests: ["mu-cang-chai","suoi-giang","ho-thac-ba"],
    featured: false, order: 21, imgId: "1600596542815-611e32e77b33"
  },
  {
    slug: "dien-bien", name: "Điện Biên", nameVi: "Điện Biên", region: "mien-bac",
    desc: "Chiến trường Điện Biên Phủ lịch sử – nơi diễn ra trận đánh 'lừng lẫy năm châu, chấn động địa cầu'.",
    longDesc: "Điện Biên là tỉnh biên giới phía Tây Bắc, nổi tiếng thế giới với chiến thắng Điện Biên Phủ năm 1954 – trận đánh kết thúc ách thực dân Pháp tại Đông Dương. Quần thể di tích Điện Biên Phủ gồm đồi A1, hầm De Castries, sở chỉ huy Mường Phăng là những chứng tích lịch sử vô giá. Lòng chảo Điện Biên với cánh đồng Mường Thanh rộng lớn nhất Tây Bắc rất đẹp. Tỉnh còn có nhiều bản làng dân tộc Thái, Mông với văn hoá đặc sắc.",
    pop: "0,60 triệu", area: "9.541,0", best: "Tháng 10 – Tháng 4",
    highlights: ["Di tích Điện Biên Phủ", "Đồi A1", "Cánh đồng Mường Thanh", "Bản làng dân tộc"],
    dests: ["di-tich-dien-bien-phu","doi-a1","ham-de-castries","so-chi-huy-muong-phang"],
    featured: false, order: 22, imgId: "1600596542815-611e32e77b34"
  },
  {
    slug: "hoa-binh", name: "Hoà Bình", nameVi: "Hoà Bình", region: "mien-bac",
    desc: "Cửa ngõ Tây Bắc với Mai Châu thung lũng xanh và hồ Hoà Bình sơn thuỷ hữu tình.",
    longDesc: "Hoà Bình là tỉnh miền núi cửa ngõ vùng Tây Bắc, chỉ cách Hà Nội khoảng 80km. Mai Châu là thung lũng xanh mướt giữa núi non, nơi du khách có thể nghỉ homestay trong nhà sàn dân tộc Thái, thưởng thức ẩm thực địa phương và ngắm ruộng lúa. Hồ Hoà Bình là hồ nhân tạo lớn với phong cảnh sơn thuỷ hữu tình, lý tưởng cho du thuyền. Thung Nai là vùng hồ đẹp với núi non bao quanh.",
    pop: "0,85 triệu", area: "4.608,7", best: "Tháng 10 – Tháng 4",
    highlights: ["Mai Châu", "Hồ Hoà Bình", "Thung Nai"],
    dests: ["mai-chau","ho-hoa-binh","thung-nai"],
    featured: false, order: 23, imgId: "1600596542815-611e32e77b35"
  },
  {
    slug: "lai-chau", name: "Lai Châu", nameVi: "Lai Châu", region: "mien-bac",
    desc: "Vùng đất hoang sơ Tây Bắc với đèo Ô Quy Hồ và bản làng dân tộc nguyên bản.",
    longDesc: "Lai Châu là tỉnh biên giới phía Tây Bắc, một trong những vùng đất hoang sơ nhất Việt Nam. Đèo Ô Quy Hồ (nối Lai Châu với Lào Cai) là đèo dài nhất Tây Bắc với cảnh quan hùng vĩ trên mây. Bản Sin Suối Hồ là bản du lịch cộng đồng nổi tiếng của người Mông với vườn địa lan và nếp sống văn hoá đặc sắc. Rừng Pú Sam Cáp có thung lũng hoa ban nở trắng mỗi mùa xuân.",
    pop: "0,46 triệu", area: "9.068,8", best: "Tháng 2 – Tháng 4 (mùa hoa ban)",
    highlights: ["Đèo Ô Quy Hồ", "Sin Suối Hồ", "Hoa ban"],
    dests: ["sin-suoi-ho","pu-sam-cap","thac-tac-tinh"],
    featured: false, order: 24, imgId: "1600596542815-611e32e77b36"
  },
  {
    slug: "son-la", name: "Sơn La", nameVi: "Sơn La", region: "mien-bac",
    desc: "Cao nguyên Mộc Châu xanh mướt – thảo nguyên bát ngát với đồi chè và hoa cải trắng.",
    longDesc: "Sơn La là tỉnh lớn nhất vùng Tây Bắc, nổi tiếng với cao nguyên Mộc Châu – vùng đất thảo nguyên xanh mướt ở độ cao 1.050m. Mộc Châu hấp dẫn quanh năm với đồi chè xanh ngát, hoa cải trắng mùa đông, hoa mận trắng mùa xuân và đồng cỏ bao la. Rừng thông Bản Áng thơ mộng là điểm check-in yêu thích. Nhà tù Sơn La là di tích lịch sử quan trọng thời thuộc Pháp.",
    pop: "1,25 triệu", area: "14.174,4", best: "Tháng 10 – Tháng 3",
    highlights: ["Cao nguyên Mộc Châu", "Đồi chè", "Hoa mận, hoa cải"],
    dests: ["moc-chau","rung-thong-ban-ang","nha-tu-son-la"],
    featured: false, order: 25, imgId: "1600596542815-611e32e77b37"
  },

  // ============ MIỀN TRUNG (19) ============
  {
    slug: "da-nang", name: "Đà Nẵng", nameVi: "Đà Nẵng", region: "mien-trung",
    desc: "Thành phố đáng sống nhất Việt Nam với bãi biển tuyệt đẹp và Cầu Vàng nổi tiếng thế giới.",
    longDesc: "Đà Nẵng là thành phố trực thuộc trung ương nằm ở vùng duyên hải miền Trung Việt Nam. Nơi đây nổi tiếng với bãi biển Mỹ Khê – một trong 6 bãi biển đẹp nhất hành tinh, Ngũ Hành Sơn huyền bí và Cầu Vàng – biểu tượng du lịch Việt Nam. Bán đảo Sơn Trà là khu bảo tồn thiên nhiên với loài voọc chà vá chân nâu quý hiếm. Cầu Rồng phun lửa và nước mỗi cuối tuần. Đà Nẵng còn là cửa ngõ khám phá Hội An và Huế.",
    pop: "1,20 triệu", area: "1.284,9", best: "Tháng 2 – Tháng 5",
    highlights: ["Cầu Vàng Bà Nà Hills", "Bãi biển Mỹ Khê", "Ngũ Hành Sơn", "Bán đảo Sơn Trà"],
    dests: ["cau-vang-ba-na","bai-bien-my-khe","ngu-hanh-son","ban-dao-son-tra","cau-rong","cho-han"],
    featured: true, order: 26, imgId: "1557750255-c76072a7aee1"
  },
  {
    slug: "thua-thien-hue", name: "Thừa Thiên Huế", nameVi: "Thừa Thiên Huế", region: "mien-trung",
    desc: "Cố đô triều Nguyễn với quần thể di tích Đại Nội, lăng tẩm và sông Hương thơ mộng.",
    longDesc: "Thừa Thiên Huế là tỉnh miền Trung, nơi toạ lạc cố đô Huế – kinh đô của triều đại phong kiến cuối cùng Việt Nam. Quần thể di tích cố đô Huế được UNESCO công nhận là Di sản Văn hoá Thế giới, gồm Đại Nội (Tử Cấm Thành), các lăng vua Tự Đức, Khải Định, Minh Mạng. Chùa Thiên Mụ bên bờ sông Hương là biểu tượng của Huế. Cầu Trường Tiền, núi Bạch Mã và ẩm thực cung đình Huế tinh tế làm nên sức hấp dẫn đặc biệt.",
    pop: "1,13 triệu", area: "5.033,2", best: "Tháng 1 – Tháng 4",
    highlights: ["Đại Nội Huế", "Lăng Tự Đức", "Chùa Thiên Mụ", "Ẩm thực cung đình"],
    dests: ["dai-noi-hue","chua-thien-mu","lang-tu-duc","lang-khai-dinh","cau-truong-tien","nui-bach-ma"],
    featured: true, order: 27, imgId: "1562883676-a00873dfa128"
  },
  {
    slug: "quang-nam", name: "Quảng Nam", nameVi: "Quảng Nam", region: "mien-trung",
    desc: "Quê hương phố cổ Hội An lung linh đèn lồng và Thánh địa Mỹ Sơn huyền bí.",
    longDesc: "Quảng Nam là tỉnh duyên hải miền Trung, sở hữu hai Di sản Văn hoá Thế giới UNESCO. Phố cổ Hội An là đô thị cổ được bảo tồn nguyên vẹn nhất Đông Nam Á với kiến trúc pha trộn Việt – Hoa – Nhật, nổi tiếng với đèn lồng lung linh mỗi đêm rằm. Thánh địa Mỹ Sơn là quần thể đền tháp Chăm Pa huyền bí. Cù Lao Chàm là Khu dự trữ Sinh quyển Thế giới với biển trong vắt. Làng rau Trà Quế nổi tiếng với nông nghiệp hữu cơ.",
    pop: "1,49 triệu", area: "10.574,7", best: "Tháng 2 – Tháng 5",
    highlights: ["Phố cổ Hội An", "Thánh địa Mỹ Sơn", "Cù Lao Chàm", "Đèn lồng Hội An"],
    dests: ["pho-co-hoi-an","thanh-dia-my-son","chua-cau-hoi-an","cu-lao-cham","lang-rau-tra-que"],
    featured: true, order: 28, imgId: "1528127269322-539152af8e65"
  },
  {
    slug: "khanh-hoa", name: "Khánh Hoà", nameVi: "Khánh Hoà", region: "mien-trung",
    desc: "Thành phố biển Nha Trang tuyệt đẹp với vịnh biển trong xanh và Tháp Bà Ponagar cổ kính.",
    longDesc: "Khánh Hoà là tỉnh duyên hải Nam Trung Bộ, nổi tiếng với thành phố biển Nha Trang – một trong những vịnh biển đẹp nhất thế giới. Vịnh Nha Trang có nước biển trong xanh, nhiều đảo đẹp và hệ san hô phong phú. Tháp Bà Ponagar là kiệt tác kiến trúc Chăm Pa hơn 1.000 năm tuổi. Vinpearl Land Nha Trang là khu giải trí lớn trên đảo Hòn Tre. Hòn Mun là khu bảo tồn biển đầu tiên của Việt Nam, lý tưởng cho lặn biển.",
    pop: "1,23 triệu", area: "5.217,7", best: "Tháng 1 – Tháng 8",
    highlights: ["Vịnh Nha Trang", "Tháp Bà Ponagar", "Lặn biển Hòn Mun", "Vinpearl"],
    dests: ["vinh-nha-trang","thap-ba-ponagar","vinpearl-nha-trang","hon-mun","dao-diep-son"],
    featured: true, order: 29, imgId: "1564596823821-79e97cfc1d43"
  },
  {
    slug: "lam-dong", name: "Lâm Đồng", nameVi: "Lâm Đồng", region: "mien-trung",
    desc: "Thành phố ngàn hoa Đà Lạt với khí hậu mát mẻ quanh năm và kiến trúc Pháp lãng mạn.",
    longDesc: "Lâm Đồng là tỉnh Tây Nguyên nổi tiếng với thành phố Đà Lạt – thành phố ngàn hoa ở độ cao 1.500m. Đà Lạt có khí hậu mát mẻ quanh năm, kiến trúc biệt thự Pháp cổ lãng mạn, hồ Xuân Hương thơ mộng giữa trung tâm và vô số vườn hoa rực rỡ. Thung Lũng Tình Yêu, Dinh Bảo Đại, thác Datanla là những điểm du lịch nổi bật. Đà Lạt còn nổi tiếng với cà phê, atiso, dâu tây và rau hoa xứ lạnh.",
    pop: "1,30 triệu", area: "9.773,5", best: "Tháng 11 – Tháng 3",
    highlights: ["Hồ Xuân Hương", "Thung Lũng Tình Yêu", "Biệt thự Pháp cổ", "Vườn hoa Đà Lạt"],
    dests: ["thanh-pho-da-lat","ho-xuan-huong","thung-lung-tinh-yeu","dinh-bao-dai","thac-datanla"],
    featured: true, order: 30, imgId: "1555921015-35b65ab0d91f"
  },
  {
    slug: "binh-thuan", name: "Bình Thuận", nameVi: "Bình Thuận", region: "mien-trung",
    desc: "Thủ phủ resort Mũi Né với đồi cát vàng sa mạc, bàu Trắng và hải sản tươi ngon.",
    longDesc: "Bình Thuận là tỉnh duyên hải cực Nam Trung Bộ, nổi tiếng với Mũi Né – thiên đường nghỉ dưỡng với hàng trăm resort ven biển. Đồi cát Mũi Né có cảnh quan như sa mạc Sahara thu nhỏ, rất đẹp lúc bình minh và hoàng hôn. Bàu Trắng là hồ nước ngọt giữa đồi cát, được ví như ốc đảo sa mạc. Tháp Chàm Poshanu và Kê Gà – ngọn hải đăng cổ nhất Đông Nam Á là những điểm tham quan hấp dẫn.",
    pop: "1,23 triệu", area: "7.828,4", best: "Tháng 11 – Tháng 4",
    highlights: ["Đồi cát Mũi Né", "Bàu Trắng", "Hải đăng Kê Gà", "Resort biển"],
    dests: ["doi-cat-mui-ne","bau-trang","thap-cham-poshanu","ke-ga"],
    featured: false, order: 31, imgId: "1600596542815-611e32e77b38"
  },
  {
    slug: "thanh-hoa", name: "Thanh Hoá", nameVi: "Thanh Hoá", region: "mien-trung",
    desc: "Đất học xứ Thanh với Thành Nhà Hồ – di sản thế giới và bãi biển Sầm Sơn nổi tiếng.",
    longDesc: "Thanh Hoá là tỉnh lớn ở Bắc Trung Bộ, có lịch sử lâu đời với nhiều di tích quan trọng. Thành Nhà Hồ là kiến trúc đá độc đáo được UNESCO công nhận Di sản Văn hoá Thế giới. Bãi biển Sầm Sơn là khu nghỉ mát biển nổi tiếng nhất miền Bắc. Vườn quốc gia Bến En có hồ nước và rừng nguyên sinh đẹp. Thành cổ Lam Kinh là nơi phát tích khởi nghĩa Lam Sơn của vua Lê Lợi.",
    pop: "3,64 triệu", area: "11.116,3", best: "Tháng 4 – Tháng 9",
    highlights: ["Thành Nhà Hồ", "Sầm Sơn", "Lam Kinh", "Vườn quốc gia Bến En"],
    dests: ["thanh-nha-ho","sam-son","vuon-quoc-gia-ben-en","lam-kinh"],
    featured: false, order: 32, imgId: "1600596542815-611e32e77b39"
  },
  {
    slug: "nghe-an", name: "Nghệ An", nameVi: "Nghệ An", region: "mien-trung",
    desc: "Quê hương Chủ tịch Hồ Chí Minh với bãi biển Cửa Lò và Vườn quốc gia Pù Mát.",
    longDesc: "Nghệ An là tỉnh lớn nhất Việt Nam về diện tích, quê hương của Chủ tịch Hồ Chí Minh. Khu di tích Kim Liên là nơi lưu giữ ngôi nhà nơi Bác sinh ra và lớn lên. Bãi biển Cửa Lò là khu nghỉ mát biển nổi tiếng xứ Nghệ. Vườn quốc gia Pù Mát có rừng nguyên sinh rộng lớn với đa dạng sinh học cao. Nghệ An còn nổi tiếng với ẩm thực đặc sắc như lươn xứ Nghệ và cháo lươn.",
    pop: "3,33 triệu", area: "16.487,5", best: "Tháng 4 – Tháng 9",
    highlights: ["Quê Bác Hồ", "Cửa Lò", "Vườn quốc gia Pù Mát", "Ẩm thực xứ Nghệ"],
    dests: ["cua-lo","que-bac-kim-lien","vuon-quoc-gia-pu-mat","thanh-co-vinh"],
    featured: false, order: 33, imgId: "1600596542815-611e32e77b40"
  },
  {
    slug: "ha-tinh", name: "Hà Tĩnh", nameVi: "Hà Tĩnh", region: "mien-trung",
    desc: "Vùng đất hiếu học miền Trung với chùa Hương Tích và bãi biển Thiên Cầm.",
    longDesc: "Hà Tĩnh là tỉnh Bắc Trung Bộ nổi tiếng là vùng đất hiếu học, quê hương của đại thi hào Nguyễn Du. Chùa Hương Tích trên núi Hồng Lĩnh được mệnh danh là 'Hoan Châu đệ nhất danh lam'. Bãi biển Thiên Cầm với bờ cát trắng dài, nước biển trong xanh là điểm nghỉ mát hấp dẫn. Vườn quốc gia Vũ Quang có nhiều loài động vật quý hiếm, nơi phát hiện loài Sao La nổi tiếng.",
    pop: "1,29 triệu", area: "5.997,2", best: "Tháng 4 – Tháng 9",
    highlights: ["Chùa Hương Tích", "Bãi biển Thiên Cầm", "Vườn quốc gia Vũ Quang"],
    dests: ["chua-huong-tich","bai-bien-thien-cam","vuon-quoc-gia-vu-quang"],
    featured: false, order: 34, imgId: "1600596542815-611e32e77b41"
  },
  {
    slug: "quang-binh", name: "Quảng Bình", nameVi: "Quảng Bình", region: "mien-trung",
    desc: "Vương quốc hang động với Phong Nha – Kẻ Bàng, nơi có hang Sơn Đoòng lớn nhất thế giới.",
    longDesc: "Quảng Bình là tỉnh Bắc Trung Bộ, nổi tiếng thế giới với Vườn quốc gia Phong Nha – Kẻ Bàng – Di sản Thiên nhiên Thế giới UNESCO. Nơi đây có hang Sơn Đoòng – hang động tự nhiên lớn nhất thế giới, động Phong Nha với sông ngầm dài và động Thiên Đường lung linh nhũ đá. Tour Sông Chày – Hang Tối kết hợp zip-line và chèo kayak rất hấp dẫn. Bãi biển Nhật Lệ trong xanh và cầu Nhật Lệ là biểu tượng của thành phố Đồng Hới.",
    pop: "0,90 triệu", area: "8.065,3", best: "Tháng 4 – Tháng 8",
    highlights: ["Hang Sơn Đoòng", "Động Phong Nha", "Động Thiên Đường", "Bãi biển Nhật Lệ"],
    dests: ["dong-phong-nha","dong-thien-duong","song-chay-hang-toi","bai-bien-nhat-le"],
    featured: true, order: 35, imgId: "1600596542815-611e32e77b42"
  },
  {
    slug: "quang-tri", name: "Quảng Trị", nameVi: "Quảng Trị", region: "mien-trung",
    desc: "Vùng đất lửa với Thành cổ Quảng Trị, địa đạo Vĩnh Mốc và cầu Hiền Lương lịch sử.",
    longDesc: "Quảng Trị là tỉnh ở vùng Bắc Trung Bộ, từng là chiến trường ác liệt nhất trong chiến tranh. Thành cổ Quảng Trị là biểu tượng của sự hy sinh anh dũng trong mùa hè đỏ lửa 1972. Địa đạo Vĩnh Mốc là hệ thống đường hầm dưới lòng đất nơi người dân sinh sống suốt chiến tranh. Nghĩa trang liệt sĩ Trường Sơn là nơi yên nghỉ của hàng vạn chiến sĩ. Quảng Trị là địa danh du lịch lịch sử, hoà bình đầy ý nghĩa.",
    pop: "0,63 triệu", area: "4.739,8", best: "Tháng 3 – Tháng 8",
    highlights: ["Thành cổ Quảng Trị", "Địa đạo Vĩnh Mốc", "Nghĩa trang Trường Sơn"],
    dests: ["thanh-co-quang-tri","dia-dao-vinh-moc","nghia-trang-truong-son"],
    featured: false, order: 36, imgId: "1600596542815-611e32e77b43"
  },
  {
    slug: "quang-ngai", name: "Quảng Ngãi", nameVi: "Quảng Ngãi", region: "mien-trung",
    desc: "Quê hương của đảo Lý Sơn – \"Maldives Việt Nam\" với tỏi đen và cảnh biển tuyệt đẹp.",
    longDesc: "Quảng Ngãi là tỉnh duyên hải Nam Trung Bộ, nổi bật với đảo Lý Sơn – hòn đảo núi lửa xinh đẹp được mệnh danh là 'Maldives Việt Nam' hay 'Vương quốc tỏi'. Lý Sơn có cảnh quan biển tuyệt đẹp với cổng Tò Vò, chùa Hang và bãi rêu xanh mướt. Thành cổ Châu Sa là di tích Chăm Pa cổ. Quảng Ngãi còn gắn liền với Đội Hoàng Sa kiêm quản Bắc Hải – lịch sử chủ quyền biển đảo Việt Nam.",
    pop: "1,23 triệu", area: "5.153,6", best: "Tháng 3 – Tháng 8",
    highlights: ["Đảo Lý Sơn", "Cổng Tò Vò", "Tỏi Lý Sơn"],
    dests: ["dao-ly-son","thanh-co-chau-sa","bai-bien-my-khe-quang-ngai"],
    featured: false, order: 37, imgId: "1600596542815-611e32e77b44"
  },
  {
    slug: "binh-dinh", name: "Bình Định", nameVi: "Bình Định", region: "mien-trung",
    desc: "Đất võ Tây Sơn với Quy Nhơn – thành phố biển mới nổi, Eo Gió và Kỳ Co tuyệt đẹp.",
    longDesc: "Bình Định là tỉnh duyên hải Nam Trung Bộ, đất võ Tây Sơn gắn liền với vua Quang Trung – Nguyễn Huệ. Quy Nhơn đang nổi lên là thành phố biển đẹp với Eo Gió – nơi gió thổi quanh năm tạo cảnh quan kỳ vĩ, bãi biển Kỳ Co trong xanh như ngọc. Tháp Đôi và các tháp Chăm cổ là di sản kiến trúc đặc sắc. Ghềnh Ráng Tiên Sa gắn liền với thi sĩ Hàn Mặc Tử. Bình Định còn nổi tiếng với bánh ít lá gai và bún chả cá.",
    pop: "1,49 triệu", area: "6.025,6", best: "Tháng 1 – Tháng 8",
    highlights: ["Eo Gió", "Kỳ Co", "Tháp Đôi", "Ghềnh Ráng"],
    dests: ["thap-doi","ghenh-rang","ky-co","eo-gio"],
    featured: false, order: 38, imgId: "1600596542815-611e32e77b45"
  },
  {
    slug: "phu-yen", name: "Phú Yên", nameVi: "Phú Yên", region: "mien-trung",
    desc: "Xứ Nẫu với Gành Đá Đĩa độc đáo, Mũi Đại – điểm cực Đông và vịnh Xuân Đài thơ mộng.",
    longDesc: "Phú Yên là tỉnh duyên hải Nam Trung Bộ, nổi tiếng nhờ bộ phim 'Tôi thấy hoa vàng trên cỏ xanh'. Gành Đá Đĩa là kỳ quan thiên nhiên với hàng nghìn cột đá bazan xếp chồng như những chiếc đĩa khổng lồ. Mũi Đại (Mũi Điện) là điểm cực Đông – nơi đón ánh bình minh đầu tiên trên đất liền Việt Nam. Vịnh Xuân Đài thơ mộng và Núi Đá Bia (Thạch Bi Sơn) hùng vĩ là những điểm đến ấn tượng.",
    pop: "0,90 triệu", area: "5.060,6", best: "Tháng 1 – Tháng 8",
    highlights: ["Gành Đá Đĩa", "Mũi Đại", "Vịnh Xuân Đài", "Bãi Xép"],
    dests: ["ganh-da-dia","mui-dai","vinh-xuan-dai","nui-da-bia"],
    featured: false, order: 39, imgId: "1600596542815-611e32e77b46"
  },
  {
    slug: "ninh-thuan", name: "Ninh Thuận", nameVi: "Ninh Thuận", region: "mien-trung",
    desc: "Vùng đất nắng gió với vịnh Vĩnh Hy hoang sơ, tháp Chàm và văn hoá Chăm đặc sắc.",
    longDesc: "Ninh Thuận là tỉnh duyên hải có khí hậu nắng nóng nhất Việt Nam, mang vẻ đẹp hoang sơ đặc biệt. Vịnh Vĩnh Hy nước xanh ngắt nằm giữa núi đá, là một trong 4 vịnh đẹp nhất Việt Nam. Vườn quốc gia Núi Chúa có hệ sinh thái bán hoang mạc độc đáo. Ninh Thuận là trung tâm văn hoá Chăm với nhiều tháp Chàm cổ, làng gốm Bàu Trúc – làng gốm cổ nhất Đông Nam Á và lễ hội Katê đặc sắc.",
    pop: "0,59 triệu", area: "3.355,3", best: "Tháng 10 – Tháng 4",
    highlights: ["Vịnh Vĩnh Hy", "Tháp Chàm", "Văn hoá Chăm", "Vườn quốc gia Núi Chúa"],
    dests: ["vinh-vinh-hy","vuon-quoc-gia-nui-chua","thap-cham-ninh-thuan"],
    featured: false, order: 40, imgId: "1600596542815-611e32e77b47"
  },
  {
    slug: "kon-tum", name: "Kon Tum", nameVi: "Kon Tum", region: "mien-trung",
    desc: "Vùng đất Tây Nguyên hoang sơ với nhà thờ gỗ độc đáo và Măng Đen – Đà Lạt thứ hai.",
    longDesc: "Kon Tum là tỉnh cực Bắc Tây Nguyên, nơi giao thoa của nhiều nền văn hoá dân tộc Ba Na, Xơ Đăng, Giẻ Triêng. Nhà thờ gỗ Kon Tum (nhà thờ Chánh Toà) là kiệt tác kiến trúc gỗ theo phong cách Roman kết hợp nhà rông Tây Nguyên. Măng Đen là khu du lịch sinh thái ở độ cao 1.200m với khí hậu mát mẻ, được ví như 'Đà Lạt thứ hai'. Ngục Kon Tum là di tích lịch sử về cuộc đấu tranh của tù chính trị.",
    pop: "0,54 triệu", area: "9.674,2", best: "Tháng 11 – Tháng 4",
    highlights: ["Nhà thờ gỗ Kon Tum", "Măng Đen", "Nhà rông Tây Nguyên"],
    dests: ["nha-tho-go-kon-tum","mang-den","nguc-kon-tum"],
    featured: false, order: 41, imgId: "1600596542815-611e32e77b48"
  },
  {
    slug: "gia-lai", name: "Gia Lai", nameVi: "Gia Lai", region: "mien-trung",
    desc: "Cao nguyên đất đỏ bazan với Biển Hồ thơ mộng và không gian cồng chiêng Tây Nguyên.",
    longDesc: "Gia Lai là tỉnh Tây Nguyên với cao nguyên đất đỏ bazan mênh mông. Biển Hồ (hồ T'Nưng) là hồ nước ngọt tự nhiên rộng lớn nằm trong miệng núi lửa cổ, đẹp huyền bí. Thác Phú Cường hùng vĩ giữa đồi thông xanh ngát. Không gian văn hoá Cồng chiêng Tây Nguyên đã được UNESCO công nhận là Kiệt tác Di sản Phi vật thể. Gia Lai còn nổi tiếng với cà phê, hồ tiêu và bóng đá Hoàng Anh Gia Lai.",
    pop: "1,51 triệu", area: "15.510,9", best: "Tháng 11 – Tháng 4",
    highlights: ["Biển Hồ", "Thác Phú Cường", "Cồng chiêng Tây Nguyên"],
    dests: ["bien-ho","thac-phu-cuong","nha-tho-duc-an"],
    featured: false, order: 42, imgId: "1600596542815-611e32e77b49"
  },
  {
    slug: "dak-lak", name: "Đắk Lắk", nameVi: "Đắk Lắk", region: "mien-trung",
    desc: "Thủ phủ cà phê Việt Nam với Buôn Ma Thuột, thác Drây Nur hùng vĩ và voi Bản Đôn.",
    longDesc: "Đắk Lắk là tỉnh trung tâm Tây Nguyên, thủ phủ cà phê Việt Nam. Buôn Ma Thuột là thành phố cà phê với lễ hội cà phê nổi tiếng. Thác Drây Nur và Drây Sáp là cặp thác đôi hùng vĩ trên sông Sêrêpốk. Buôn Đôn nổi tiếng với nghề thuần dưỡng voi và du lịch cưỡi voi. Hồ Lắk là hồ nước ngọt tự nhiên lớn thứ hai Tây Nguyên, xung quanh là buôn làng M'Nông với nhà dài truyền thống.",
    pop: "1,87 triệu", area: "13.043,4", best: "Tháng 11 – Tháng 4",
    highlights: ["Cà phê Buôn Ma Thuột", "Thác Drây Nur", "Buôn Đôn", "Hồ Lắk"],
    dests: ["ho-lak","buon-don","thac-dray-nur","bao-tang-dak-lak"],
    featured: false, order: 43, imgId: "1600596542815-611e32e77b50"
  },
  {
    slug: "dak-nong", name: "Đắk Nông", nameVi: "Đắk Nông", region: "mien-trung",
    desc: "Công viên Địa chất Toàn cầu UNESCO với hồ Tà Đùng – \"Vịnh Hạ Long Tây Nguyên\".",
    longDesc: "Đắk Nông là tỉnh phía Nam Tây Nguyên, được UNESCO công nhận là Công viên Địa chất Toàn cầu nhờ hệ thống hang động núi lửa độc đáo. Hồ Tà Đùng được mệnh danh là 'Vịnh Hạ Long của Tây Nguyên' với hàng trăm đảo nhỏ giữa lòng hồ xanh biếc. Thác Drây Sáp – Gia Long hùng vĩ nằm trên sông Sêrêpốk. Núi lửa Chư B'Luk là điểm du lịch địa chất độc đáo với các hang động dung nham.",
    pop: "0,62 triệu", area: "6.514,4", best: "Tháng 11 – Tháng 4",
    highlights: ["Hồ Tà Đùng", "Thác Drây Sáp", "Hang động núi lửa"],
    dests: ["ta-dung","thac-dray-sap","cong-vien-dia-chat-dak-nong"],
    featured: false, order: 44, imgId: "1600596542815-611e32e77b51"
  },

  // ============ MIỀN NAM (19) ============
  {
    slug: "ho-chi-minh", name: "TP. Hồ Chí Minh", nameVi: "Thành phố Hồ Chí Minh", region: "mien-nam",
    desc: "Thành phố năng động nhất Việt Nam, trung tâm kinh tế và giải trí của cả nước.",
    longDesc: "Thành phố Hồ Chí Minh (Sài Gòn) là thành phố lớn nhất Việt Nam, nổi tiếng với nhịp sống sôi động, kiến trúc Pháp cổ điển pha trộn với toà nhà chọc trời hiện đại. Nhà thờ Đức Bà, Bưu điện Trung tâm, Dinh Độc Lập và chợ Bến Thành là những biểu tượng không thể bỏ qua. Địa đạo Củ Chi lịch sử, Bảo tàng Chứng tích Chiến tranh xúc động và phố đi bộ Nguyễn Huệ sôi động. Sài Gòn còn là thiên đường ẩm thực với vô vàn món ngon.",
    pop: "9,30 triệu", area: "2.061,2", best: "Tháng 12 – Tháng 4 (mùa khô)",
    highlights: ["Nhà thờ Đức Bà", "Chợ Bến Thành", "Địa đạo Củ Chi", "Phố đi bộ Nguyễn Huệ"],
    dests: ["nha-tho-duc-ba","cho-ben-thanh","dia-dao-cu-chi","dinh-doc-lap","buu-dien-trung-tam","bao-tang-chung-tich-chien-tranh","pho-di-bo-nguyen-hue"],
    featured: true, order: 45, imgId: "1583417319070-4a69db38a482"
  },
  {
    slug: "ba-ria-vung-tau", name: "Bà Rịa - Vũng Tàu", nameVi: "Bà Rịa - Vũng Tàu", region: "mien-nam",
    desc: "Thành phố biển gần Sài Gòn với Bãi Sau, Bãi Trước và tượng Chúa Kitô trên núi.",
    longDesc: "Bà Rịa – Vũng Tàu là tỉnh ven biển Đông Nam Bộ, điểm nghỉ mát biển gần TP.HCM nhất (chỉ 2 giờ lái xe). Bãi Sau (Bãi Thùy Vân) dài và sạch, Bãi Trước nằm ngay trung tâm thành phố với nhiều quán café ven biển. Tượng Chúa Kitô Vua trên núi Nhỏ cao 32m nhìn ra biển. Hồ Tràm là vùng bãi biển hoang sơ với nhiều resort cao cấp. Vũng Tàu còn nổi tiếng với hải sản tươi sống và bánh khọt.",
    pop: "1,15 triệu", area: "1.982,2", best: "Tháng 11 – Tháng 4",
    highlights: ["Bãi Sau", "Tượng Chúa Kitô", "Hồ Tràm", "Hải sản"],
    dests: ["bai-truoc","bai-sau","tuong-chua-kito","ho-tram"],
    featured: true, order: 46, imgId: "1600596542815-611e32e77b52"
  },
  {
    slug: "kien-giang", name: "Kiên Giang", nameVi: "Kiên Giang", region: "mien-nam",
    desc: "Thiên đường biển đảo Phú Quốc – đảo ngọc lớn nhất Việt Nam với bãi biển tuyệt đẹp.",
    longDesc: "Kiên Giang là tỉnh cực Tây Nam Việt Nam, nổi tiếng nhất với đảo Phú Quốc – hòn đảo lớn nhất Việt Nam. Phú Quốc có những bãi biển cát trắng tuyệt đẹp như Bãi Sao, Bãi Dài, nước biển trong vắt lý tưởng cho lặn biển. Dinh Cậu là đền thờ linh thiêng trên mỏm đá nhìn ra biển. Làng chài Hàm Ninh nổi tiếng với cua ghẹ tươi sống. Vườn quốc gia Phú Quốc bảo tồn rừng nguyên sinh và nhiều loài động thực vật quý.",
    pop: "1,72 triệu", area: "6.346,3", best: "Tháng 11 – Tháng 4",
    highlights: ["Đảo Phú Quốc", "Bãi Sao", "Dinh Cậu", "Nước mắm Phú Quốc"],
    dests: ["dao-phu-quoc","bai-sao-phu-quoc","dinh-cau","lang-chai-ham-ninh","vuon-quoc-gia-phu-quoc"],
    featured: true, order: 47, imgId: "1600596542815-611e32e77b53"
  },
  {
    slug: "can-tho", name: "Cần Thơ", nameVi: "Cần Thơ", region: "mien-nam",
    desc: "Thủ phủ miền Tây sông nước với chợ nổi Cái Răng – nét văn hoá đặc trưng Nam Bộ.",
    longDesc: "Cần Thơ là thành phố trực thuộc trung ương duy nhất ở đồng bằng sông Cửu Long, thủ phủ của miền Tây Nam Bộ. Chợ nổi Cái Răng là chợ nổi lớn nhất và nổi tiếng nhất, nơi hàng trăm ghe xuồng mua bán trái cây, nông sản trên sông. Bến Ninh Kiều lung linh về đêm bên bờ sông Hậu. Vườn cò Bằng Lăng là nơi hàng vạn con cò trú ngụ. Cần Thơ còn nổi tiếng với ẩm thực Nam Bộ phong phú.",
    pop: "1,24 triệu", area: "1.401,6", best: "Tháng 11 – Tháng 4",
    highlights: ["Chợ nổi Cái Răng", "Bến Ninh Kiều", "Trái cây miền Tây", "Ẩm thực Nam Bộ"],
    dests: ["cho-noi-cai-rang","ben-ninh-kieu","vuon-co-bang-lang","chua-ong-can-tho"],
    featured: true, order: 48, imgId: "1600596542815-611e32e77b54"
  },
  {
    slug: "binh-duong", name: "Bình Dương", nameVi: "Bình Dương", region: "mien-nam",
    desc: "Thủ phủ công nghiệp phía Nam với khu du lịch Đại Nam và vườn trái cây Lái Thiêu.",
    longDesc: "Bình Dương là tỉnh công nghiệp phát triển bậc nhất phía Nam, giáp TP.HCM. Khu du lịch Đại Nam Văn Hiến là quần thể giải trí rộng lớn với khu vui chơi, sở thú, đền thờ và biển nhân tạo. Núi Châu Thới có chùa cổ trên đỉnh, là điểm tham quan tâm linh. Vườn trái cây Lái Thiêu nổi tiếng với măng cụt, sầu riêng, chôm chôm vào mùa hè. Bình Dương đang phát triển thành đô thị hiện đại bên cạnh truyền thống gốm sứ lâu đời.",
    pop: "2,58 triệu", area: "2.694,4", best: "Tháng 5 – Tháng 7 (mùa trái cây)",
    highlights: ["Đại Nam Văn Hiến", "Vườn trái cây Lái Thiêu", "Núi Châu Thới"],
    dests: ["dai-nam","nui-chau-thoi","khu-du-lich-lai-thieu"],
    featured: false, order: 49, imgId: "1600596542815-611e32e77b55"
  },
  {
    slug: "binh-phuoc", name: "Bình Phước", nameVi: "Bình Phước", region: "mien-nam",
    desc: "Vùng đất đỏ bazan với Vườn quốc gia Bù Gia Mập và núi Bà Rá huyền bí.",
    longDesc: "Bình Phước là tỉnh miền Đông Nam Bộ, nổi tiếng với vùng đất đỏ bazan trồng cao su, điều và tiêu. Vườn quốc gia Bù Gia Mập là khu rừng nguyên sinh lớn với đa dạng sinh học cao, nơi sinh sống của nhiều loài linh trưởng quý hiếm. Núi Bà Rá cao 723m là ngọn núi cao nhất tỉnh, có chùa và cảnh quan đẹp. Hồ Suối Cam là điểm du lịch sinh thái trong lành giữa đồi thông.",
    pop: "1,00 triệu", area: "6.871,5", best: "Tháng 11 – Tháng 4",
    highlights: ["Vườn quốc gia Bù Gia Mập", "Núi Bà Rá", "Hồ Suối Cam"],
    dests: ["vuon-quoc-gia-bu-gia-map","nui-ba-ra","ho-suoi-cam"],
    featured: false, order: 50, imgId: "1600596542815-611e32e77b56"
  },
  {
    slug: "dong-nai", name: "Đồng Nai", nameVi: "Đồng Nai", region: "mien-nam",
    desc: "Vườn quốc gia Cát Tiên – khu dự trữ sinh quyển thế giới và Bửu Long với núi đá kỳ vĩ.",
    longDesc: "Đồng Nai là tỉnh lớn nhất vùng Đông Nam Bộ, có Vườn quốc gia Cát Tiên – Khu dự trữ Sinh quyển Thế giới UNESCO với rừng nguyên sinh bao la, nơi sinh sống của nhiều loài quý hiếm. Khu du lịch Bửu Long có núi đá kỳ vĩ soi bóng xuống hồ nước xanh, được ví như 'Hạ Long thu nhỏ'. Thác Mai trong Vườn quốc gia Cát Tiên đẹp hoang sơ. Đồng Nai còn nổi tiếng với bưởi Tân Triều và ẩm thực đa dạng.",
    pop: "3,10 triệu", area: "5.907,2", best: "Tháng 11 – Tháng 4",
    highlights: ["Vườn quốc gia Cát Tiên", "Bửu Long", "Thác Mai"],
    dests: ["vuon-quoc-gia-cat-tien","khu-du-lich-buu-long","thac-mai"],
    featured: false, order: 51, imgId: "1600596542815-611e32e77b57"
  },
  {
    slug: "tay-ninh", name: "Tây Ninh", nameVi: "Tây Ninh", region: "mien-nam",
    desc: "Đất Thánh của đạo Cao Đài với Toà Thánh Tây Ninh và núi Bà Đen – nóc nhà Nam Bộ.",
    longDesc: "Tây Ninh là tỉnh Đông Nam Bộ giáp biên giới Campuchia. Núi Bà Đen cao 986m là đỉnh núi cao nhất Nam Bộ, nay có cáp treo hiện đại, là điểm hành hương và tham quan nổi tiếng. Toà Thánh Cao Đài Tây Ninh là trung tâm của đạo Cao Đài với kiến trúc rực rỡ sắc màu, kết hợp phong cách Đông – Tây độc đáo. Hồ Dầu Tiếng là hồ nhân tạo lớn nhất Việt Nam, cảnh quan thanh bình.",
    pop: "1,17 triệu", area: "4.039,7", best: "Tháng 11 – Tháng 4",
    highlights: ["Núi Bà Đen", "Toà Thánh Cao Đài", "Hồ Dầu Tiếng"],
    dests: ["nui-ba-den","toa-thanh-cao-dai","ho-dau-tieng"],
    featured: false, order: 52, imgId: "1600596542815-611e32e77b58"
  },
  {
    slug: "long-an", name: "Long An", nameVi: "Long An", region: "mien-nam",
    desc: "Cửa ngõ miền Tây với Làng nổi Tân Lập – rừng tràm xanh mướt giữa đồng bằng.",
    longDesc: "Long An là tỉnh cửa ngõ miền Tây Nam Bộ, giáp TP.HCM. Làng nổi Tân Lập là khu du lịch sinh thái nổi tiếng với rừng tràm nguyên sinh xanh mướt, nơi du khách chèo xuồng xuyên qua tán rừng tràm thơ mộng. Khu di tích Bình Tả có di chỉ khảo cổ văn hoá Óc Eo. Khu du lịch Cộng Trời có cánh đồng sen bát ngát mùa hè. Long An cũng là vùng lúa gạo trù phú của đồng bằng sông Cửu Long.",
    pop: "1,69 triệu", area: "4.494,9", best: "Tháng 8 – Tháng 11 (mùa nước nổi)",
    highlights: ["Làng nổi Tân Lập", "Rừng tràm", "Đồng sen"],
    dests: ["lang-noi-tan-lap","khu-di-tich-binh-ta","khu-du-lich-cong-troi"],
    featured: false, order: 53, imgId: "1600596542815-611e32e77b59"
  },
  {
    slug: "tien-giang", name: "Tiền Giang", nameVi: "Tiền Giang", region: "mien-nam",
    desc: "Xứ cù lao miền Tây với Cù lao Thới Sơn xanh mát và chùa Vĩnh Tràng cổ kính.",
    longDesc: "Tiền Giang là tỉnh đầu nguồn sông Tiền, cửa ngõ miền Tây gần TP.HCM nhất. Cù lao Thới Sơn là hòn đảo giữa sông Tiền, điểm du lịch sinh thái nổi tiếng nơi du khách trải nghiệm đi xuồng, nghe đờn ca tài tử, thưởng thức trái cây và mật ong. Chùa Vĩnh Tràng có kiến trúc độc đáo pha trộn Đông – Tây. Trại rắn Đồng Tâm là trung tâm nghiên cứu rắn lớn nhất Việt Nam.",
    pop: "1,76 triệu", area: "2.510,6", best: "Tháng 11 – Tháng 4",
    highlights: ["Cù lao Thới Sơn", "Chùa Vĩnh Tràng", "Trái cây miền Tây"],
    dests: ["cu-lao-thoi-son","chua-vinh-trang","trai-ran-dong-tam"],
    featured: false, order: 54, imgId: "1600596542815-611e32e77b60"
  },
  {
    slug: "ben-tre", name: "Bến Tre", nameVi: "Bến Tre", region: "mien-nam",
    desc: "Xứ dừa Bến Tre với sông nước hữu tình, kẹo dừa nổi tiếng và Cồn Phụng.",
    longDesc: "Bến Tre là tỉnh nằm trọn trên ba cù lao lớn giữa sông Tiền, được mệnh danh là 'Xứ Dừa' với hàng triệu cây dừa. Cồn Phụng là điểm du lịch sinh thái nổi tiếng với vườn dừa, xưởng kẹo dừa và đi xuồng trên rạch. Vườn dừa Bến Tre rợp bóng mát, nơi du khách trải nghiệm cuộc sống miệt vườn. Sân chim Vàm Hồ là nơi hàng vạn con chim cò trú ngụ, rất đẹp vào mùa sinh sản.",
    pop: "1,29 triệu", area: "2.394,8", best: "Tháng 11 – Tháng 4",
    highlights: ["Cồn Phụng", "Kẹo dừa Bến Tre", "Sông nước miệt vườn"],
    dests: ["con-phung","vuon-dua-ben-tre","san-chim-vam-ho"],
    featured: false, order: 55, imgId: "1600596542815-611e32e77b61"
  },
  {
    slug: "vinh-long", name: "Vĩnh Long", nameVi: "Vĩnh Long", region: "mien-nam",
    desc: "Cù lao An Bình yên bình với nhà cổ Nam Bộ và vườn trái cây xum xuê.",
    longDesc: "Vĩnh Long là tỉnh nằm giữa sông Tiền và sông Hậu, nổi tiếng với cù lao An Bình – hòn đảo yên bình với những vườn trái cây sum suê và nhà cổ Nam Bộ hàng trăm năm tuổi. Du khách có thể nghỉ homestay, chèo xuồng trên kênh rạch và thưởng thức ẩm thực dân dã. Vĩnh Long còn nổi tiếng với vườn trái cây bốn mùa và nhiều ngôi chùa Khmer cổ kính.",
    pop: "1,02 triệu", area: "1.520,2", best: "Tháng 11 – Tháng 4",
    highlights: ["Cù lao An Bình", "Nhà cổ Nam Bộ", "Vườn trái cây"],
    dests: ["cu-lao-an-binh","nha-co-vinh-long","vuon-trai-cay-vinh-long"],
    featured: false, order: 56, imgId: "1600596542815-611e32e77b62"
  },
  {
    slug: "tra-vinh", name: "Trà Vinh", nameVi: "Trà Vinh", region: "mien-nam",
    desc: "Vùng đất văn hoá Khmer với chùa Âng cổ kính, Ao Bà Om bí ẩn và biển Ba Động.",
    longDesc: "Trà Vinh là tỉnh ven biển đồng bằng sông Cửu Long, nơi có cộng đồng người Khmer đông đúc với văn hoá đặc sắc. Chùa Âng (chùa Angkorajaborey) là ngôi chùa Khmer cổ hơn 1.000 năm tuổi với kiến trúc lộng lẫy. Ao Bà Om là ao nước cổ hình chữ nhật, bao quanh bởi hàng trăm cây sao cổ thụ, gắn với truyền thuyết. Biển Ba Động với bờ cát dài và hàng phi lao rì rào.",
    pop: "1,01 triệu", area: "2.340,7", best: "Tháng 11 – Tháng 4",
    highlights: ["Chùa Âng", "Ao Bà Om", "Văn hoá Khmer"],
    dests: ["chua-ang","ao-ba-om","bien-ba-dong"],
    featured: false, order: 57, imgId: "1600596542815-611e32e77b63"
  },
  {
    slug: "dong-thap", name: "Đồng Tháp", nameVi: "Đồng Tháp", region: "mien-nam",
    desc: "Xứ sen hồng với Vườn quốc gia Tràm Chim, làng hoa Sa Đéc và khu di tích Xẻo Quýt.",
    longDesc: "Đồng Tháp là tỉnh đầu nguồn sông Cửu Long, nổi tiếng với Vườn quốc gia Tràm Chim – nơi cư trú của loài sếu đầu đỏ quý hiếm. Làng hoa Sa Đéc là vựa hoa lớn nhất miền Nam với hàng trăm loài hoa rực rỡ quanh năm, đặc biệt đẹp vào dịp Tết. Khu di tích Xẻo Quýt là căn cứ cách mạng giữa rừng tràm, nay là điểm du lịch sinh thái. Đồng Tháp còn được mệnh danh là xứ sen hồng với đồng sen bát ngát.",
    pop: "1,60 triệu", area: "3.383,8", best: "Tháng 8 – Tháng 11 (mùa nước nổi, mùa sen)",
    highlights: ["Vườn quốc gia Tràm Chim", "Làng hoa Sa Đéc", "Xẻo Quýt"],
    dests: ["vuon-quoc-gia-tram-chim","lang-hoa-sa-dec","khu-di-tich-xeo-quit"],
    featured: false, order: 58, imgId: "1600596542815-611e32e77b64"
  },
  {
    slug: "an-giang", name: "An Giang", nameVi: "An Giang", region: "mien-nam",
    desc: "Vùng Bảy Núi huyền bí với núi Sam, rừng tràm Trà Sư và làng Chăm Châu Giang.",
    longDesc: "An Giang là tỉnh đầu nguồn sông Cửu Long, giáp biên giới Campuchia, nổi tiếng với vùng Bảy Núi (Thất Sơn) huyền bí. Núi Sam ở Châu Đốc có Miếu Bà Chúa Xứ – ngôi miếu linh thiêng bậc nhất miền Nam. Rừng tràm Trà Sư là khu rừng ngập nước tuyệt đẹp với thảm bèo xanh phủ kín mặt nước. Làng Chăm Châu Giang lưu giữ văn hoá Chăm Islam độc đáo. Núi Cấm (Thiên Cấm Sơn) là đỉnh cao nhất đồng bằng sông Cửu Long.",
    pop: "1,90 triệu", area: "3.536,8", best: "Tháng 8 – Tháng 11 (mùa nước nổi)",
    highlights: ["Rừng tràm Trà Sư", "Núi Sam", "Miếu Bà Chúa Xứ", "Làng Chăm"],
    dests: ["nui-cam","nui-sam","lang-cham-chau-giang","rung-tra-su"],
    featured: false, order: 59, imgId: "1600596542815-611e32e77b65"
  },
  {
    slug: "hau-giang", name: "Hậu Giang", nameVi: "Hậu Giang", region: "mien-nam",
    desc: "Tỉnh trẻ nhất miền Tây với chợ nổi Ngã Bảy và khu bảo tồn thiên nhiên Lung Ngọc Hoàng.",
    longDesc: "Hậu Giang là tỉnh nằm ở trung tâm đồng bằng sông Cửu Long, tách ra từ Cần Thơ năm 2004. Chợ nổi Ngã Bảy là chợ nổi truyền thống trên sông, nơi ghe xuồng tập trung mua bán nông sản. Khu bảo tồn thiên nhiên Lung Ngọc Hoàng có rừng tràm và đồng cỏ ngập nước là nơi trú ngụ của nhiều loài chim quý. Vườn cò Vị Thuỷ là điểm ngắm chim hấp dẫn vào mùa sinh sản.",
    pop: "0,73 triệu", area: "1.621,7", best: "Tháng 11 – Tháng 4",
    highlights: ["Chợ nổi Ngã Bảy", "Lung Ngọc Hoàng", "Sông nước miền Tây"],
    dests: ["cho-noi-nga-bay","khu-du-lich-lung-ngoc-hoang","vuon-co-vi-thuy"],
    featured: false, order: 60, imgId: "1600596542815-611e32e77b66"
  },
  {
    slug: "soc-trang", name: "Sóc Trăng", nameVi: "Sóc Trăng", region: "mien-nam",
    desc: "Vùng đất ba dân tộc Kinh – Hoa – Khmer với chùa Dơi nổi tiếng và lễ hội Oóc Om Bóc.",
    longDesc: "Sóc Trăng là tỉnh ven biển đồng bằng sông Cửu Long, nơi cộng cư của ba dân tộc Kinh – Hoa – Khmer. Chùa Dơi (chùa Mã Tộc) là ngôi chùa Khmer cổ nổi tiếng với hàng ngàn con dơi trú ngụ trên cây trong khuôn viên chùa. Chùa Kh'Leang là một trong những chùa Khmer cổ nhất và đẹp nhất đồng bằng. Cù Lao Dung là vùng đất phù sa bồi giữa sông Hậu. Lễ hội Oóc Om Bóc – đua ghe Ngo là lễ hội đặc sắc nhất.",
    pop: "1,20 triệu", area: "3.311,9", best: "Tháng 10 – Tháng 11 (lễ hội Oóc Om Bóc)",
    highlights: ["Chùa Dơi", "Lễ hội Oóc Om Bóc", "Văn hoá ba dân tộc"],
    dests: ["chua-doi-soc-trang","chua-kh-leang","cu-lao-dung"],
    featured: false, order: 61, imgId: "1600596542815-611e32e77b67"
  },
  {
    slug: "bac-lieu", name: "Bạc Liêu", nameVi: "Bạc Liêu", region: "mien-nam",
    desc: "Quê hương công tử Bạc Liêu với nhà Công tử và bản Dạ cổ hoài lang bất hủ.",
    longDesc: "Bạc Liêu là tỉnh ven biển phía Nam đồng bằng sông Cửu Long, nổi tiếng với giai thoại Công tử Bạc Liêu – người giàu nhất miền Nam xưa. Nhà Công tử Bạc Liêu là biệt thự kiến trúc Pháp nay là bảo tàng. Quán Âm Phật Đài (tượng Phật Bà cao 11m nhìn ra biển) là điểm hành hương nổi tiếng. Vườn chim Bạc Liêu rộng 130ha là nơi trú ngụ của hàng chục ngàn con chim. Bạc Liêu còn là quê hương của bản 'Dạ cổ hoài lang' – tiền thân của vọng cổ cải lương.",
    pop: "0,91 triệu", area: "2.669,0", best: "Tháng 11 – Tháng 4",
    highlights: ["Nhà Công tử Bạc Liêu", "Quán Âm Phật Đài", "Vườn chim Bạc Liêu"],
    dests: ["nha-cong-tu-bac-lieu","quan-am-phat-dai","vuon-chim-bac-lieu"],
    featured: false, order: 62, imgId: "1600596542815-611e32e77b68"
  },
  {
    slug: "ca-mau", name: "Cà Mau", nameVi: "Cà Mau", region: "mien-nam",
    desc: "Đất Mũi – cực Nam Tổ quốc với rừng đước ngập mặn và Vườn quốc gia U Minh Hạ.",
    longDesc: "Cà Mau là tỉnh cực Nam Việt Nam, nơi có Mũi Cà Mau – điểm cực Nam thiêng liêng của Tổ quốc. Vườn quốc gia U Minh Hạ có rừng tràm ngập nước bao la, hệ sinh thái đa dạng. Đất Mũi Cà Mau là nơi đất và biển gặp nhau, mỗi năm lấn ra biển thêm vài chục mét. Hòn Đá Bạc là cụm đảo nhỏ với truyền thuyết về nàng tiên. Cà Mau nổi tiếng với tôm, cua, cá đồng và ẩm thực Nam Bộ đậm đà.",
    pop: "1,19 triệu", area: "5.331,7", best: "Tháng 11 – Tháng 4",
    highlights: ["Đất Mũi Cà Mau", "Rừng đước ngập mặn", "Vườn quốc gia U Minh Hạ"],
    dests: ["dat-mui-ca-mau","vuon-quoc-gia-u-minh-ha","hon-da-bac"],
    featured: false, order: 63, imgId: "1600596542815-611e32e77b69"
  }
];

// Convert to full province objects
const provinces = provincesRaw.map(p => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  nameVi: p.nameVi,
  region: p.region,
  description: p.desc,
  longDescription: p.longDesc,
  heroImage: `https://images.unsplash.com/photo-${p.imgId}?w=1200&h=800&fit=crop&auto=format`,
  thumbnail: `https://images.unsplash.com/photo-${p.imgId}?w=400&h=300&fit=crop&auto=format`,
  population: p.pop.includes('triệu') ? p.pop + ' người' : p.pop + ' triệu người',
  area: p.area + ' km²',
  bestTimeToVisit: p.best,
  highlights: p.highlights,
  destinationSlugs: p.dests,
  featured: p.featured,
  order: p.order
}));

// Fix population format
provinces.forEach(p => {
  if (p.population.includes('triệu người người')) {
    p.population = p.population.replace(' người người', ' người');
  }
});

const outputPath = path.join(__dirname, '../src/data/provinces.json');
fs.writeFileSync(outputPath, JSON.stringify(provinces, null, 2), 'utf-8');
console.log(`Generated ${provinces.length} provinces to ${outputPath}`);
