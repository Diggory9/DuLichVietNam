import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Post } from "../models/Post";

const posts = [
  {
    title: "Top 10 điểm đến không thể bỏ lỡ tại Việt Nam",
    slug: "top-10-diem-den-khong-the-bo-lo-tai-viet-nam",
    excerpt:
      "Việt Nam sở hữu vô vàn cảnh đẹp trải dài từ Bắc vào Nam. Hãy cùng khám phá 10 điểm đến hấp dẫn nhất mà bất kỳ du khách nào cũng nên ghé thăm ít nhất một lần trong đời.",
    content: `# Top 10 điểm đến không thể bỏ lỡ tại Việt Nam

Việt Nam là một đất nước xinh đẹp với thiên nhiên hùng vĩ, văn hoá đa dạng và con người thân thiện. Từ những dãy núi trùng điệp phía Bắc đến những bãi biển xanh ngắt miền Trung và đồng bằng phì nhiêu phương Nam, mỗi vùng miền đều mang một nét đẹp riêng biệt. Dưới đây là 10 điểm đến mà bạn nhất định phải ghé thăm.

## 1. Vịnh Hạ Long – Quảng Ninh

Vịnh Hạ Long là Di sản Thiên nhiên Thế giới được UNESCO công nhận, nổi tiếng với hàng nghìn hòn đảo đá vôi mọc lên giữa làn nước xanh biếc. Du khách có thể trải nghiệm du thuyền qua đêm, chèo kayak khám phá các hang động hoặc tắm biển tại đảo Ti Tốp. Khung cảnh bình minh và hoàng hôn trên vịnh tạo nên những khoảnh khắc không thể nào quên.

## 2. Phố cổ Hội An – Quảng Nam

Hội An là thành phố cổ được bảo tồn gần như nguyên vẹn với kiến trúc độc đáo pha trộn giữa Việt Nam, Trung Hoa và Nhật Bản. Mỗi tối, phố cổ lung linh trong ánh đèn lồng đủ sắc màu. Đừng quên thả đèn hoa đăng trên sông Hoài và thưởng thức cao lầu — món ăn đặc trưng chỉ có ở nơi đây.

## 3. Sapa – Lào Cai

Sapa nằm ở độ cao hơn 1.500m so với mực nước biển, nổi tiếng với những thửa ruộng bậc thang tuyệt đẹp và văn hoá của các dân tộc thiểu số. Thời điểm lý tưởng để ghé thăm là tháng 9 đến tháng 10 khi lúa chín vàng, tạo nên bức tranh thiên nhiên ngoạn mục.

## 4. Đà Nẵng

Đà Nẵng là thành phố đáng sống nhất Việt Nam với những bãi biển đẹp như Mỹ Khê, Bà Nà Hills với Cầu Vàng nổi tiếng và bán đảo Sơn Trà hoang sơ. Đây còn là cửa ngõ để khám phá Hội An và Huế.

## 5. Phú Quốc – Kiên Giang

Đảo ngọc Phú Quốc sở hữu những bãi biển cát trắng mịn, nước biển trong vắt và hệ sinh thái rừng nguyên sinh phong phú. Du khách có thể lặn ngắm san hô, tham quan vườn tiêu, nhà thùng nước mắm hoặc ngắm hoàng hôn tuyệt đẹp tại Sunset Town.

## 6. Huế – Thừa Thiên Huế

Cố đô Huế mang trong mình bề dày lịch sử với Đại Nội, lăng tẩm các vua triều Nguyễn và dòng sông Hương thơ mộng. Ẩm thực Huế cũng là một điểm nhấn với bún bò Huế, bánh bèo, bánh nậm đậm đà hương vị.

## 7. Ninh Bình

Được mệnh danh là "Hạ Long trên cạn", Ninh Bình sở hữu quần thể danh thắng Tràng An, Tam Cốc với những dãy núi đá vôi xen kẽ đồng lúa và sông nước. Khu vực này cũng là Di sản Thế giới hỗn hợp đầu tiên của Việt Nam.

## 8. Đà Lạt – Lâm Đồng

Thành phố ngàn hoa Đà Lạt luôn mát mẻ quanh năm, là điểm đến lý tưởng cho những ai yêu thích thiên nhiên và sự lãng mạn. Những đồi thông, hồ Xuân Hương, thung lũng Tình Yêu và vườn hoa thành phố tạo nên không gian bình yên, thơ mộng.

## 9. Hà Giang

Hà Giang là vùng đất biên giới cực Bắc với Cao nguyên đá Đồng Văn — Công viên Địa chất Toàn cầu UNESCO. Cung đường đèo Mã Pí Lèng ngoạn mục, sông Nho Quế xanh ngọc bích và những bản làng người Mông tạo nên hành trình đầy cảm xúc.

## 10. TP. Hồ Chí Minh

Thành phố lớn nhất Việt Nam là nơi giao thoa giữa truyền thống và hiện đại. Từ Nhà thờ Đức Bà, Bưu điện Trung tâm đến các toà nhà chọc trời Landmark 81, Bitexco. Đời sống về đêm sôi động với vô vàn quán ăn đường phố, quán cà phê cóc và khu phố đi bộ Nguyễn Huệ.

---

Mỗi điểm đến đều mang một câu chuyện riêng, một vẻ đẹp riêng. Hãy lên kế hoạch và bắt đầu hành trình khám phá Việt Nam ngay hôm nay!`,
    author: "Admin",
    category: "du-lich",
    tags: ["du-lich", "diem-den", "viet-nam", "top-10"],
    published: true,
    publishedAt: new Date(),
    coverImage: "",
  },
  {
    title: "Khám phá ẩm thực đường phố Hà Nội",
    slug: "kham-pha-am-thuc-duong-pho-ha-noi",
    excerpt:
      "Hà Nội không chỉ nổi tiếng với lịch sử nghìn năm văn hiến mà còn là thiên đường ẩm thực đường phố. Hãy cùng điểm qua những món ăn khiến bao thực khách say mê.",
    content: `# Khám phá ẩm thực đường phố Hà Nội

Hà Nội — thủ đô nghìn năm tuổi — không chỉ là trung tâm chính trị, văn hoá mà còn là thiên đường ẩm thực của Việt Nam. Ẩm thực đường phố Hà Nội có nét đặc trưng riêng biệt: tinh tế trong cách chế biến, phong phú về hương vị và gắn liền với đời sống thường nhật của người dân thủ đô. Dưới đây là những món ăn đường phố bạn nhất định phải thử khi đến Hà Nội.

## Phở Hà Nội — Tinh hoa ẩm thực Việt

Phở là món ăn biểu tượng của Hà Nội và cũng là món Việt Nam nổi tiếng nhất thế giới. Một bát phở Hà Nội chuẩn vị có nước dùng trong, ngọt thanh từ xương bò ninh kỹ, bánh phở mềm mịn và thịt bò tái hồng. Điểm đặc biệt là phở Hà Nội không ăn kèm nhiều rau sống như miền Nam, chỉ cần thêm chút hành lá, giá đỗ và vài giọt chanh, ớt.

**Địa chỉ gợi ý:** Phở Thìn Lò Đúc, Phở Bát Đàn, Phở Lý Quốc Sư.

## Bún chả — Hương vị khó cưỡng

Bún chả là món ăn trưa quen thuộc của người Hà Nội. Chả được nướng trên bếp than hoa toả ra mùi thơm lừng khắp các con phố. Bát nước chấm chua ngọt với đu đủ, cà rốt ngâm cùng bún tươi trắng muốt tạo nên sự kết hợp hoàn hảo. Món ăn này từng được cựu Tổng thống Mỹ Barack Obama thưởng thức khi ghé thăm Hà Nội.

**Địa chỉ gợi ý:** Bún chả Hương Liên (Obama bún chả), Bún chả Đắc Kim.

## Bún đậu mắm tôm — Dân dã mà cuốn hút

Bún đậu mắm tôm là sự kết hợp tưởng đơn giản nhưng lại gây nghiện: bún lá trắng mềm, đậu phụ chiên vàng giòn, chả cốm thơm bùi, lòng dồi béo ngậy, tất cả chấm cùng mắm tôm đánh bông sủi bọt. Dù mùi mắm tôm có phần đặc biệt, nhưng một khi đã thử, bạn sẽ không thể dừng lại.

## Bánh mì Hà Nội — Khác biệt tinh tế

Bánh mì Hà Nội có phần vỏ mỏng giòn, nhân đơn giản hơn so với bánh mì Sài Gòn nhưng lại đậm đà nhờ pate gan thơm béo, giò lụa mịn mượt và rau mùi tươi xanh. Một ổ bánh mì nóng hổi vào buổi sáng sớm là bữa sáng hoàn hảo cho ngày mới.

## Chả cá Lã Vọng — Đặc sản trứ danh

Chả cá Lã Vọng có lịch sử hơn 100 năm, là một trong những món ăn đặc trưng nhất của Hà Nội. Cá lăng tươi được ướp nghệ vàng óng, chiên trên chảo nóng với thì là và hành lá xanh mướt. Món ăn được thưởng thức cùng bún, mắm tôm, đậu phộng rang và các loại rau thơm.

## Kem Tràng Tiền — Hương vị hoài niệm

Không thể nói về ẩm thực Hà Nội mà thiếu kem Tràng Tiền. Ra đời từ năm 1958, que kem mộc mạc với các vị kem đậu xanh, sô-cô-la, dừa và váng sữa đã trở thành ký ức tuổi thơ của biết bao thế hệ người Hà Nội. Đến nay, kem Tràng Tiền vẫn giữ nguyên hương vị và giá cả bình dân.

## Trà đá vỉa hè — Nét văn hoá độc đáo

Cuối cùng, không thể không nhắc đến ly trà đá vỉa hè — thức uống gắn liền với đời sống Hà Nội. Chỉ cần 3.000 đến 5.000 đồng, bạn đã có một ly trà mát lạnh, ngồi trên chiếc ghế nhựa thấp giữa phố phường, ngắm nhìn dòng người qua lại. Đó chính là cách trải nghiệm Hà Nội chân thực nhất.

---

Ẩm thực đường phố Hà Nội là một cuộc hành trình đầy hương vị. Mỗi con phố, mỗi ngõ nhỏ đều ẩn chứa những quán ăn khiến bạn phải quay lại lần thứ hai, thứ ba. Hãy đến Hà Nội và để vị giác dẫn lối bạn!`,
    author: "Admin",
    category: "am-thuc",
    tags: ["am-thuc", "ha-noi", "duong-pho", "pho", "bun-cha"],
    published: true,
    publishedAt: new Date(),
    coverImage: "",
  },
  {
    title: "Kinh nghiệm du lịch Đà Nẵng tự túc 2026",
    slug: "kinh-nghiem-du-lich-da-nang-tu-tuc-2026",
    excerpt:
      "Đà Nẵng là điểm đến lý tưởng cho chuyến du lịch tự túc với chi phí hợp lý. Bài viết chia sẻ kinh nghiệm di chuyển, ăn ở và các điểm tham quan hấp dẫn nhất tại Đà Nẵng.",
    content: `# Kinh nghiệm du lịch Đà Nẵng tự túc 2026

Đà Nẵng luôn nằm trong danh sách các thành phố du lịch hàng đầu Việt Nam nhờ bãi biển đẹp, ẩm thực phong phú và cơ sở hạ tầng hiện đại. Nếu bạn đang lên kế hoạch cho chuyến đi Đà Nẵng tự túc, bài viết này sẽ giúp bạn có một hành trình trọn vẹn với chi phí tiết kiệm nhất.

## Thời điểm lý tưởng để đi Đà Nẵng

Thời điểm đẹp nhất để du lịch Đà Nẵng là từ **tháng 3 đến tháng 8**, khi thời tiết nắng đẹp, biển lặng sóng và ít mưa. Tránh đi vào tháng 10 đến tháng 12 vì đây là mùa mưa lũ tại miền Trung. Nếu muốn tránh đông đúc và giá rẻ hơn, hãy đi vào các ngày trong tuần, tránh dịp lễ tết.

## Di chuyển đến Đà Nẵng

**Đường hàng không** là phương tiện phổ biến và tiện lợi nhất. Sân bay quốc tế Đà Nẵng nằm ngay trung tâm thành phố, chỉ cách bãi biển Mỹ Khê khoảng 5km. Các hãng bay giá rẻ như VietJet, Bamboo Airways thường xuyên có khuyến mãi, bạn có thể săn vé từ 500.000 đến 1.500.000 đồng nếu đặt sớm.

**Đường sắt** cũng là lựa chọn thú vị với tàu Thống Nhất chạy dọc đất nước, cho bạn cơ hội ngắm cảnh từ Bắc vào Nam, đặc biệt là đoạn đèo Hải Vân huyền thoại.

## Nơi ở tại Đà Nẵng

Đà Nẵng có nhiều lựa chọn lưu trú phù hợp với mọi ngân sách:

- **Hostel / Nhà nghỉ:** 150.000 – 300.000 đồng/đêm, phù hợp cho du khách ba lô.
- **Khách sạn 3 sao:** 400.000 – 800.000 đồng/đêm, sạch sẽ và tiện nghi.
- **Resort / Khách sạn 4-5 sao:** 1.500.000 – 4.000.000 đồng/đêm, trải nghiệm sang trọng.

**Mẹo:** Nên đặt khách sạn khu vực gần biển Mỹ Khê hoặc cầu Rồng để thuận tiện di chuyển và tận hưởng view biển.

## Top điểm tham quan không thể bỏ qua

### Bà Nà Hills và Cầu Vàng

Bà Nà Hills nằm ở độ cao 1.487m với hệ thống cáp treo dài nhất thế giới. Cầu Vàng — cây cầu nằm trên hai bàn tay khổng lồ — đã trở thành biểu tượng du lịch Việt Nam. Vé vào cổng khoảng 900.000 đồng/người lớn, bao gồm cáp treo và các trò chơi trong khu vui chơi.

### Bán đảo Sơn Trà

Bán đảo Sơn Trà là lá phổi xanh của Đà Nẵng với đường ven biển uốn lượn tuyệt đẹp. Tại đây có chùa Linh Ứng với tượng Phật Quan Âm cao 67m và bãi biển hoang sơ Bãi Bụt. Bạn có thể thuê xe máy tự lái khám phá bán đảo vào buổi sáng sớm để ngắm bình minh.

### Ngũ Hành Sơn

Cụm năm ngọn núi đá cẩm thạch với nhiều hang động và chùa chiền linh thiêng. Từ đỉnh Thuỷ Sơn, bạn có thể phóng tầm mắt ngắm toàn cảnh Đà Nẵng và biển Đông.

### Bãi biển Mỹ Khê

Từng được tạp chí Forbes bình chọn là một trong sáu bãi biển quyến rũ nhất hành tinh. Bãi cát trắng mịn, nước biển trong xanh và sóng vừa phải rất thích hợp để tắm biển, lướt sóng hoặc đơn giản là dạo bộ lúc hoàng hôn.

## Ẩm thực Đà Nẵng nhất định phải thử

- **Mì Quảng:** Sợi mì vàng ươm, nước dùng đậm đà với tôm, thịt và đậu phộng rang.
- **Bánh tráng cuốn thịt heo:** Thịt heo luộc cuốn cùng bánh tráng, rau sống và chấm mắm nêm.
- **Bún mắm:** Nước dùng từ mắm cá đậm vị, ăn kèm rau sống và các loại hải sản.
- **Hải sản tươi sống:** Khu vực bãi biển Mỹ An, Phạm Văn Đồng có nhiều nhà hàng hải sản bình dân.

## Chi phí tham khảo cho 3 ngày 2 đêm

| Hạng mục | Chi phí (VNĐ) |
|----------|---------------|
| Vé máy bay khứ hồi | 1.500.000 – 3.000.000 |
| Khách sạn (2 đêm) | 800.000 – 1.600.000 |
| Ăn uống (3 ngày) | 600.000 – 1.000.000 |
| Vé tham quan + di chuyển | 1.000.000 – 1.500.000 |
| **Tổng cộng** | **3.900.000 – 7.100.000** |

## Lời khuyên hữu ích

1. **Thuê xe máy** để chủ động di chuyển, giá khoảng 100.000 – 150.000 đồng/ngày.
2. **Mang theo kem chống nắng** vì nắng miền Trung khá gắt.
3. **Check thời tiết** trước khi đi, đặc biệt nếu đi vào mùa chuyển giao.
4. **Đặt vé Bà Nà Hills online** để tránh xếp hàng lâu tại quầy.

---

Đà Nẵng là thành phố thân thiện, dễ đi, dễ yêu. Dù là chuyến đi một mình, cùng bạn bè hay gia đình, bạn đều sẽ tìm thấy những trải nghiệm đáng nhớ tại nơi đây. Chúc bạn có một chuyến du lịch Đà Nẵng tự túc thật vui và tiết kiệm!`,
    author: "Admin",
    category: "trai-nghiem",
    tags: ["da-nang", "trai-nghiem", "tu-tuc", "kinh-nghiem", "2026"],
    published: true,
    publishedAt: new Date(),
    coverImage: "",
  },
];

async function seedPosts() {
  await connectDB();

  await Post.deleteMany({});
  console.log("Cleared existing posts");

  const inserted = await Post.insertMany(posts);
  console.log(`Inserted ${inserted.length} posts:`);
  for (const post of inserted) {
    console.log(`  - [${post.category}] ${post.title}`);
  }

  console.log("Seed posts completed!");
  await mongoose.connection.close();
  process.exit(0);
}

seedPosts().catch((err) => {
  console.error("Seed posts failed:", err);
  process.exit(1);
});
