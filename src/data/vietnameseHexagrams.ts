export interface VietHexagram {
  number: number;
  name: string; // Tên quẻ (Thuần Càn, Thủy Lôi Truân...)
  chinese: string; // Chữ Hán (乾, 屯...)
  symbol: string; // Quái tượng (Trời / Trời, Nước / Sấm...)
  element: string; // Ngũ hành
  thoanTu: string; // Lời Thoán (Phán đoán tổng quát của Kinh Dịch)
  tuongTruyen: string; // Lời Tượng (Đạo xử thế của người quân tử)
  meaning: string; // Ý nghĩa cốt lõi thực tế
  haoTu: Record<number, string>; // Lời 6 Hào (Hào 1 đến Hào 6)
}

export const VIETNAMESE_HEXAGRAMS: Record<number, VietHexagram> = {
  1: {
    number: 1,
    name: 'Thuần Càn (Trời)',
    chinese: '乾',
    symbol: 'Càn trên Càn dưới (Trời trên Trời)',
    element: 'Kim',
    thoanTu: 'Nguyên, Hanh, Lợi, Trinh. Đạo Càn là sáng tạo vô cùng, thông suốt vạn vật, đem lại điều lành khi giữ vững sự chính trực.',
    tuongTruyen: 'Trời vận động mạnh mẽ không ngừng, người quân tử noi theo đó mà tự cường không nghỉ.',
    meaning: 'Thời cơ lớn đang mở ra, năng lượng sung mãn, sáng tạo tột bậc. Thành công đến khi biết giữ lòng kiên định, khiêm nhu và không tự mãn.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Rồng còn ẩn mình dưới vực sâu (Tiềm long vật dụng). Chưa nên vội vã hành động, hãy tích lũy nội lực và chờ thời cơ.',
      2: 'Hào 2 (Cửu Nhị): Rồng hiện ở cánh đồng (Hiện long tại điền). Gặp gỡ quý nhân, người có uy đức để hợp tác sẽ rất có lợi.',
      3: 'Hào 3 (Cửu Tam): Cả ngày cần mẫn phấn đấu, đêm về vẫn thận trọng tự soi xét. Cẩn trọng phòng ngừa thì không gặp tai họa.',
      4: 'Hào 4 (Cửu Tứ): Rồng hoặc bay lên chín tầng mây, hoặc ẩn mình nơi vực sâu. Đứng trước bước ngoặt lớn, linh hoạt thích ứng thì không có lỗi.',
      5: 'Hào 5 (Cửu Ngũ): Rồng bay trên trời cao (Phi long tại thiên). Thời vận cực thịnh, tài năng tỏa sáng, có đại nhân trợ lực.',
      6: 'Hào 6 (Thượng Cửu): Rồng bay quá cao có điều hối hận (Kháng long hữu hối). Tránh kiêu ngạo, tham vọng thái quá kẻo gặp suy thoái.'
    }
  },
  2: {
    number: 2,
    name: 'Thuần Khôn (Đất)',
    chinese: '坤',
    symbol: 'Khôn trên Khôn dưới (Đất trên Đất)',
    element: 'Thổ',
    thoanTu: 'Nguyên, Hanh, Lợi tẫn mã chi trinh. Đạo Khôn là bao dung, nhẫn nại như đất mẹ. Đi trước thì lạc lối, theo sau giữ gìn đức trung thuận thì đắc lợi.',
    tuongTruyen: 'Thế đất dày chở vạn vật, người quân tử lấy đức dày mà bao bọc muôn người.',
    meaning: 'Thời vận của sự lắng nghe, hợp tác, tích lũy âm thầm. Tránh tranh giành quyền vị hay cầm đầu mạo hiểm; điềm lành đến từ sự mềm dẻo và bền chí.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Đạp lên sương sớm, biết rằng băng giá mùa đông sắp tới. Cần nhìn xa trông rộng, sớm phòng ngừa rủi ro.',
      2: 'Hào 2 (Lục Nhị): Ngay thẳng, vuông vắn, rộng lớn (Trực phương đại). Không cần mưu toan vụ lợi mà việc gì cũng hanh thông tốt lành.',
      3: 'Hào 3 (Lục Tam): Giữ kín tài năng và đức hạnh, nhẫn nại hoàn thành công việc được giao mà không màng khoe khoang công trạng.',
      4: 'Hào 4 (Lục Tứ): Thắt miệng túi lại (Quát nang). Giữ mồm giữ miệng, thận trọng kín đáo thì tránh được mọi thị phi gièm pha.',
      5: 'Hào 5 (Lục Ngũ): Áo màu vàng lót bên trong (Hoàng thường nguyên cát). Giữ đức khiêm cung, lấy trung dung đối đãi thì đại cát.',
      6: 'Hào 6 (Thượng Lục): Rồng đánh nhau nơi đồng nội, máu chảy rách toạc. Cạnh tranh đến cùng cực chỉ gây tổn thương cho đôi bên.'
    }
  },
  3: {
    number: 3,
    name: 'Thủy Lôi Truân (Khởi Đầu Gian Nan)',
    chinese: '屯',
    symbol: 'Khảm (Nước) trên Chấn (Sấm)',
    element: 'Thủy',
    thoanTu: 'Truân là lúc vạn vật mới sinh đầy khó khăn. Chưa nên vội vã tiến bước, cần tìm kiếm sự giúp đỡ từ người có kinh nghiệm.',
    tuongTruyen: 'Mây và sấm dồn dập, người quân tử biết sắp xếp công việc trật tự từ trong hỗn độn.',
    meaning: 'Bước khởi đầu bao giờ cũng vất vả, nhiều trắc trở nhưng ẩn chứa mầm sống mạnh mẽ. Cần kiên nhẫn, không nản chí, tích cực xây dựng liên minh.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Ngập ngừng chần chừ trước chông gai. Kiên định giữ vững lập trường và xây dựng đội ngũ trợ lực.',
      2: 'Hào 2 (Lục Nhị): Khó khăn chồng chất, xe ngựa chia lìa. Không phải kẻ gian mà là duyên chưa tới, kiên nhẫn chờ thời điểm thích hợp.',
      3: 'Hào 3 (Lục Tam): Đi săn hươu trong rừng mà không có người dẫn đường thì dễ lạc lối. Biết dừng lại đúng lúc là khôn ngoan.',
      4: 'Hào 4 (Lục Tứ): Xe ngựa chia rẽ, nhưng nếu chủ động tìm kiếm sự liên kết hòa hợp thì tiến lên sẽ cát lợi.',
      5: 'Hào 5 (Cửu Ngũ): Ban phát ơn huệ còn nhỏ hẹp. Làm việc nhỏ thì thuận lợi, việc đại sự chớ nên nóng vội.',
      6: 'Hào 6 (Thượng Lục): Xe ngựa chia rẽ, nước mắt đầm đìa. Bế tắc cùng cực do quá đơn độc, cần nhanh chóng thay đổi cách tiếp cận.'
    }
  },
  4: {
    number: 4,
    name: 'Sơn Thủy Mông (Ấu Thơ Mở Mang)',
    chinese: '蒙',
    symbol: 'Cấn (Núi) trên Khảm (Nước)',
    element: 'Hỏa',
    thoanTu: 'Mông là sự mờ mịt cần khai sáng. Không phải ta cầu kẻ non trẻ, mà người non trẻ đến cầu học ta. Thành tâm học hỏi ắt hanh thông.',
    tuongTruyen: 'Dưới núi có dòng suối chảy ra, người quân tử nuôi dưỡng đức hạnh bằng hành động quả quyết.',
    meaning: 'Thời điểm cần khiêm tốn lắng nghe lời chỉ dẫn của thầy hay tiền bối. Chưa am tường thì chớ nên tự ý quyết định liều lĩnh.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Khai mở sự tăm tối bằng kỷ luật nghiêm minh, nhưng sau đó phải tháo gỡ ràng buộc để phát triển tự nhiên.',
      2: 'Hào 2 (Cửu Nhị): Bao dung nâng đỡ người chưa hiểu biết thì đại cát. Người gánh vác việc gia đình hoặc tập thể rất chu toàn.',
      3: 'Hào 3 (Lục Tam): Chớ vội kết giao với kẻ thấy lợi là quên nghĩa, mất đi phẩm giá tự thân.',
      4: 'Hào 4 (Lục Tứ): Bị vướng kẹt trong sự u mê cô lập do quá bảo thủ. Cần mau chóng mở lòng tiếp thu cái mới.',
      5: 'Hào 5 (Lục Ngũ): Giữ tâm hồn trong sáng, thuần hậu như đứa trẻ biết lắng nghe lời dạy bảo thì gặp nhiều may mắn.',
      6: 'Hào 6 (Thượng Cửu): Trị kẻ ngoan cố cần răn đe đúng mức, chớ dùng bạo lực hà khắc kẻo sinh phản tác dụng.'
    }
  },
  5: {
    number: 5,
    name: 'Thủy Thiên Nhu (Chờ Đợi Thời Cơ)',
    chinese: '需',
    symbol: 'Khảm (Nước) trên Càn (Trời)',
    element: 'Kim',
    thoanTu: 'Nhu là chờ đợi. Lòng thành thật sáng tỏ thì mọi sự hanh thông, giữ vững chính đạo thì cát lợi, vượt sông lớn thành công.',
    tuongTruyen: 'Mây cuộn trên trời cao, người quân tử ăn uống dưỡng sức, nghỉ ngơi tĩnh tâm chờ thời.',
    meaning: 'Cơ hội sắp đến nhưng lúc này cần tích lũy năng lượng, kiên nhẫn chuẩn bị thay vì sốt ruột manh động.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Chờ đợi nơi đồng hoang xa hiểm nguy. Kiên định giữ nề nếp bình thường thì không gặp lỗi lầm.',
      2: 'Hào 2 (Cửu Nhị): Chờ đợi trên bãi cát, có điều tiếng thị phi nhỏ nhưng cuối cùng vẫn được điều lành.',
      3: 'Hào 3 (Cửu Tam): Chờ đợi trong bùn lầy nguy hiểm, dễ thu hút kẻ địch. Cần hết sức thận trọng và cảnh giác.',
      4: 'Hào 4 (Lục Tứ): Chờ đợi giữa chốn hiểm địa máu lửa. Hãy nhanh chóng rút lui ra khỏi hố sâu nguy nan.',
      5: 'Hào 5 (Cửu Ngũ): Chờ đợi bên mâm rượu tiệc thảnh thơi. Giữ tâm trung chính thì muôn sự tốt lành.',
      6: 'Hào 6 (Thượng Lục): Rơi vào hố sâu, có ba vị khách không mời mà đến. Cung kính tiếp đón hòa nhã thì hóa nguy thành an.'
    }
  },
  6: {
    number: 6,
    name: 'Thiên Thủy Tụng (Tranh Chấp Kiện Cáo)',
    chinese: '訟',
    symbol: 'Càn (Trời) trên Khảm (Nước)',
    element: 'Kim',
    thoanTu: 'Tụng là tranh chấp, bất đồng. Dù có lý nhưng bị ngăn trở, biết dừng lại nửa chừng là tốt, tranh đấu đến cùng ắt gặp họa.',
    tuongTruyen: 'Trời và Nước vận động ngược hướng nhau, người quân tử làm việc gì cũng bàn bạc rõ ràng minh bạch ngay từ đầu.',
    meaning: 'Cảnh báo về mâu thuẫn, tranh cãi, kiện tụng. Cách hóa giải tốt nhất là dĩ hòa vi quý, nhường nhịn và tìm giải pháp trung gian hòa giải.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Không kéo dài việc tranh chấp, dù có chút điều qua tiếng lại nhưng kết cục sẽ tốt đẹp.',
      2: 'Hào 2 (Cửu Nhị): Thấy thế không thể tranh được thì chủ động nhường bước rút lui về chốn an toàn, tránh vạ lây.',
      3: 'Hào 3 (Lục Tam): Giữ gìn đức hạnh xưa cũ, an phận giữ mình thì dẫu nguy hiểm cuối cùng vẫn bình an.',
      4: 'Hào 4 (Cửu Tứ): Không tranh chấp nữa, quay về thuận theo lẽ phải và an tâm giữ đạo chính thì cát lành.',
      5: 'Hào 5 (Cửu Ngũ): Tranh tụng trước bậc công minh phân xử rõ ràng thì đại cát.',
      6: 'Hào 6 (Thượng Cửu): Dẫu có thắng kiện được ban thưởng đai da quý, nhưng trong một buổi sáng cũng bị tước đoạt ba lần.'
    }
  },
  7: {
    number: 7,
    name: 'Địa Thủy Sư (Quân Đội Tập Hợp)',
    chinese: '師',
    symbol: 'Khôn (Đất) trên Khảm (Nước)',
    element: 'Thủy',
    thoanTu: 'Sư là quần chúng, quân đội. Cần người chỉ huy đức độ và kỷ luật nghiêm minh mới đạt được thắng lợi không tì vết.',
    tuongTruyen: 'Trong lòng đất chứa nước ngầm, người quân tử nuôi dưỡng lòng nhân từ và che chở muôn dân.',
    meaning: 'Muốn hoàn thành việc lớn cần có tổ chức kỷ luật, đoàn kết đội ngũ và sự lãnh đạo sáng suốt. Tránh hành động tự phát, vô kỷ luật.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Xuất quân phải có kỷ cương phép tắc. Phép tắc lỏng lẻo thì thất bại cận kề.',
      2: 'Hào 2 (Cửu Nhị): Nằm ở vị trí trung tâm chỉ huy quân đội, được cấp trên tin cậy ban thưởng trọng hậu.',
      3: 'Hào 3 (Lục Tam): Quân đội chở đầy xác chết trên xe. Chỉ huy sai lầm dẫn đến tổn thất nặng nề.',
      4: 'Hào 4 (Lục Tứ): Quân đội tạm thời lui binh đóng giữ chỗ an toàn. Biết lùi để bảo toàn lực lượng thì không có lỗi.',
      5: 'Hào 5 (Lục Ngũ): Đất có thú hoang quấy nhiễu, bắt trừ không lỗi. Hãy giao quyền cho tướng giỏi, chớ dùng kẻ bất tài.',
      6: 'Hào 6 (Thượng Lục): Đại tướng thắng trận phân chia phong đất lập ấp. Tuyệt đối không trọng dụng kẻ tiểu nhân.'
    }
  },
  8: {
    number: 8,
    name: 'Thủy Địa Tỷ (Gắn Kết Thân Ái)',
    chinese: '比',
    symbol: 'Khảm (Nước) trên Khôn (Đất)',
    element: 'Thủy',
    thoanTu: 'Tỷ là gắn bó, tương trợ lẫn nhau. Bói được quẻ này là cát lợi. Người đến sau chần chừ thì lỡ mất cơ hội tốt.',
    tuongTruyen: 'Trên mặt đất có nước thấm đượm, các đấng tiên vương thiết lập mối bang giao thân thiện với muôn phương.',
    meaning: 'Thời cơ tuyệt vời để mở rộng quan hệ, hợp tác đôi bên cùng có lợi, tìm kiếm người đồng hành chung chí hướng.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Gắn kết bằng tấm lòng chân thật, thủy chung như chum đầy nước thì muôn điều may mắn.',
      2: 'Hào 2 (Lục Nhị): Sự gắn kết xuất phát tự đáy lòng trung chính, giữ trọn đạo nghĩa thì đại cát.',
      3: 'Hào 3 (Lục Tam): Kết giao nhầm với những kẻ bất chính, thiếu tin cậy sẽ chuốc lấy phiền muộn.',
      4: 'Hào 4 (Lục Tứ): Thân ái và phục tùng người hiền đức bên ngoài, giữ vững lập trường thì có phúc.',
      5: 'Hào 5 (Cửu Ngũ): Vua săn thú mở vòng vây ba mặt, để lối thoát một mặt. Đối nhân xử thế rộng lượng thì lòng người tự quy phục.',
      6: 'Hào 6 (Thượng Lục): Muốn gắn kết nhưng thiếu đi người dẫn dắt đầu đàn hoặc đến quá muộn màng, gặp điều hung.'
    }
  },
  9: {
    number: 9,
    name: 'Phong Thiên Tiểu Súc (Tích Lũy Nhỏ)',
    chinese: '小畜',
    symbol: 'Tốn (Gió) trên Càn (Trời)',
    element: 'Mộc',
    thoanTu: 'Tiểu Súc là chứa nhịn, tích lũy từ những việc nhỏ. Mây đen giăng đầy mà chưa mưa từ phía Tây, cần tích lũy thêm.',
    tuongTruyen: 'Gió thổi trên trời, người quân tử trau dồi văn hóa và đức hạnh từng ngày.',
    meaning: 'Thời điểm tích tiểu thành đại. Chưa đủ lực để làm việc lớn ồ ạt; hãy kiên nhẫn gom góp kỹ năng, vốn liếng và tạo dựng uy tín.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Quay trở lại con đường chính đạo của mình. Có lỗi gì đâu, muôn sự tốt lành.',
      2: 'Hào 2 (Cửu Nhị): Được dắt dẫn cùng quay về đường ngay, cát lợi vững bền.',
      3: 'Hào 3 (Cửu Tam): Trục bánh xe bị gãy vỡ, vợ chồng bất hòa trừng mắt nhìn nhau. Cần nhường nhịn trong nội bộ.',
      4: 'Hào 4 (Lục Tứ): Có lòng chân thành thì xua tan nguy hiểm máu chảy, nỗi lo âu sợ hãi tự tiêu biến.',
      5: 'Hào 5 (Cửu Ngũ): Có lòng thành tín gắn bó cùng láng giềng, san sẻ sự giàu có và phồn vinh.',
      6: 'Hào 6 (Thượng Cửu): Mưa đã rơi, vạn vật được an dưỡng nhờ công đức tích lũy. Trăng gần tròn nên biết dừng lại, tiến quá sẽ nguy.'
    }
  },
  10: {
    number: 10,
    name: 'Thiên Trạch Lý (Lễ Nghi Cẩn Trọng)',
    chinese: '履',
    symbol: 'Càn (Trời) trên Đoài (Hồ)',
    element: 'Thổ',
    thoanTu: 'Lý là giẫm lên đuôi cọp mà cọp không cắn. Đi đứng cẩn trọng, ứng xử lễ phép thì mọi việc hanh thông.',
    tuongTruyen: 'Trời ở trên cao, Đầm hồ ở dưới thấp, người quân tử phân biệt tôn ti trật tự để định rõ chí hướng người đời.',
    meaning: 'Đối mặt với tình huống nguy hiểm hoặc cấp trên khắt khe. Vũ khí mạnh nhất của bạn là thái độ mềm mỏng, lễ phép, đúng mực.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Ăn ở mộc mạc, giản dị mà tiến bước thì không ai bắt bẻ được lỗi lầm.',
      2: 'Hào 2 (Cửu Nhị): Đi trên con đường bằng phẳng thênh thang. Người ẩn dật giữ đức trung chính thì gặp điều lành.',
      3: 'Hào 3 (Lục Tam): Kẻ một mắt muốn nhìn xa, kẻ què chân đòi đi nhanh, giẫm đuôi cọp bị cọp cắn. Hành động quá sức chuốc họa.',
      4: 'Hào 4 (Cửu Tứ): Giẫm lên đuôi cọp nhưng luôn biết nơm nớp lo sợ, cẩn trọng từng li từng tí nên cuối cùng được cát lành.',
      5: 'Hào 5 (Cửu Ngũ): Hành động cương quyết nhưng phải luôn ý thức được mối nguy hiểm tiềm ẩn.',
      6: 'Hào 6 (Thượng Cửu): Nhìn lại chặng đường đã qua, xét đoán kỹ điềm lành dữ. Khi đạo lý vẹn toàn thì đại cát.'
    }
  },
  11: {
    number: 11,
    name: 'Địa Thiên Thái (Thông Suốt Thái Bình)',
    chinese: '泰',
    symbol: 'Khôn (Đất) trên Càn (Trời)',
    element: 'Thổ',
    thoanTu: 'Thái là thông suốt, bình an. Cái nhỏ đi cái lớn đến, vạn vật giao hòa, quân tử nắm quyền, thời vận hưng thịnh.',
    tuongTruyen: 'Trời Đất giao hòa sinh sôi vạn vật, bậc minh chủ tài trợ và thành tựu đạo Trời Đất để giúp đỡ muôn dân.',
    meaning: 'Thời vận cực kỳ tốt đẹp, mọi việc hanh thông, công việc và tình duyên đều thuận buồm xuôi gió. Hãy nắm bắt cơ hội để phát triển.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Nhổ rễ cỏ tranh kéo theo cả chùm đất, đồng tâm hiệp lực tiến lên thì cát lợi.',
      2: 'Hào 2 (Cửu Nhị): Bao dung kẻ thô vụng, lội qua sông lớn không bè, không quên bạn xa, giữ trọn đạo trung dung.',
      3: 'Hào 3 (Cửu Tam): Không có dốc nào không có đường bằng, không có đi mà không có lại. Giữ vững sự kiên định trong gian khó thì vô tội.',
      4: 'Hào 4 (Lục Tứ): Bay lượn xuống gần gũi, không khoe khoang của cải, chân thành đối đãi với láng giềng.',
      5: 'Hào 5 (Lục Ngũ): Vua Thành Thang gả em gái cho người hiền đức, mang lại phúc lộc lớn lao và hạnh phúc mỹ mãn.',
      6: 'Hào 6 (Thượng Lục): Thành sụp đổ trở lại hào sâu. Vận thái cực chuyển sang bĩ, chớ dùng binh đao, hãy giữ gìn trật tự nội bộ.'
    }
  },
  12: {
    number: 12,
    name: 'Thiên Địa Bĩ (Bế Tắc Trắc Trở)',
    chinese: '否',
    symbol: 'Càn (Trời) trên Khôn (Đất)',
    element: 'Kim',
    thoanTu: 'Bĩ là bế tắc, không thông suốt. Kẻ tiểu nhân đắc chí, người quân tử ẩn mình giữ đạo. Cái lớn đi cái nhỏ đến.',
    tuongTruyen: 'Trời Đất không giao hòa, người quân tử tiết kiệm đức độ để tránh hiểm họa, không màng vinh hoa phú quý hư danh.',
    meaning: 'Thời điểm gặp trở ngại, lòng người ly tán, môi trường xung quanh có nhiều tiêu cực. Lựa chọn sáng suốt nhất là kiên nhẫn chờ thời, giữ gìn phẩm giá.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Nhổ rễ cỏ tranh liền rễ, cùng nhau giữ vững sự chính trực thì vượt qua bế tắc.',
      2: 'Hào 2 (Lục Nhị): Nhẫn nhục chịu đựng, đối với người tiểu nhân là thuận lợi, với người quân tử là cơ hội tôi luyện bản lĩnh.',
      3: 'Hào 3 (Lục Tam): Kẻ bất chính gánh chịu nỗi nhục nhã ê chề vì hành vi sai trái.',
      4: 'Hào 4 (Cửu Tứ): Làm việc theo mệnh lệnh của bậc chí tôn thì không có lỗi, bạn bè cùng chung chí hướng đều được hưởng phúc.',
      5: 'Hào 5 (Cửu Ngũ): Vận bế tắc sắp tan, người quân tử khôi phục cơ đồ. Nhưng phải luôn tự răn: "Liệu có nguy mất chăng?" buộc chặt vào gốc dâu già.',
      6: 'Hào 6 (Thượng Cửu): Vận bế tắc đã đi đến hồi kết thúc. Sau cơn bĩ cực đến hồi thái lai, niềm vui lớn sẽ đến.'
    }
  },
  13: {
    number: 13,
    name: 'Thiên Hỏa Đồng Nhân (Đoàn Kết Đồng Tâm)',
    chinese: '同人',
    symbol: 'Càn (Trời) trên Ly (Lửa)',
    element: 'Kim',
    thoanTu: 'Đồng Nhân là hòa hợp cùng người nơi đồng nội, hanh thông, vượt qua sông lớn, giữ đạo chính của người quân tử thì có lợi.',
    tuongTruyen: 'Trời cùng Lửa soi sáng muôn nơi, người quân tử phân loại vạn vật để hiểu rõ từng cộng đồng.',
    meaning: 'Thời điểm tìm kiếm sự đồng lòng, kết nối sức mạnh tập thể, mở rộng hợp tác công khai, minh bạch, không vụ lợi bè phái.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Hòa đồng với mọi người ngay trước cổng nhà, công khai minh bạch không có lỗi.',
      2: 'Hào 2 (Lục Nhị): Chỉ hòa đồng trong nội bộ dòng họ hay phe phái nhỏ thì chuốc lấy hổ thẹn, hẹp hòi.',
      3: 'Hào 3 (Cửu Tam): Giấu vũ khí trong bụi rậm, leo lên gò cao quan sát thăm dò, ba năm không dám khởi sự.',
      4: 'Hào 4 (Cửu Tứ): Trèo lên tường thành nhưng biết dừng lại không tấn công cướp phá, cát lành.',
      5: 'Hào 5 (Cửu Ngũ): Người đồng tâm trước khóc than sau cười vui rạng rỡ, sau bao gian nan gặp gỡ nhau viên mãn.',
      6: 'Hào 6 (Thượng Cửu): Hòa hợp với người ở nơi đồng nội xa xôi, tuy chưa thật gắn bó mật thiết nhưng không có điều gì hối tiếc.'
    }
  },
  14: {
    number: 14,
    name: 'Hỏa Thiên Đại Hữu (Sở Hữu Lớn Lao)',
    chinese: '大有',
    symbol: 'Ly (Lửa) trên Càn (Trời)',
    element: 'Kim',
    thoanTu: 'Đại Hữu là sự giàu có, sở hữu lớn. Mặt trời rực rỡ trên bầu trời cao, vạn sự hanh thông rực rỡ.',
    tuongTruyen: 'Lửa cháy sáng trên trời cao, người quân tử trừ tà phù chính, thuận theo mệnh trời mà làm điều lành.',
    meaning: 'Thời kỳ bội thu về tài chính, công danh hoặc tình cảm. Thành quả lớn đến tay cần đi kèm với lòng bao dung, làm việc thiện và chia sẻ với đời.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Không liên can gì đến điều xấu ác gây hại thì không lỗi. Ý thức được gian khó thì giữ vững thành quả.',
      2: 'Hào 2 (Cửu Nhị): Xe lớn chở đầy của cải hàng hóa, có nơi để đi tới và khởi sự hành động mà không mắc sai lầm.',
      3: 'Hào 3 (Cửu Tam): Bậc chư hầu đem của cải dâng lên Thiên tử, kẻ tiểu nhân hẹp hòi không thể làm được việc nghĩa hiệp này.',
      4: 'Hào 4 (Cửu Tứ): Phân biệt ranh giới rõ ràng, không khoe khoang sự giàu có trước người khác thì không ai ghen ghét.',
      5: 'Hào 5 (Lục Ngũ): Dùng lòng chân thành gắn kết mọi người, uy nghiêm mà hòa nhã thì đại cát.',
      6: 'Hào 6 (Thượng Cửu): Được trời ban phúc lành, muôn sự đều tốt đẹp hanh thông, không việc gì là không có lợi.'
    }
  },
  15: {
    number: 15,
    name: 'Địa Sơn Khiêm (Khiêm Tốn Nhún Nhường)',
    chinese: '謙',
    symbol: 'Khôn (Đất) trên Cấn (Núi)',
    element: 'Kim',
    thoanTu: 'Khiêm là khiêm tốn. Đạo khiêm khiến người có đức thành tựu mọi việc lớn, trước sau trọn vẹn.',
    tuongTruyen: 'Trong lòng đất có ngọn núi cao, người quân tử bớt chỗ thừa bù chỗ thiếu, cân bằng vạn vật một cách công bằng.',
    meaning: 'Quẻ toàn cát duy nhất trong 64 quẻ Kinh Dịch. Khiêm tốn là chìa khóa mở mọi cánh cửa thành công, được quý nhân trợ giúp và người đời mến phục.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Người quân tử khiêm tốn lại càng khiêm tốn, vượt sông lớn hiểm trở cũng bình an cát lợi.',
      2: 'Hào 2 (Lục Nhị): Lòng khiêm tốn bộc lộ tự nhiên ra ngoài thành tiếng vang, kiên định giữ đạo chính thì gặp phúc lành.',
      3: 'Hào 3 (Cửu Tam): Người có công lao lớn mà vẫn giữ đức khiêm tốn nhún nhường, làm việc gì cũng thành công trọn vẹn.',
      4: 'Hào 4 (Lục Tứ): Hành xử khiêm tốn đúng mực trong mọi cử chỉ, không có việc gì là không thuận lợi.',
      5: 'Hào 5 (Lục Ngũ): Không cậy giàu sang khoe của, dùng uy đức và sự cương quyết dẹp trừ kẻ quấy rối thì có lợi.',
      6: 'Hào 6 (Thượng Lục): Khiêm tốn đã nổi danh muôn phương, dùng kỷ luật nghiêm minh chấn chỉnh lại bản thân và nội bộ.'
    }
  },
  16: {
    number: 16,
    name: 'Lôi Địa Dự (Vui Vẻ Thuận Lòng)',
    chinese: '豫',
    symbol: 'Chấn (Sấm) trên Khôn (Đất)',
    element: 'Mộc',
    thoanTu: 'Dự là vui vẻ, thuận hòa, chuẩn bị sẵn sàng. Dựng xây liên minh và hành động dứt khoát thì có lợi lớn.',
    tuongTruyen: 'Sấm vang trên mặt đất làm muôn loài phấn khởi, tiên vương sáng tác âm nhạc tôn vinh đức trời.',
    meaning: 'Tinh thần phấn chấn, lòng người quy tụ, niềm vui tràn ngập. Tuy nhiên cần vui chơi có chừng mực, luôn có sự chuẩn bị chu đáo để niềm vui bền lâu.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Khoe khoang niềm vui sớm khi chưa thành công trọn vẹn ắt chuốc lấy tai họa.',
      2: 'Hào 2 (Lục Nhị): Vững vàng như tảng đá, nhìn thấu thời cơ trước khi sự việc xảy ra, không đợi hết ngày mới quyết định, cát lành.',
      3: 'Hào 3 (Lục Tam): Trông ngóng niềm vui từ kẻ khác rồi chần chừ do dự sẽ chuốc lấy hối hận.',
      4: 'Hào 4 (Cửu Tứ): Nguồn gốc của sự vui vẻ phấn khởi, thành tựu việc lớn lao, bạn bè tụ họp đông đảo tin theo.',
      5: 'Hào 5 (Lục Ngũ): Đang gặp căn bệnh dây dẳng nhưng nhờ nội lực vững vàng nên không nguy hiểm tính mạng.',
      6: 'Hào 6 (Thượng Lục): Mê muội trong niềm vui khoái lạc tột cùng, nhưng nếu biết kịp thời thức tỉnh thay đổi thì không có lỗi.'
    }
  },
  17: {
    number: 17,
    name: 'Trạch Lôi Tùy (Tùy Thuận Thời Thế)',
    chinese: '隨',
    symbol: 'Đoài (Hồ) trên Chấn (Sấm)',
    element: 'Mộc',
    thoanTu: 'Tùy là thuận theo thời thế, tùy cơ ứng biến. Giữ lòng trung chính thì đại cát hanh thông, không mắc sai lầm.',
    tuongTruyen: 'Sấm nằm dưới đầm hồ, người quân tử khi đêm về thì nghỉ ngơi an dưỡng tinh thần.',
    meaning: 'Biết thuận theo hoàn cảnh, lắng nghe người có tài đức và thích ứng linh hoạt. Chớ nên cố chấp đi ngược lại dòng chảy tự nhiên.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Chuẩn mực thay đổi theo thời, bước chân ra ngoài kết giao với người hiền sẽ lập nên sự nghiệp.',
      2: 'Hào 2 (Lục Nhị): Nếu quyến luyến đứa trẻ nhỏ thì đánh mất người trượng phu tài đức.',
      3: 'Hào 3 (Lục Tam): Đi theo người trượng phu thì từ bỏ được tính trẻ con non nớt, đạt được điều mình mong ước.',
      4: 'Hào 4 (Cửu Tứ): Đi theo người được thành công nhưng bị nghi kỵ, giữ tấm lòng chân thành sáng tỏ thì tai qua nạn khỏi.',
      5: 'Hào 5 (Cửu Ngũ): Chân thành tin tưởng nơi điều thiện và người tốt thì đại cát.',
      6: 'Hào 6 (Thượng Cửu): Được gắn kết bền chặt và tôn vinh nơi chốn cao quý của bậc minh vương.'
    }
  },
  18: {
    number: 18,
    name: 'Sơn Phong Cổ (Sửa Chữa Sai Lầm)',
    chinese: '蠱',
    symbol: 'Cấn (Núi) trên Tốn (Gió)',
    element: 'Mộc',
    thoanTu: 'Cổ là sự mục nát, hư hỏng cần chấn chỉnh. Trước ba ngày suy nghĩ kỹ, sau ba ngày hành động quyết liệt thì đại hanh thông.',
    tuongTruyen: 'Dưới chân núi có gió thổi luẩn quẩn, người quân tử chấn hưng lòng dân và bồi dưỡng đức hạnh.',
    meaning: 'Thời điểm thanh lọc, sửa chữa những sai lầm cũ, cải tổ quy trình công việc hoặc làm mới lại một mối quan hệ đã nguội lạnh.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Sửa chữa cơ nghiệp sai sót của bậc tiền bối, tiếp nối sự nghiệp với lòng hiếu kính thì thành công.',
      2: 'Hào 2 (Lục Nhị): Sửa chữa lỗi lầm một cách mềm mỏng, ôn hòa thì tránh được hối hận về sau.',
      3: 'Hào 3 (Cửu Tam): Sửa chữa có phần quá quyết liệt, tuy có chút ân hận nhỏ nhưng không mắc lỗi lầm lớn.',
      4: 'Hào 4 (Lục Tứ): Dung túng để mặc sự suy thoái tiếp diễn sẽ chuốc lấy sự nhục nhã.',
      5: 'Hào 5 (Lục Ngũ): Sửa chữa việc cũ đạt được thành tựu và nhận được sự khen ngợi, kính trọng của muôn người.',
      6: 'Hào 6 (Thượng Cửu): Không màng bả vinh hoa chức vị trần tục, hướng tới chí hướng cao thượng thanh tao.'
    }
  },
  19: {
    number: 19,
    name: 'Địa Trạch Lâm (Tiếp Cận Đến Gần)',
    chinese: '臨',
    symbol: 'Khôn (Đất) trên Đoài (Hồ)',
    element: 'Kim',
    thoanTu: 'Lâm là đến gần, lớn mạnh lên. Hanh thông thuận lợi, nhưng đến tháng tám (mùa suy thoái) cần cẩn trọng phòng ngừa.',
    tuongTruyen: 'Trên đầm hồ có đất bao quanh, người quân tử dạy dỗ không mệt mỏi, bao dung chở che muôn dân vô bờ bến.',
    meaning: 'Thời kỳ vận khí đang lên, tầm ảnh hưởng gia tăng, công việc mở rộng. Hãy nắm bắt thời cơ khi còn đang thịnh và chuẩn bị cho chu kỳ sau.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Cùng nhau chân thành tiến bước đến gần điều tốt lành thì đại cát.',
      2: 'Hào 2 (Cửu Nhị): Chân thành cảm ứng lẫn nhau, việc gì cũng hanh thông cát lợi.',
      3: 'Hào 3 (Lục Tam): Đến gần mà tự mãn, khoe khoang thì không có lợi; biết lo lắng sửa mình thì không mắc lỗi.',
      4: 'Hào 4 (Lục Tứ): Đến gần một cách hoàn hảo, chí tâm chí thành thì không có sai lầm.',
      5: 'Hào 5 (Lục Ngũ): Bậc minh tri thức biết dùng người hiền tài quản lý việc, đại cát.',
      6: 'Hào 6 (Thượng Lục): Đến gần bằng tấm lòng đôn hậu, quảng đại vị tha thì đại cát không tì vết.'
    }
  },
  20: {
    number: 20,
    name: 'Phong Địa Quan (Quan Sát Tĩnh Lặng)',
    chinese: '觀',
    symbol: 'Tốn (Gió) trên Khôn (Đất)',
    element: 'Kim',
    thoanTu: 'Quan là xem xét, chiêm ngưỡng. Như lễ tế đã rửa tay mà chưa dâng lễ, lòng thành kính trang nghiêm khiến muôn người hướng về.',
    tuongTruyen: 'Gió thổi lướt trên mặt đất, đấng minh vương đi tuần thú muôn phương, xem xét phong tục để giáo hóa dân chúng.',
    meaning: 'Thời điểm tĩnh tâm quan sát toàn cảnh, tự soi xét nội tâm và đánh giá tình hình sâu sắc trước khi đưa ra quyết định hành động.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Tầm nhìn thiển cận như trẻ con nhìn đời, người thường thì không lỗi, người có vị thế thì đáng xấu hổ.',
      2: 'Hào 2 (Lục Nhị): Nhìn đời qua khe cửa hẹp, góc nhìn bị hạn chế chỉ thích hợp cho việc nhỏ nội trợ.',
      3: 'Hào 3 (Lục Tam): Quan sát lại từng bước tiến lui của cuộc đời mình để chọn đường đi đúng đắn.',
      4: 'Hào 4 (Lục Tứ): Quan sát ánh sáng rạng rỡ của đất nước, thích hợp làm khách quý phò tá bậc minh vương.',
      5: 'Hào 5 (Cửu Ngũ): Tự quan sát đức hạnh và hành vi của bản thân, người quân tử không mắc lỗi lầm.',
      6: 'Hào 6 (Thượng Cửu): Quan sát cuộc đời với tâm thế khoáng đạt, siêu nhiên thoát tục thì tâm hồn an nhiên không tì vết.'
    }
  },
  21: {
    number: 21,
    name: 'Hỏa Lôi Phệ Hạp (Cắn Xuyên Trở Ngại)',
    chinese: '噬嗑',
    symbol: 'Ly (Lửa) trên Chấn (Sấm)',
    element: 'Mộc',
    thoanTu: 'Phệ Hạp là cắn đứt vật cản, dùng pháp luật nghiêm minh để dẹp trừ trở ngại thì mọi việc hanh thông.',
    tuongTruyen: 'Sấm và Chớp cùng nổi lên uy lực, tiên vương định rõ hình phạt để sáng tỏ phép nước.',
    meaning: 'Gặp phải chướng ngại vật hoặc bất đồng gay gắt cần sự quyết đoán, giải quyết triệt để vấn đề tận gốc, không nhân nhượng nửa vời.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Mang gông cùm vào chân che mất ngón, răn đe ngay từ lỗi nhỏ lúc ban đầu để tránh tai họa lớn.',
      2: 'Hào 2 (Lục Nhị): Cắn vào miếng thịt mềm ngập cả mũi, có chút quá tay nhưng không có lỗi lớn.',
      3: 'Hào 3 (Lục Tam): Cắn phải miếng thịt khô dai lại gặp chất độc, có chút bẽ bàng nhưng không hại lớn.',
      4: 'Hào 4 (Cửu Tứ): Cắn miếng thịt sấy khô được mũi tên vàng, trải qua gian nan kiên trì giữ đạo chính thì đắc lợi.',
      5: 'Hào 5 (Lục Ngũ): Cắn thịt khô được vàng ròng, ý thức sâu sắc mối nguy hiểm và giữ tâm công minh thì vô tội.',
      6: 'Hào 6 (Thượng Cửu): Mang gông lớn che mất cả hai tai, ngoan cố không nghe lời cảnh báo ắt gặp tai họa diệt vong.'
    }
  },
  22: {
    number: 22,
    name: 'Sơn Hỏa Bí (Trang Hoàng Vẻ Đẹp)',
    chinese: '賁',
    symbol: 'Cấn (Núi) trên Ly (Lửa)',
    element: 'Thổ',
    thoanTu: 'Bí là trang sức, vẻ đẹp thanh nhã. Hanh thông trong việc nhỏ, việc lớn cần chú trọng thực chất bên trong hơn vẻ hào nhoáng.',
    tuongTruyen: 'Dưới chân núi có ngọn lửa rực sáng, người quân tử làm sáng tỏ chính sự mà không vội vàng phán quyết.',
    meaning: 'Nghệ thuật, giao tiếp, xây dựng hình ảnh và thương hiệu cá nhân. Chú ý: vẻ đẹp hình thức chỉ bền vững khi có phẩm chất thật bên trong.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Trang điểm cho đôi bàn chân, thà đi bộ đàng hoàng còn hơn ngồi xe của kẻ bất chính.',
      2: 'Hào 2 (Lục Nhị): Trang điểm cho bộ râu, biết thuận theo và tôn vinh người có đức.',
      3: 'Hào 3 (Cửu Tam): Vẻ đẹp rạng rỡ đẫm ướt hương thơm, kiên trì giữ gìn đạo hạnh thì cát lợi lâu dài.',
      4: 'Hào 4 (Lục Tứ): Trang điểm bằng màu trắng tinh khôi, cưỡi ngựa trắng bay bổng, tìm kiếm người tri kỷ chân thành.',
      5: 'Hào 5 (Lục Ngũ): Trang điểm nơi vườn tược gò đồi, sính lễ giản dị đơn sơ nhưng lòng thành thì kết thúc tốt đẹp viên mãn.',
      6: 'Hào 6 (Thượng Cửu): Vẻ đẹp thuần khiết màu trắng không cần tô vẽ (Bạch bí), quay về với sự giản dị nguyên bản thì vô tội.'
    }
  },
  23: {
    number: 23,
    name: 'Sơn Địa Bác (Rơi Rụng Suy Thoái)',
    chinese: '剝',
    symbol: 'Cấn (Núi) trên Khôn (Đất)',
    element: 'Kim',
    thoanTu: 'Bác là sụp đổ, bào mòn. Kẻ tiểu nhân lấn át, khí âm cực thịnh, chưa nên tiến hành bất cứ việc gì lớn lúc này.',
    tuongTruyen: 'Núi gắn liền trên mặt đất bị gió mưa xói mòn, người trên muốn yên ổn phải hậu đãi và chăm lo cho cấp dưới.',
    meaning: 'Thời kỳ thoái trào, suy giảm tài nguyên hoặc bị gièm pha. Cách ứng phó khôn ngoan nhất là án binh bất động, bảo toàn vốn liếng và chờ đợi chu kỳ mới.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Chân giường bị mục nát bào mòn, nền móng lung lay ắt gặp điềm hung.',
      2: 'Hào 2 (Lục Nhị): Thân giường bị bào mòn, nguy cơ cận kề cần hết sức cảnh giác.',
      3: 'Hào 3 (Lục Tam): Bị bào mòn nhưng tách mình ra khỏi kẻ xấu, giữ sự liên kết với người chính trực thì không có lỗi.',
      4: 'Hào 4 (Lục Tứ): Sự bào mòn chạm tới tận da thịt mặt giường, hiểm họa cận kề.',
      5: 'Hào 5 (Lục Ngũ): Dẫn dắt người thân thuộc như đàn cá được ân sủng, việc gì cũng thuận lợi.',
      6: 'Hào 6 (Thượng Cửu): Trái cây lớn còn sót lại trên cành cao chưa bị rụng. Người quân tử được dân chở che, kẻ tiểu nhân bị phá tan nhà cửa.'
    }
  },
  24: {
    number: 24,
    name: 'Địa Lôi Phục (Trở Về Tái Sinh)',
    chinese: '復',
    symbol: 'Khôn (Đất) trên Chấn (Sấm)',
    element: 'Thổ',
    thoanTu: 'Phục là quay trở về, ánh sáng tái sinh sau mùa đông lạnh giá. Ra vào thông suốt, bảy ngày lại phục hồi, khởi sự có lợi.',
    tuongTruyen: 'Sấm động sâu trong lòng đất, ngày Đông chí vua đóng cửa ải, thương nhân không đi lại, nghỉ ngơi tĩnh dưỡng.',
    meaning: 'Bình minh của một chu kỳ mới! Những bế tắc đã lùi lại phía sau, sinh khí quay trở lại. Hãy khởi đầu từng bước chắc chắn và tự tin.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Quay trở lại ngay từ khoảng cách gần, không đi lạc quá xa, đại cát đại lợi.',
      2: 'Hào 2 (Lục Nhị): Thấy điều hay mà vui vẻ quay về phục thiện, điều lành đến liền tay.',
      3: 'Hào 3 (Lục Tam): Nhiều lần quay đi quay lại do tâm còn chao đảo, tuy nguy hiểm nhưng kịp nhận ra thì không lỗi lớn.',
      4: 'Hào 4 (Lục Tứ): Đi giữa đám đông nhưng biết một mình quay về con đường chính đạo.',
      5: 'Hào 5 (Lục Ngũ): Tự giác quay về bằng lòng trung thực cao thượng, không có điều chi phải hối hận.',
      6: 'Hào 6 (Thượng Lục): Mê muội không chịu quay về, chuốc lấy đại họa tai ương mười năm không gượng dậy nổi.'
    }
  },
  25: {
    number: 25,
    name: 'Thiên Lôi Vô Vọng (Chân Thật Tự Nhiên)',
    chinese: '無妄',
    symbol: 'Càn (Trời) trên Chấn (Sấm)',
    element: 'Mộc',
    thoanTu: 'Vô Vọng là không dối trá, giữ lòng trong sáng tự nhiên. Làm việc tà vạy vụ lợi sẽ chuốc lấy tai họa.',
    tuongTruyen: 'Dưới trời sấm vang động, vạn vật phát triển tự nhiên theo thiên tính, người quân tử thuận theo thời mà nuôi dưỡng muôn loài.',
    meaning: 'Hãy làm việc với cái tâm trong sáng, không toan tính mưu mẹo. Thành quả sẽ tự nhiên tới; sự gượng ép hay lừa lọc sẽ phản tác dụng.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Hành động với tấm lòng trong sáng vô tư thì đi đâu cũng gặp may mắn cát lành.',
      2: 'Hào 2 (Lục Nhị): Cày cấy mà không vội tính đến mùa gặt, khai hoang không màng đất màu mỡ, hành động vô tư thì có lợi.',
      3: 'Hào 3 (Lục Tam): Tai họa bất ngờ ập đến như bò buộc bên đường người qua đường dắt mất, người làng chịu oan.',
      4: 'Hào 4 (Cửu Tứ): Giữ lòng kiên định không vọng động thì tránh được mọi tai họa.',
      5: 'Hào 5 (Cửu Ngũ): Bệnh không do nguyên cớ bộc phát, chớ dùng thuốc men bừa bãi, để tự nhiên sẽ tự lành.',
      6: 'Hào 6 (Thượng Cửu): Lòng không mưu toan nhưng thời thế chưa thuận, hành động hấp tấp sẽ gặp rủi ro.'
    }
  },
  26: {
    number: 26,
    name: 'Sơn Thiên Đại Súc (Tích Lũy Lớn Lao)',
    chinese: '大畜',
    symbol: 'Cấn (Núi) trên Càn (Trời)',
    element: 'Thổ',
    thoanTu: 'Đại Súc là chứa nhịn, tích lũy kiến thức và tài đức to lớn. Không ăn cơm nhà mà phụng sự xã hội thì cát lợi, vượt sông lớn thành công.',
    tuongTruyen: 'Trời ở trong lòng Núi, người quân tử học hỏi nhiều lời nói và việc làm của cổ nhân để tích lũy đức hạnh.',
    meaning: 'Thời cơ lớn để tích lũy tài sản, kiến thức chuyên sâu và xây dựng nền tảng vững chắc cho sự nghiệp tương lai.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Có nguy hiểm phía trước, tốt nhất là nên dừng lại giữ mình.',
      2: 'Hào 2 (Cửu Nhị): Tháo trục bánh xe dừng lại, biết kiềm chế sức mạnh đúng lúc để tránh đụng độ.',
      3: 'Hào 3 (Cửu Tam): Ngựa tốt phi nhanh rèn luyện tay nghề hằng ngày, phòng bị khó khăn thì tiến lên có lợi.',
      4: 'Hào 4 (Lục Tứ): Đóng cọc ngang trán bò tót non để ngăn tính hung dữ từ sớm, đại cát.',
      5: 'Hào 5 (Lục Ngũ): Răng nanh heo rừng bị triệt tiêu sức hại, mọi việc tốt lành.',
      6: 'Hào 6 (Thượng Cửu): Đạt đến con đường thênh thang của trời cao, công thành danh toại hanh thông tột bực.'
    }
  },
  27: {
    number: 27,
    name: 'Sơn Lôi Di (Nuôi Dưỡng Thân Tâm)',
    chinese: '頤',
    symbol: 'Cấn (Núi) trên Chấn (Sấm)',
    element: 'Mộc',
    thoanTu: 'Di là nuôi dưỡng. Quan sát cách một người tự nuôi dưỡng bản thân và nuôi dưỡng người khác để biết phẩm cách.',
    tuongTruyen: 'Dưới chân núi có sấm vang rền, người quân tử cẩn trọng lời ăn tiếng nói và điều độ việc ăn uống.',
    meaning: 'Chú trọng sức khỏe thể chất, thanh lọc tâm trí và lời nói. Nuôi dưỡng tri thức và cẩn trọng với những gì mình nạp vào cơ thể và tâm hồn.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Bỏ rùa thiêng báu vật của mình mà thèm thuồng nhìn mâm cỗ người khác, chuốc lấy điềm hung.',
      2: 'Hào 2 (Lục Nhị): Đi tìm sự nuôi dưỡng ngược đời trái đạo lý sẽ gặp tai họa.',
      3: 'Hào 3 (Lục Tam): Trái với lẽ nuôi dưỡng chân chính, mười năm không làm nên tích sự gì.',
      4: 'Hào 4 (Lục Tứ): Hướng lên trên tìm nguồn nuôi dưỡng chính đáng, như hổ rình mồi tập trung cao độ thì không có lỗi.',
      5: 'Hào 5 (Lục Ngũ): Đi chệch đường ngay nhưng biết dừng lại nương tựa bậc hiền nhân thì cát lành.',
      6: 'Hào 6 (Thượng Cửu): Là cội nguồn nuôi dưỡng muôn loài, gánh vác trách nhiệm lớn lao tuy hiểm nguy nhưng đại cát.'
    }
  },
  28: {
    number: 28,
    name: 'Trạch Phong Đại Quá (Gánh Nặng Vượt Mức)',
    chinese: '大過',
    symbol: 'Đoài (Hồ) trên Tốn (Gió)',
    element: 'Mộc',
    thoanTu: 'Đại Quá là quá mức, đòn nóc nhà bị cong võng vì chịu tải quá nặng. Cần hành động quyết đoán giải tỏa áp lực.',
    tuongTruyen: 'Đầm nước ngập chìm cây cối, người quân tử dẫu đứng một mình không sợ hãi, lánh đời không buồn phiền.',
    meaning: 'Tình trạng căng thẳng, quá tải trong công việc hoặc trách nhiệm. Cần có giải pháp giảm tải ngay lập tức, tránh để gãy đổ.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Trải chiếu cỏ mềm lót dưới đất, cẩn trọng tột cùng ngay từ bước đầu thì không có lỗi.',
      2: 'Hào 2 (Lục Cửu): Cây liễu khô đâm chồi nảy lộc, ông lão lấy được vợ trẻ, muôn sự tốt lành.',
      3: 'Hào 3 (Cửu Tam): Đòn nóc nhà bị cong oằn gãy đổ vì sức nặng quá mức, nguy nan khôn lường.',
      4: 'Hào 4 (Cửu Tứ): Đòn nóc được chống đỡ vững vàng, cát lợi; nhưng nếu cậy thế riêng thì chuốc lấy xấu hổ.',
      5: 'Hào 5 (Cửu Ngũ): Cây liễu khô trổ hoa tàn tạ, bà lão lấy được chồng trẻ, không lỗi nhưng không bền.',
      6: 'Hào 6 (Thượng Lục): Lội qua sông nước ngập quá đầu, tuy gặp nạn nhưng chí khí dũng cảm không đáng trách.'
    }
  },
  29: {
    number: 29,
    name: 'Thuần Khảm (Nước Hiểm Nguy)',
    chinese: '坎',
    symbol: 'Khảm trên Khảm dưới (Vực sâu trong Vực sâu)',
    element: 'Thủy',
    thoanTu: 'Khảm là hố sâu, hiểm nguy trùng điệp. Giữ tấm lòng chân thành, tâm trí vững vàng không dao động thì vượt qua nạn lớn.',
    tuongTruyen: 'Nước chảy không ngừng đến nơi hiểm trở, người quân tử giữ đức hạnh thường hằng và rèn luyện kỹ năng dạy dỗ.',
    meaning: 'Đang ở trong giai đoạn thử thách gắt gao, nguy hiểm bủa vây. Hãy bình tĩnh, đi từng bước chắc chắn, không mạo hiểm manh động.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Rơi xuống đáy hố sâu hun hút, lún sâu vào hiểm họa gặp điều hung.',
      2: 'Hào 2 (Cửu Nhị): Nằm giữa chốn hiểm nguy, chỉ nên mưu cầu những điều nhỏ nhặt an toàn.',
      3: 'Hào 3 (Lục Tam): Đến hay lui đều gặp hố thẳm nguy khốn, hãy án binh bất động chớ hành động mù quáng.',
      4: 'Hào 4 (Lục Tứ): Một chén rượu, một giỏ cơm giản dị đưa qua cửa sổ vào ngục tối, lòng thành chân thật thì thoát nạn.',
      5: 'Hào 5 (Cửu Ngũ): Nước ngập chưa tràn bờ, hiểm nguy đã được san bằng bình ổn, vô tội.',
      6: 'Hào 6 (Thượng Lục): Bị trói bằng dây thừng gai ba lớp nhốt trong rừng gai tối tăm, ba năm khó lòng thoát nạn.'
    }
  },
  30: {
    number: 30,
    name: 'Thuần Ly (Lửa Soi Sáng)',
    chinese: '離',
    symbol: 'Ly trên Ly dưới (Lửa sáng nối Lửa sáng)',
    element: 'Hỏa',
    thoanTu: 'Ly là gắn bó, sáng suốt như ngọn lửa. Nương tựa vào điều chính đạo thì hanh thông, nuôi bò cái thì đại cát.',
    tuongTruyen: 'Ánh sáng rực rỡ chiếu rọi muôn phương, bậc đại nhân nối tiếp ánh sáng soi rọi bốn cõi.',
    meaning: 'Trí tuệ minh mẫn, sự nghiệp tỏa sáng rực rỡ. Cần nương tựa vào môi trường tốt, đối tác uy tín để ánh sáng duy trì bền vững.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Bước chân ban đầu còn bỡ ngỡ, giữ lòng cung kính cẩn trọng thì không mắc sai lầm.',
      2: 'Hào 2 (Lục Nhị): Ánh sáng vàng rực rỡ ở vị trí trung chính, đại cát đại lợi.',
      3: 'Hào 3 (Cửu Tam): Ánh mặt trời xế chiều tà, không gõ vò ca hát mà lại thở dài than vãn, chuốc lấy điều hung.',
      4: 'Hào 4 (Cửu Tứ): Bùng cháy dữ dội bất ngờ rồi vụt tắt tàn lụi, không có nền tảng vững bền.',
      5: 'Hào 5 (Lục Ngũ): Giọt nước mắt tuôn rơi như mưa tiếc thương hối cải, sau cơn buồn gặp lại niềm vui cát lành.',
      6: 'Hào 6 (Thượng Cửu): Vua xuất quân chinh phạt chém đầu tướng giặc đầu sỏ, khoan hồng cho kẻ bị lôi kéo thì không có lỗi.'
    }
  },
  31: {
    number: 31,
    name: 'Trạch Sơn Hàm (Cảm Ứng Giao Duyên)',
    chinese: '咸',
    symbol: 'Đoài (Hồ) trên Cấn (Núi)',
    element: 'Kim',
    thoanTu: 'Hàm là cảm ứng, giao cảm chân thành. Trai gái tương hợp, lấy vợ gả chồng thì đại cát.',
    tuongTruyen: 'Trên núi có đầm nước thanh mát, người quân tử giữ lòng trống không trong sáng để đón nhận ý kiến muôn người.',
    meaning: 'Điềm báo đại cát cho tình cảm, duyên số, sự đồng điệu tâm hồn và các mối quan hệ hợp tác đối tác tự nhiên gắn kết.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Cảm ứng mới bắt đầu ở ngón chân cái, chí hướng mới nhen nhóm chưa hành động gì lớn.',
      2: 'Hào 2 (Lục Nhị): Cảm ứng ở bắp chân, chớ vội chạy theo cảm xúc bồng bột, ở yên thì tốt.',
      3: 'Hào 3 (Cửu Tam): Cảm ứng ở đùi, bị người khác dắt mũi chạy theo sau sẽ chuốc lấy sự bẽ bàng.',
      4: 'Hào 4 (Cửu Tứ): Giữ tâm trung chính kiên định thì hối hận tiêu tan; nếu suy nghĩ lăng xăng thì chỉ bạn bè thân mới theo.',
      5: 'Hào 5 (Cửu Ngũ): Cảm ứng ở phần lưng thịt dầy vững chãi, không có điều chi phải ân hận.',
      6: 'Hào 6 (Thượng Lục): Cảm ứng chỉ nơi đầu môi chót lưỡi, lời nói suông không có thực tâm.'
    }
  },
  32: {
    number: 32,
    name: 'Lôi Phong Hằng (Bền Vững Lâu Dài)',
    chinese: '恆',
    symbol: 'Chấn (Sấm) trên Tốn (Gió)',
    element: 'Mộc',
    thoanTu: 'Hằng là bền lâu, thủy chung như nhất. Hanh thông không lỗi, kiên trì theo đuổi mục tiêu thì có nơi để đi tới.',
    tuongTruyen: 'Sấm và Gió cùng chuyển động tương trợ lẫn nhau, người quân tử đứng vững vàng không thay đổi chí hướng.',
    meaning: 'Thời điểm cần sự kiên trì, chung thủy, giữ vững cam kết và duy trì nhịp độ ổn định. Tránh thay đổi xoành xoạch đứng núi này trông núi nọ.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Nóng vội muốn bền chặt ngay từ đầu sẽ phản tác dụng, gặp điều hung.',
      2: 'Hào 2 (Cửu Nhị): Giữ đạo trung dung bền bỉ thì mọi điều ân hận đều tiêu tan.',
      3: 'Hào 3 (Cửu Tam): Tính tình thất thường không giữ được đức hằng bền lâu, chuốc lấy nỗi nhục nhã ê chề.',
      4: 'Hào 4 (Cửu Tứ): Đi săn ở nơi không có thú thì dẫu có kiên trì cũng chẳng thu được kết quả gì.',
      5: 'Hào 5 (Lục Ngũ): Giữ đức bền chặt theo kiểu phụ nữ nội trợ thì tốt cho người tùng phục, không tốt cho bậc trượng phu quyết đoán.',
      6: 'Hào 6 (Thượng Lục): Tâm trí chao đảo dao động không ngừng nghỉ, gặp điều hung.'
    }
  },
  33: {
    number: 33,
    name: 'Thiên Sơn Độn (Ẩn Thoát Lánh Xa)',
    chinese: '遯',
    symbol: 'Càn (Trời) trên Cấn (Núi)',
    element: 'Kim',
    thoanTu: 'Độn là rút lui, ẩn dật tránh hiểm họa. Nhỏ thì có lợi, lớn cần biết tạm thời buông tay bảo toàn lực lượng.',
    tuongTruyen: 'Dưới trời có núi cao sừng sững, người quân tử lánh xa kẻ tiểu nhân, giữ thái độ nghiêm nghị mà không thù hằn.',
    meaning: 'Biết rút lui đúng lúc là đỉnh cao của trí tuệ. Tránh đối đầu với hoàn cảnh bất lợi hoặc những kẻ tiểu nhân hãm hại.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Rút lui chậm trễ ở phần đuôi, gặp nguy hiểm, chớ nên hành động mù quáng.',
      2: 'Hào 2 (Lục Nhị): Dùng da bò vàng buộc chặt lấy chí hướng kiên quyết rút lui, không ai lay chuyển nổi.',
      3: 'Hào 3 (Cửu Tam): Muốn rút lui nhưng bị ràng buộc vướng víu mệt mỏi, nuôi tôi tớ thì tốt.',
      4: 'Hào 4 (Cửu Tứ): Người quân tử tự nguyện rút lui êm đẹp, kẻ tiểu nhân bị ràng buộc mê muội.',
      5: 'Hào 5 (Cửu Ngũ): Rút lui một cách đàng hoàng, duyên dáng và đúng thời điểm, kiên định thì cát lợi.',
      6: 'Hào 6 (Thượng Cửu): Rút lui nhẹ nhàng thanh thản như cánh chim bay lượn trên trời cao, không việc gì là không thuận lợi.'
    }
  },
  34: {
    number: 34,
    name: 'Lôi Thiên Đại Tráng (Hùng Mạnh Cương Trực)',
    chinese: '大壯',
    symbol: 'Chấn (Sấm) trên Càn (Trời)',
    element: 'Kim',
    thoanTu: 'Đại Tráng là sức mạnh lớn lao, chính đại quang minh. Giữ lòng trung chính thì đắc lợi lớn.',
    tuongTruyen: 'Sấm vang trên trời cao uy dũng, người quân tử không bước chân vào những nơi phi lễ trái đạo.',
    meaning: 'Khí thế ngút trời, năng lực mạnh mẽ. Cần dùng sức mạnh đúng chỗ, có đạo đức và kiểm soát sự nóng giận kẻo húc đầu vào rào dậu.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Cậy sức mạnh ở ngón chân mà tiến vội ắt gặp hung họa.',
      2: 'Hào 2 (Cửu Nhị): Giữ vững đạo trung chính không ỷ mạnh hiếp yếu thì cát lợi.',
      3: 'Hào 3 (Cửu Tam): Kẻ tiểu nhân dùng sức mạnh cơ bắp, người quân tử dùng đức hạnh. Dê đực húc bờ rào mắc kẹt cả sừng.',
      4: 'Hào 4 (Cửu Tứ): Húc thủng bờ rào thoát ra ngoài, trục xe lớn vững vàng tiến bước, hối hận tiêu tan.',
      5: 'Hào 5 (Lục Ngũ): Mất con dê ở nơi dễ dãi nhưng không có gì hối hận.',
      6: 'Hào 6 (Thượng Lục): Dê húc bờ rào tiến không được thoái không xong, gian nan vất vả nhưng biết dừng lại thì chuyển nguy thành an.'
    }
  },
  35: {
    number: 35,
    name: 'Hỏa Địa Tấn (Tiến Lên Sáng Sủa)',
    chinese: '晉',
    symbol: 'Ly (Lửa) trên Khôn (Đất)',
    element: 'Kim',
    thoanTu: 'Tấn là tiến lên sáng tỏ. Như bậc chư hầu trung lương được vua ban thưởng ngựa quý nhiều vô kể, ngày tiếp kiến ba lần.',
    tuongTruyen: 'Mặt trời mọc lên khỏi mặt đất tỏa sáng muôn nơi, người quân tử tự làm sáng tỏ đức hạnh cao quý của mình.',
    meaning: 'Thời vận thăng tiến rõ rệt! Công việc thuận lợi, tài năng được công nhận, cấp trên nâng đỡ và cơ hội phát triển mở rộng.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Muốn tiến nhưng bị ngăn trở, khoan dung giữ lòng kiên định thì không mắc lỗi.',
      2: 'Hào 2 (Lục Nhị): Tiến lên trong sầu muộn nhưng giữ lòng chính trực thì được bậc mẫu hậu ban phúc lớn.',
      3: 'Hào 3 (Lục Tam): Được mọi người đồng lòng tín nhiệm ủng hộ tiến lên, hối hận tiêu tan.',
      4: 'Hào 4 (Cửu Tứ): Tiến lên như con chuột chũi tham lam vụng trộm, nguy hại cận kề.',
      5: 'Hào 5 (Lục Ngũ): Không màng đến chuyện được mất cá nhân, tiến lên với tâm thế trong sáng thì muôn sự cát lành.',
      6: 'Hào 6 (Thượng Cửu): Tiến lên dùng vũ lực dẹp loạn nội bộ bản thân thì tốt, dùng hà khắc với người ngoài thì chuốc lấy hổ thẹn.'
    }
  },
  36: {
    number: 36,
    name: 'Địa Hỏa Minh Di (Thương Tích Giấu Sáng)',
    chinese: '明夷',
    symbol: 'Khôn (Đất) trên Ly (Lửa)',
    element: 'Thủy',
    thoanTu: 'Minh Di là ánh sáng bị vùi lấp dưới lòng đất, thời kỳ đen tối. Cần biết giấu tài năng, kiên trì trong gian khó.',
    tuongTruyen: 'Mặt trời lặn chìm sâu vào lòng đất, người quân tử xử thế với quần chúng bằng cách giấu bớt sự thông thái sáng tỏ.',
    meaning: 'Thời kỳ khó khăn, bị chèn ép hoặc môi trường xung quanh độc hại. Hãy học cách "giả ngô giả ngọng", giữ mình an toàn để chờ bình minh.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Cánh chim bị thương cụp cánh bay đi, ba ngày không ăn, chủ nhà xì xào nhưng không trách.',
      2: 'Hào 2 (Lục Nhị): Bị thương ở đùi trái, nhưng được ngựa tốt cứu thoát qua cơn nguy hiểm, cát lành.',
      3: 'Hào 3 (Cửu Tam): Đi săn ở phương Nam bắt được đầu sỏ gian tà, nhưng chớ vội vàng cải cách ồ ạt.',
      4: 'Hào 4 (Lục Tứ): Đi sâu vào bụng kẻ gian tà nhìn thấu sự thật rồi rút lui ra khỏi cửa nhà an toàn.',
      5: 'Hào 5 (Lục Ngũ): Như Cơ Tử thời Trụ vương giả điên giấu tài, kiên trì giữ đạo chính thoát khỏi hiểm họa.',
      6: 'Hào 6 (Thượng Lục): Trước bay lên sáng rực trời cao sau rơi xuống đất đen tăm tối, kẻ bạo ngược tự diệt.'
    }
  },
  37: {
    number: 37,
    name: 'Phong Hỏa Gia Nhân (Gia Đình Hòa Thuận)',
    chinese: '家人',
    symbol: 'Tốn (Gió) trên Ly (Lửa)',
    element: 'Mộc',
    thoanTu: 'Gia Nhân là người trong nhà, đạo gia đình nề nếp. Người phụ nữ giữ đức đoan trang chính trực thì gia đạo hưng thịnh.',
    tuongTruyen: 'Gió sinh ra từ ngọn lửa bùng cháy, người quân tử lời nói có căn cứ và hành động có nề nếp chuẩn mực.',
    meaning: 'Tập trung vun vén tổ ấm, sắp xếp ổn thỏa nội bộ gia đình hoặc đội ngũ nội bộ công ty. Trong ấm thì ngoài mới êm.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Đặt ra gia quy nề nếp nghiêm minh ngay từ đầu thì không nảy sinh điều hối hận.',
      2: 'Hào 2 (Lục Nhị): Chu toàn việc nội trợ và chăm sóc gia đình, không màng việc bên ngoài, cát lợi.',
      3: 'Hào 3 (Cửu Tam): Gia đình quá nghiêm khắc có tiếng than van nhưng giữ được nền nếp; quá buông tuồng sẽ chuốc lấy nhục nhã.',
      4: 'Hào 4 (Lục Tứ): Gia đình thịnh vượng giàu có và hòa thuận, đại cát.',
      5: 'Hào 5 (Cửu Ngũ): Bậc gia trưởng lấy tình yêu thương chân thành đối đãi với người nhà, không cần lo âu, cát lành.',
      6: 'Hào 6 (Thượng Cửu): Có uy đức và lòng chân thành giữ trọn đến cùng thì gia đình muôn đời hưng thịnh.'
    }
  },
  38: {
    number: 38,
    name: 'Hỏa Trạch Khuê (Bất Đồng Khác Biệt)',
    chinese: '睽',
    symbol: 'Ly (Lửa) trên Đoài (Hồ)',
    element: 'Thổ',
    thoanTu: 'Khuê là trái ngược, bất đồng quan điểm. Trong việc nhỏ vẫn có thể đạt được kết quả, việc lớn cần tìm điểm tương đồng.',
    tuongTruyen: 'Lửa bốc lên cao, Nước đầm chảy xuống thấp, người quân tử nhìn nhận sự khác biệt để tìm kiếm sự hòa hợp đa dạng.',
    meaning: 'Gặp sự bất đồng quan điểm, hiểu lầm trong công việc hoặc tình cảm. Hãy tôn trọng sự khác biệt và tìm điểm chung thay vì tranh cãi.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Ngựa chạy mất không cần đuổi theo nó sẽ tự về, gặp kẻ xấu tránh né thì không có lỗi.',
      2: 'Hào 2 (Cửu Nhị): Tình cờ gặp gỡ tri kỷ trong con ngõ hẹp, không có sai lầm.',
      3: 'Hào 3 (Lục Tam): Xe bị kéo lùi, trâu bị cản, người bị cắt tóc gọt mũi; đầu khó khăn nhưng sau gặp kết cục tốt đẹp.',
      4: 'Hào 4 (Cửu Tứ): Cô độc giữa chốn bất đồng nhưng gặp được người bạn chân thành cùng chí hướng, tai qua nạn khỏi.',
      5: 'Hào 5 (Lục Ngũ): Người cùng chí hướng cắn xuyên qua lớp vỏ ngăn cách, cùng nhau tiến bước thì có lỗi gì đâu.',
      6: 'Hào 6 (Thượng Cửu): Nhìn nhầm bạn thành heo bùn, quỷ dữ giương cung bắn, sau nhận ra chân tướng buông cung vui vẻ hòa hợp.'
    }
  },
  39: {
    number: 39,
    name: 'Thủy Sơn Kiển (Khó Khăn Hiểm Trở)',
    chinese: '蹇',
    symbol: 'Khảm (Nước) trên Cấn (Núi)',
    element: 'Thủy',
    thoanTu: 'Kiển là bước đi khập khiễng, trước mặt là nước sâu sau lưng là núi cao. Đi về phía Tây Nam có lợi, tìm đại nhân chỉ lối.',
    tuongTruyen: 'Trên núi có nước hiểm trở, người quân tử tự soi xét bản thân để bồi dưỡng đức hạnh.',
    meaning: 'Đang gặp bế tắc, đường đi gập ghềnh hiểm trở. Đừng cố đâm đầu về phía trước; hãy dừng lại xem xét bản thân và tìm kiếm quý nhân trợ giúp.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Tiến lên gặp gian khó hiểm trở, biết dừng lại ở yên thì được ngợi khen.',
      2: 'Hào 2 (Lục Nhị): Quản gia gặp gian khó không phải vì lỗi của mình mà vì lòng trung thành gánh vác.',
      3: 'Hào 3 (Cửu Tam): Tiến lên gặp hiểm nguy, quay trở lại bến đỗ an toàn thì được người nhà đón nhận mừng vui.',
      4: 'Hào 4 (Lục Tứ): Tiến lên gặp trắc trở, quay lại liên kết cùng bạn bè đồng đội vững mạnh.',
      5: 'Hào 5 (Cửu Ngũ): Giữa cơn đại nạn khó khăn trùng điệp, có bạn bè tri kỷ đến ứng cứu kịp thời.',
      6: 'Hào 6 (Thượng Lục): Tiến lên gặp nguy nan, quay lại đạt được thành tựu lớn lao, tìm gặp đại nhân chỉ lối thì đại cát.'
    }
  },
  40: {
    number: 40,
    name: 'Lôi Thủy Giải (Giải Tỏa Tháo Gỡ)',
    chinese: '解',
    symbol: 'Chấn (Sấm) trên Khảm (Nước)',
    element: 'Mộc',
    thoanTu: 'Giải là cởi trói, tháo gỡ khó khăn. Như cơn mưa rào mùa xuân giải tỏa khô hạn. Không có việc thì quay về an nghỉ, có việc thì hành động sớm.',
    tuongTruyen: 'Sấm sét và Mưa tuôn trút xuống, người quân tử tha thứ lỗi lầm và khoan hồng cho kẻ có tội.',
    meaning: 'Nút thắt được tháo gỡ, hiểm nguy tan biến, thời kỳ phục hồi và tha thứ bắt đầu. Hãy nhanh chóng hành động để nắm bắt cơ hội mới.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Khó khăn vừa tan biến, ở yên tĩnh dưỡng thì không mắc sai lầm.',
      2: 'Hào 2 (Cửu Nhị): Bắn được ba con cáo nơi đồng nội, thu được mũi tên vàng ròng, kiên định giữ đạo chính thì cát lợi.',
      3: 'Hào 3 (Lục Tam): Gánh nặng trên lưng lại ngồi chễm chệ trên xe quý, thu hút kẻ cướp dòm ngó.',
      4: 'Hào 4 (Cửu Tứ): Tháo bỏ sự ràng buộc nơi ngón chân cái, bạn bè chân thành sẽ tự tìm đến tin cậy.',
      5: 'Hào 5 (Lục Ngũ): Bậc quân tử dứt khoát giải tỏa kẻ tiểu nhân ra khỏi tổ chức, đại cát.',
      6: 'Hào 6 (Thượng Lục): Vua bắn trúng con chim ưng hung dữ đậu trên tường thành cao, trừ dẹp mối họa lớn.'
    }
  },
  41: {
    number: 41,
    name: 'Sơn Trạch Tổn (Bớt Dưới Thêm Trên)',
    chinese: '損',
    symbol: 'Cấn (Núi) trên Đoài (Hồ)',
    element: 'Thổ',
    thoanTu: 'Tổn là bớt đi sự ham muốn, bớt dưới thêm trên. Có lòng thành thật thì đại cát, dâng lễ chỉ bằng hai giỏ tre nhỏ cũng được thần linh chứng giám.',
    tuongTruyen: 'Dưới chân núi có đầm sâu, người quân tử nén cơn giận và kiềm chế lòng tham muốn.',
    meaning: 'Học cách cho đi, tinh giản chi tiêu, cắt giảm những điều thừa thãi để tập trung vào giá trị cốt lõi. Chịu thiệt thòi nhỏ để được lợi ích lớn.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Xong việc của mình nhanh chóng đến giúp người khác, cân nhắc không làm tổn hại sức mình thì không lỗi.',
      2: 'Hào 2 (Cửu Nhị): Giúp người mà không làm tổn hại đến phẩm giá của mình, giữ đạo chính thì cát lợi.',
      3: 'Hào 3 (Lục Tam): Ba người cùng đi ắt bớt một người, một người đi lẻ loi ắt gặp được bạn tri âm.',
      4: 'Hào 4 (Lục Tứ): Giảm bớt tật xấu và căn bệnh của mình khiến người khác vui mừng giúp đỡ, không lỗi.',
      5: 'Hào 5 (Lục Ngũ): Được thần linh ban cho đôi mai rùa báu trị giá mười con rùa, không thể chối từ, đại cát.',
      6: 'Hào 6 (Thượng Cửu): Làm lợi cho muôn người mà không làm tổn hại đến mình, thu phục được lòng dân bốn cõi.'
    }
  },
  42: {
    number: 42,
    name: 'Phong Lôi Ích (Tăng Thêm Lợi Ích)',
    chinese: '益',
    symbol: 'Tốn (Gió) trên Chấn (Sấm)',
    element: 'Mộc',
    thoanTu: 'Ích là tăng thêm, bớt trên thêm dưới cho dân chúng. Khởi sự hành động đại cát, vượt sông lớn thành công.',
    tuongTruyen: 'Gió và Sấm cùng tăng cường sức mạnh cho nhau, người quân tử thấy điều thiện thì làm theo, thấy lỗi lầm thì sửa đổi.',
    meaning: 'Thời kỳ phát triển thịnh vượng, gia tăng thu nhập, mở mang tri thức và nhận được sự trợ lực lớn lao từ xung quanh.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Được tăng cường sức mạnh để làm nên đại sự vẻ vang, đại cát không tì vết.',
      2: 'Hào 2 (Lục Nhị): Được ban cho đôi rùa báu mười con không thể từ chối, giữ lòng thành kính muôn việc hanh thông.',
      3: 'Hào 3 (Lục Tam): Được hưởng lợi ích ngay trong cơn hoạn nạn hiểm nghèo, giữ lòng trung thực báo cáo minh bạch thì không lỗi.',
      4: 'Hào 4 (Lục Tứ): Làm trung gian báo cáo việc công minh được vua tin cậy trao quyền di dời kinh đô.',
      5: 'Hào 5 (Cửu Ngũ): Có tấm lòng nhân từ thương dân không cần hỏi cũng biết là đại cát đại lợi.',
      6: 'Hào 6 (Thượng Cửu): Chỉ lo vơ vét lợi ích cho riêng mình mà không sẻ chia cho ai, bị người đời ghét bỏ tấn công.'
    }
  },
  43: {
    number: 43,
    name: 'Trạch Thiên Quải (Quyết Đoán Loại Bỏ)',
    chinese: '夬',
    symbol: 'Đoài (Hồ) trên Càn (Trời)',
    element: 'Kim',
    thoanTu: 'Quải là quyết liệt trừ bỏ cái xấu. Cần công khai tuyên bố rõ ràng nơi triều đình, không dùng bạo lực mù quáng.',
    tuongTruyen: 'Đầm nước dâng cao lên tận trời, người quân tử ban phát bổng lộc cho cấp dưới mà không tích trữ của riêng.',
    meaning: 'Thời điểm cần sự dứt khoát, cắt đứt dứt điểm những thói quen xấu, mối quan hệ độc hại hoặc các dự án không hiệu quả.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Hăng hái ở ngón chân vội vã tiến lên khi chưa đủ sức ắt gặp sai lầm thất bại.',
      2: 'Hào 2 (Cửu Nhị): Luôn cảnh giác hô hào báo động dẫu đêm tối có giặc cũng không sợ hãi.',
      3: 'Hào 3 (Cửu Tam): Gương mặt đầy vẻ cương quyết tiến bước dẫu gặp mưa gió bị người hiểu lầm nhưng vô tội.',
      4: 'Hào 4 (Cửu Tứ): Mông không còn thịt bước đi lảo đảo, nếu biết nghe lời khuyên can thì không đến nỗi hối hận.',
      5: 'Hào 5 (Cửu Ngũ): Nhổ cỏ rau sam dứt khoát giữ vững đạo trung chính thì không có lỗi.',
      6: 'Hào 6 (Thượng Lục): Đến cùng không có tiếng kêu cứu, kẻ tiểu nhân bị trừ tiệt nhưng nếu kiêu ngạo sẽ gặp nguy.'
    }
  },
  44: {
    number: 44,
    name: 'Thiên Phong Cấu (Gặp Gỡ Bất Ngờ)',
    chinese: '姤',
    symbol: 'Càn (Trời) trên Tốn (Gió)',
    element: 'Kim',
    thoanTu: 'Cấu là gặp gỡ bất ngờ, một hào âm mới sinh dưới năm hào dương. Người phụ nữ quá mạnh bạo chớ vội cưới làm vợ.',
    tuongTruyen: 'Dưới trời có gió thổi lan tỏa khắp cõi, đấng minh vương ban bố mệnh lệnh tuyên cáo bốn phương.',
    meaning: 'Cảnh giác trước những cám dỗ bất ngờ, những lời đường mật hoặc các cơ hội "việc nhẹ lương cao" tiềm ẩn nhiều cạm bẫy.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Buộc chặt hãm lại bằng thắng xe bằng đồng, ngăn chặn mầm mống xấu ngay từ đầu.',
      2: 'Hào 2 (Cửu Nhị): Trong bếp có cá không lỗi, đừng để lọt ra cho khách lạ kẻo sinh chuyện.',
      3: 'Hào 3 (Cửu Tam): Mông không còn thịt bước đi khó khăn, tuy nguy hiểm nhưng không mắc lỗi lớn.',
      4: 'Hào 4 (Cửu Tứ): Trong bếp không có cá, xa rời dân chúng ắt chuốc lấy điềm hung.',
      5: 'Hào 5 (Cửu Ngũ): Dùng lá dưa bọc quả dưa giấu tài năng đức độ, trời sẽ tự ban phúc lành rơi xuống tay.',
      6: 'Hào 6 (Thượng Cửu): Gặp gỡ bằng sừng húc kiêu căng, chuốc lấy sự chê cười nhưng không nguy hại lớn.'
    }
  },
  45: {
    number: 45,
    name: 'Trạch Địa Tụy (Họp Mặt Tụ Tụ)',
    chinese: '萃',
    symbol: 'Đoài (Hồ) trên Khôn (Đất)',
    element: 'Kim',
    thoanTu: 'Tụy là tụ họp, đoàn kết quần chúng. Cần có người lãnh đạo đức độ, cúng tế thần linh và chuẩn bị vũ khí phòng ngừa biến cố.',
    tuongTruyen: 'Nước đầm tụ lại trên mặt đất, người quân tử sửa sang khí giới để phòng bị những biến cố bất ngờ.',
    meaning: 'Thời điểm hội tụ nhân tài, tụ họp gia đình, tổ chức sự kiện hoặc thành lập hội nhóm phát triển quy mô lớn.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Tụ họp nhưng lòng còn e ngại phân vân, cất tiếng kêu gọi bạn bè cùng chí hướng thì tai qua nạn khỏi.',
      2: 'Hào 2 (Lục Nhị): Được dẫn dắt đến tụ họp nhờ lòng chân thành, lễ vật đơn sơ cũng được phúc lành.',
      3: 'Hào 3 (Lục Tam): Muốn tụ họp mà thở dài than vãn vì chưa được chấp nhận, tiến lên kết giao thì không có lỗi.',
      4: 'Hào 4 (Cửu Tứ): Tụ họp thành công rực rỡ, đại cát không tì vết.',
      5: 'Hào 5 (Cửu Ngũ): Đứng ở vị trí trung tâm tụ họp muôn người tin phục, giữ đức bền lâu thì hối hận tiêu tan.',
      6: 'Hào 6 (Thượng Lục): Đứng ngoài cuộc tụ họp than khóc nước mắt đầm đìa, tuy buồn bã nhưng không có lỗi lớn.'
    }
  },
  46: {
    number: 46,
    name: 'Địa Phong Thăng (Thăng Tiến Dần Dần)',
    chinese: '升',
    symbol: 'Khôn (Đất) trên Tốn (Gió/Cây)',
    element: 'Mộc',
    thoanTu: 'Thăng là cây mọc từ lòng đất vươn lên cao, thăng tiến từng bước vững chắc. Đi về phương Nam đại cát, không lo âu.',
    tuongTruyen: 'Trong lòng đất mọc lên cây xanh tốt, người quân tử tích lũy từng đức hạnh nhỏ để tạo nên sự nghiệp vĩ đại.',
    meaning: 'Thời kỳ thăng quan tiến chức, học hành đỗ đạt, công việc tiến triển đều đặn từng bước một cách vững vàng.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Được mọi người tin tưởng đón nhận cùng thăng tiến, đại cát.',
      2: 'Hào 2 (Lục Nhị): Lòng thành thật dẫu lễ mọn dâng tế mùa hạ cũng được thần linh ban phúc.',
      3: 'Hào 3 (Cửu Tam): Thăng tiến vào vùng đất trống thênh thang không gặp bất cứ trở ngại nào.',
      4: 'Hào 4 (Lục Tứ): Vua ban thưởng phong tặng nơi núi Kỳ Sơn danh tiếng, cát lợi không tì vết.',
      5: 'Hào 5 (Lục Ngũ): Thăng tiến từng bước vững vàng theo bậc thang danh vọng, đại cát.',
      6: 'Hào 6 (Thượng Lục): Thăng tiến trong đêm tối mù quáng, cần giữ vững lòng trung chính chớ tham vọng quá đà.'
    }
  },
  47: {
    number: 47,
    name: 'Trạch Thủy Khốn (Khốn Đốn Gian Nan)',
    chinese: '困',
    symbol: 'Đoài (Hồ) trên Khảm (Nước)',
    element: 'Kim',
    thoanTu: 'Khốn là cạn kiệt, nước đầm bị rò rỉ chảy hết xuống đáy. Người quân tử dẫu khốn cùng vẫn kiên trinh, lời nói lúc này không ai tin.',
    tuongTruyen: 'Đầm nước khô cạn không còn giọt nước, người quân tử xả thân vì nghĩa giữ trọn chí khí.',
    meaning: 'Thời kỳ thử thách bản lĩnh tột cùng, tài chính eo hẹp hoặc cô lập. Đừng than vãn giải thích; hãy nhẫn nại hành động âm thầm vượt qua.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Ngồi khốn đốn dưới gốc cây khô trơ trụi, đi vào thung lũng tối tăm ba năm không thấy ánh sáng.',
      2: 'Hào 2 (Lục Cửu): Khốn đốn trong rượu thịt tiệc tùng, bỗng có người mang áo đỏ đến ban thưởng, cúng tế thần linh thì cát lành.',
      3: 'Hào 3 (Lục Tam): Khốn đốn bên tảng đá, dựa vào bụi gai góc, về đến nhà không thấy vợ đâu, gặp điều hung.',
      4: 'Hào 4 (Cửu Tứ): Đến chậm rãi trong cỗ xe mạ vàng lộng lẫy, dẫu có trắc trở nhưng cuối cùng đạt được thành quả.',
      5: 'Hào 5 (Cửu Ngũ): Bị cắt mũi gọt chân khốn khổ, nhưng được quan chức áo đỏ cứu viện, từ từ thoát nạn.',
      6: 'Hào 6 (Thượng Lục): Bị trói buộc bởi dây leo chằng chịt, động đậy là lo sợ; nhưng nếu dũng cảm cất bước thì hối hận tiêu tan.'
    }
  },
  48: {
    number: 48,
    name: 'Thủy Phong Tỉnh (Giếng Nước Nuôi Đời)',
    chinese: '井',
    symbol: 'Khảm (Nước) trên Tốn (Gió/Gỗ)',
    element: 'Mộc',
    thoanTu: 'Tỉnh là giếng nước. Làng xóm có thể dời đổi nhưng giếng nước ngàn đời không đổi, nuôi dưỡng vạn người không bao giờ cạn kiệt.',
    tuongTruyen: 'Trên cây gỗ có nước múc lên, người quân tử an ủi động viên dân chúng và khuyến khích giúp đỡ lẫn nhau.',
    meaning: 'Khai thác nội lực tiềm ẩn, nâng cao chuyên môn cốt lõi. Nguồn lực của bạn rất dồi dào, cần có phương pháp khai thác đúng cách.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Giếng bùn lầy không thể uống được nước, giếng hoang chim chóc cũng chẳng thèm đậu.',
      2: 'Hào 2 (Cửu Nhị): Lòng giếng sâu bắn trúng cá nhỏ, thùng múc nước bị vỡ rò rỉ.',
      3: 'Hào 3 (Cửu Tam): Giếng nước đã được vét trong veo nhưng không ai múc uống làm lòng người đau xót, nếu được vua dùng thì đại phúc.',
      4: 'Hào 4 (Lục Tứ): Xây lát lại thành giếng vững chắc, tạm thời chưa dùng nhưng không có lỗi.',
      5: 'Hào 5 (Cửu Ngũ): Nước giếng trong veo, mát ngọt như suối ngọc nuôi dưỡng muôn người.',
      6: 'Hào 6 (Thượng Lục): Miệng giếng mở rộng không đậy nắp, ai đến múc cũng được, đại cát đại lợi.'
    }
  },
  49: {
    number: 49,
    name: 'Trạch Hỏa Cách (Cải Cách Thay Đổi)',
    chinese: '革',
    symbol: 'Đoài (Hồ) trên Ly (Lửa)',
    element: 'Thủy',
    thoanTu: 'Cách là cách mạng, lột xác đổi mới. Đến đúng ngày hẹn mới khởi sự thì lòng người tin phục, đại hanh thông, hối hận tiêu tan.',
    tuongTruyen: 'Trong đầm hồ có ngọn lửa bùng cháy, người quân tử chỉnh đốn lịch pháp và làm sáng tỏ bốn mùa.',
    meaning: 'Thời điểm chín muồi để thay đổi toàn diện: đổi mới công nghệ, chuyển đổi mô hình kinh doanh, thay đổi tư duy và lối sống.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Dùng da bò vàng buộc chặt lại, thời cơ chưa tới chớ vội manh động.',
      2: 'Hào 2 (Lục Nhị): Đến ngày hẹn khởi sự tiến hành đổi mới thì đại cát không có sai lầm.',
      3: 'Hào 3 (Cửu Tam): Bàn bạc việc cải cách ba lần chín chắn rồi mới tiến hành thì có lợi.',
      4: 'Hào 4 (Cửu Tứ): Lòng tin đã vững chắc, thay đổi mệnh lệnh đạt được thành công rực rỡ.',
      5: 'Hào 5 (Cửu Ngũ): Bậc đại nhân thay đổi như cọp lột xác vằn vện rực rỡ, không cần bói cũng biết là đại cát.',
      6: 'Hào 6 (Thượng Lục): Người quân tử đổi mới như báo thay lông đẹp đẽ, kẻ tiểu nhân chỉ đổi nét mặt thuận theo.'
    }
  },
  50: {
    number: 50,
    name: 'Hỏa Phong Đỉnh (Đỉnh Đồng Vững Vàng)',
    chinese: '鼎',
    symbol: 'Ly (Lửa) trên Tốn (Gió/Gỗ)',
    element: 'Mộc',
    thoanTu: 'Đỉnh là vạc đồng nấu đồ ăn tế thần và nuôi người hiền đức, tượng trưng cho quyền lực vững chãi và sự hưng thịnh tột bậc.',
    tuongTruyen: 'Trên cây gỗ có lửa cháy rực rỡ, người quân tử giữ vị trí vững vàng và thuận theo mệnh trời.',
    meaning: 'Thời vận đại cát! Sự nghiệp vững như bàn thạch, tài năng được trọng dụng, đời sống vật chất và tinh thần viên mãn phong phú.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Lật úp vạc đồng đổ hết cặn bã dơ bẩn cũ đi, lấy vợ lẽ sinh con trai quý, không có lỗi.',
      2: 'Hào 2 (Cửu Nhị): Trong vạc có thức ăn thơm ngon, người khác ghen ghét nhưng không hại được mình, cát lành.',
      3: 'Hào 3 (Cửu Tam): Quai vạc bị gãy không bưng đi được, thức ăn ngon chưa được dùng, mưa rơi làm dịu mát thì cát lợi.',
      4: 'Hào 4 (Cửu Tứ): Chân vạc bị gãy làm đổ hết thức ăn của vua, chuốc lấy hình phạt ô nhục.',
      5: 'Hào 5 (Lục Ngũ): Vạc có quai màu vàng gắn khoen ngọc quý, giữ đạo trung chính thì đại cát.',
      6: 'Hào 6 (Thượng Cửu): Vạc có khoen ngọc bích sáng ngời, muôn sự đại cát đại lợi, không việc gì là không hanh thông.'
    }
  },
  51: {
    number: 51,
    name: 'Thuần Chấn (Sấm Động Giật Mình)',
    chinese: '震',
    symbol: 'Chấn trên Chấn dưới (Sấm trên Sấm dưới)',
    element: 'Mộc',
    thoanTu: 'Chấn là sấm nổ vang rền khiến người giật mình sợ hãi, sau đó cười nói vui vẻ. Tiếng sấm vang xa trăm dặm mà không làm rơi chén rượu tế.',
    tuongTruyen: 'Sấm nổ liên hồi vang dội, người quân tử biết sợ hãi mà tự tu dưỡng sửa đổi bản thân.',
    meaning: 'Biến cố bất ngờ xảy ra làm rúng động tâm lý. Giữ được sự bình tĩnh, điềm đạm trước cơn bão táp thì sẽ biến nguy thành cơ hội lớn.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Sấm nổ giật mình hoảng sợ, sau đó cười nói hân hoan, cát lành.',
      2: 'Hào 2 (Lục Nhị): Sấm nổ dữ dội làm mất của cải báu vật, leo lên chín gò cao lánh nạn, bảy ngày của cải tự quay về.',
      3: 'Hào 3 (Lục Tam): Sấm nổ kinh hoàng làm tâm trí hoảng loạn, hành động sửa mình thì tai qua nạn khỏi.',
      4: 'Hào 4 (Cửu Tứ): Tiếng sấm bị lún chìm vào bùn lầy không vang xa được.',
      5: 'Hào 5 (Lục Ngũ): Sấm động lui tới liên hồi nguy hiểm, giữ vững vị trí trung tâm xử lý thì không tổn thất việc lớn.',
      6: 'Hào 6 (Thượng Lục): Sấm nổ làm chấn động mắt nhìn quanh co sợ hãi, chưa chạm tới thân mình mà tới hàng xóm thì dừng lại phòng ngừa.'
    }
  },
  52: {
    number: 52,
    name: 'Thuần Cấn (Núi Tĩnh Lặng)',
    chinese: '艮',
    symbol: 'Cấn trên Cấn dưới (Núi trên Núi dưới)',
    element: 'Thổ',
    thoanTu: 'Cấn là dừng lại, tĩnh lặng như ngọn núi. Dừng ở sau lưng không thấy thân mình, đi trong sân không thấy người, không có lỗi.',
    tuongTruyen: 'Núi non trùng điệp đứng yên bất động, người quân tử suy nghĩ không vượt ra ngoài bổn phận của mình.',
    meaning: 'Học nghệ thuật buông bỏ và tĩnh lặng. Dừng lại đúng lúc, không can thiệp vào những việc không thuộc trách nhiệm của mình để tâm an trí sáng.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Dừng lại ở ngón chân cái ngay từ lúc chưa bước đi, không có lỗi, kiên trì thì tốt.',
      2: 'Hào 2 (Lục Nhị): Dừng lại ở bắp chân không cứu được người đi trước, trong lòng không vui.',
      3: 'Hào 3 (Cửu Tam): Dừng lại ở thắt lưng làm cột sống cứng đờ, nguy hiểm nghẹt thở trong lòng.',
      4: 'Hào 4 (Lục Tứ): Dừng lại ở phần thân mình, giữ tâm bất động thì không có sai lầm.',
      5: 'Hào 5 (Lục Ngũ): Dừng lại ở lời ăn tiếng nói có trật tự ngăn nắp, mọi hối hận đều tan biến.',
      6: 'Hào 6 (Thượng Cửu): Đạt đến đỉnh cao của sự tĩnh lặng đôn hậu trọn vẹn, đại cát.'
    }
  },
  53: {
    number: 53,
    name: 'Phong Sơn Tiệm (Tiến Bước Vững Vàng)',
    chinese: '漸',
    symbol: 'Tốn (Gió/Cây) trên Cấn (Núi)',
    element: 'Mộc',
    thoanTu: 'Tiệm là tiến bước dần dần từng bước như chim nhạn bay về núi, người con gái lấy chồng theo đúng lễ nghi thì đại cát.',
    tuongTruyen: 'Trên núi có cây cối lớn dần từng ngày, người quân tử trau dồi đức hạnh làm đẹp phong tục xã hội.',
    meaning: 'Thành công bền vững cần có thời gian và sự kiên trì tích lũy. Tuyệt đối tránh đốt cháy giai đoạn hay dục tốc bất đạt.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Chim nhạn tiến dần đến bờ nước, kẻ nhỏ tuổi có chút điều tiếng xì xào nhưng không có lỗi lớn.',
      2: 'Hào 2 (Lục Nhị): Chim nhạn tiến đến tảng đá bằng phẳng, ăn uống no đủ thảnh thơi cát lành.',
      3: 'Hào 3 (Cửu Tam): Chim nhạn tiến lên gò đất cao hiểm trở, người chồng đi chinh chiến chưa về, người vợ mang thai chưa sinh, cần giữ đạo phòng thủ.',
      4: 'Hào 4 (Lục Tứ): Chim nhạn tiến đậu trên cành cây bằng phẳng dẫu chông chênh nhưng tìm được chỗ đậu an toàn.',
      5: 'Hào 5 (Cửu Ngũ): Chim nhạn tiến lên đỉnh núi cao, ba năm người vợ không sinh con nhưng cuối cùng sum họp trọn vẹn, đại cát.',
      6: 'Hào 6 (Thượng Cửu): Chim nhạn bay vút lên chín tầng mây xanh để lại lông vũ làm khuôn mẫu lễ nghi muôn đời.'
    }
  },
  54: {
    number: 54,
    name: 'Lôi Trạch Quy Muội (Gả Con Gái Nhỏ)',
    chinese: '歸妹',
    symbol: 'Chấn (Sấm) trên Đoài (Hồ)',
    element: 'Kim',
    thoanTu: 'Quy Muội là gả con gái về nhà chồng khi chưa đủ lễ nghi trọn vẹn. Khởi sự hành động lúc này gặp hung họa, không việc gì có lợi.',
    tuongTruyen: 'Trên đầm hồ có sấm động làm nước xao xuyến, người quân tử nhìn thấu điểm kết thúc để biết điều khởi đầu.',
    meaning: 'Cảnh báo về sự việc diễn ra không đúng quy trình, xuất phát từ cảm xúc bốc đồng hoặc vị thế bất lợi. Cần thận trọng chớ vội vàng cam kết.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Gả người em gái làm nàng hầu phụ giúp, người què chân vẫn đi được, tiến lên cát lành.',
      2: 'Hào 2 (Cửu Nhị): Người một mắt vẫn nhìn thấy đường, người ẩn dật giữ trọn lòng trinh bạch thì có lợi.',
      3: 'Hào 3 (Lục Tam): Chờ đợi gả đi mà không thành, quay về làm nàng hầu phụ giúp.',
      4: 'Hào 4 (Cửu Tứ): Trì hoãn việc gả đi chờ thời điểm thích hợp và người xứng đáng thì sau gặp duyên lành.',
      5: 'Hào 5 (Lục Ngũ): Vua gả em gái áo cưới giản dị không đẹp bằng nàng hầu, vầng trăng gần tròn đem lại phúc lớn.',
      6: 'Hào 6 (Thượng Lục): Người phụ nữ bưng giỏ không có hoa quả, người đàn ông mổ dê không có máu, không có kết quả gì.'
    }
  },
  55: {
    number: 55,
    name: 'Lôi Hỏa Phong (Thịnh Vượng Đầy Đủ)',
    chinese: '豐',
    symbol: 'Chấn (Sấm) trên Ly (Lửa)',
    element: 'Thủy',
    thoanTu: 'Phong là thịnh vượng tột bậc như mặt trời đứng bóng lúc giữa trưa. Chớ nên lo lắng khi vầng trăng tròn rồi sẽ khuyết, hãy tận hưởng và chia sẻ.',
    tuongTruyen: 'Sấm và Chớp cùng nổi lên rực rỡ uy phong, người quân tử phân xử kiện cáo công minh và thực thi pháp luật nghiêm minh.',
    meaning: 'Thời kỳ đỉnh cao của thành công, tài lộc dồi dào, danh tiếng vang dội. Hãy khiêm nhường, chia sẻ thành quả và chuẩn bị kế hoạch duy trì bền vững.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Gặp được bạn cùng đẳng cấp tài năng, mười ngày cùng hợp tác không có lỗi.',
      2: 'Hào 2 (Lục Nhị): Màn che rủ xuống giữa trưa thấy sao Bắc Đẩu, bị nghi ngờ nhưng dùng lòng chân thành cảm hóa thì cát lành.',
      3: 'Hào 3 (Cửu Tam): Màn che phủ kín thấy sao nhỏ giữa trưa, gãy cánh tay phải nhưng không mắc lỗi.',
      4: 'Hào 4 (Cửu Tứ): Màn che phủ thấy sao Bắc Đẩu giữa trưa, gặp được người chủ cùng chí hướng thì cát lợi.',
      5: 'Hào 5 (Lục Ngũ): Thu hút được người hiền tài đến phò tá, có vinh quang và nhận được nhiều lời ngợi khen, đại cát.',
      6: 'Hào 6 (Thượng Lục): Nhà cửa nguy nga đồ sộ nhưng tự cô lập bản thân, ngó qua cửa không thấy bóng người, ba năm cô độc gặp hung.'
    }
  },
  56: {
    number: 56,
    name: 'Hỏa Sơn Lữ (Lữ Khách Đơn Độc)',
    chinese: '旅',
    symbol: 'Ly (Lửa) trên Cấn (Núi)',
    element: 'Hỏa',
    thoanTu: 'Lữ là đi xa, khách tha hương nơi đất khách quê người. Trong việc nhỏ thì hanh thông, giữ đạo chính thì gặp điều lành.',
    tuongTruyen: 'Trên núi có ngọn lửa cháy lan nhanh chóng, người quân tử thận trọng trong việc dùng hình phạt và không kéo dài ngục tù.',
    meaning: 'Thời điểm đi xa, chuyển chỗ ở, thay đổi môi trường làm việc hoặc cảm thấy lạc lõng. Cần khiêm tốn, hòa nhã và tôn trọng phong tục nơi mới.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Khách tha hương vụn vặt tính toán so đo những điều nhỏ nhặt, chuốc lấy tai họa.',
      2: 'Hào 2 (Lục Nhị): Khách tìm được quán trọ an toàn, trong túi có tiền bạc, có tôi tớ trung thành giúp việc, cát lành.',
      3: 'Hào 3 (Cửu Tam): Làm cháy quán trọ của mình, mất lòng tôi tớ trung thành, rơi vào cảnh nguy hiểm khốn cùng.',
      4: 'Hào 4 (Cửu Tứ): Khách tìm được nơi dừng chân có rìu sắc phòng thân, nhưng lòng dạ chưa thật an yên.',
      5: 'Hào 5 (Lục Ngũ): Bắn trúng chim trĩ mất một mũi tên, cuối cùng nhận được tước vị và lời khen thưởng.',
      6: 'Hào 6 (Thượng Cửu): Chim làm cháy tổ của mình trên cành cao, trước cười vui sau khóc than mất con bò ở nơi đất khách, gặp hung.'
    }
  },
  57: {
    number: 57,
    name: 'Thuần Tốn (Gió Thuận Khiêm Nhường)',
    chinese: '巽',
    symbol: 'Tốn trên Tốn dưới (Gió trên Gió dưới)',
    element: 'Mộc',
    thoanTu: 'Tốn là gió thổi mềm mại luồn lách khắp nơi, khiêm nhường phục tùng. Hanh thông trong việc nhỏ, có nơi để đi tới, gặp gỡ đại nhân thì cát.',
    tuongTruyen: 'Gió thổi tiếp nối nhau không ngừng, người quân tử phổ biến mệnh lệnh và hoàn thành công việc chu đáo.',
    meaning: 'Dùng sự mềm mỏng, linh hoạt và kiên trì thẩm thấu để giải quyết vấn đề. Nước chảy đá mòn, sự nhẹ nhàng sẽ chiến thắng sự cứng nhắc.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Tiến lui ngập ngừng bất định, có chí khí của bậc dũng sĩ quân nhân thì có lợi.',
      2: 'Hào 2 (Lục Nhị): Luồn cúi dưới gầm giường, nhờ thầy phù thủy cúng tế giải trừ thì cát lợi không có lỗi.',
      3: 'Hào 3 (Cửu Tam): Quá nhún nhường luồn cúi nhiều lần thành ra đê tiện, chuốc lấy sự xấu hổ.',
      4: 'Hào 4 (Lục Tứ): Hối hận tiêu tan, đi săn nơi đồng nội bắt được ba loại thú quý.',
      5: 'Hào 5 (Cửu Ngũ): Giữ lòng trung chính thì cát lợi, trước ba ngày suy xét sau ba ngày thực thi mệnh lệnh đổi mới.',
      6: 'Hào 6 (Thượng Cửu): Luồn cúi dưới gầm giường đánh mất cả vũ khí phòng thân, gặp điều hung.'
    }
  },
  58: {
    number: 58,
    name: 'Thuần Đoài (Đầm Hồ Vui Vẻ)',
    chinese: '兌',
    symbol: 'Đoài trên Đoài dưới (Đầm trên Đầm dưới)',
    element: 'Kim',
    thoanTu: 'Đoài là vui tươi, hoan hỷ, giao tiếp ngọt ngào. Hanh thông, giữ lòng chính trực thì niềm vui mới bền lâu.',
    tuongTruyen: 'Hai đầm hồ nối liền tưới mát cho nhau, người quân tử cùng bạn bè trao đổi học tập và rèn luyện đạo đức.',
    meaning: 'Niềm vui trong giao tiếp, thảo luận học thuật, đàm phán thành công và các hoạt động giải trí lành mạnh kết nối lòng người.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Niềm vui hòa nhã, thanh thản tự tại từ nội tâm, cát lành.',
      2: 'Hào 2 (Cửu Nhị): Niềm vui chân thành xuất phát từ lòng thành tín, hối hận tiêu tan.',
      3: 'Hào 3 (Lục Tam): Đi tìm kiếm niềm vui khoái lạc từ bên ngoài một cách hời hợt, chuốc lấy điềm hung.',
      4: 'Hào 4 (Cửu Tứ): Cân nhắc giữa niềm vui cao thượng và thú vui tầm thường, dứt khoát chọn điều thiện thì có niềm vui lớn.',
      5: 'Hào 5 (Cửu Ngũ): Tin tưởng vào kẻ tiểu nhân lừa gạt sẽ gặp nguy hiểm.',
      6: 'Hào 6 (Thượng Lục): Dẫn dắt lôi kéo người khác cùng vui vẻ, chưa phân định rõ tốt xấu.'
    }
  },
  59: {
    number: 59,
    name: 'Phong Thủy Hoán (Tan Biến Tiêu Tan)',
    chinese: '渙',
    symbol: 'Tốn (Gió) trên Khảm (Nước)',
    element: 'Hỏa',
    thoanTu: 'Hoán là gió thổi tan băng giá, tan biến ngăn cách bế tắc. Vua đến đền thờ tổ tiên cúng tế, vượt sông lớn thành công.',
    tuongTruyen: 'Gió thổi lướt trên mặt nước làm sóng tan biến, tiên vương dâng lễ tế thần linh và lập đền thờ.',
    meaning: 'Hóa giải hiểu lầm, xua tan âu lo, giải phóng những áp lực dồn nén lâu ngày. Thời điểm thuận lợi để kết nối lại tình cảm và hợp tác.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Dùng sức mạnh của con ngựa khỏe cứu thoát sự ly tán từ sớm, cát lành.',
      2: 'Hào 2 (Lục Nhị): Khi gặp sự ly tán chạy đến nương tựa vào chỗ dựa vững chắc, hối hận tiêu tan.',
      3: 'Hào 3 (Lục Tam): Quên thân mình vì đại nghĩa cứu vãn sự ly tán của tập thể thì không có gì ân hận.',
      4: 'Hào 4 (Lục Tứ): Phá tan sự chia rẽ bè phái trong đám đông để đạt được sự đại đoàn kết lớn lao, đại cát.',
      5: 'Hào 5 (Cửu Ngũ): Mệnh lệnh của vua ban ra như mồ hôi toát ra giải trừ cơn sốt làm tan biến mọi hoạn nạn, không có lỗi.',
      6: 'Hào 6 (Thượng Cửu): Tránh xa tổn hại đổ máu và lánh xa nỗi hiểm nguy sợ hãi thì không có sai lầm.'
    }
  },
  60: {
    number: 60,
    name: 'Thủy Trạch Tiết (Tiết Chế Ngăn Nắp)',
    chinese: '節',
    symbol: 'Khảm (Nước) trên Đoài (Hồ)',
    element: 'Thủy',
    thoanTu: 'Tiết là tiết chế, chừng mực, giới hạn. Tiết chế hợp lý thì hanh thông, tiết chế quá cay nghiệt khắt khe thì không thể duy trì bền lâu.',
    tuongTruyen: 'Trên đầm hồ có nước chứa đựng đúng dung tích, người quân tử chế định số lượng quy tắc và bàn về đức hạnh.',
    meaning: 'Cần có kế hoạch quản lý tài chính, thời gian và năng lượng một cách khoa học. Biết điểm dừng và sống có kỷ luật điều độ.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Không bước chân ra ngoài cửa ngõ, biết dừng lại đúng lúc thì không mắc sai lầm.',
      2: 'Hào 2 (Cửu Nhị): Cửa đã mở mà không chịu bước ra ngoài hành động kịp thời, lỡ mất cơ hội gặp hung.',
      3: 'Hào 3 (Lục Tam): Không biết tiết chế bản thân để buông tuồng phóng túng, sẽ phải than khóc hối hận.',
      4: 'Hào 4 (Lục Tứ): An tâm vui vẻ thực hiện sự tiết chế đúng mực, hanh thông.',
      5: 'Hào 5 (Cửu Ngũ): Tiết chế ngọt ngào hợp lý mang lại điều tốt lành, tiến lên được người đời kính phục.',
      6: 'Hào 6 (Thượng Lục): Tiết chế quá khắc nghiệt khổ sở, kiên trì theo đuổi ắt gặp hung họa, nhưng biết hối cải thì ân hận tiêu tan.'
    }
  },
  61: {
    number: 61,
    name: 'Phong Trạch Trung Phu (Thành Tín Chân Thật)',
    chinese: '中孚',
    symbol: 'Tốn (Gió) trên Đoài (Hồ)',
    element: 'Thổ',
    thoanTu: 'Trung Phu là lòng thành thật tự đáy lòng cảm hóa được cả loài heo cá. Vượt sông lớn cát lợi, giữ đạo chính thì muôn sự thành.',
    tuongTruyen: 'Trên đầm hồ có gió thổi êm đềm, người quân tử xét xử án tình cẩn trọng và hoãn việc thi hành án chết.',
    meaning: 'Lòng chân thành, chữ Tín và sự minh bạch tuyệt đối là chìa khóa vạn năng giúp bạn chinh phục lòng người và gặt hái thành công.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Giữ sự tĩnh tâm chân thành ngay từ đầu thì cát lợi; nếu có toan tính riêng tư sẽ bất an trong lòng.',
      2: 'Hào 2 (Cửu Nhị): Hạc kêu trong bóng râm râm mát, con hạc non cất tiếng họa theo; ta có chén rượu ngon cùng bạn hiền nâng ly chia sẻ.',
      3: 'Hào 3 (Lục Tam): Tâm trạng bấp bênh khi đánh trống khi ngừng nghỉ, khi khóc lóc khi ca hát vì thiếu sự kiên định chân thành.',
      4: 'Hào 4 (Lục Tứ): Trăng gần tròn, ngựa kéo xe đi lẻ đôi không có lỗi, chuyên tâm theo đuổi người chính trực.',
      5: 'Hào 5 (Cửu Ngũ): Có lòng thành tín ràng buộc gắn kết muôn người như bện thừng, không có lỗi lầm.',
      6: 'Hào 6 (Thượng Cửu): Tiếng gà gáy rỗng tuếch vang lên tận trời mây không có thực chất, gặp điều hung.'
    }
  },
  62: {
    number: 62,
    name: 'Lôi Sơn Tiểu Quá (Vượt Nhỏ Khiêm Tốn)',
    chinese: '小過',
    symbol: 'Chấn (Sấm) trên Cấn (Núi)',
    element: 'Mộc',
    thoanTu: 'Tiểu Quá là vượt qua một chút việc nhỏ. Thích hợp làm việc nhỏ, chưa nên làm việc lớn. Chim bay nên hạ xuống thấp chớ bay vút lên cao.',
    tuongTruyen: 'Trên núi có tiếng sấm vang dội, người quân tử hành động hơi quá cẩn trọng, tang lễ hơi quá đau buồn, chi tiêu hơi quá tiết kiệm.',
    meaning: 'Thời điểm thích hợp để giải quyết các tiểu tiết, hồ sơ giấy tờ, rà soát chi tiết nhỏ. Khiêm tốn, hạ mình sẽ an toàn và đắc lợi.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Chim bay vút lên cao khi chưa đủ lông cánh ắt chuốc lấy tai họa.',
      2: 'Hào 2 (Lục Nhị): Đi qua ông nội mà gặp bà nội, không gặp vua mà gặp quan thừa tướng, không có lỗi.',
      3: 'Hào 3 (Cửu Tam): Không cẩn thận phòng bị từ xa để kẻ xấu thừa cơ ám hại, gặp điều hung.',
      4: 'Hào 4 (Cửu Tứ): Không mắc sai lầm lớn, đi qua hiểm nguy cần nhún nhường nhẫn nại, chớ hành động mù quáng.',
      5: 'Hào 5 (Lục Ngũ): Mây đen dày đặc không mưa từ phương Tây, quan bắn trúng con mồi trong hang sâu.',
      6: 'Hào 6 (Thượng Lục): Bay quá cao không chịu dừng lại, rơi vào cạm bẫy lưới giăng chuốc lấy đại họa.'
    }
  },
  63: {
    number: 63,
    name: 'Thủy Hỏa Ký Tế (Đã Hoàn Thành)',
    chinese: '既濟',
    symbol: 'Khảm (Nước) trên Ly (Lửa)',
    element: 'Thủy',
    thoanTu: 'Ký Tế là việc đã hoàn thành viên mãn, nước trên lửa dưới đun nấu chín thức ăn. Việc nhỏ hanh thông, ban đầu tốt lành cuối cùng cần cẩn trọng.',
    tuongTruyen: 'Nước ở trên Lửa đun nấu điều hòa, người quân tử nghĩ đến mối nguy hiểm tiềm ẩn để sớm lo liệu phòng ngừa.',
    meaning: 'Giai đoạn thành công trọn vẹn, mọi việc đã vào guồng. Cần duy trì trật tự, bảo dưỡng thành quả và không ngủ quên trên chiến thắng.',
    haoTu: {
      1: 'Hào 1 (Sơ Cửu): Hãm phanh kéo bánh xe lại, đuôi bị ướt chút ít nhưng không có lỗi.',
      2: 'Hào 2 (Lục Nhị): Người phụ nữ mất tấm rèm che xe không cần đuổi tìm, bảy ngày sau sẽ tự lấy lại được.',
      3: 'Hào 3 (Cửu Tam): Vua Cao Tông đánh nước Quỷ Phương ròng rã ba năm mới thắng, chớ dùng kẻ tiểu nhân.',
      4: 'Hào 4 (Lục Tứ): Áo đẹp có miếng vá giẻ rách, cả ngày luôn đề cao cảnh giác phòng ngừa rủi ro.',
      5: 'Hào 5 (Cửu Ngũ): Nước láng giềng phía Đông mổ bò tế lễ lớn không bằng nước phía Tây dâng lễ mọn mà hưởng trọn phúc lành.',
      6: 'Hào 6 (Thượng Lục): Lội qua sông ướt sũng cả đầu, không biết dừng lại đúng lúc ắt gặp hiểm nguy.'
    }
  },
  64: {
    number: 64,
    name: 'Hỏa Thủy Vị Tế (Chưa Xong Còn Tiếp)',
    chinese: '未濟',
    symbol: 'Ly (Lửa) trên Khảm (Nước)',
    element: 'Hỏa',
    thoanTu: 'Vị Tế là chưa hoàn thành, lửa ở trên nước ở dưới chưa giao hòa. Cáo nhỏ lội qua sông ướt đuôi, không có việc gì là không thể hoàn thành nếu kiên trì.',
    tuongTruyen: 'Lửa ở trên Nước bốc hơi ngược hướng, người quân tử cẩn trọng phân biệt vạn vật để sắp xếp đúng vị trí.',
    meaning: 'Hành trình mới lại bắt đầu! Đừng nản lòng khi công việc chưa xong; đây là cơ hội để bạn hoàn thiện, nâng cấp bản thân lên một tầm cao mới.',
    haoTu: {
      1: 'Hào 1 (Sơ Lục): Cáo nhỏ lội qua sông bị ướt đuôi, chưa đủ sức tiến vội ắt gặp hổ thẹn.',
      2: 'Hào 2 (Cửu Nhị): Hãm phanh bánh xe dừng lại kiểm tra, kiên định giữ đạo chính thì cát lợi.',
      3: 'Hào 3 (Lục Tam): Việc chưa thành mà vội vã xuất chinh ắt gặp hung, vượt sông lớn thành công nhờ chuẩn bị kỹ.',
      4: 'Hào 4 (Cửu Tứ): Kiên định giữ đạo chính thì cát lành hối hận tiêu tan, chinh phạt ba năm được thưởng đất nước lớn.',
      5: 'Hào 5 (Lục Ngũ): Giữ lòng trung chính đạt được vinh quang rực rỡ, được thần linh ban phúc lành đại cát.',
      6: 'Hào 6 (Thượng Cửu): Uống rượu vui vẻ tiệc tùng không có lỗi, nhưng nếu say sưa ướt đẫm cả đầu thì mất đi sự chừng mực.'
    }
  }
};
