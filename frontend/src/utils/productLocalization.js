// Comprehensive multilingual dictionary and helpers for sports shop products and categories

export const categoryTranslations = {
  All: { uz: 'Barchasi', ru: 'Все', en: 'All' },
  Football: { uz: 'Futbol', ru: 'Футбол', en: 'Football' },
  Basketball: { uz: 'Basketbol', ru: 'Баскетбол', en: 'Basketball' },
  Volleyball: { uz: 'Voleybol', ru: 'Волейбол', en: 'Volleyball' },
  Running: { uz: 'Yugurish', ru: 'Бег', en: 'Running' },
  'Sports Clothes': { uz: 'Sport kiyimlari', ru: 'Спортивная одежда', en: 'Sports Clothes' },
  'Fitness Equipment': { uz: 'Fitnes uskunalari', ru: 'Фитнес-инвентарь', en: 'Fitness Equipment' },
  Dumbbells: { uz: 'Gantellar', ru: 'Гантели', en: 'Dumbbells' },
  Yoga: { uz: 'Yoga', ru: 'Йога', en: 'Yoga' },
  Cycling: { uz: 'Velosport', ru: 'Велоспорт', en: 'Cycling' },
  Boxing: { uz: 'Boks', ru: 'Бокс', en: 'Boxing' },
  Swimming: { uz: 'Suzish', ru: 'Плавание', en: 'Swimming' },
  'Gym Accessories': { uz: 'Zal aksessuarlari', ru: 'Аксессуары для зала', en: 'Gym Accessories' },
  'Bags & Bottles': { uz: 'Sumka va butilkalar', ru: 'Сумки и бутылки', en: 'Bags & Bottles' },
  'Fitness Watches': { uz: 'Fitnes soatlar', ru: 'Фитнес-часы', en: 'Fitness Watches' },
  Tennis: { uz: 'Tennis', ru: 'Теннис', en: 'Tennis' },
};

export const badgeTranslations = {
  Bestseller: { uz: 'Xaridorbop', ru: 'Хит продаж', en: 'Bestseller' },
  Popular: { uz: 'Ommabop', ru: 'Популярное', en: 'Popular' },
  New: { uz: 'Yangi', ru: 'Новинка', en: 'New' },
  'Top Rated': { uz: 'Yuqori baho', ru: 'Высокий рейтинг', en: 'Top Rated' },
  'Editor Choice': { uz: 'Ekspert tanlovi', ru: 'Выбор экспертов', en: 'Editor Choice' },
  'Hot Deal': { uz: 'Katta chegirma', ru: 'Горячая цена', en: 'Hot Deal' },
  'Eco Choice': { uz: 'Eko tanlov', ru: 'Эко выбор', en: 'Eco Choice' },
  Featured: { uz: 'Tavsiya', ru: 'Рекомендуем', en: 'Featured' },
  'Best Value': { uz: 'Hamyonbop', ru: 'Выгодная цена', en: 'Best Value' },
  'Top Pick': { uz: 'Eng yaxshi', ru: 'Топ выбор', en: 'Top Pick' },
  Essential: { uz: 'Muhim anjom', ru: 'Обязательно', en: 'Essential' },
  Flagship: { uz: 'Flagman', ru: 'Флагман', en: 'Flagship' },
};

// Catalog translation database for seeded items
export const catalogTranslations = {
  'Nike Mercurial Match Pro Football': {
    name: {
      uz: "Nike Mercurial Match Pro Futbol To'pi",
      ru: 'Футбольный мяч Nike Mercurial Match Pro',
      en: 'Nike Mercurial Match Pro Football',
    },
    description: {
      uz: "Har qanday ob-havo sharoitida to'pning aniq aerodinamik uchishi va ajoyib nazorati uchun 12 panelli FIFA Quality Pro professional to'pi.",
      ru: 'Профессиональный матчевый мяч FIFA Quality Pro с 12-панельной термосварной конструкцией для точной траектории и идеального контроля в любую погоду.',
      en: 'FIFA Quality Pro match football with thermal-bonded 12-panel construction for pinpoint aerodynamic trajectory and consistent touch in all weather conditions.',
    },
    features: {
      uz: ['FIFA Quality Pro sertifikati', 'Maksimal ushlash uchun relyefli qoplama', 'Yuqori elastik butil kamera'],
      ru: ['Сертификат FIFA Quality Pro', 'Текстурированная поверхность для идеального сцепления', 'Упругая бутиловая камера'],
      en: ['FIFA Quality Pro Certified', 'Textured casing for superior grip', 'High-rebound butyl bladder'],
    },
  },
  'GripPro Negative Cut Goalkeeper Gloves': {
    name: {
      uz: "GripPro Professional Darvozabon Qo'lqoplari",
      ru: 'Вратарские перчатки GripPro Negative Cut',
      en: 'GripPro Negative Cut Goalkeeper Gloves',
    },
    description: {
      uz: "Quruq va nam ob-havoda maksimal ushlab turish uchun 4 mmli nemis kontakti lateksi va bilakni mahkam tutuvchi keng tasma.",
      ru: 'Вратарские перчатки с 4-мм немецким контактным латексом для надежного сцепления в любую погоду и усиленной фиксацией запястья.',
      en: '4mm German contact latex palm offering elite grip in wet and dry conditions, with extended wrist wrap for ultimate support.',
    },
    features: {
      uz: ['4mm Nemis Kontakt Lateksi', 'Ergonomik qulay bichim', 'Nafas oluvchi to\'rli orqa qism'],
      ru: ['4-мм немецкий контактный латекс', 'Эргономичный крой Negative Cut', 'Дышащий сетчатый материал'],
      en: ['4mm German Contact Latex', 'Ergonomic negative cut fit', 'Breathable air-mesh backhand'],
    },
  },
  'Spalding Official Game Composite Basketball': {
    name: {
      uz: "Spalding Rasmiy O'yin Basketbol To'pi",
      ru: 'Баскетбольный мяч Spalding Official Game Composite',
      en: 'Spalding Official Game Composite Basketball',
    },
    description: {
      uz: "Zal va ochiq maydonlar uchun mo'ljallangan, mukammal ushlash va aniq sakrash imkonini beruvchi 7-o'lchamdagi kompozit charm basketbol to'pi.",
      ru: 'Официальный композитный баскетбольный мяч размера 7 для залов и уличных площадок с максимальным сцеплением и предсказуемым отскоком.',
      en: 'Official Size 7 indoor/outdoor composite leather basketball designed for maximum grip, soft touch, and precision bounce.',
    },
    features: {
      uz: ['Rasmiy 7-o\'lcham (29.5")', 'Namlikni yutuvchi kompozit charm', 'Chuqur relyefli chiziqlar dizayni'],
      ru: ['Официальный размер 7 (29.5")', 'Влагоотводящая композитная кожа', 'Глубокие каналы для идеального контроля'],
      en: ['Official Size 7 (29.5")', 'Moisture-wicking composite cover', 'Deep channel design'],
    },
  },
  'Mikasa Pro Touch Championship Volleyball': {
    name: {
      uz: "Mikasa Pro Touch Chempionat Voleybol To'pi",
      ru: 'Волейбольный мяч Mikasa Pro Touch Championship',
      en: 'Mikasa Pro Touch Championship Volleyball',
    },
    description: {
      uz: "Barqaror uchish va yumshoq teginish uchun 18 panelli aerodinamik relyefli plyaj va zal voleybol to'pi.",
      ru: 'Волейбольный мяч с 18-панельной аэродинамической поверхностью для стабильного полета и мягкого приема на паркете и пляже.',
      en: '18-panel aerodynamic dimpled surface design for stable flight and responsive cushioned touch for beach and gym play.',
    },
    features: {
      uz: ['18 panelli aerodinamik relyef', 'Mikrofibrli kompozit charm', 'FIVB xalqaro standartiga mos'],
      ru: ['18-панельный аэродинамический контур', 'Микрофибровая композитная кожа', 'Соответствует стандартам FIVB'],
      en: ['18-panel aerodynamic contour', 'Micro-fiber composite leather', 'FIVB compliant size & weight'],
    },
  },
  'Velocity Carbon Marathon Racing Shoes': {
    name: {
      uz: "Velocity Carbon Marafon Yugurish Krossovkasi",
      ru: 'Марафонские кроссовки Velocity Carbon Racing',
      en: 'Velocity Carbon Marathon Racing Shoes',
    },
    description: {
      uz: "Tezkor turtki beruvchi to'liq uglerod tolali (karbon) plastinka va yengil azotli ko'pik bilan jihozlangan ultra-yengil marafon krossovkasi.",
      ru: 'Ультралегкие марафонские кроссовки с полноразмерной карбоновой пластиной и упругой азотной пеной для максимальной скорости.',
      en: 'Ultra-lightweight marathon racing shoe engineered with a full-length curved carbon fiber propulsion plate and responsive nitrogen-infused foam.',
    },
    features: {
      uz: ['To\'liq 3K Karbon plastinka', 'Elastik PEBA superko\'pik taglik', 'Vazni bor-yo\'g\'i 185 gramm'],
      ru: ['Полноразмерная карбоновая пластина 3K', 'Упругая промежуточная подошва PEBA', 'Вес всего 185 грамм'],
      en: ['Full-length 3K Carbon plate', 'Responsive PEBA superfoam midsole', 'Weighs only 185g (size 9)'],
    },
  },
  'AeroDry Men Seamless Compression Training Set': {
    name: {
      uz: "AeroDry Erkaklar Choksiz Kompression Sport Kiyimi",
      ru: 'Мужской компрессионный комплект AeroDry',
      en: 'AeroDry Men Seamless Compression Training Set',
    },
    description: {
      uz: "Mushaklarni qo'llab-quvvatlovchi, ter o'tkazmaydigan va shilinishlarning oldini oluvchi sifatli elastik sport kiyimi to'plami.",
      ru: 'Эластичный влагоотводящий компрессионный рашгард и тайтсы для ускорения восстановления мышц и тренировок высокой интенсивности.',
      en: 'Second-skin moisture-wicking compression long sleeve and tights engineered to enhance muscle recovery and prevent chafing during high intensity training.',
    },
    features: {
      uz: ['4 tomonga cho\'ziluvchan mato', 'Mushaklarni maqsadli qo\'llab-quvvatlash', 'Antibakterial kumush iplar'],
      ru: ['Эластичность в 4 направлениях', 'Направленная поддержка мышц', 'Антибактериальная технология с ионами серебра'],
      en: ['4-way stretch fabric', 'Targeted muscle compression', 'Anti-odor silver yarn technology'],
    },
  },
  'PowerDial 24kg Adjustable Dumbbell Pair': {
    name: {
      uz: "PowerDial 24 kg Sozlanuvchan Gantellar Juftligi",
      ru: 'Регулируемые гантели PowerDial 24 кг (пара)',
      en: 'PowerDial 24kg Adjustable Dumbbell Pair',
    },
    description: {
      uz: "Tezkor aylanuvchi mexanizm yordamida 2.5 kg dan 24 kg gacha oson o'zgaruvchan 15 juft gantel o'rnini bosuvchi ixcham to'plam.",
      ru: 'Пара гантелей с быстрым селекторным механизмом регулировки веса от 2.5 до 24 кг с шагом 2.5 кг, заменяющая 15 пар обычных гантелей.',
      en: 'Replace 15 pairs of dumbbells with a single rapid-dial adjustment mechanism. Adjust from 2.5 kg to 24 kg per hand in 2.5 kg increments.',
    },
    features: {
      uz: ['Tezkor aylanuvchi sozlash tizimi', 'Mustahkam lazer bilan kesilgan po\'lat diski', 'Ixcham saqlash tagligi'],
      ru: ['Быстрый механизм выбора веса', 'Надежные диски из лазерной стали', 'Компактные подставки в комплекте'],
      en: ['Rapid selector dial system', 'Durable laser-cut steel plates', 'Compact storage trays included'],
    },
  },
  'ProFold Heavy Duty Flat/Incline Gym Bench': {
    name: {
      uz: "ProFold Buklanuvchi Fitnes va Trenajyor Skameykasi",
      ru: 'Складная силовая скамья ProFold Heavy Duty',
      en: 'ProFold Heavy Duty Flat/Incline Gym Bench',
    },
    description: {
      uz: "360 kg yuk ko'tarish qobiliyati va 7 xil qiyalik burchagiga sozlanuvchi mustahkam metall skameyka.",
      ru: 'Универсальная тренировочная скамья с 7 положениями спинки, грузоподъемностью до 360 кг и износостойкой обивкой.',
      en: 'Commercial 7-position incline to decline workout bench with 800 lb weight capacity and high-density sweat-resistant padding.',
    },
    features: {
      uz: ['7 xil orqa va 3 xil o\'rindiq burchagi', 'Mustahkam 14-gauge po\'lat ramka', 'Buklanuvchi joy tejovchi dizayn'],
      ru: ['7 положений спинки и 3 угла сиденья', 'Усиленная стальная рама 14-gauge', 'Складная компактная конструкция'],
      en: ['7 back positions & 3 seat angles', 'Commercial 14-gauge steel frame', 'Foldable space-saving design'],
    },
  },
  'ZenAlignment Eco Cork Yoga Mat & Block Set': {
    name: {
      uz: "ZenAlignment Tabiiy Probka Yoga To'shagi va Bloklari",
      ru: 'Эко-коврик для йоги из пробки ZenAlignment с блоками',
      en: 'ZenAlignment Eco Cork Yoga Mat & Block Set',
    },
    description: {
      uz: "Sirg'alib ketmaydigan tabiiy probka va kauchukdan tayyorlangan, tana holatini to'g'ri saqlovchi chiziqli yoga to'shagi va 2 ta bloki.",
      ru: 'Премиальный нескользящий коврик из натуральной пробки и каучука с линиями выравнивания асан, в комплекте с двумя пробковыми блоками.',
      en: 'Premium organic cork and natural tree rubber non-slip mat with laser-etched posture alignment guides. Includes 2 high-density cork blocks and carry strap.',
    },
    features: {
      uz: ['100% Biologik parchalanuvchi probka', 'Terlaganda ham sirpanmas tutqich', '6mm qalinlikdagi qulay qatlam'],
      ru: ['100% органическая пробка и каучук', 'Идеальное сцепление даже при потении', 'Двойная амортизация толщиной 6 мм'],
      en: ['100% biodegradable organic cork', 'Superior wet sweat grip', '6mm dual-layer cushioning'],
    },
  },
  'AeroPro Road Cycling Carbon Helmet': {
    name: {
      uz: "AeroPro Shosse Velosport Karbon Shlemi",
      ru: 'Шоссейный аэродинамический велошлем AeroPro',
      en: 'AeroPro Road Cycling Carbon Helmet',
    },
    description: {
      uz: "Shamol tunnelida sinovdan o'tgan, MIPS xavfsizlik tizimi va 18 ta shamollatish kanallariga ega yengil veloshlem.",
      ru: 'Аэродинамический велосипедный шлем с системой защиты от ударов MIPS, 18 вентиляционными каналами и магнитным визором.',
      en: 'Wind-tunnel tested aerodynamic cycling helmet featuring MIPS safety technology, 18 internal cooling airflow channels, and magnetic buckle.',
    },
    features: {
      uz: ['Integratsiyalashgan MIPS himoyasi', 'Ultra-yengil polikarbonat korpus', 'Magnitli olinuvchi ko\'zoynak visor'],
      ru: ['Встроенная защита MIPS', 'Сверхлегкий поликарбонатный корпус', 'Съемный магнитный визор'],
      en: ['Integrated MIPS rotational protection', 'Ultralight in-mold polycarbonate shell', 'Removable magnetic visor'],
    },
  },
  'VeloBeam 1200LM Smart Bike Light & Tail Flash': {
    name: {
      uz: "VeloBeam 1200LM Aqlli Velosiped Chirog'i To'plami",
      ru: 'Умный комплект велосипедного света VeloBeam 1200LM',
      en: 'VeloBeam 1200LM Smart Bike Light & Tail Flash',
    },
    description: {
      uz: "Suv o'tkazmaydigan 1200 lyumenli kuchli old fara va aqlli tormoz sensori bilan jihozlangan orqa miltillovchi chiroq.",
      ru: 'Мощная влагозащитная передняя велофара на 1200 люмен с антибликовым лучом и умный задний стоп-сигнал с датчиком торможения.',
      en: 'High-output 1200 lumens aluminum waterproof front bicycle headlight with 5 light modes and smart brake sensing rear LED light.',
    },
    features: {
      uz: ['1200 Lyumen yorug\'lik quvvati', 'USB-C qayta quvvatlanuvchi 4000mAh batareya', 'IPX6 suvdan to\'liq himoya'],
      ru: ['Яркость 1200 люмен с антибликом', 'Зарядка через USB-C, аккумулятор 4000 мАч', 'Водонепроницаемость IPX6'],
      en: ['1200 Lumens output with anti-glare beam', 'USB-C rechargeable 4000mAh battery', 'IPX6 waterproof rating'],
    },
  },
  'Knockout Pro Leather Boxing Gloves 14oz': {
    name: {
      uz: "Knockout Pro Haqiqiy Charm Boks Qo'lqoplari 14oz",
      ru: 'Кожаные боксерские перчатки Knockout Pro 14oz',
      en: 'Knockout Pro Leather Boxing Gloves 14oz',
    },
    description: {
      uz: "Qo'l mehnati bilan tayyorlangan tabiiy buqa charmi va ko'p qatlamli zarba yutuvchi gelli professional boks qo'lqoplari.",
      ru: 'Профессиональные перчатки из натуральной воловьей кожи с многослойной гелевой набивкой для защиты суставов и запястья.',
      en: 'Handcrafted top-grain cowhide leather sparring and bag gloves with multi-layer gel padding for maximum knuckle and wrist shock absorption.',
    },
    features: {
      uz: ['100% Haqiqiy buqa charmi', 'Uch qatlamli zarba yutuvchi ko\'pik', 'Bilakni ushlovchi keng yopishqoq tasma'],
      ru: ['100% натуральная кожа высшего качества', 'Трехслойная амортизирующая пена', 'Широкая манжета на липучке для фиксации кисти'],
      en: ['100% Genuine cowhide leather', 'Tri-layered foam shock absorption', 'Extra wide hook-and-loop wrist lock'],
    },
  },
  'HydroGlider Polarized Anti-Fog Swim Goggles': {
    name: {
      uz: "HydroGlider Polyarizatsiyalangan Suzish Ko'zoynagi",
      ru: 'Поляризационные очки для плавания HydroGlider',
      en: 'HydroGlider Polarized Anti-Fog Swim Goggles',
    },
    description: {
      uz: "Yorug'lik chaqnashi va UV nurlaridan himoya qiluvchi, tumanlanishga qarshi qoplamali qulay silikonli suzish ko'zoynagi.",
      ru: 'Широкоугольные поляризационные очки для плавания с защитой от ультрафиолета UV400 и двойным антизапотевающим покрытием.',
      en: 'Panoramic wide-angle polarized lenses that eliminate outdoor glare and provide 100% UV protection and crystal-clear vision with double anti-fog coating.',
    },
    features: {
      uz: ['Polyarizatsiyalangan UV400 himoya oynasi', 'Juda yumshoq suyuq silikon qistirma', '3 xil burun o\'lchami ko\'prigi'],
      ru: ['Поляризационные линзы с защитой UV400', 'Сверхмягкий жидкий силиконовый обтюратор', '3 сменные носовые перемычки'],
      en: ['Polarized UV400 protective lenses', 'Ultra-soft liquid silicone gasket', '3 interchangeable nose bridges'],
    },
  },
  'Titan 45L Waterproof Gym Duffel with Shoe Compartment': {
    name: {
      uz: "Titan 45L Poyabzal Bo'limli Suv O'tkazmaydigan Sport Sumkasi",
      ru: 'Спортивная водонепроницаемая сумка Titan 45L с отсеком для обуви',
      en: 'Titan 45L Waterproof Gym Duffel with Shoe Compartment',
    },
    description: {
      uz: "Ventilyatsiyali alohida krossovka bo'limi, nam kiyimlar cho'ntagi va mustahkam yelka kamari bilan jihozlangan katta sport sumkasi.",
      ru: 'Прочная водоотталкивающая сумка для тренировок с изолированным вентилируемым отсеком для обуви и карманом для влажных вещей.',
      en: 'Heavy-duty water-repellent tactical gym bag with isolated ventilated sneaker compartment, wet clothes pocket, and shaker bottle holder.',
    },
    features: {
      uz: ['Ventilyatsiyali alohida poyabzal bo\'limi', 'Suv o\'tkazmaydigan nam/quruq PVX cho\'ntak', 'Mustahkamlangan yumshoq yelka tasmasi'],
      ru: ['Изолированное вентилируемое отделение для обуви', 'Водонепроницаемый карман для влажных вещей', 'Усиленные мягкие плечевые ремни'],
      en: ['Ventilated separate shoe garage', 'Waterproof wet/dry PVC pocket', 'Reinforced padded shoulder harness'],
    },
  },
  'ThermoFlask 1000ml Stainless Sport Hydration Bottle': {
    name: {
      uz: "ThermoFlask 1000ml Zanglamas Po'lat Sport Termosi",
      ru: 'Спортивная термобутылка ThermoFlask 1000мл из нержавеющей стали',
      en: 'ThermoFlask 1000ml Stainless Sport Hydration Bottle',
    },
    description: {
      uz: "Ikki qavatli vakuumli izolyatsiyalangan, suvni 24 soat muzdek va 12 soat issiq saqlovchi BPA-siz qulay sport butilkasi.",
      ru: 'Двустенная вакуумная термобутылка из пищевой стали, сохраняющая воду ледяной до 24 часов и горячей до 12 часов.',
      en: 'Double-wall vacuum insulated 18/8 food-grade stainless steel bottle. Keeps water freezing cold for 24 hours with fast-flow sport chug lid.',
    },
    features: {
      uz: ['Suvni 24 soat sovuq / 12 soat issiq saqlaydi', '100% BPA-siz va tommas qopqoq', 'Sirpanmaydigan mustahkam kukunli qoplama'],
      ru: ['Держит холод 24 часа / тепло 12 часов', '100% без BPA и защита от протечек', 'Устойчивое порошковое покрытие'],
      en: ['Keeps cold for 24h / hot for 12h', '100% BPA-Free & leak-proof lid', 'Durable non-slip powder coat'],
    },
  },
  'Apex Pro GPS Multi-Sport Endurance Smartwatch': {
    name: {
      uz: "Apex Pro GPS Ko'p Tarmoqli Sport Smart-Soati",
      ru: 'Мультиспортивные GPS смарт-часы Apex Pro',
      en: 'Apex Pro GPS Multi-Sport Endurance Smartwatch',
    },
    description: {
      uz: "Titan korpusli, ikki chastotali GPS, yurak urishi, qon kislorodi (SpO2) o'lchagich va 14 kunlik batareyaga ega professional sport soati.",
      ru: 'Титановые спортивные часы с двухчастотным GPS, пульсометром, оценкой VO2 Max, водонепроницаемостью 100м и автономностью до 14 дней.',
      en: 'Rugged titanium bezel sports smartwatch equipped with dual-frequency GPS, optical heart rate, SpO2, VO2 Max estimation, and 14-day battery life.',
    },
    features: {
      uz: ['Ikki chastotali ko\'p tarmoqli GNSS joylashuv', 'Yurak urishi, HRV va VO2 Max ko\'rsatkichlari', '100 metr suvga chidamlilik darajasi'],
      ru: ['Двухчастотный мультисистемный GPS/GNSS', 'Измерение пульса, HRV и VO2 Max', 'Водонепроницаемость 100 метров'],
      en: ['Dual-Frequency multi-GNSS tracking', 'Heart Rate, HRV & VO2 Max metrics', '100m water resistance rating'],
    },
  },
  'ProStaff 97 Graphite Tennis Racket': {
    name: {
      uz: 'ProStaff 97 Grafit Tennis Raketkasi',
      ru: 'Теннисная ракетка ProStaff 97 Graphite',
      en: 'ProStaff 97 Graphite Tennis Racket',
    },
    description: {
      uz: 'Musobaqalar va professional o\'yinlar uchun yuqori aniqlik, kuchli aylantirish va mukammal nazorat ta\'minlovchi grafit tennis raketkasi.',
      ru: 'Профессиональная теннисная ракетка из высокомодульного графита для максимального контроля мяча и мощного вращения на турнирах.',
      en: 'Precision carbon graphite performance tennis racket offering surgical control and high swing weight for competitive tournament players.',
    },
    features: {
      uz: ['Yuqori modulli pishiq grafit ramka', '16x19 Spin tor tuzilishi', 'Vibratsiyani yutuvchi qulay tutqich'],
      ru: ['Высокомодульная графитовая рама', 'Струнная формула 16x19 Spin', 'Вибропоглощающая рукоятка'],
      en: ['High-modulus Braided Graphite', '16x19 Spin string pattern', 'Vibration dampening grip'],
    },
  },
  'IronGrip Cast Iron Kettlebell 16kg': {
    name: {
      uz: 'IronGrip Quyma Cho\'yan Giri (Kettlebell) 16kg',
      ru: 'Чугунная гиря IronGrip 16кг',
      en: 'IronGrip Cast Iron Kettlebell 16kg',
    },
    description: {
      uz: 'Yaxlit quyma cho\'yandan yasalgan, bo\'rni yaxshi tutuvchi va sirpanmaydigan kukunli qoplamali professional sport giri.',
      ru: 'Цельнолитая соревновательная чугунная гиря с устойчивым порошковым покрытием против скольжения в руках.',
      en: 'Single-piece cast iron competition kettlebell with powder-coated textured surface for chalk retention and non-slip grip.',
    },
    features: {
      uz: ['Mustahkam yaxlit quyma korpus', 'Qulay barqaror tekis asos', 'Rangli belgilangan tutqich halqalari'],
      ru: ['Цельнолитая прочная конструкция', 'Плоское устойчивое основание', 'Цветовая маркировка веса'],
      en: ['Solid single-piece casting', 'Flat machined base for stability', 'Color-coded handle rings'],
    },
  },
  'UltraSpeed Pro Bearing Jump Rope': {
    name: {
      uz: 'UltraSpeed Pro Rulmanli Tezkor Sakrash Arqoni',
      ru: 'Скоростная скакалка на подшипниках UltraSpeed Pro',
      en: 'UltraSpeed Pro Bearing Jump Rope',
    },
    description: {
      uz: 'Aviatsiya alyuminiy dastasi va 360 darajali qo\'sh podshipnikli, buralib qolmaydigan po\'lat arqonli tezkor sakrash vositasi.',
      ru: 'Скоростная кроссфит-скакалка с алюминиевыми рукоятками и двойными подшипниками 360° для двойных прыжков.',
      en: 'Aircraft-grade aluminum handles with 360-degree dual ball bearings and kink-resistant coated steel speed cable for double-unders.',
    },
    features: {
      uz: ['360° qo\'sh sharikli podshipnik', 'Sozlanuvchi 3 metrli po\'lat tros', 'Sirpanmaydigan naqshli alyuminiy tutqich'],
      ru: ['Двойной подшипник вращения на 360°', 'Регулируемый стальной трос 3м', 'Рельефные нескользящие ручки'],
      en: ['Dual 360° ball bearing mechanism', 'Adjustable 3-meter coated wire', 'Anti-slip knurled grip handles'],
    },
  },
  'StrikeZone 4ft Heavy Punching Bag': {
    name: {
      uz: 'StrikeZone 4ft Professional Boks Qopi (Grusha)',
      ru: 'Тяжелый боксерский мешок StrikeZone 4ft',
      en: 'StrikeZone 4ft Heavy Punching Bag',
    },
    description: {
      uz: 'Uch qavatli tikilgan mustahkam charm, zarbalarni kuchli yutuvchi to\'ldiruvchi va aylanma zanjir ilmog\'i bilan og\'ir boks qopi.',
      ru: 'Тяжелый боксерский мешок из многослойной кожи с усиленными стропами и карабином 360° для сильных ударов.',
      en: 'Heavy-duty tear-resistant synthetic leather punching bag with reinforced nylon straps and 360-degree swivel chain for powerful strikes.',
    },
    features: {
      uz: ['Uch qavatli mustahkam tikuv', 'Zarba energiyasini yutuvchi to\'ldirgich', '360° aylanuvchi po\'lat zanjir to\'plami'],
      ru: ['Тройная усиленная прошивка', 'Ударопоглощающий наполнитель', 'Поворотный стальной карабин в комплекте'],
      en: ['Triple-stitched synthetic leather', 'High shock-absorbing rag filling', 'Heavy-duty swivel hanger included'],
    },
  },
  'PaceMaster GPS Heart Rate Running Watch': {
    name: {
      uz: 'PaceMaster GPS Yurak Ufushi Sport Soati',
      ru: 'Беговые часы PaceMaster с GPS и пульсометром',
      en: 'PaceMaster GPS Heart Rate Running Watch',
    },
    description: {
      uz: 'Haqiqiy vaqt rejimida tezlik, GPS masofa, yurak urishi zonalari va tiklanish vaqtini ko\'rsatuvchi maxsus yugurish smart-soati.',
      ru: 'Специализированные беговые часы с высокоточным GPS, мониторингом темпа, зон пульса и расчетом времени восстановления.',
      en: 'Dedicated running watch with real-time GPS pace, heart rate zones, recovery suggestions, and race finish time predictor.',
    },
    features: {
      uz: ['O\'rnatilgan GPS va GLONASS sun\'iy yo\'ldoshlari', 'Bilakdan optik yurak urishi sensori', '10 kungacha batareya quvvati'],
      ru: ['Встроенный GPS и GLONASS', 'Оптический датчик пульса на запястье', 'Автономная работа до 10 дней'],
      en: ['Built-in GPS & GLONASS', 'Wrist-based heart rate sensor', 'Battery life up to 10 days in smartwatch mode'],
    },
  },
  'ThermoSteel 750ml Insulated Sports Shaker': {
    name: {
      uz: 'ThermoSteel 750ml Zanglamas Po\'lat Sport Sheykiri',
      ru: 'Стальной термо-шейкер ThermoSteel 750мл',
      en: 'ThermoSteel 750ml Insulated Sports Shaker',
    },
    description: {
      uz: 'Ichki aralashtiruvchi to\'ri bo\'lgan, oqmaydigan va kokteyllarni 12 soat sovuq saqlovchi oziq-ovqat po\'latidan tayyorlangan sheykir.',
      ru: 'Шейкер из нержавеющей стали с бесшумным венчиком для протеина, сохраняющий напитки холодными до 12 часов.',
      en: 'Stainless steel protein shaker bottle with built-in blending whisk and leak-proof flip cap, keeping protein shakes cold for 12 hours.',
    },
    features: {
      uz: ['304 markali oziq-ovqat po\'lati', 'Hid o\'tmas gigiyenik ichki qism', 'Oson yechiluvchi shovqinsiz qoruvchi'],
      ru: ['Пищевая нержавеющая сталь 304', 'Не впитывает запахи', 'Съемный тихий венчик для смешивания'],
      en: ['Food-grade 304 stainless steel', 'Odor-resistant interior', 'Removable silent blending whisk'],
    },
  },
};

/**
 * Returns translated category label with bidirectional matching
 */
export const getLocalizedCategory = (category, lang = 'uz') => {
  if (!category) return '';
  const item = categoryTranslations[category];
  if (item && item[lang]) return item[lang];

  // Bidirectional reverse match
  const catLower = category.toLowerCase().trim();
  const entry = Object.values(categoryTranslations).find(
    (t) =>
      t.uz?.toLowerCase() === catLower ||
      t.ru?.toLowerCase() === catLower ||
      t.en?.toLowerCase() === catLower
  );
  if (entry && entry[lang]) return entry[lang];
  return category;
};

/**
 * Returns translated badge label with bidirectional matching
 */
export const getLocalizedBadge = (badge, lang = 'uz') => {
  if (!badge) return '';
  const item = badgeTranslations[badge];
  if (item && item[lang]) return item[lang];

  // Bidirectional reverse match
  const badgeLower = badge.toLowerCase().trim();
  const entry = Object.values(badgeTranslations).find(
    (b) =>
      b.uz?.toLowerCase() === badgeLower ||
      b.ru?.toLowerCase() === badgeLower ||
      b.en?.toLowerCase() === badgeLower
  );
  if (entry && entry[lang]) return entry[lang];
  return badge;
};

/**
 * Returns fully localized product object with bidirectional catalog matching
 */
export const getLocalizedProduct = (product, lang = 'uz') => {
  if (!product) return null;

  // 1. Direct or bidirectional match for product in catalog
  let catalogItem = catalogTranslations[product.name];
  if (!catalogItem && product.name) {
    const nameLower = product.name.toLowerCase().trim();
    catalogItem = Object.values(catalogTranslations).find(
      (item) =>
        item.name?.uz?.toLowerCase() === nameLower ||
        item.name?.ru?.toLowerCase() === nameLower ||
        item.name?.en?.toLowerCase() === nameLower
    );
  }

  const localizedName = catalogItem?.name?.[lang] || product.name;

  // Preserve custom edited description if present and distinct
  let localizedDesc = product.description;
  if (catalogItem?.description?.[lang]) {
    const isStandardCatalogDesc =
      !product.description ||
      product.description === catalogItem.description.en ||
      product.description === catalogItem.description.uz ||
      product.description === catalogItem.description.ru;
    if (isStandardCatalogDesc) {
      localizedDesc = catalogItem.description[lang];
    }
  }

  const localizedFeatures = catalogItem?.features?.[lang] || product.features || [];
  const localizedCategory = getLocalizedCategory(product.category, lang);
  const localizedBadge = getLocalizedBadge(product.badge, lang);

  return {
    ...product,
    name: localizedName,
    description: localizedDesc || product.description,
    features: localizedFeatures,
    categoryLabel: localizedCategory,
    badgeLabel: localizedBadge,
  };
};
